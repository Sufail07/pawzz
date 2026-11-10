export type LLMProvider = "gemini" | "groq" | "openrouter" | "custom";
export type ResearchProvider = "gemini-grounding" | "tavily" | "searxng" | "ddg" | "manual";
export type StorageMode = "filesystem" | "browser";

interface Preset {
  baseUrl: string;
  model: string;
}

const PRESETS: Record<Exclude<LLMProvider, "custom">, Preset> = {
  gemini: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.5-flash",
  },
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-chat-v3-0324:free",
  },
};

export interface AppConfig {
  provider: LLMProvider;
  providerLabel: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  demoMode: boolean;
  demoSetting: "auto" | "on" | "off";
  researchProvider: ResearchProvider;
  researchSetting: string;
  tavilyKey: string;
  searxngUrl: string;
  storageMode: StorageMode;
  rateLimitPerMin: number;
  vitals: Record<string, string | boolean | number>;
}

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function providerKey(provider: LLMProvider): string {
  if (provider === "gemini") return env("GEMINI_API_KEY");
  if (provider === "groq") return env("GROQ_API_KEY");
  if (provider === "openrouter") return env("OPENROUTER_API_KEY");
  return "";
}

function parseProvider(value: string): LLMProvider {
  if (value === "groq" || value === "openrouter" || value === "custom" || value === "gemini") {
    return value;
  }
  return "gemini";
}

function resolveResearchProvider(
  setting: string,
  provider: LLMProvider,
  hasKey: boolean,
  tavilyKey: string,
  searxngUrl: string,
): ResearchProvider {
  if (
    setting === "gemini-grounding" ||
    setting === "tavily" ||
    setting === "searxng" ||
    setting === "ddg" ||
    setting === "manual"
  ) {
    if (setting === "gemini-grounding" && (!hasKey || provider !== "gemini")) return "ddg";
    if (setting === "tavily" && !tavilyKey) return "ddg";
    if (setting === "searxng" && !searxngUrl) return "ddg";
    return setting;
  }
  if (provider === "gemini" && hasKey) return "gemini-grounding";
  if (tavilyKey) return "tavily";
  if (searxngUrl) return "searxng";
  return "ddg";
}

export function loadConfig(): AppConfig {
  const provider = parseProvider(env("LLM_PROVIDER") || "gemini");
  const preset = provider === "custom" ? { baseUrl: "", model: "" } : PRESETS[provider];
  const apiKey = env("LLM_API_KEY") || providerKey(provider);
  const baseUrl = env("LLM_BASE_URL") || preset.baseUrl;
  const model = env("LLM_MODEL") || preset.model;
  const demoSetting = (env("DEMO_MODE") || "auto") as "auto" | "on" | "off";
  const demoMode = demoSetting === "on" || (demoSetting === "auto" && !apiKey);
  const tavilyKey = env("TAVILY_API_KEY");
  const searxngUrl = env("SEARXNG_URL").replace(/\/+$/, "");
  const researchSetting = env("RESEARCH_PROVIDER") || "auto";
  const researchProvider = resolveResearchProvider(
    researchSetting,
    provider,
    Boolean(apiKey),
    tavilyKey,
    searxngUrl,
  );
  const storageMode: StorageMode = process.env.VERCEL ? "browser" : "filesystem";
  const rateLimitPerMin = Number(env("RATE_LIMIT_PER_MIN") || "10") || 10;

  const providerLabel =
    provider === "gemini"
      ? "Google Gemini"
      : provider === "groq"
        ? "Groq"
        : provider === "openrouter"
          ? "OpenRouter"
          : "Custom provider";

  return {
    provider,
    providerLabel,
    baseUrl,
    model,
    apiKey,
    demoMode,
    demoSetting,
    researchProvider,
    researchSetting,
    tavilyKey,
    searxngUrl,
    storageMode,
    rateLimitPerMin,
    vitals: {
      provider,
      model,
      researchProvider,
      demoMode,
      storageMode,
      configured: Boolean(apiKey),
    },
  };
}

export function publicConfig(config: AppConfig) {
  return {
    demoMode: config.demoMode,
    demoSetting: config.demoSetting,
    provider: config.provider,
    providerLabel: config.providerLabel,
    model: config.model,
    researchProvider: config.researchProvider,
    storageMode: config.storageMode,
    configured: Boolean(config.apiKey),
    rateLimitPerMin: config.rateLimitPerMin,
  };
}
