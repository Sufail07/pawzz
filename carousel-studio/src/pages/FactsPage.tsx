import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Info,
  Link2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash,
  TriangleExclamationPoint,
} from "lucide-react";
import {
  countChars,
  MAX_KEY_POINTS,
} from "../../shared/limits";
import {
  factsGateIssues,
  type Carousel,
  type KeyPoint,
} from "../../shared/schema";
import { ApiError, runCopy, runResearch } from "../lib/api";
import { useStudio } from "../app/StudioProvider";
import { StudioShell } from "../app/StudioShell";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, inputClass, textareaClass } from "../components/ui/Field";
import { LoadingBlock } from "../components/ui/Feedback";
import { Switch } from "../components/ui/Switch";
import { cn } from "../lib/cn";

type Busy = "research" | "copy" | null;

function pointProblem(point: KeyPoint): string | null {
  if (!point.text.trim()) return "Add a claim";
  if (!point.source_url.trim()) return "Add a source URL";
  if (point.confidence !== "high") return "Mark it verified";
  if (!point.approved) return "Approve or remove it";
  return null;
}

export function FactsPage() {
  const { id = "" } = useParams<{ id: string }>();
  return (
    <StudioShell id={id} step="facts">
      {(carousel) => <FactsBody carousel={carousel} />}
    </StudioShell>
  );
}

function FactsBody({ carousel }: { carousel: Carousel }) {
  const navigate = useNavigate();
  const { updateDraft, saveDraftNow, getDraft, config } = useStudio();
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorIssues, setErrorIssues] = useState<string[]>([]);
  const [demoNotice, setDemoNotice] = useState<boolean>(carousel.demo);
  const researchStarted = useRef(false);
  const points = carousel.research.key_points;
  const issues = factsGateIssues(carousel);
  const resolvedCount = points.filter((point) => !pointProblem(point)).length;

  const current = () => getDraft(carousel.id) ?? carousel;

  const loadResearch = async (replace = false) => {
    setBusy("research");
    setError(null);
    setErrorIssues([]);
    try {
      const response = await runResearch(current().brief);
      updateDraft(carousel.id, (draft) => ({
        ...draft,
        research: {
          key_points: response.research.key_points,
          sources: response.research.sources,
        },
        slides: replace ? [] : draft.slides,
        headline_options: replace ? [] : draft.headline_options,
        chosen_headline: replace ? "" : draft.chosen_headline,
        caption: replace ? "" : draft.caption,
        hashtags: replace ? [] : draft.hashtags,
        status: "draft",
        demo: response.meta.demo,
      }));
      setDemoNotice(response.meta.demo);
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : null;
      setError(apiError?.message ?? "Research failed. Try again or add points manually.");
      setErrorIssues(apiError?.issues ?? []);
    } finally {
      setBusy(null);
    }
  };

  useEffect(() => {
    if (points.length === 0 && !researchStarted.current) {
      researchStarted.current = true;
      void loadResearch(false);
    }
    // The ref guard intentionally runs once per carousel id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carousel.id]);

  const updatePoint = (index: number, patch: Partial<KeyPoint>) => {
    updateDraft(carousel.id, (draft) => ({
      ...draft,
      status: "draft",
      research: {
        ...draft.research,
        key_points: draft.research.key_points.map((point, pointIndex) =>
          pointIndex === index ? { ...point, ...patch } : point,
        ),
      },
    }));
  };

  const addPoint = () => {
    if (points.length >= MAX_KEY_POINTS) return;
    const point: KeyPoint = {
      id: `kp-manual-${Date.now()}`,
      text: "",
      source_url: "",
      source_title: "",
      confidence: "check",
      approved: false,
    };
    updateDraft(carousel.id, (draft) => ({
      ...draft,
      status: "draft",
      research: {
        ...draft.research,
        key_points: [...draft.research.key_points, point],
      },
    }));
  };

  const removePoint = (index: number) => {
    updateDraft(carousel.id, (draft) => ({
      ...draft,
      status: "draft",
      research: {
        ...draft.research,
        key_points: draft.research.key_points.filter((_, pointIndex) => pointIndex !== index),
      },
    }));
  };

  const chooseSource = (index: number, url: string) => {
    const source = carousel.research.sources.find((item) => item.url === url);
    updatePoint(index, {
      source_url: url,
      source_title: source?.title ?? "",
    });
  };

  const approveResolved = () => {
    updateDraft(carousel.id, (draft) => ({
      ...draft,
      status: "draft",
      research: {
        ...draft.research,
        key_points: draft.research.key_points.map((point) => ({
          ...point,
          approved:
            Boolean(point.text.trim()) &&
            Boolean(point.source_url.trim()) &&
            point.confidence === "high",
        })),
      },
    }));
  };

  const continueToCopy = async () => {
    const latest = current();
    const latestIssues = factsGateIssues(latest);
    if (latestIssues.length > 0) {
      setError("Resolve the gate before writing copy.");
      setErrorIssues(latestIssues);
      return;
    }
    setBusy("copy");
    setError(null);
    setErrorIssues([]);
    try {
      const response = await runCopy(latest);
      updateDraft(carousel.id, (draft) => ({
        ...draft,
        headline_options: response.copy.headline_options,
        chosen_headline: response.copy.headline_options[0] ?? "",
        slides: response.copy.slides.map((slide, index) => ({ ...slide, n: index + 1 })),
        caption: response.copy.caption,
        hashtags: response.copy.hashtags,
        status: "facts_approved",
        demo: response.meta.demo,
      }));
      await saveDraftNow(getDraft(carousel.id) ?? latest);
      navigate(`/studio/${carousel.id}/draft`);
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : null;
      setError(apiError?.message ?? "Copy generation failed. Try again.");
      setErrorIssues(apiError?.issues ?? []);
    } finally {
      setBusy(null);
    }
  };

  const rerunResearch = () => {
    if (
      carousel.slides.length > 0 &&
      !window.confirm("Replace the research and clear the current draft copy?")
    ) {
      return;
    }
    void loadResearch(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-studio-ink">Gate 1 · Fact check</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-studio-muted">
              Every claim needs a source and a human decision. Approved points are the only
              material the copy stage can use.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="primary">
              {points.length} points
            </Badge>
            <Badge tone={resolvedCount === points.length && points.length >= 3 ? "success" : "accent"}>
              {resolvedCount} resolved
            </Badge>
            {config.demoMode ? <Badge tone="accent">Demo research</Badge> : null}
          </div>
        </div>

        {demoNotice ? (
          <div className="flex items-start gap-3 rounded-2xl border border-[#f2d8ac] bg-studio-accent-soft p-4 text-sm text-[#6d470d]">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>
              This run uses the zero-key demo research fixture. It is real, vetted sample content,
              but it was not generated for your brief.
            </p>
          </div>
        ) : null}

        {busy === "research" && points.length === 0 ? (
          <LoadingBlock label="Researching the brief and collecting sources…" />
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-[#f0c9cc] bg-studio-error-soft p-4 text-sm text-studio-error" role="alert">
            <p className="font-semibold">{error}</p>
            {errorIssues.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                {errorIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => void loadResearch(false)} loading={busy === "research"}>
                <RefreshCw className="h-4 w-4" aria-hidden />
                Retry research
              </Button>
              <Button size="sm" variant="ghost" onClick={addPoint}>
                <Plus className="h-4 w-4" aria-hidden />
                Add a point manually
              </Button>
            </div>
          </div>
        ) : null}

        {points.length === 0 && busy !== "research" ? (
          <Card className="p-6 text-center">
            <TriangleExclamationPoint className="mx-auto h-8 w-8 text-studio-accent" aria-hidden />
            <h3 className="mt-3 font-bold text-studio-ink">No research yet</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-studio-muted">
              Run research again, or add key points manually and attach sources yourself.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button onClick={() => void loadResearch(false)}>
                <RefreshCw className="h-4 w-4" aria-hidden />
                Run research
              </Button>
              <Button variant="secondary" onClick={addPoint}>
                <Plus className="h-4 w-4" aria-hidden />
                Add manually
              </Button>
            </div>
          </Card>
        ) : null}

        {points.map((point, index) => {
          const problem = pointProblem(point);
          const sourceValid = /^https?:\/\//.test(point.source_url);
          return (
            <Card key={point.id || index} className="p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">Point {String(index + 1).padStart(2, "0")}</Badge>
                <Badge tone={point.confidence === "high" ? "success" : "accent"}>
                  {point.confidence === "high" ? "Verified" : "Needs check"}
                </Badge>
                {problem ? (
                  <Badge tone="error">{problem}</Badge>
                ) : (
                  <Badge tone="success">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    Ready
                  </Badge>
                )}
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-studio-muted hover:bg-studio-error-soft hover:text-studio-error"
                    aria-label={`Remove point ${index + 1}`}
                  >
                    <Trash className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid gap-3">
                <Field
                  label="Claim"
                  htmlFor={`point-text-${index}`}
                  hint={`${countChars(point.text)}/240 characters`}
                >
                  <textarea
                    id={`point-text-${index}`}
                    className={textareaClass}
                    value={point.text}
                    maxLength={240}
                    onChange={(event) => updatePoint(index, { text: event.target.value })}
                    placeholder="One short, verifiable claim"
                  />
                </Field>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="Source URL"
                    htmlFor={`point-url-${index}`}
                    hint="Approval requires a real http(s) link."
                  >
                    <input
                      id={`point-url-${index}`}
                      className={inputClass}
                      type="url"
                      list="suggested-sources"
                      value={point.source_url}
                      onChange={(event) => chooseSource(index, event.target.value)}
                      placeholder="https://…"
                    />
                  </Field>
                  <Field
                    label="Source title"
                    htmlFor={`point-title-${index}`}
                    hint="Shown in the export copy deck."
                  >
                    <input
                      id={`point-title-${index}`}
                      className={inputClass}
                      value={point.source_title}
                      maxLength={160}
                      onChange={(event) => updatePoint(index, { source_title: event.target.value })}
                      placeholder="Publisher · page title"
                    />
                  </Field>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {sourceValid ? (
                    <a
                      href={point.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-studio-border px-3 text-xs font-semibold text-studio-primary hover:bg-studio-primary-soft"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      Open source
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-studio-muted">
                      <Link2 className="h-3.5 w-3.5" aria-hidden />
                      Add a source link to verify
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => updatePoint(index, { confidence: "high" })}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold",
                      point.confidence === "high"
                        ? "border-[#c8e5d3] bg-studio-success-soft text-[#1f6b43]"
                        : "border-studio-border text-studio-ink hover:border-studio-primary",
                    )}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                    {point.confidence === "high" ? "Marked verified" : "Mark verified"}
                  </button>
                  <div className="ml-auto">
                    <Switch
                      id={`point-approve-${index}`}
                      checked={point.approved}
                      onChange={(approved) => updatePoint(index, { approved })}
                      label={point.approved ? "Approved" : "Approve point"}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={addPoint} disabled={points.length >= MAX_KEY_POINTS}>
            <Plus className="h-4 w-4" aria-hidden />
            Add key point
          </Button>
          <Button variant="ghost" onClick={rerunResearch} loading={busy === "research"}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            Re-run research
          </Button>
        </div>

        <datalist id="suggested-sources">
          {carousel.research.sources.map((source) => (
            <option key={source.url} value={source.url}>
              {source.title}
            </option>
          ))}
        </datalist>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-studio-primary" aria-hidden />
            <h3 className="font-display text-lg font-bold text-studio-ink">Gate checklist</h3>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-studio-muted">
            {config.demoMode
              ? "In demo mode the fixture is already sourced. Approve all resolved points to continue."
              : "This gate is intentionally strict: unresolved claims block copywriting."}
          </p>
          {issues.length === 0 ? (
            <div className="mt-4 rounded-xl border border-[#c8e5d3] bg-studio-success-soft p-3 text-sm font-semibold text-[#1f6b43]">
              All claims are approved, sourced and verified.
            </div>
          ) : (
            <ul className="mt-4 space-y-2" aria-label="Gate issues">
              {issues.map((issue) => (
                <li key={issue} className="flex gap-2 text-xs leading-relaxed text-studio-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-accent" aria-hidden />
                  {issue}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="secondary" onClick={approveResolved} disabled={points.length === 0}>
              <Check className="h-4 w-4" aria-hidden />
              Approve all resolved
            </Button>
            <Button
              onClick={() => void continueToCopy()}
              disabled={issues.length > 0}
              loading={busy === "copy"}
              icon={<ArrowRight className="h-4 w-4" aria-hidden />}
            >
              {busy === "copy" ? "Writing copy…" : "Approve facts & write copy"}
            </Button>
            {issues.length > 0 ? (
              <p className="text-center text-xs text-studio-muted">
                Resolve {issues.length} item{issues.length === 1 ? "" : "s"} to unlock copy.
              </p>
            ) : null}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-lg font-bold text-studio-ink">Available sources</h3>
          <p className="mt-1 text-xs text-studio-muted">
            Search results are suggestions, not automatic approval.
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {carousel.research.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex gap-2 rounded-xl border border-studio-border bg-studio-card p-3 text-xs leading-relaxed hover:border-studio-primary"
                >
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-studio-primary" aria-hidden />
                  <span>
                    <span className="block font-semibold text-studio-ink group-hover:text-studio-primary">
                      {source.title || source.url}
                    </span>
                    <span className="mt-0.5 block truncate text-studio-muted">{source.url}</span>
                  </span>
                </a>
              </li>
            ))}
            {carousel.research.sources.length === 0 ? (
              <li className="rounded-xl border border-dashed border-studio-border-strong p-3 text-xs text-studio-muted">
                No suggested sources. Paste a URL into a claim.
              </li>
            ) : null}
          </ul>
        </Card>

        <div className="flex items-start gap-2 rounded-2xl border border-studio-border bg-studio-card/70 p-4 text-xs leading-relaxed text-studio-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-studio-info" aria-hidden />
          <p>
            Animal-health content must be reviewed by a licensed vet before real publication. The
            studio records sources; it does not replace clinical review.
          </p>
        </div>
      </aside>
    </div>
  );
}
