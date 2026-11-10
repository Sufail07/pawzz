import { describe, expect, it } from "vitest";
import type { AppConfig } from "./config.js";
import { LLMError, callJson } from "./llm.js";

const config: AppConfig = {
  provider: "gemini",
  providerLabel: "Google Gemini",
  baseUrl: "https://example.test/v1beta/openai",
  model: "test-model",
  apiKey: "test-key",
  demoMode: false,
  demoSetting: "off",
  researchProvider: "manual",
  researchSetting: "manual",
  tavilyKey: "",
  searxngUrl: "",
  storageMode: "browser",
  rateLimitPerMin: 10,
  vitals: {},
};

function chatResponse(content: string, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

describe("LLM JSON client", () => {
  it("returns schema-valid JSON", async () => {
    globalThis.fetch = async () => chatResponse('{"ok":true,"label":"test"}');
    const result = await callJson(
      config,
      [{ role: "user", content: "Return JSON" }],
      (await import("zod")).z.object({ ok: (await import("zod")).z.boolean(), label: (await import("zod")).z.string() }),
      "test",
    );
    expect(result).toEqual({ ok: true, label: "test" });
  });

  it("retries when the first response breaks the contract", async () => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      if (calls === 1) return chatResponse('{"ok":"not-a-boolean"}');
      return chatResponse('{"ok":true}');
    };
    const { z } = await import("zod");
    const result = await callJson(
      config,
      [{ role: "user", content: "Return JSON" }],
      z.object({ ok: z.boolean() }),
      "test",
    );
    expect(result).toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it("strips markdown fences and surrounding prose", async () => {
    globalThis.fetch = async () =>
      chatResponse('Here is the JSON:\n```json\n{"ok":true}\n```\nThanks');
    const { z } = await import("zod");
    const result = await callJson(
      config,
      [{ role: "user", content: "Return JSON" }],
      z.object({ ok: z.boolean() }),
      "test",
    );
    expect(result).toEqual({ ok: true });
  });

  it("maps provider 429s to a retryable LLMError", async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: { message: "quota exceeded" } }), {
        status: 429,
        headers: { "retry-after": "30" },
      });
    await expect(
      callJson(config, [{ role: "user", content: "Return JSON" }], (await import("zod")).z.object({}), "test"),
    ).rejects.toMatchObject({ status: 429, retryAfter: 30 } satisfies Partial<LLMError>);
  });

  it("fails clearly when no key is configured", async () => {
    await expect(
      callJson(
        { ...config, apiKey: "" },
        [{ role: "user", content: "Return JSON" }],
        (await import("zod")).z.object({}),
        "test",
      ),
    ).rejects.toBeInstanceOf(LLMError);
  });
});
