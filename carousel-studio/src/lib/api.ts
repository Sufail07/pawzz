export class ApiError extends Error {
  status: number;
  issues: string[];
  retryAfter?: number;

  constructor(message: string, status = 0, issues: string[] = [], retryAfter?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues;
    this.retryAfter = retryAfter;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(
      "Could not reach the studio API. Run the local server or use demo mode.",
      0,
    );
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const body = (data ?? {}) as {
      error?: string;
      issues?: Array<{ message?: string } | string>;
      retryAfter?: number;
    };
    const issues = Array.isArray(body.issues)
      ? body.issues.map((issue) => (typeof issue === "string" ? issue : issue.message ?? "Invalid value"))
      : [];
    throw new ApiError(
      body.error || `Request failed with status ${response.status}`,
      response.status,
      issues,
      body.retryAfter,
    );
  }

  return data as T;
}

export interface StudioConfig {
  demoMode: boolean;
  demoSetting: "auto" | "on" | "off";
  provider: string;
  providerLabel: string;
  model: string;
  researchProvider: string;
  storageMode: "filesystem" | "browser";
  configured: boolean;
  rateLimitPerMin: number;
  capabilities: {
    drafts: boolean;
    export: string;
  };
}

export const getConfig = () => request<StudioConfig>("/api/config");

export interface ResearchApiResponse {
  research: {
    key_points: import("../../shared/schema").KeyPoint[];
    sources: import("../../shared/schema").Source[];
    provider: string;
  };
  meta: { demo: boolean; provider: string; researchProvider: string };
}

export const runResearch = (brief: import("../../shared/schema").Brief) =>
  request<ResearchApiResponse>("/api/research", {
    method: "POST",
    body: JSON.stringify({ brief }),
  });

export interface CopyApiResponse {
  copy: import("../../shared/schema").CopyResponse;
  meta: { demo: boolean; provider: string; researchProvider: string };
}

export const runCopy = (carousel: import("../../shared/schema").Carousel) =>
  request<CopyApiResponse>("/api/copy", {
    method: "POST",
    body: JSON.stringify({ carousel }),
  });

export const runVisual = (
  brief: import("../../shared/schema").Brief,
  slides: import("../../shared/schema").Slide[],
) =>
  request<{ slides: import("../../shared/schema").Slide[] }>("/api/visual", {
    method: "POST",
    body: JSON.stringify({ brief, slides }),
  });

export const listServerDrafts = () =>
  request<{ drafts: import("../../shared/schema").Carousel[]; supported: boolean }>(
    "/api/drafts",
  );

export const saveServerDraft = (carousel: import("../../shared/schema").Carousel) =>
  request<{ carousel: import("../../shared/schema").Carousel }>("/api/drafts", {
    method: "POST",
    body: JSON.stringify({ carousel }),
  });

export const deleteServerDraft = (id: string) =>
  request<{ ok: boolean }>(`/api/drafts/${encodeURIComponent(id)}`, { method: "DELETE" });
