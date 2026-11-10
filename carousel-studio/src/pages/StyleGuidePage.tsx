import { Link } from "react-router-dom";
import { ArrowRight, Check, Palette } from "lucide-react";
import type { Slide } from "../../shared/schema";
import { LAYOUT_LABELS, LAYOUTS } from "../../shared/limits";
import { THEMES, THEME_NAMES, type ThemeName } from "../../shared/themes";
import { Badge } from "../components/ui/Badge";
import { buttonStyles } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { inputClass } from "../components/ui/Field";
import { SlidePreview } from "../components/slide/SlidePreview";

const DEMO_SLIDES: Slide[] = [
  {
    n: 1,
    layout: "hook",
    title: "A clear, on-brand hook",
    subtitle: "Every slide uses the same locked template set.",
    body: "",
    items: [],
    number: "",
    source: "",
    label: "",
    handle: "",
    icon: "sparkles",
    notes: "",
  },
  {
    n: 2,
    layout: "statement",
    title: "One idea per slide",
    subtitle: "",
    body: "Short, sourced copy with a fixed character limit so it never overflows.",
    items: [],
    number: "",
    source: "",
    label: "",
    handle: "",
    icon: "target",
    notes: "",
  },
  {
    n: 3,
    layout: "list",
    title: "A list that stays scannable",
    subtitle: "",
    body: "",
    items: ["Three or four points", "One line each", "Enforced limits", "No design decisions"],
    number: "",
    source: "",
    label: "",
    handle: "",
    icon: "check-circle",
    notes: "",
  },
  {
    n: 4,
    layout: "stat",
    title: "",
    subtitle: "",
    body: "",
    items: [],
    number: "12",
    source: "Template library · slide types",
    label: "layouts cover every part of the carousel",
    handle: "",
    icon: "activity",
    notes: "",
  },
  {
    n: 5,
    layout: "quote",
    title: "",
    subtitle: "",
    body: "The system succeeds when the founder reviews, not designs.",
    items: [],
    number: "",
    source: "",
    label: "The operating principle",
    handle: "",
    icon: "lightbulb",
    notes: "",
  },
  {
    n: 6,
    layout: "cta",
    title: "Start with one brief",
    subtitle: "",
    body: "",
    items: [],
    number: "",
    source: "",
    label: "",
    handle: "@pawzz.care",
    icon: "arrow-right",
    notes: "",
  },
];

const TOKEN_KEYS = [
  ["primary", "Primary action"],
  ["primaryDark", "Hover / dark"],
  ["accent", "Highlight"],
  ["surface", "Page surface"],
  ["ink", "Body text"],
  ["muted", "Secondary text"],
  ["border", "Divider"],
] as const;

function ThemeSection({ theme }: { theme: ThemeName }) {
  const value = THEMES[theme];
  return (
    <section aria-labelledby={`theme-${theme}`} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={`theme-${theme}`} className="font-display text-2xl font-bold text-studio-ink">
            {value.label}
          </h2>
          <p className="mt-1 text-sm text-studio-muted">
            {value.brand} · {value.bodyFont}
            {value.displayFont !== value.bodyFont ? ` + ${value.displayFont}` : ""} ·{" "}
            {value.handle}
          </p>
        </div>
        <Badge tone={theme === "animal" ? "primary" : "info"}>
          {theme === "animal" ? "Teal family" : "Indigo family"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {TOKEN_KEYS.map(([key, label]) => (
          <div key={key} className="overflow-hidden rounded-2xl border border-studio-border bg-studio-card">
            <div className="h-16" style={{ backgroundColor: value[key] }} />
            <div className="p-3">
              <p className="text-xs font-semibold text-studio-ink">{label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-studio-muted">{value[key]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_SLIDES.map((slide, index) => (
          <div key={`${theme}-${slide.layout}`} className="flex flex-col gap-2">
            <SlidePreview
              slide={slide}
              theme={theme}
              index={index}
              total={DEMO_SLIDES.length}
              disclaimer={value.disclaimer}
            />
            <p className="px-1 text-xs font-semibold text-studio-muted">
              {LAYOUT_LABELS[slide.layout]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StyleGuidePage() {
  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="primary">
            <Palette className="h-3.5 w-3.5" aria-hidden />
            Coded design system
          </Badge>
          <h1 className="mt-3 font-display text-3xl font-bold text-studio-ink md:text-4xl">
            Styleguide
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-studio-muted">
            Two brand families, one shared template library. Slides are fixed at 1080 × 1350 and
            use CSS custom properties, so the AI can choose a layout but never invent styling.
          </p>
        </div>
        <Link to="/" className={buttonStyles("secondary")}>
          Back to brief
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-12">
        {THEME_NAMES.map((theme) => (
          <ThemeSection key={theme} theme={theme} />
        ))}
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-xl font-bold text-studio-ink">Type and spacing</h2>
          <div className="mt-4 space-y-3">
            <p className="font-display text-4xl font-bold text-studio-ink">Display headline</p>
            <p className="text-2xl font-bold text-studio-ink">Section heading</p>
            <p className="text-base text-studio-ink">
              Body copy uses Plus Jakarta Sans at 16 px with a 4 px spacing grid.
            </p>
            <p className="text-sm text-studio-muted">
              Secondary text. Minimum tap target 44 × 44 px. Radius 12 for inputs, 20 for cards,
              999 for pills.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className={buttonStyles("primary", "sm")}>
              Primary
            </button>
            <button type="button" className={buttonStyles("secondary", "sm")}>
              Secondary
            </button>
            <button type="button" className={buttonStyles("accent", "sm")}>
              Accent
            </button>
            <button type="button" className={buttonStyles("ghost", "sm")}>
              Ghost
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="primary">Primary</Badge>
            <Badge tone="success">
              <Check className="h-3.5 w-3.5" aria-hidden />
              Verified
            </Badge>
            <Badge tone="accent">Needs check</Badge>
            <Badge tone="error">Blocked</Badge>
          </div>
          <input className={`${inputClass} mt-4`} placeholder="Input field" aria-label="Example input" />
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-bold text-studio-ink">Template contract</h2>
          <p className="mt-1 text-sm text-studio-muted">
            The AI selects a layout and fills fields. Limits are enforced in the prompt and again by
            the validator.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-studio-border text-studio-muted">
                  <th className="py-2 pr-3 font-semibold">Layout</th>
                  <th className="py-2 font-semibold">Fields and limits</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Hook", "Title 60 · Subtitle 90"],
                  ["Statement", "Title 50 · Body 140"],
                  ["List", "Title 40 · 3–4 items × 60"],
                  ["Stat", "Number 12 · Label 60 · Source 120"],
                  ["Quote or tip", "Tip 120 · Label 40"],
                  ["CTA", "Action 50 · Handle 60"],
                ].map(([layout, fields]) => (
                  <tr key={layout} className="border-b border-studio-border/70 last:border-0">
                    <td className="py-2 pr-3 font-semibold text-studio-ink">{layout}</td>
                    <td className="py-2 text-studio-muted">{fields}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-studio-muted">
            {LAYOUTS.length} layouts. Default structure: 1 hook, 5–7 content slides, 1 CTA. Text
            that exceeds a limit is flagged before export, and the validator rejects it at the API.
          </p>
        </Card>
      </section>
    </div>
  );
}
