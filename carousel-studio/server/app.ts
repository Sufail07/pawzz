import { Hono, type Context } from "hono";
import { bodyLimit } from "hono/body-limit";
import { logger } from "hono/logger";
import { z } from "zod";
import {
  briefSchema,
  carouselSchema,
  copyResponseSchema,
  exportIssues,
  factsGateIssues,
  slideSchema,
  type Carousel,
} from "../shared/schema.js";
import { demoCopy } from "../shared/fixtures/demo.js";
import { loadConfig, publicConfig } from "./config.js";
import { generateCopy, applyVisualSelection } from "./generate.js";
import { LLMError, callJson } from "./llm.js";
import { checkRateLimit } from "./rate-limit.js";
import { runResearch } from "./research.js";
import { visualMessages } from "./prompts.js";
import { visualResponseSchema } from "../shared/schema.js";
import { deleteDraft, getDraft, listDrafts, saveDraft } from "./store.js";

const app = new Hono();

if (!process.env.VERCEL) {
  app.use("*", logger());
  app.use(
    "*",
    bodyLimit({
      maxSize: 1024 * 1024,
      onError: (c) => c.json({ error: "Request body is too large." }, 413),
    }),
  );
}
app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "same-origin");
  c.header("X-Frame-Options", "DENY");
});

function clientKey(c: Context): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "local"
  );
}

function rateLimited(c: Context, limit: number): Response | null {
  const result = checkRateLimit(clientKey(c), limit);
  if (result.allowed) return null;
  c.header("Retry-After", String(result.retryAfter));
  return c.json(
    {
      error: `Too many generations. Try again in ${result.retryAfter} seconds.`,
      retryAfter: result.retryAfter,
    },
    429,
  );
}

function validation(c: Context, error: z.ZodError) {
  return c.json(
    {
      error: "The request did not match the studio contract.",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    },
    400,
  );
}

app.get("/api/health", (c) => {
  const config = loadConfig();
  return c.json({
    ok: true,
    provider: config.provider,
    model: config.model,
    demoMode: config.demoMode,
    storageMode: config.storageMode,
  });
});

app.get("/api/config", (c) => {
  const config = loadConfig();
  return c.json({
    ...publicConfig(config),
    capabilities: {
      drafts: config.storageMode === "filesystem",
      export: "browser",
    },
  });
});

app.post("/api/research", async (c) => {
  const config = loadConfig();
  const limited = rateLimited(c, config.rateLimitPerMin);
  if (limited) return limited;

  const body = await c.req.json().catch(() => null);
  const parsed = z.object({ brief: briefSchema }).safeParse(body);
  if (!parsed.success) return validation(c, parsed.error);

  const research = await runResearch(parsed.data.brief, config);
  return c.json({
    research,
    meta: {
      demo: config.demoMode,
      provider: config.providerLabel,
      researchProvider: research.provider,
    },
  });
});

app.post("/api/copy", async (c) => {
  const config = loadConfig();
  const limited = rateLimited(c, config.rateLimitPerMin);
  if (limited) return limited;

  const body = await c.req.json().catch(() => null);
  const parsed = z.object({ carousel: carouselSchema }).safeParse(body);
  if (!parsed.success) return validation(c, parsed.error);

  const carousel = parsed.data.carousel;
  const gateIssues = factsGateIssues(carousel);
  if (gateIssues.length > 0) {
    return c.json(
      {
        error: "Resolve the fact-check gate before writing copy.",
        issues: gateIssues,
      },
      409,
    );
  }

  const approved = carousel.research.key_points.filter((point) => point.approved);
  if (config.demoMode) {
    const copy = demoCopy(carousel.brief.theme);
    const normalized = {
      ...copy,
      slides: copy.slides.map((slide, index) => ({ ...slide, n: index + 1 })),
    };
    const checked = copyResponseSchema.safeParse(normalized);
    if (!checked.success) return validation(c, checked.error);
    return c.json({
      copy: checked.data,
      meta: {
        demo: true,
        provider: "Demo fixture",
        researchProvider: "manual",
      },
    });
  }

  const copy = await generateCopy(carousel.brief, approved, config);
  return c.json({
    copy,
    meta: {
      demo: false,
      provider: config.providerLabel,
      researchProvider: config.researchProvider,
    },
  });
});

app.post("/api/visual", async (c) => {
  const config = loadConfig();
  const limited = rateLimited(c, config.rateLimitPerMin);
  if (limited) return limited;

  const body = await c.req.json().catch(() => null);
  const parsed = z
    .object({ brief: briefSchema, slides: z.array(slideSchema).min(1).max(9) })
    .safeParse(body);
  if (!parsed.success) return validation(c, parsed.error);

  if (config.demoMode) {
    return c.json({
      slides: parsed.data.slides,
      meta: { demo: true, provider: "Demo fixture" },
    });
  }

  const preview = parsed.data.slides.map((slide) => ({
    n: slide.n,
    layout: slide.layout,
    title: slide.title,
    body: slide.body,
    items: slide.items,
  }));
  const result = await callJson(
    config,
    visualMessages(parsed.data.brief, preview),
    visualResponseSchema,
    "visual direction",
  );
  return c.json({
    slides: applyVisualSelection(parsed.data.slides, result.slides),
    meta: { demo: false, provider: config.providerLabel },
  });
});

app.get("/api/drafts", async (c) => {
  const config = loadConfig();
  if (config.storageMode !== "filesystem") {
    return c.json({ drafts: [], supported: false });
  }
  return c.json({ drafts: await listDrafts(), supported: true });
});

app.post("/api/drafts", async (c) => {
  const config = loadConfig();
  if (config.storageMode !== "filesystem") {
    return c.json({ error: "Server storage is not available in this deployment." }, 501);
  }
  const body = await c.req.json().catch(() => null);
  const parsed = z.object({ carousel: carouselSchema }).safeParse(body);
  if (!parsed.success) return validation(c, parsed.error);
  const saved = await saveDraft(parsed.data.carousel);
  return c.json({ carousel: saved });
});

app.get("/api/drafts/:id", async (c) => {
  const config = loadConfig();
  if (config.storageMode !== "filesystem") {
    return c.json({ error: "Server storage is not available in this deployment." }, 501);
  }
  const draft = await getDraft(c.req.param("id"));
  if (!draft) return c.json({ error: "Draft not found." }, 404);
  return c.json({ carousel: draft });
});

app.delete("/api/drafts/:id", async (c) => {
  const config = loadConfig();
  if (config.storageMode !== "filesystem") {
    return c.json({ error: "Server storage is not available in this deployment." }, 501);
  }
  await deleteDraft(c.req.param("id"));
  return c.json({ ok: true });
});

app.get("/api/drafts/:id/export-check", async (c) => {
  const config = loadConfig();
  if (config.storageMode !== "filesystem") {
    return c.json({ error: "Server storage is not available in this deployment." }, 501);
  }
  const draft = await getDraft(c.req.param("id"));
  if (!draft) return c.json({ error: "Draft not found." }, 404);
  const issues = exportIssues(draft as Carousel);
  return c.json({ ok: issues.length === 0, issues });
});

app.notFound((c) => c.json({ error: "API route not found." }, 404));

app.onError((error, c) => {
  if (error instanceof LLMError) {
    if (error.retryAfter) c.header("Retry-After", String(error.retryAfter));
    return c.json(
      { error: error.message, retryAfter: error.retryAfter },
      error.status as 400 | 401 | 409 | 422 | 429 | 502 | 503 | 504,
    );
  }
  if (error instanceof z.ZodError) return validation(c, error);
  console.error(error);
  return c.json({ error: "Something went wrong in the studio API." }, 500);
});

export default app;
