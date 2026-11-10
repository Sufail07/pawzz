import { z } from "zod";
import {
  CHARACTER_LIMITS,
  ICONS,
  LAYOUTS,
  MAX_KEY_POINTS,
  MAX_SLIDES,
  MIN_KEY_POINTS,
  MIN_SLIDES,
  slideIssues,
  type SlideLike,
} from "./limits.js";
import { THEMES, type ThemeName } from "./themes.js";

export const PLATFORMS = ["instagram", "linkedin", "both"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const THEME_KEYS = Object.keys(THEMES) as ThemeName[];

export const briefSchema = z.object({
  idea: z.string().trim().min(8, "Describe the idea in at least 8 characters").max(300),
  audience: z.string().trim().min(3, "Add an audience").max(160),
  platform: z.enum(PLATFORMS),
  theme: z.enum(THEME_KEYS as [ThemeName, ...ThemeName[]]),
});

export type Brief = z.infer<typeof briefSchema>;

function isHttpUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const sourceSchema = z.object({
  title: z.string().trim().max(160).default(""),
  url: z.string().trim().max(500).refine(isHttpUrl, "Enter a valid http(s) URL"),
});

export type Source = z.infer<typeof sourceSchema>;

export const keyPointSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().max(240).default(""),
  source_url: z
    .string()
    .trim()
    .max(500)
    .refine(isHttpUrl, "Enter a valid http(s) URL"),
  source_title: z.string().trim().max(160).default(""),
  confidence: z.enum(["high", "check"]).default("check"),
  approved: z.boolean().default(false),
});

export type KeyPoint = z.infer<typeof keyPointSchema>;

const slideFieldsSchema = z.object({
  n: z.number().int().min(0).max(MAX_SLIDES).default(0),
  layout: z.enum(LAYOUTS),
  title: z.string().max(400).default(""),
  subtitle: z.string().max(400).default(""),
  body: z.string().max(600).default(""),
  items: z.array(z.string().max(300)).max(6).default([]),
  number: z.string().max(60).default(""),
  source: z.string().max(400).default(""),
  label: z.string().max(160).default(""),
  handle: z.string().max(160).default(""),
  icon: z.enum(ICONS),
  notes: z.string().max(600).default(""),
});

export const slideSchema = slideFieldsSchema.superRefine((slide, ctx) => {
  for (const message of slideIssues(slide as SlideLike, false)) {
    ctx.addIssue({ code: "custom", message });
  }
});

export type Slide = z.infer<typeof slideSchema>;

export const researchResponseSchema = z.object({
  key_points: z
    .array(
      z.object({
        text: z.string().trim().min(1).max(240),
        source_url: z.string().trim().max(500).default(""),
        source_title: z.string().trim().max(160).default(""),
        confidence: z.enum(["high", "check"]).default("check"),
      }),
    )
    .min(MIN_KEY_POINTS)
    .max(MAX_KEY_POINTS),
});

export type ResearchResponse = z.infer<typeof researchResponseSchema>;

export const copyResponseSchema = z
  .object({
    headline_options: z.array(z.string().trim().min(1).max(90)).length(3),
    slides: z.array(slideFieldsSchema).min(MIN_SLIDES).max(MAX_SLIDES),
    caption: z.string().trim().min(20).max(CHARACTER_LIMITS.caption),
    hashtags: z
      .array(z.string().trim().min(1).max(CHARACTER_LIMITS.hashtag))
      .min(5)
      .max(15),
  })
  .superRefine((value, ctx) => {
    value.slides.forEach((slide, index) => {
      for (const message of slideIssues(slide as SlideLike, true)) {
        ctx.addIssue({
          code: "custom",
          path: ["slides", index],
          message,
        });
      }
    });
    if (value.slides[0]?.layout !== "hook") {
      ctx.addIssue({ code: "custom", path: ["slides", 0], message: "Slide 1 must use the hook layout" });
    }
    if (value.slides[value.slides.length - 1]?.layout !== "cta") {
      ctx.addIssue({
        code: "custom",
        path: ["slides", value.slides.length - 1],
        message: "The last slide must use the CTA layout",
      });
    }
  });

export type CopyResponse = z.infer<typeof copyResponseSchema>;

export const visualResponseSchema = z.object({
  slides: z
    .array(
      z.object({
        n: z.number().int().min(1).max(MAX_SLIDES),
        layout: z.enum(LAYOUTS),
        icon: z.enum(ICONS),
      }),
    )
    .min(1)
    .max(MAX_SLIDES),
});

export type VisualResponse = z.infer<typeof visualResponseSchema>;

export const carouselSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  brief: briefSchema,
  research: z.object({
    key_points: z.array(keyPointSchema).max(MAX_KEY_POINTS + 2).default([]),
    sources: z.array(sourceSchema).max(12).default([]),
  }),
  headline_options: z.array(z.string().max(90)).max(3).default([]),
  chosen_headline: z.string().max(90).default(""),
  slides: z.array(slideSchema).max(MAX_SLIDES).default([]),
  caption: z.string().max(CHARACTER_LIMITS.caption).default(""),
  hashtags: z.array(z.string().max(CHARACTER_LIMITS.hashtag)).max(30).default([]),
  disclaimer: z.string().max(400).default(""),
  status: z.enum(["draft", "facts_approved", "final"]),
  demo: z.boolean().default(false),
});

export type Carousel = z.infer<typeof carouselSchema>;

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createDraft(brief: Brief): Carousel {
  const now = new Date().toISOString();
  return {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    brief,
    research: { key_points: [], sources: [] },
    headline_options: [],
    chosen_headline: "",
    slides: [],
    caption: "",
    hashtags: [],
    disclaimer: THEMES[brief.theme].disclaimer,
    status: "draft",
    demo: false,
  };
}

export function factsGateIssues(carousel: Carousel): string[] {
  const issues: string[] = [];
  const points = carousel.research.key_points;
  if (points.length < MIN_KEY_POINTS) {
    issues.push(`Add or approve at least ${MIN_KEY_POINTS} key points`);
  }
  points.forEach((point, index) => {
    const label = point.text.trim() ? `Point ${index + 1}` : `Point ${index + 1} (empty)`;
    if (!point.text.trim()) {
      issues.push(`${label} needs a claim`);
    }
    if (!point.approved) {
      issues.push(`${label} must be approved or removed`);
    }
    if (!point.source_url.trim()) {
      issues.push(`${label} needs a source URL`);
    }
    if (point.confidence !== "high") {
      issues.push(`${label} still needs verification`);
    }
  });
  return issues;
}

export function exportIssues(carousel: Carousel): string[] {
  const issues = factsGateIssues(carousel);
  if (carousel.status !== "final") {
    issues.push("Approve the final read before exporting");
  }
  if (!carousel.chosen_headline.trim()) {
    issues.push("Choose a headline");
  }
  if (carousel.slides.length < MIN_SLIDES || carousel.slides.length > MAX_SLIDES) {
    issues.push(`Carousel needs ${MIN_SLIDES} to ${MAX_SLIDES} slides`);
  }
  if (carousel.slides[0]?.layout !== "hook") {
    issues.push("Slide 1 must use the hook layout");
  }
  if (carousel.slides[carousel.slides.length - 1]?.layout !== "cta") {
    issues.push("The last slide must use the CTA layout");
  }
  carousel.slides.forEach((slide, index) => {
    for (const message of slideIssues(slide as SlideLike, true)) {
      issues.push(`Slide ${index + 1}: ${message}`);
    }
  });
  if (carousel.caption.trim().length < 20) {
    issues.push("Caption needs at least 20 characters");
  }
  if (carousel.hashtags.length < 5 || carousel.hashtags.length > 15) {
    issues.push("Use 5 to 15 hashtags");
  }
  return issues;
}

export function allSlideIssues(carousel: Carousel): string[] {
  return carousel.slides.flatMap((slide, index) =>
    slideIssues(slide as SlideLike, false).map((message) => `Slide ${index + 1}: ${message}`),
  );
}

export function normalizeHashtags(input: string): string[] {
  const parts = input
    .split(/[\s,]+/)
    .map((tag) => tag.replace(/^#+/, "").trim())
    .filter(Boolean)
    .map((tag) => `#${tag}`);
  return [...new Set(parts)].slice(0, 15);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "carousel";
}
