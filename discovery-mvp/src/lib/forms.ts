export type SubmissionKind = "list-business" | "correction";

export interface SubmissionRecord {
  id: string;
  kind: SubmissionKind;
  createdAt: string;
  payload: Record<string, unknown>;
  delivered: boolean;
}

const STORAGE_KEY = "pawzz.submissions.v1";

function makeReference(): string {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PZ-${Date.now().toString(36).slice(-4).toUpperCase()}-${random}`;
}

function readSubmissions(): SubmissionRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SubmissionRecord[]) : [];
  } catch {
    return [];
  }
}

function storeSubmission(record: SubmissionRecord) {
  try {
    const existing = readSubmissions();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([record, ...existing].slice(0, 50)),
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

export async function submitForm(
  kind: SubmissionKind,
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
    await new Promise((resolve) => window.setTimeout(resolve, 500));
  }

  storeSubmission({
    id: reference,
    kind,
    createdAt: body.submittedAt,
    payload,
    delivered,
  });

  return { reference, delivered };
}

export function submissionsEndpointConfigured(): boolean {
  return Boolean(endpoint());
}

export function validatePhone(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");
  if (!value.trim()) return "Phone number is required";
  if (digits.length < 10 || digits.length > 13)
    return "Enter a valid phone number with 10–13 digits";
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()))
    return "Enter a valid email address";
  return undefined;
}

export function validateLink(value: string): string | undefined {
  if (!value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:")
      return "Use an http or https link";
  } catch {
    return "Enter a full link starting with https://";
  }
  return undefined;
}
