import { afterEach, beforeEach, vi } from "vitest";
import { readLeads, submitLead } from "./submit";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("lead submission", () => {
  it("stores the lead locally when no endpoint is configured", async () => {
    vi.stubEnv("VITE_FORMS_ENDPOINT", "");
    const result = await submitLead("intro_call", {
      name: "Asha",
      track: "AI Foundations",
    });

    expect(result.delivered).toBe(false);
    expect(result.reference).toMatch(/^LM-/);

    const [lead] = readLeads();
    expect(lead.kind).toBe("intro_call");
    expect(lead.delivered).toBe(false);
    expect(lead.payload).toMatchObject({
      name: "Asha",
      track: "AI Foundations",
    });
  });

  it("posts JSON to the configured endpoint and marks it delivered", async () => {
    vi.stubEnv("VITE_FORMS_ENDPOINT", "https://example.test/lead");
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitLead("syllabus", {
      name: "Asha",
      email: "asha@example.com",
    });

    expect(result.delivered).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://example.test/lead");
    expect(init.method).toBe("POST");
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      kind: "syllabus",
      name: "Asha",
      email: "asha@example.com",
    });
    expect(body.reference).toMatch(/^LM-/);
    expect(readLeads()).toHaveLength(1);
  });

  it("throws when the endpoint rejects the submission", async () => {
    vi.stubEnv("VITE_FORMS_ENDPOINT", "https://example.test/lead");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );

    await expect(submitLead("intro_call", { name: "Asha" })).rejects.toThrow(
      /500/,
    );
    expect(readLeads()).toHaveLength(0);
  });
});
