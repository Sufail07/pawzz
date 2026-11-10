import {
  CHARACTER_LIMITS,
  LAYOUTS,
  ICON_LABELS,
} from "../shared/limits.js";
import type { Brief, KeyPoint } from "../shared/schema.js";
import { THEMES } from "../shared/themes.js";
import type { SearchResult } from "./research.js";

export interface PromptMessage {
  role: "system" | "user";
  content: string;
}

function layoutGuide(): string {
  return LAYOUTS.map((layout) => {
    switch (layout) {
      case "hook":
        return `- hook: title (max ${CHARACTER_LIMITS.hook.title}), subtitle (max ${CHARACTER_LIMITS.hook.subtitle})`;
      case "statement":
        return `- statement: title (max ${CHARACTER_LIMITS.statement.title}), body (max ${CHARACTER_LIMITS.statement.body})`;
      case "list":
        return `- list: title (max ${CHARACTER_LIMITS.list.title}), items (3-4, each max ${CHARACTER_LIMITS.list.item})`;
      case "stat":
        return `- stat: number (max ${CHARACTER_LIMITS.stat.number}), label (max ${CHARACTER_LIMITS.stat.label}), source (max ${CHARACTER_LIMITS.stat.source}, required)`;
      case "quote":
        return `- quote: body (tip text, max ${CHARACTER_LIMITS.quote.body}), label (max ${CHARACTER_LIMITS.quote.label})`;
      case "cta":
        return `- cta: title (action line, max ${CHARACTER_LIMITS.cta.title}), handle (max ${CHARACTER_LIMITS.cta.handle})`;
    }
  }).join("\n");
}

function iconGuide(): string {
  return Object.entries(ICON_LABELS)
    .map(([name, label]) => `${name} (${label})`)
    .join(", ");
}

export function researchMessages(brief: Brief, sources: SearchResult[]): PromptMessage[] {
  const theme = THEMES[brief.theme];
  const hasSources = sources.length > 0;
  const sourceBlock = hasSources
    ? sources
        .map(
          (source, index) =>
            `${index + 1}. ${source.title}\nURL: ${source.url}\nSnippet: ${source.snippet.slice(0, 350)}`,
        )
        .join("\n\n")
    : "(No web search results were available.)";

  return [
    {
      role: "system",
      content: `You are the research assistant for ${theme.label}. You find short, accurate, citable key points for a social carousel. Use real, reputable, publicly accessible source URLs. You return JSON only.`,
    },
    {
      role: "user",
      content: `Research brief
Idea: ${brief.idea}
Audience: ${brief.audience}
Platform: ${brief.platform}
Theme: ${brief.theme}

SEARCH RESULTS
${sourceBlock}

Task: return 3 to 6 key points that could support the carousel. Each point must be one short claim (max 240 characters) that a careful editor could verify.

Rules:
1. ${hasSources ? "Prefer the supplied search results. Use a URL from the list as source_url whenever the claim is supported by it." : "Provide a real, reputable source URL and source title for every key point (e.g. established organizations, .gov/.edu, or well-known references relevant to the topic)."}
2. ${hasSources ? "Never invent a URL. If no listed source supports a point, use an empty source_url, empty source_title, and confidence \"check\"." : "Do not invent or guess URLs. Only include URLs you are confident are real and relevant; if unsure, choose a widely known authoritative page on the topic."}
3. Use confidence "high" when the source directly supports the claim; otherwise use "check".
${brief.theme === "animal" ? "4. For animal health, do not diagnose, prescribe, give dosages, or claim certainty. Use wording such as \"can be a sign\" and \"contact a vet\".\n5. Do not include statistics unless a source clearly states them.\n6. " : "4. Do not include statistics unless a source clearly states them.\n5. "}Return JSON only, with this exact shape:
{"key_points":[{"text":"...","source_url":"https://...","source_title":"...","confidence":"high"}]}`,
    },
  ];
}

export function copyMessages(brief: Brief, approvedPoints: KeyPoint[]): PromptMessage[] {
  const theme = THEMES[brief.theme];
  const points = approvedPoints
    .map((point, index) => `${index + 1}. ${point.text}\nSource: ${point.source_title || point.source_url}`)
    .join("\n\n");

  return [
    {
      role: "system",
      content: `You are the copywriter for ${theme.label}'s carousel studio. Tone: warm, clear, practical, never alarmist. You write only from approved research points. You never invent facts, statistics, quotes, testimonials or sources. You return JSON only.`,
    },
    {
      role: "user",
      content: `Brief
Idea: ${brief.idea}
Audience: ${brief.audience}
Platform: ${brief.platform}
Brand handle: ${theme.handle}

APPROVED KEY POINTS (the only claims you may use)
${points}

TEMPLATE LIBRARY
${layoutGuide()}

Allowed icons
${iconGuide()}

Task: write an on-brand carousel with 7 to 9 slides. The first slide must be a hook. The last slide must be a CTA. Use one idea per slide. Keep every field inside its character limit. Include a stat slide only if an approved point contains a real number from the source; otherwise use statement, list or quote.

Layout choice guidance:
- hook for slide 1
- statement for one idea
- list for 3-4 short parallel actions or signs
- quote for practical advice
- cta for the final action

Rules:
1. Use only the approved key points. Do not add new claims, numbers, brand names or promises.
${brief.theme === "animal" ? "2. For animal health, never diagnose, prescribe or promise an outcome. Do not say a symptom is harmless.\n3. " : "2. "}Write three distinct headline options, each max 90 characters.
${brief.theme === "animal" ? "4. " : "3. "}Write a caption (max ${CHARACTER_LIMITS.caption} characters) and 5 to 15 hashtags. Do not use spaces inside a hashtag.
${brief.theme === "animal" ? "5. " : "4. "}Icons must come from the allowed list. Pick the icon that best matches each slide.
${brief.theme === "animal" ? "6. " : "5. "}Return JSON only, with this exact shape:
{"headline_options":["","",""],"slides":[{"n":1,"layout":"hook","title":"","subtitle":"","body":"","items":[],"number":"","source":"","label":"","handle":"","icon":"sparkles","notes":""}],"caption":"","hashtags":["#example"]}

Fill only the fields used by each layout. Use "" for unused text fields and [] for unused arrays. Do not wrap the JSON in markdown.`,
    },
  ];
}

export function visualMessages(brief: Brief, slides: KeyPointPreview[]): PromptMessage[] {
  return [
    {
      role: "system",
      content:
        "You are the visual direction stage for a brand-locked carousel template library. You may choose an allowed layout and an allowed icon. You never invent layouts, fields or styling. You return JSON only.",
    },
    {
      role: "user",
      content: `Theme: ${brief.theme}
For each slide, keep the content readable and choose one layout from: ${LAYOUTS.join(", ")}.
Choose one icon from: ${iconGuide()}.
Do not add or remove slides. The first slide must stay a hook and the last slide must stay a CTA.

Slides:
${slides
  .map(
    (slide) =>
      `Slide ${slide.n}: layout=${slide.layout}; title="${slide.title}"; body="${slide.body}"; items=${JSON.stringify(slide.items)}`,
  )
  .join("\n")}

Return JSON only:
{"slides":[{"n":1,"layout":"hook","icon":"sparkles"}]}`,
    },
  ];
}

export interface KeyPointPreview {
  n: number;
  layout: string;
  title: string;
  body: string;
  items: string[];
}
