import { search, SafeSearchType } from "duck-duck-scrape";
import { LLMError, callJson } from "./llm.js";
import type { AppConfig, ResearchProvider } from "./config.js";
import { researchMessages } from "./prompts.js";
import {
  researchResponseSchema,
  type Brief,
  type KeyPoint,
  type ResearchResponse,
  type Source,
} from "../shared/schema.js";
import { demoResearchForBrief } from "../shared/fixtures/demo.js";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface ResearchOutcome {
  key_points: KeyPoint[];
  sources: Source[];
  provider: ResearchProvider;
}

interface GroundingResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    groundingMetadata?: {
      groundingChunks?: Array<{
        web?: { uri?: string; title?: string };
      }>;
    };
  }>;
  error?: { message?: string };
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function cleanText(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchQuery(brief: Brief): string {
  return `${brief.idea} ${brief.audience} credible source`;
}

function dedupeSources(sources: Source[]): Source[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    if (!isHttpUrl(source.url) || seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Search timed out")), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function tavilySearch(brief: Brief, apiKey: string): Promise<SearchResult[]> {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query: searchQuery(brief),
      max_results: 6,
      search_depth: "basic",
      include_answer: false,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`Tavily returned ${response.status}`);
  }
  const data = (await response.json()) as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
  };
  return (data.results ?? [])
    .filter((result) => result.url && isHttpUrl(result.url))
    .map((result) => ({
      title: cleanText(result.title ?? result.url ?? "Source"),
      url: result.url ?? "",
      snippet: cleanText(result.content ?? ""),
    }));
}

async function searxngSearch(brief: Brief, baseUrl: string): Promise<SearchResult[]> {
  const url = new URL(`${baseUrl}/search`);
  url.searchParams.set("q", searchQuery(brief));
  url.searchParams.set("format", "json");
  url.searchParams.set("safesearch", "1");
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`SearXNG returned ${response.status}`);
  }
  const data = (await response.json()) as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
  };
  return (data.results ?? [])
    .filter((result) => result.url && isHttpUrl(result.url))
    .slice(0, 6)
    .map((result) => ({
      title: cleanText(result.title ?? result.url ?? "Source"),
      url: result.url ?? "",
      snippet: cleanText(result.content ?? ""),
    }));
}

async function duckDuckGoSearch(brief: Brief): Promise<SearchResult[]> {
  const result = await withTimeout(
    search(searchQuery(brief), {
      safeSearch: SafeSearchType.STRICT,
      locale: "en-us",
    }),
    20_000,
  );
  return result.results
    .filter((item) => isHttpUrl(item.url))
    .slice(0, 6)
    .map((item) => ({
      title: cleanText(item.title),
      url: item.url,
      snippet: cleanText(item.description),
    }));
}

async function geminiGrounding(
  brief: Brief,
  config: AppConfig,
): Promise<ResearchOutcome | null> {
  if (config.provider !== "gemini" || !config.apiKey) return null;

  const prompt = `Research this carousel brief with Google Search:
Idea: ${brief.idea}
Audience: ${brief.audience}
Theme: ${brief.theme}

Find 3 to 6 accurate, citable key points. Use only reputable sources. ${brief.theme === "animal" ? "For animal health, do not diagnose or prescribe. " : ""}Every key point must include the source URL that supports it and a confidence of "high" or "check".

Return JSON only:
{"key_points":[{"text":"...","source_url":"https://...","source_title":"...","confidence":"high"}]}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [
        {
          text: "You are a careful research assistant. Use Google Search grounding, cite real URLs, and return JSON only.",
        },
      ],
    },
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2400,
      responseMimeType: "application/json",
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${encodeURIComponent(config.apiKey)}`;
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok && response.status === 400) {
    const fallbackBody = {
      ...body,
      generationConfig: { ...body.generationConfig, responseMimeType: undefined },
    };
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fallbackBody),
      signal: AbortSignal.timeout(60_000),
    });
  }

  if (!response.ok) {
    throw new Error(`Gemini grounding returned ${response.status}`);
  }

  const data = (await response.json()) as GroundingResponse;
  const candidate = data.candidates?.[0];
  const text = (candidate?.content?.parts ?? []).map((part) => part.text ?? "").join("");
  if (!text.trim()) throw new Error("Gemini grounding returned no text");

  const groundingSources: Source[] = (candidate?.groundingMetadata?.groundingChunks ?? [])
    .map((chunk) => ({
      title: cleanText(chunk.web?.title ?? "Google Search source"),
      url: chunk.web?.uri ?? "",
    }))
    .filter((source) => isHttpUrl(source.url));

  let parsed: unknown;
  try {
    const bodyText = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    const start = bodyText.indexOf("{");
    const end = bodyText.lastIndexOf("}");
    parsed = JSON.parse(bodyText.slice(start, end + 1));
  } catch {
    throw new Error("Gemini grounding did not return JSON");
  }

  const validated = researchResponseSchema.safeParse(parsed);
  if (!validated.success) throw new Error("Gemini grounding returned invalid research JSON");

  return normalizeResearch(validated.data, groundingSources, "gemini-grounding");
}

async function collectSources(
  brief: Brief,
  config: AppConfig,
): Promise<{ sources: SearchResult[]; provider: ResearchProvider }> {
  if (config.researchProvider === "tavily" && config.tavilyKey) {
    try {
      return { sources: await tavilySearch(brief, config.tavilyKey), provider: "tavily" };
    } catch {
      // continue to the next adapter
    }
  }
  if (config.researchProvider === "searxng" && config.searxngUrl) {
    try {
      return { sources: await searxngSearch(brief, config.searxngUrl), provider: "searxng" };
    } catch {
      // continue to the next adapter
    }
  }
  if (config.researchProvider !== "manual") {
    try {
      return { sources: await duckDuckGoSearch(brief), provider: "ddg" };
    } catch {
      // fall through to manual
    }
  }
  return { sources: [], provider: "manual" };
}

function titleFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host ? host.charAt(0).toUpperCase() + host.slice(1) : "";
  } catch {
    return "";
  }
}

export function normalizeResearch(
  raw: ResearchResponse,
  searchSources: Source[],
  provider: ResearchProvider,
): ResearchOutcome {
  const allowed = new Set(searchSources.map((source) => source.url));
  const keyPoints: KeyPoint[] = [];
  const seenClaims = new Set<string>();

  raw.key_points.forEach((point, index) => {
    const text = cleanText(point.text);
    if (!text || seenClaims.has(text.toLowerCase())) return;
    seenClaims.add(text.toLowerCase());
    const sourceUrl = isHttpUrl(point.source_url) ? point.source_url : "";
    const sourceTitle =
      point.source_title ||
      searchSources.find((source) => source.url === sourceUrl)?.title ||
      (sourceUrl ? titleFromUrl(sourceUrl) : "");
    const supported =
      Boolean(sourceUrl) &&
      (allowed.size === 0 || allowed.has(sourceUrl)) &&
      point.confidence === "high";
    keyPoints.push({
      id: `kp-${Date.now()}-${index}`,
      text: text.slice(0, 240),
      source_url: sourceUrl,
      source_title: cleanText(sourceTitle).slice(0, 160),
      confidence: supported ? "high" : "check",
      approved: false,
    });
  });

  if (keyPoints.length < 3) {
    throw new LLMError(
      "The research stage returned fewer than three usable key points. Try a more specific brief or add points manually.",
      422,
    );
  }

  const pointSources: Source[] = keyPoints
    .filter((point) => isHttpUrl(point.source_url))
    .map((point) => ({
      title: point.source_title || point.source_url,
      url: point.source_url,
    }));

  return {
    key_points: keyPoints.slice(0, 6),
    sources: dedupeSources([...searchSources, ...pointSources]).slice(0, 12),
    provider,
  };
}

export async function runResearch(
  brief: Brief,
  config: AppConfig,
): Promise<ResearchOutcome> {
  if (config.demoMode) {
    const demo = demoResearchForBrief(brief);
    return {
      key_points: demo.key_points,
      sources: demo.sources,
      provider: "manual",
    };
  }

  if (config.researchProvider === "gemini-grounding") {
    try {
      const grounded = await geminiGrounding(brief, config);
      if (grounded) return grounded;
    } catch {
      // fall back to the search adapter chain
    }
  }

  const { sources, provider } = await collectSources(brief, config);
  const raw = await callJson(
    config,
    researchMessages(brief, sources),
    researchResponseSchema,
    "research",
  );
  return normalizeResearch(raw, sources, provider);
}
