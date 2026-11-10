import type { ZodType } from "zod";
import type { AppConfig } from "./config.js";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class LLMError extends Error {
  status: number;
  retryAfter?: number;

  constructor(message: string, status = 502, retryAfter?: number) {
    super(message);
    this.name = "LLMError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

interface ChatResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string; type?: string };
}

function extractJson(text: string): unknown {
  let body = text.trim();
  body = body.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in the model response");
  }
  return JSON.parse(body.slice(start, end + 1));
}

function responseText(data: ChatResponse): string {
  const content = data.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((part) => part.text ?? "").join("");
  }
  return "";
}

async function requestChat(
  config: AppConfig,
  messages: LLMMessage[],
  jsonMode: boolean,
): Promise<string> {
  if (!config.apiKey) {
    throw new LLMError(
      "No LLM API key is configured. Add a free key to .env or use demo mode.",
      503,
    );
  }
  if (!config.baseUrl) {
    throw new LLMError("No LLM base URL is configured.", 503);
  }

  const body: Record<string, unknown> = {
    model: config.model,
    messages,
    temperature: 0.35,
    max_tokens: 3200,
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.apiKey}`,
  };
  if (config.provider === "openrouter") {
    headers["HTTP-Referer"] = "https://github.com/pawzz/carousel-studio";
    headers["X-Title"] = "Pawzz Carousel Studio";
  }

  let response: Response;
  try {
    response = await fetch(`${config.baseUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(75_000),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new LLMError("The model took too long to respond. Try again.", 504);
    }
    throw new LLMError("Could not reach the model provider. Check the network and base URL.", 502);
  }

  if (!response.ok) {
    const raw = await response.text();
    let message = raw.slice(0, 400);
    try {
      const parsed = JSON.parse(raw) as ChatResponse;
      message = parsed.error?.message ?? message;
    } catch {
      // keep the raw message
    }
    if (response.status === 429) {
      const retry = Number(response.headers.get("retry-after") ?? "60") || 60;
      throw new LLMError(
        `The free-tier limit was reached. Try again in ${retry} seconds or switch provider.`,
        429,
        retry,
      );
    }
    if (response.status === 401 || response.status === 403) {
      throw new LLMError("The model provider rejected the API key.", 401);
    }
    if (jsonMode && response.status === 400 && /response_format/i.test(message)) {
      return requestChat(config, messages, false);
    }
    throw new LLMError(`Model provider error: ${message || response.statusText}`, response.status);
  }

  const data = (await response.json()) as ChatResponse;
  const text = responseText(data);
  if (!text.trim()) {
    throw new LLMError("The model returned an empty response.", 502);
  }
  return text;
}

export async function callJson<T>(
  config: AppConfig,
  messages: LLMMessage[],
  schema: ZodType<T>,
  label: string,
): Promise<T> {
  let conversation = [...messages];
  let lastError = "Unknown validation error";
  let lastRaw = "";

  for (let attempt = 0; attempt < 3; attempt += 1) {
    let text: string;
    try {
      text = await requestChat(config, conversation, true);
    } catch (error) {
      if (
        error instanceof LLMError &&
        (error.message.includes("empty response") ||
          error.status === 502 ||
          error.status === 503 ||
          error.status === 504)
      ) {
        lastError = error.message;
        if (attempt < 2) continue;
      }
      throw error;
    }

    lastRaw = text;
    try {
      const parsed = extractJson(text);
      const result = schema.safeParse(parsed);
      if (result.success) return result.data;
      lastError = result.error.issues
        .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("; ");
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Invalid JSON";
    }

    conversation = [
      ...conversation,
      { role: "assistant", content: lastRaw.slice(0, 6000) },
      {
        role: "user",
        content: `That response did not match the ${label} JSON contract. Fix every issue and return JSON only.\nIssues: ${lastError}`,
      },
    ];
  }

  throw new LLMError(`The model could not produce valid ${label} JSON: ${lastError}`, 422);
}
