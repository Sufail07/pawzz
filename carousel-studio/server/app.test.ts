import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "./app.js";
import { animalSample } from "../shared/fixtures/samples.js";

const previous = { ...process.env };

beforeAll(() => {
  process.env.DEMO_MODE = "on";
  process.env.VERCEL = "1";
  process.env.LLM_API_KEY = "";
  process.env.GEMINI_API_KEY = "";
  process.env.RESEARCH_PROVIDER = "manual";
});

afterAll(() => {
  process.env = previous;
});

async function json<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

describe("studio API in demo mode", () => {
  it("reports health without exposing secrets", async () => {
    const response = await app.request("/api/health");
    expect(response.status).toBe(200);
    const body = await json<Record<string, unknown>>(response);
    expect(body.ok).toBe(true);
    expect(body.demoMode).toBe(true);
    expect(body).not.toHaveProperty("apiKey");
  });

  it("exposes only public configuration", async () => {
    const response = await app.request("/api/config");
    expect(response.status).toBe(200);
    const body = await json<Record<string, unknown>>(response);
    expect(body.demoMode).toBe(true);
    expect(body.storageMode).toBe("browser");
    expect(body).not.toHaveProperty("apiKey");
    expect(body).not.toHaveProperty("tavilyKey");
  });

  it("returns the vetted demo research for the sample brief", async () => {
    const response = await app.request("/api/research", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ brief: animalSample.brief }),
    });
    expect(response.status).toBe(200);
    const body = await json<{ research: { key_points: Array<{ approved: boolean }>; sources: unknown[] } }>(
      response,
    );
    expect(body.research.key_points.length).toBeGreaterThanOrEqual(3);
    expect(body.research.key_points.every((point) => point.approved === false)).toBe(true);
    expect(body.research.sources.length).toBeGreaterThan(0);
  });

  it("rejects copy before the facts gate is cleared", async () => {
    const blocked = {
      ...animalSample,
      research: {
        ...animalSample.research,
        key_points: animalSample.research.key_points.map((point) => ({
          ...point,
          approved: false,
        })),
      },
    };
    const response = await app.request("/api/copy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ carousel: blocked }),
    });
    expect(response.status).toBe(409);
    const body = await json<{ issues: string[] }>(response);
    expect(body.issues.length).toBeGreaterThan(0);
  });

  it("returns copy for an approved carousel", async () => {
    const response = await app.request("/api/copy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ carousel: animalSample }),
    });
    expect(response.status).toBe(200);
    const body = await json<{ copy: { headline_options: string[]; slides: unknown[] }; meta: { demo: boolean } }>(
      response,
    );
    expect(body.meta.demo).toBe(true);
    expect(body.copy.headline_options).toHaveLength(3);
    expect(body.copy.slides.length).toBeGreaterThanOrEqual(7);
  });

  it("rejects invalid briefs with field issues", async () => {
    const response = await app.request("/api/research", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ brief: { idea: "x" } }),
    });
    expect(response.status).toBe(400);
    const body = await json<{ issues: Array<{ path: string; message: string }> }>(response);
    expect(body.issues.length).toBeGreaterThan(0);
  });

  it("declares server drafts unavailable in the deployed build", async () => {
    const response = await app.request("/api/drafts");
    expect(response.status).toBe(200);
    const body = await json<{ supported: boolean; drafts: unknown[] }>(response);
    expect(body.supported).toBe(false);
    expect(body.drafts).toEqual([]);
  });
});
