export const LAYOUTS = [
  "hook",
  "statement",
  "list",
  "stat",
  "quote",
  "cta",
] as const;

export type Layout = (typeof LAYOUTS)[number];

export const ICONS = [
  "activity",
  "alert-triangle",
  "arrow-right",
  "book-open",
  "bone",
  "bot",
  "brain",
  "calendar",
  "cat",
  "check-circle",
  "clock",
  "dog",
  "droplet",
  "graduation-cap",
  "heart-pulse",
  "lightbulb",
  "map-pin",
  "message-circle",
  "moon",
  "paw-print",
  "phone",
  "rocket",
  "shield-check",
  "sparkles",
  "stethoscope",
  "sun",
  "syringe",
  "target",
  "thermometer",
  "utensils",
  "wind",
  "zap",
] as const;

export type IconName = (typeof ICONS)[number];

export const ICON_LABELS: Record<IconName, string> = {
  activity: "Activity",
  "alert-triangle": "Warning",
  "arrow-right": "Arrow",
  "book-open": "Guide",
  bone: "Bone",
  bot: "Assistant",
  brain: "Thinking",
  calendar: "Calendar",
  cat: "Cat",
  "check-circle": "Check",
  clock: "Clock",
  dog: "Dog",
  droplet: "Water",
  "graduation-cap": "Learning",
  "heart-pulse": "Health",
  lightbulb: "Idea",
  "map-pin": "Location",
  "message-circle": "Conversation",
  moon: "Night",
  "paw-print": "Paw",
  phone: "Phone",
  rocket: "Start",
  "shield-check": "Trust",
  sparkles: "Sparkle",
  stethoscope: "Vet",
  sun: "Day",
  syringe: "Vaccine",
  target: "Goal",
  thermometer: "Temperature",
  utensils: "Food",
  wind: "Breathing",
  zap: "Energy",
};

export const LAYOUT_LABELS: Record<Layout, string> = {
  hook: "Hook",
  statement: "Statement",
  list: "List",
  stat: "Stat",
  quote: "Quote or tip",
  cta: "CTA",
};

export const CHARACTER_LIMITS = {
  hook: { title: 60, subtitle: 90 },
  statement: { title: 50, body: 140 },
  list: { title: 40, item: 60 },
  stat: { number: 12, label: 60, source: 120 },
  quote: { body: 120, label: 40 },
  cta: { title: 50, handle: 60 },
  notes: 300,
  caption: 2200,
  hashtag: 40,
} as const;

export const MAX_SLIDES = 9;
export const MIN_SLIDES = 7;
export const MAX_KEY_POINTS = 6;
export const MIN_KEY_POINTS = 3;

export function countChars(value: string): number {
  return [...value].length;
}

export interface SlideLike {
  layout: Layout;
  title?: string;
  subtitle?: string;
  body?: string;
  items?: string[];
  number?: string;
  source?: string;
  label?: string;
  handle?: string;
  icon?: string;
  notes?: string;
}

export function slideIssues(slide: SlideLike, requireContent = false): string[] {
  const issues: string[] = [];
  const required = (value: string | undefined, name: string) => {
    if (requireContent && !(value ?? "").trim()) issues.push(`${name} is required`);
  };
  const max = (value: string | undefined, limit: number, name: string) => {
    if (countChars(value ?? "") > limit) {
      issues.push(`${name} is ${countChars(value ?? "")}/${limit} characters`);
    }
  };

  required(slide.icon, "Icon");
  if (slide.icon && !(ICONS as readonly string[]).includes(slide.icon)) {
    issues.push(`Icon "${slide.icon}" is not in the template library`);
  }

  switch (slide.layout) {
    case "hook":
      required(slide.title, "Title");
      required(slide.subtitle, "Subtitle");
      max(slide.title, CHARACTER_LIMITS.hook.title, "Title");
      max(slide.subtitle, CHARACTER_LIMITS.hook.subtitle, "Subtitle");
      break;
    case "statement":
      required(slide.title, "Title");
      required(slide.body, "Body");
      max(slide.title, CHARACTER_LIMITS.statement.title, "Title");
      max(slide.body, CHARACTER_LIMITS.statement.body, "Body");
      break;
    case "list": {
      const items = (slide.items ?? []).filter((item) => item.trim());
      required(slide.title, "Title");
      max(slide.title, CHARACTER_LIMITS.list.title, "Title");
      if (requireContent && (items.length < 3 || items.length > 4)) {
        issues.push("List needs three or four points");
      }
      if (items.length > 4) issues.push("List allows at most four points");
      items.forEach((item, index) =>
        max(item, CHARACTER_LIMITS.list.item, `Point ${index + 1}`),
      );
      break;
    }
    case "stat":
      required(slide.number, "Number");
      required(slide.label, "Label");
      if (requireContent) required(slide.source, "Source");
      max(slide.number, CHARACTER_LIMITS.stat.number, "Number");
      max(slide.label, CHARACTER_LIMITS.stat.label, "Label");
      max(slide.source, CHARACTER_LIMITS.stat.source, "Source");
      break;
    case "quote":
      required(slide.body, "Tip text");
      required(slide.label, "Label");
      max(slide.body, CHARACTER_LIMITS.quote.body, "Tip text");
      max(slide.label, CHARACTER_LIMITS.quote.label, "Label");
      break;
    case "cta":
      required(slide.title, "Action line");
      required(slide.handle, "Handle or link");
      max(slide.title, CHARACTER_LIMITS.cta.title, "Action line");
      max(slide.handle, CHARACTER_LIMITS.cta.handle, "Handle or link");
      break;
  }

  max(slide.notes, CHARACTER_LIMITS.notes, "Notes");
  return issues;
}
