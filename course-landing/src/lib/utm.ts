export interface UtmValues {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

export interface UtmStore {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const STORAGE_KEY = "lumen.utm.v1";
const emptyUtm: UtmValues = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
};

let memory: UtmValues | null = null;

function parse(query: string): Partial<UtmValues> {
  const params = new URLSearchParams(
    query.startsWith("?") ? query.slice(1) : query,
  );
  return {
    utm_source: params.get("utm_source")?.trim() ?? "",
    utm_medium: params.get("utm_medium")?.trim() ?? "",
    utm_campaign: params.get("utm_campaign")?.trim() ?? "",
  };
}

function readStore(store: UtmStore): UtmValues | null {
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UtmValues>;
    return {
      utm_source: parsed.utm_source ?? "",
      utm_medium: parsed.utm_medium ?? "",
      utm_campaign: parsed.utm_campaign ?? "",
    };
  } catch {
    return null;
  }
}

export function captureUtm(search: string, store: UtmStore): UtmValues {
  const incoming = parse(search);
  const existing = readStore(store) ?? memory ?? emptyUtm;
  const merged: UtmValues = {
    utm_source: existing.utm_source || incoming.utm_source || "",
    utm_medium: existing.utm_medium || incoming.utm_medium || "",
    utm_campaign: existing.utm_campaign || incoming.utm_campaign || "",
  };
  memory = merged;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Session storage can be unavailable; the in-memory value still applies.
  }
  return merged;
}

export function readUtm(store: UtmStore): UtmValues {
  return readStore(store) ?? memory ?? emptyUtm;
}

function sessionStore(): UtmStore {
  if (typeof window === "undefined") {
    return { getItem: () => null, setItem: () => undefined };
  }
  return window.sessionStorage;
}

export function captureUtmFromLocation(): UtmValues {
  if (typeof window === "undefined") return emptyUtm;
  return captureUtm(window.location.search, sessionStore());
}

export function currentUtm(): UtmValues {
  return readUtm(sessionStore());
}

export function resetUtmForTests(): void {
  memory = null;
}
