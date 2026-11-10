import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Plus,
  Smartphone,
  Sparkles,
  Trash,
  TriangleExclamationPoint,
} from "lucide-react";
import {
  CHARACTER_LIMITS,
  ICONS,
  ICON_LABELS,
  LAYOUT_LABELS,
  LAYOUTS,
  countChars,
  slideIssues,
  type IconName,
  type Layout,
  type SlideLike,
} from "../../shared/limits";
import {
  allSlideIssues,
  exportIssues,
  normalizeHashtags,
  type Carousel,
  type Slide,
} from "../../shared/schema";
import { useStudio } from "../app/StudioProvider";
import { StudioShell } from "../app/StudioShell";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { inputClass, textareaClass } from "../components/ui/Field";
import { SlidePreview } from "../components/slide/SlidePreview";
import { cn } from "../lib/cn";

export function DraftPage() {
  const { id = "" } = useParams<{ id: string }>();
  return (
    <StudioShell id={id} step="draft">
      {(carousel) => <DraftBody carousel={carousel} />}
    </StudioShell>
  );
}

function SlideField({
  label,
  value,
  max,
  onChange,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  max: number;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const count = countChars(value);
  const over = count > max;
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between gap-2 text-xs font-semibold text-studio-ink">
        {label}
        <span className={cn("font-mono text-[11px]", over ? "text-studio-error" : "text-studio-muted")}>
          {count}/{max}
        </span>
      </span>
      {multiline ? (
        <textarea
          className={cn(textareaClass, over && "border-studio-error")}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          className={cn(inputClass, over && "border-studio-error")}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function DraftBody({ carousel }: { carousel: Carousel }) {
  const { updateDraft, saveDraftNow, getDraft } = useStudio();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [phonePreview, setPhonePreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slides = carousel.slides;
  const currentSlide = slides[Math.min(selected, Math.max(0, slides.length - 1))];
  const readiness = useMemo(
    () => exportIssues({ ...carousel, status: "final" }),
    [carousel],
  );
  const layoutIssues = useMemo(() => allSlideIssues(carousel), [carousel]);

  const updateSummary = (updater: (draft: Carousel) => Carousel) => {
    updateDraft(carousel.id, (draft) => {
      const updated = updater(draft);
      return {
        ...updated,
        status: updated.status === "final" ? "facts_approved" : updated.status,
      };
    });
  };

  const updateSlide = (index: number, patch: Partial<Slide>) => {
    updateSummary((draft) => ({
      ...draft,
      slides: draft.slides.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, ...patch } : slide,
      ),
    }));
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    if (index <= 0 || index >= slides.length - 1) return;
    const target = index + direction;
    if (target <= 0 || target >= slides.length - 1) return;
    updateSummary((draft) => {
      const next = [...draft.slides];
      const [moved] = next.splice(index, 1);
      if (!moved) return draft;
      next.splice(target, 0, moved);
      return { ...draft, slides: next.map((slide, slideIndex) => ({ ...slide, n: slideIndex + 1 })) };
    });
    setSelected(target);
  };

  const addSlide = () => {
    if (slides.length >= 9) return;
    updateSummary((draft) => {
      const insertion = Math.max(1, draft.slides.length - 1);
      const slide: Slide = {
        n: insertion + 1,
        layout: "statement",
        title: "",
        subtitle: "",
        body: "",
        items: [],
        number: "",
        source: "",
        label: "",
        handle: "",
        icon: "lightbulb",
        notes: "",
      };
      const next = [...draft.slides];
      next.splice(insertion, 0, slide);
      return { ...draft, slides: next.map((item, index) => ({ ...item, n: index + 1 })) };
    });
    setSelected(Math.max(1, slides.length - 1));
  };

  const removeSlide = (index: number) => {
    if (index <= 0 || index >= slides.length - 1) return;
    updateSummary((draft) => ({
      ...draft,
      slides: draft.slides
        .filter((_, slideIndex) => slideIndex !== index)
        .map((slide, slideIndex) => ({ ...slide, n: slideIndex + 1 })),
    }));
    setSelected(Math.max(0, Math.min(index - 1, slides.length - 3)));
  };

  const changeLayout = (layout: Layout) => {
    if (!currentSlide) return;
    updateSlide(selected, { layout });
  };

  const addItem = () => {
    if (!currentSlide || currentSlide.items.length >= 4) return;
    updateSlide(selected, { items: [...currentSlide.items, ""] });
  };

  const updateItem = (itemIndex: number, value: string) => {
    if (!currentSlide) return;
    updateSlide(selected, {
      items: currentSlide.items.map((item, index) => (index === itemIndex ? value : item)),
    });
  };

  const removeItem = (itemIndex: number) => {
    if (!currentSlide) return;
    updateSlide(selected, {
      items: currentSlide.items.filter((_, index) => index !== itemIndex),
    });
  };

  const addHashtags = () => {
    const next = normalizeHashtags(`${carousel.hashtags.join(" ")} ${tagInput}`);
    updateSummary((draft) => ({ ...draft, hashtags: next }));
    setTagInput("");
  };

  const removeHashtag = (tag: string) => {
    updateSummary((draft) => ({ ...draft, hashtags: draft.hashtags.filter((item) => item !== tag) }));
  };

  const approveFinal = async () => {
    const latest = getDraft(carousel.id) ?? carousel;
    const issues = exportIssues({ ...latest, status: "final" });
    if (issues.length > 0) {
      setError("Fix the readiness checklist before the final read.");
      return;
    }
    setSaving(true);
    setError(null);
    const approved = { ...latest, status: "final" as const };
    updateDraft(carousel.id, () => approved);
    try {
      await saveDraftNow(approved);
    } catch {
      // Local save is enough; the server archive can catch up later.
    }
    setSaving(false);
    navigate(`/studio/${carousel.id}/export`);
  };

  const updateCaption = (caption: string) => {
    updateSummary((draft) => ({ ...draft, caption }));
  };

  const chooseHeadline = (headline: string) => {
    updateSummary((draft) => ({ ...draft, chosen_headline: headline }));
  };

  if (!currentSlide) {
    return (
      <Card className="p-6">
        <p className="text-sm text-studio-muted">
          This carousel has no slides yet. Return to Gate 1 and write the copy.
        </p>
      </Card>
    );
  }

  const slideProblems = slideIssues(currentSlide as SlideLike, false);
  const Icon = Smartphone;

  return (
    <div className="grid gap-6 xl:grid-cols-[190px_minmax(0,1fr)_330px] xl:items-start">
      <div className="order-2 xl:order-1 xl:sticky xl:top-24">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-studio-ink">Slides</h2>
          <span className="text-xs text-studio-muted">{slides.length}/9</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 xl:flex-col xl:overflow-visible xl:pb-0">
          {slides.map((slide, index) => (
            <button
              key={slide.n}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                "flex w-28 shrink-0 flex-col gap-1.5 rounded-2xl border p-1.5 text-left transition xl:w-full",
                selected === index
                  ? "border-studio-primary bg-studio-primary-soft/60 shadow-sm"
                  : "border-studio-border bg-studio-card hover:border-studio-border-strong",
              )}
              aria-pressed={selected === index}
            >
              <SlidePreview slide={slide} theme={carousel.brief.theme} index={index} total={slides.length} />
              <span className="flex items-center justify-between px-0.5 text-[11px] font-semibold text-studio-muted">
                <span>
                  {String(index + 1).padStart(2, "0")} · {LAYOUT_LABELS[slide.layout]}
                </span>
                {slideIssues(slide as SlideLike, false).length > 0 ? (
                  <span className="h-2 w-2 rounded-full bg-studio-error" aria-label="Has issues" />
                ) : null}
              </span>
            </button>
          ))}
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="mt-2 w-full"
          onClick={addSlide}
          disabled={slides.length >= 9}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add slide
        </Button>
      </div>

      <div className="order-1 xl:order-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-studio-ink">Draft</h2>
            <p className="mt-1 text-sm text-studio-muted">
              Pick a headline, then edit the slide inline or in the inspector.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={phonePreview ? "primary" : "secondary"}
              size="sm"
              onClick={() => setPhonePreview((value) => !value)}
            >
              <Icon className="h-4 w-4" aria-hidden />
              Phone preview
            </Button>
          </div>
        </div>

        {carousel.status === "draft" && slides.length > 0 ? (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-[#f2d8ac] bg-studio-accent-soft p-3 text-xs leading-relaxed text-[#6d470d]">
            <TriangleExclamationPoint className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>
              The facts changed after this copy was written. Go back to Gate 1 to re-approve and
              re-run copy before exporting.
            </p>
          </div>
        ) : null}

        <div className={cn("mx-auto w-full", phonePreview ? "max-w-[360px]" : "max-w-[460px]")}>
          <div className={phonePreview ? "phone-shell" : ""}>
            <SlidePreview
              slide={currentSlide}
              theme={carousel.brief.theme}
              index={selected}
              total={slides.length}
              disclaimer={carousel.disclaimer}
              editing
              onChange={(patch) => updateSlide(selected, patch)}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-studio-muted">
            <span>
              Slide {selected + 1} of {slides.length} · {LAYOUT_LABELS[currentSlide.layout]}
            </span>
            <span className="hidden sm:inline">Click any text to edit it directly</span>
          </div>
        </div>

        {slideProblems.length > 0 ? (
          <div className="mx-auto mt-4 max-w-[560px] rounded-2xl border border-[#f0c9cc] bg-studio-error-soft p-3 text-xs text-studio-error">
            <p className="font-semibold">This slide needs attention</p>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {slideProblems.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="font-display text-lg font-bold text-studio-ink">Headline</h3>
            <p className="mt-1 text-xs text-studio-muted">
              Used on the cover, copy deck and history. The slide itself has its own title.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {carousel.headline_options.map((headline) => (
                <button
                  key={headline}
                  type="button"
                  onClick={() => chooseHeadline(headline)}
                  className={cn(
                    "flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm font-semibold",
                    carousel.chosen_headline === headline
                      ? "border-studio-primary bg-studio-primary-soft/60 text-studio-ink"
                      : "border-studio-border bg-studio-card text-studio-muted hover:border-studio-primary",
                  )}
                >
                  {headline}
                  {carousel.chosen_headline === headline ? (
                    <Check className="h-4 w-4 shrink-0 text-studio-primary" aria-hidden />
                  ) : null}
                </button>
              ))}
            </div>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-studio-ink">Custom headline</span>
              <input
                className={inputClass}
                value={carousel.chosen_headline}
                maxLength={90}
                onChange={(event) => chooseHeadline(event.target.value)}
                placeholder="Write your own"
              />
            </label>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-lg font-bold text-studio-ink">Caption</h3>
            <p className="mt-1 text-xs text-studio-muted">
              {countChars(carousel.caption)}/{CHARACTER_LIMITS.caption} characters
            </p>
            <textarea
              className={cn(textareaClass, "mt-3 min-h-36")}
              value={carousel.caption}
              maxLength={CHARACTER_LIMITS.caption}
              onChange={(event) => updateCaption(event.target.value)}
            />
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-studio-ink">Hashtags</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {carousel.hashtags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => removeHashtag(tag)}
                    className="inline-flex min-h-8 items-center gap-1 rounded-full border border-studio-border bg-studio-card px-2.5 text-xs font-semibold text-studio-muted hover:border-studio-error hover:text-studio-error"
                    aria-label={`Remove ${tag}`}
                  >
                    {tag}
                    <span aria-hidden>×</span>
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  className={inputClass}
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      addHashtags();
                    }
                  }}
                  placeholder="#topic #tips #learn"
                />
                <Button variant="secondary" onClick={addHashtags}>
                  Add
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <aside className="order-3 xl:sticky xl:top-24">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-studio-ink">Inspector</h3>
            <Badge>{LAYOUT_LABELS[currentSlide.layout]}</Badge>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-studio-ink">Layout</span>
              <select
                className={inputClass}
                value={currentSlide.layout}
                onChange={(event) => changeLayout(event.target.value as Layout)}
              >
                {LAYOUTS.map((layout) => (
                  <option key={layout} value={layout}>
                    {LAYOUT_LABELS[layout]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-studio-ink">Icon</span>
              <select
                className={inputClass}
                value={currentSlide.icon}
                onChange={(event) => updateSlide(selected, { icon: event.target.value as IconName })}
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {ICON_LABELS[icon]}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => moveSlide(selected, -1)}
                disabled={selected <= 1}
                aria-label="Move slide up"
              >
                <ArrowUp className="h-4 w-4" aria-hidden />
                Up
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => moveSlide(selected, 1)}
                disabled={selected === 0 || selected >= slides.length - 2}
                aria-label="Move slide down"
              >
                <ArrowDown className="h-4 w-4" aria-hidden />
                Down
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeSlide(selected)}
                disabled={selected === 0 || selected === slides.length - 1}
                aria-label="Remove slide"
              >
                <Trash className="h-4 w-4" aria-hidden />
              </Button>
            </div>

            <div className="h-px bg-studio-border" />

            {currentSlide.layout === "hook" ? (
              <>
                <SlideField
                  label="Title"
                  value={currentSlide.title}
                  max={CHARACTER_LIMITS.hook.title}
                  onChange={(title) => updateSlide(selected, { title })}
                  placeholder="Hook title"
                />
                <SlideField
                  label="Subtitle"
                  value={currentSlide.subtitle}
                  max={CHARACTER_LIMITS.hook.subtitle}
                  onChange={(subtitle) => updateSlide(selected, { subtitle })}
                  placeholder="Subtitle"
                />
              </>
            ) : null}

            {currentSlide.layout === "statement" ? (
              <>
                <SlideField
                  label="Title"
                  value={currentSlide.title}
                  max={CHARACTER_LIMITS.statement.title}
                  onChange={(title) => updateSlide(selected, { title })}
                  placeholder="One idea"
                />
                <SlideField
                  label="Body"
                  value={currentSlide.body}
                  max={CHARACTER_LIMITS.statement.body}
                  onChange={(body) => updateSlide(selected, { body })}
                  multiline
                  placeholder="Supporting sentence"
                />
              </>
            ) : null}

            {currentSlide.layout === "list" ? (
              <>
                <SlideField
                  label="Title"
                  value={currentSlide.title}
                  max={CHARACTER_LIMITS.list.title}
                  onChange={(title) => updateSlide(selected, { title })}
                />
                <div className="flex flex-col gap-2">
                  {currentSlide.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-2">
                      <div className="flex-1">
                        <SlideField
                          label={`Point ${itemIndex + 1}`}
                          value={item}
                          max={CHARACTER_LIMITS.list.item}
                          onChange={(value) => updateItem(itemIndex, value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(itemIndex)}
                        className="mt-6 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-studio-muted hover:bg-studio-error-soft hover:text-studio-error"
                        aria-label={`Remove list point ${itemIndex + 1}`}
                      >
                        <Trash className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" onClick={addItem} disabled={currentSlide.items.length >= 4}>
                    <Plus className="h-4 w-4" aria-hidden />
                    Add point
                  </Button>
                </div>
              </>
            ) : null}

            {currentSlide.layout === "stat" ? (
              <>
                <SlideField
                  label="Number"
                  value={currentSlide.number}
                  max={CHARACTER_LIMITS.stat.number}
                  onChange={(number) => updateSlide(selected, { number })}
                  placeholder="42%"
                />
                <SlideField
                  label="Label"
                  value={currentSlide.label}
                  max={CHARACTER_LIMITS.stat.label}
                  onChange={(label) => updateSlide(selected, { label })}
                  multiline
                />
                <SlideField
                  label="Source line"
                  value={currentSlide.source}
                  max={CHARACTER_LIMITS.stat.source}
                  onChange={(source) => updateSlide(selected, { source })}
                  multiline
                />
              </>
            ) : null}

            {currentSlide.layout === "quote" ? (
              <>
                <SlideField
                  label="Tip text"
                  value={currentSlide.body}
                  max={CHARACTER_LIMITS.quote.body}
                  onChange={(body) => updateSlide(selected, { body })}
                  multiline
                />
                <SlideField
                  label="Small label"
                  value={currentSlide.label}
                  max={CHARACTER_LIMITS.quote.label}
                  onChange={(label) => updateSlide(selected, { label })}
                />
              </>
            ) : null}

            {currentSlide.layout === "cta" ? (
              <>
                <SlideField
                  label="Action line"
                  value={currentSlide.title}
                  max={CHARACTER_LIMITS.cta.title}
                  onChange={(title) => updateSlide(selected, { title })}
                  multiline
                />
                <SlideField
                  label="Handle or link"
                  value={currentSlide.handle}
                  max={CHARACTER_LIMITS.cta.handle}
                  onChange={(handle) => updateSlide(selected, { handle })}
                />
              </>
            ) : null}

            <div className="h-px bg-studio-border" />

            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-studio-ink">
                <Sparkles className="h-3.5 w-3.5 text-studio-primary" aria-hidden />
                Readiness
              </h4>
              {readiness.length === 0 ? (
                <p className="mt-2 rounded-xl border border-[#c8e5d3] bg-studio-success-soft p-2.5 text-xs font-semibold text-[#1f6b43]">
                  Ready for the final read.
                </p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {readiness.slice(0, 5).map((issue) => (
                    <li key={issue} className="flex gap-2 text-[11px] leading-relaxed text-studio-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-accent" aria-hidden />
                      {issue}
                    </li>
                  ))}
                  {readiness.length > 5 ? (
                    <li className="text-[11px] text-studio-muted">+{readiness.length - 5} more</li>
                  ) : null}
                </ul>
              )}
            </div>

            {error ? (
              <p className="rounded-xl border border-[#f0c9cc] bg-studio-error-soft p-2.5 text-xs font-semibold text-studio-error" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              onClick={() => void approveFinal()}
              loading={saving}
              disabled={readiness.length > 0}
              icon={<ArrowRight className="h-4 w-4" aria-hidden />}
            >
              Approve final read & export
            </Button>
            {layoutIssues.length > 0 ? (
              <p className="text-center text-[11px] text-studio-muted">
                {layoutIssues.length} template limit{layoutIssues.length === 1 ? "" : "s"} to fix.
              </p>
            ) : null}
          </div>
        </Card>
      </aside>
    </div>
  );
}
