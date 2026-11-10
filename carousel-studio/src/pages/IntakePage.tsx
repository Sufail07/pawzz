import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Check,
  GraduationCap,
  PawPrint,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { briefSchema, createDraft, type Brief } from "../../shared/schema";
import { THEMES, type ThemeName } from "../../shared/themes";
import { useStudio } from "../app/StudioProvider";
import { Badge } from "../components/ui/Badge";
import { Button, buttonStyles } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, inputClass, textareaClass } from "../components/ui/Field";
import { cn } from "../lib/cn";

const THEME_CARDS: Array<{
  value: ThemeName;
  title: string;
  body: string;
  icon: typeof PawPrint;
}> = [
  {
    value: "animal",
    title: "Animal care",
    body: "Pawzz · warm teal, Fraunces headlines, vet-review note",
    icon: PawPrint,
  },
  {
    value: "edu",
    title: "AI education",
    body: "Lumen AI Academy · indigo, lime highlight, Plus Jakarta",
    icon: GraduationCap,
  },
];

const SAMPLES: Array<{
  id: string;
  theme: ThemeName;
  title: string;
}> = [
  {
    id: "sample-5-signs-your-pet-needs-a-vet-today",
    theme: "animal",
    title: "5 signs your pet needs a vet today",
  },
  {
    id: "sample-start-with-ai-today",
    theme: "edu",
    title: "5 practical ways to start using AI today",
  },
];

export function IntakePage() {
  const navigate = useNavigate();
  const { saveDraftNow, drafts, config, apiReachable } = useStudio();
  const [brief, setBrief] = useState<Brief>({
    idea: "",
    audience: "",
    platform: "both",
    theme: "edu",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (patch: Partial<Brief>) => {
    setBrief((current) => ({ ...current, ...patch }));
    setErrors({});
  };

  const useSampleIdea = (theme: ThemeName) => {
    if (theme === "animal") {
      update({
        idea: "5 signs your pet needs a vet today",
        audience: "Indian pet parents with dogs and cats",
        theme,
      });
    } else {
      update({
        idea: "5 practical ways to start using AI today",
        audience: "Students and early-career professionals in India",
        theme,
      });
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = briefSchema.safeParse(brief);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0] ?? "form")] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSubmitting(true);
    const draft = createDraft(parsed.data);
    try {
      await saveDraftNow(draft);
    } catch {
      // The draft is already saved locally even if the server archive failed.
    }
    navigate(`/studio/${draft.id}/facts`);
  };

  return (
    <div className="container-page py-10 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <Badge tone="primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Idea to carousel
          </Badge>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.05] text-studio-ink md:text-5xl">
            One brief. A sourced, on-brand carousel.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-studio-muted">
            Type an idea, check the facts, pick a headline and export. The studio locks the
            template, enforces character limits and keeps every source attached.
          </p>

          <form onSubmit={submit} className="mt-8" noValidate>
            <Card className="p-5 md:p-7">
              <div className="flex flex-col gap-5">
                <Field
                  label="What is the carousel about?"
                  htmlFor="idea"
                  hint="A topic, question or practical list. The AI research stage uses this."
                  error={errors.idea}
                >
                  <textarea
                    id="idea"
                    className={textareaClass}
                    value={brief.idea}
                    maxLength={300}
                    onChange={(event) => update({ idea: event.target.value })}
                    placeholder="e.g. 5 signs your pet needs a vet today"
                  />
                </Field>

                <Field
                  label="Who is it for?"
                  htmlFor="audience"
                  hint="The more specific the audience, the better the copy."
                  error={errors.audience}
                >
                  <input
                    id="audience"
                    className={inputClass}
                    value={brief.audience}
                    maxLength={160}
                    onChange={(event) => update({ audience: event.target.value })}
                    placeholder="e.g. Indian pet parents with dogs and cats"
                  />
                </Field>

                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-studio-ink">Platform</legend>
                  <div className="grid grid-cols-3 gap-2 rounded-2xl bg-studio-surface-alt p-1.5">
                    {(
                      [
                        ["instagram", "Instagram"],
                        ["linkedin", "LinkedIn"],
                        ["both", "Both"],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-2 text-sm font-semibold transition",
                          brief.platform === value
                            ? "bg-studio-card text-studio-ink shadow-sm"
                            : "text-studio-muted hover:text-studio-ink",
                        )}
                      >
                        <input
                          type="radio"
                          name="platform"
                          value={value}
                          checked={brief.platform === value}
                          onChange={() => update({ platform: value })}
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-studio-ink">Brand theme</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {THEME_CARDS.map((item) => {
                      const theme = THEMES[item.value];
                      const Icon = item.icon;
                      const selected = brief.theme === item.value;
                      return (
                        <label
                          key={item.value}
                          className={cn(
                            "relative flex cursor-pointer gap-3 rounded-2xl border p-4 transition",
                            selected
                              ? "border-studio-primary bg-studio-primary-soft/60 shadow-sm"
                              : "border-studio-border bg-studio-card hover:border-studio-border-strong",
                          )}
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={item.value}
                            checked={selected}
                            onChange={() => update({ theme: item.value })}
                            className="sr-only"
                          />
                          <span
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
                            style={{ backgroundColor: theme.primary }}
                          >
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 font-bold text-studio-ink">
                              {item.title}
                              {selected ? <Check className="h-4 w-4 text-studio-primary" aria-hidden /> : null}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-studio-muted">
                              {item.body}
                            </span>
                            <span className="mt-2 flex gap-1.5" aria-hidden>
                              {[theme.primary, theme.accent, theme.surface].map((color) => (
                                <span
                                  key={color}
                                  className="h-3 w-6 rounded-full border border-black/5"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {Object.keys(errors).length > 0 ? (
                  <p className="rounded-xl border border-[#f0c9cc] bg-studio-error-soft p-3 text-sm font-semibold text-studio-error" role="alert">
                    Check the highlighted fields before continuing.
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" size="lg" loading={submitting} icon={<Sparkles className="h-4 w-4" aria-hidden />}>
                    Start with this brief
                  </Button>
                  <span className="text-xs text-studio-muted">
                    Next: the fact-check gate. No copy is written first.
                  </span>
                </div>
              </div>
            </Card>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="py-2 text-xs font-semibold uppercase tracking-wide text-studio-muted">
              Try a brief
            </span>
            <button
              type="button"
              onClick={() => useSampleIdea("animal")}
              className={buttonStyles("secondary", "sm")}
            >
              <PawPrint className="h-4 w-4" aria-hidden />
              Pet warning signs
            </button>
            <button
              type="button"
              onClick={() => useSampleIdea("edu")}
              className={buttonStyles("secondary", "sm")}
            >
              <Bot className="h-4 w-4" aria-hidden />
              Start with AI
            </button>
          </div>
        </div>

        <aside className="flex flex-col gap-5">
          <Card className="p-5">
            <h2 className="font-display text-xl font-bold text-studio-ink">How the run works</h2>
            <ol className="mt-4 space-y-3">
              {[
                ["Brief", "Idea, audience, platform, theme"],
                ["Research", "Sourced key points from the web"],
                ["Gate 1", "You approve, edit or remove each claim"],
                ["Copy + visuals", "Headlines, slides, caption, locked layouts"],
                ["Gate 2", "Read every slide on a phone preview"],
                ["Export", "PNG set, PDF, copy deck, JSON"],
              ].map(([title, body], index) => (
                <li key={title} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-studio-primary-soft text-xs font-bold text-studio-primary-dark">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-studio-ink">{title}</span>
                    <span className="block text-xs leading-relaxed text-studio-muted">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-studio-primary" aria-hidden />
              <div>
                <h2 className="font-bold text-studio-ink">
                  {config.demoMode ? "Zero-key demo mode" : `${config.providerLabel} · ${config.model}`}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-studio-muted">
                  {config.demoMode
                    ? "No API key configured. The research and copy stages return a labelled, vetted fixture so the whole workflow still works."
                    : `Research: ${config.researchProvider}. The API key stays on the server; the browser never sees it.`}
                </p>
                {!apiReachable ? (
                  <p className="mt-2 text-xs font-semibold text-studio-error">
                    API offline. Seeded samples are still editable and exportable.
                  </p>
                ) : null}
              </div>
            </div>
          </Card>

          {drafts.some((draft) => SAMPLES.some((sample) => sample.id === draft.id)) ? (
            <Card className="p-5">
              <h2 className="font-display text-xl font-bold text-studio-ink">Finished samples</h2>
              <p className="mt-1 text-sm text-studio-muted">
                Open a completed carousel to inspect the gate, edit and export.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {SAMPLES.map((sample) => {
                  const exists = drafts.some((draft) => draft.id === sample.id);
                  if (!exists) return null;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => navigate(`/studio/${sample.id}/export`)}
                      className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-studio-border bg-studio-card px-3 text-left text-sm font-semibold text-studio-ink hover:border-studio-primary"
                    >
                      <span className="flex items-center gap-2">
                        {sample.theme === "animal" ? (
                          <PawPrint className="h-4 w-4 text-studio-primary" aria-hidden />
                        ) : (
                          <Bot className="h-4 w-4 text-studio-info" aria-hidden />
                        )}
                        {sample.title}
                      </span>
                      <ArrowRight className="h-4 w-4 text-studio-muted" aria-hidden />
                    </button>
                  );
                })}
              </div>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
