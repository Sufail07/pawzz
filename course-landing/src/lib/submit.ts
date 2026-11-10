import type { LeadType } from "./lead";

export interface LeadRecord {
  id: string;
  kind: LeadType;
  createdAt: string;
  payload: Record<string, unknown>;
  delivered: boolean;
}

const STORAGE_KEY = "lumen.leads.v1";

function makeReference(): string {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LM-${Date.now().toString(36).slice(-4).toUpperCase()}-${random}`;
}

export function readLeads(): LeadRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LeadRecord[]) : [];
  } catch {
    return [];
  }
}

function storeLead(record: LeadRecord) {
  if (typeof window === "undefined") return;
  try {
    const existing = readLeads();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([record, ...existing].slice(0, 100)),
    );
  } catch {
    // If storage is unavailable the confirmation still succeeds for this session.
  }
}

function endpoint(): string | undefined {
  const value = import.meta.env.VITE_FORMS_ENDPOINT;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export interface SubmitResult {
  reference: string;
  delivered: boolean;
}

export async function submitLead(
  kind: LeadType,
  payload: Record<string, unknown>,
): Promise<SubmitResult> {
  const reference = makeReference();
  const body = {
    reference,
    kind,
    submittedAt: new Date().toISOString(),
    ...payload,
  };

  const url = endpoint();
  let delivered = false;

  if (url) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Submission failed (${response.status})`);
    }
    delivered = true;
  } else {
    await new Promise((resolve) => window.setTimeout(resolve, 400));
  }

  storeLead({
    id: reference,
    kind,
    createdAt: body.submittedAt,
    payload,
    delivered,
  });

  return { reference, delivered };
}

export function leadsEndpointConfigured(): boolean {
  return Boolean(endpoint());
}
