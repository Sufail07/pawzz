import {
  LAYOUTS,
  ICONS,
  type IconName,
  type Layout,
  type SlideLike,
} from "../shared/limits.js";
import {
  copyResponseSchema,
  visualResponseSchema,
  type Brief,
  type KeyPoint,
  type CopyResponse,
  type Slide,
} from "../shared/schema.js";
import type { AppConfig } from "./config.js";
import { callJson } from "./llm.js";
import { copyMessages, visualMessages } from "./prompts.js";

const FALLBACK_ICONS: IconName[] = [
  "heart-pulse",
  "activity",
  "shield-check",
  "lightbulb",
  "target",
  "sparkles",
];

function validIcon(value: string | undefined): value is IconName {
  return Boolean(value) && (ICONS as readonly string[]).includes(value as string);
}

function validLayout(value: string | undefined): value is Layout {
  return Boolean(value) && (LAYOUTS as readonly string[]).includes(value as string);
}

function fallbackIcon(slide: Slide, index: number): IconName {
  if (slide.layout === "hook") return "sparkles";
  if (slide.layout === "cta") return "arrow-right";
  if (slide.layout === "list") return "check-circle";
  if (slide.layout === "stat") return "activity";
  if (slide.layout === "quote") return "message-circle";
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length] ?? "heart-pulse";
}

function layoutFits(slide: SlideLike, layout: Layout): boolean {
  switch (layout) {
    case "hook":
      return Boolean(slide.title && slide.subtitle);
    case "statement":
      return Boolean(slide.title && slide.body);
    case "list":
      return Boolean(slide.title && (slide.items ?? []).filter(Boolean).length >= 3);
    case "stat":
      return Boolean(slide.number && slide.label && slide.source);
    case "quote":
      return Boolean(slide.body && slide.label);
    case "cta":
      return Boolean(slide.title && slide.handle);
  }
}

export function applyVisualSelection(
  slides: Slide[],
  selection: Array<{ n: number; layout: Layout; icon: IconName }>,
): Slide[] {
  const byNumber = new Map(selection.map((item) => [item.n, item]));
  return slides.map((slide, index) => {
    const chosen = byNumber.get(slide.n);
    const layout =
      chosen && validLayout(chosen.layout) && layoutFits(slide, chosen.layout)
        ? chosen.layout
        : slide.layout;
    const icon = chosen && validIcon(chosen.icon) ? chosen.icon : fallbackIcon(slide, index);
    return { ...slide, layout, icon };
  });
}

async function refineVisuals(
  brief: Brief,
  slides: Slide[],
  config: AppConfig,
): Promise<Slide[]> {
  try {
    const preview = slides.map((slide) => ({
      n: slide.n,
      layout: slide.layout,
      title: slide.title,
      body: slide.body,
      items: slide.items,
    }));
    const result = await callJson(
      config,
      visualMessages(brief, preview),
      visualResponseSchema,
      "visual direction",
    );
    return applyVisualSelection(slides, result.slides);
  } catch {
    return slides.map((slide, index) => ({
      ...slide,
      icon: validIcon(slide.icon) ? slide.icon : fallbackIcon(slide, index),
    }));
  }
}

export async function generateCopy(
  brief: Brief,
  approvedPoints: KeyPoint[],
  config: AppConfig,
): Promise<CopyResponse> {
  const raw = await callJson(
    config,
    copyMessages(brief, approvedPoints),
    copyResponseSchema,
    "copy",
  );

  const slides: Slide[] = raw.slides.map((slide, index) => ({
    ...slide,
    n: index + 1,
    icon: validIcon(slide.icon) ? slide.icon : "sparkles",
  }));

  if (slides[0] && slides[0].layout !== "hook") {
    slides[0] = { ...slides[0], layout: "hook" };
  }
  const last = slides[slides.length - 1];
  if (last && last.layout !== "cta") {
    slides[slides.length - 1] = { ...last, layout: "cta" };
  }

  const refined = await refineVisuals(brief, slides, config);
  return { ...raw, slides: refined };
}
