import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CopyPlus,
  Download,
  FileBraces,
  Plus,
  Search,
  Sparkles,
  Trash,
  Upload,
} from "lucide-react";
import { carouselSchema, type Carousel } from "../../shared/schema";
import { THEMES } from "../../shared/themes";
import { useStudio } from "../app/StudioProvider";
import { Badge } from "../components/ui/Badge";
import { Button, buttonStyles } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/Feedback";
import { inputClass } from "../components/ui/Field";
import { StatusPill } from "../components/ui/StatusPill";
import { SlidePreview } from "../components/slide/SlidePreview";
import { seedDrafts } from "../lib/repository";
import { downloadText } from "../lib/export";
import { cn } from "../lib/cn";

type Filter = "all" | "animal" | "edu" | "final";

export function HistoryPage() {
  const { drafts, deleteDraft, duplicateDraft, importDraft, saveDraftNow } = useStudio();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return drafts
      .filter((draft) => {
        if (filter === "animal" && draft.brief.theme !== "animal") return false;
        if (filter === "edu" && draft.brief.theme !== "edu") return false;
        if (filter === "final" && draft.status !== "final") return false;
        if (!needle) return true;
        return (
          draft.brief.idea.toLowerCase().includes(needle) ||
          draft.brief.audience.toLowerCase().includes(needle) ||
          draft.chosen_headline.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [drafts, filter, query]);

  const remove = async (draft: Carousel) => {
    if (!window.confirm(`Delete "${draft.brief.idea}" from this device?`)) return;
    await deleteDraft(draft.id);
  };

  const duplicate = (draft: Carousel) => {
    const copy = duplicateDraft(draft.id);
    if (copy) navigate(`/studio/${copy.id}`);
  };

  const download = (draft: Carousel) => {
    downloadText(
      JSON.stringify(draft, null, 2),
      `${draft.id}.json`,
      "application/json",
    );
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const checked = carouselSchema.safeParse(parsed);
      if (!checked.success) throw new Error("That file is not a valid Carousel Studio JSON.");
      const imported = importDraft(checked.data);
      navigate(`/studio/${imported.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not import that file.");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const restoreSamples = async () => {
    for (const sample of seedDrafts()) {
      await saveDraftNow(sample).catch(() => undefined);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Local archive
          </Badge>
          <h1 className="mt-3 font-display text-3xl font-bold text-studio-ink md:text-4xl">
            Carousel history
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-studio-muted">
            Every run saves its JSON. Reopen, duplicate, edit and re-export without losing the
            source trail.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden />
            Import JSON
          </Button>
          <Link to="/" className={buttonStyles("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            New brief
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-muted" aria-hidden />
          <input
            className={cn(inputClass, "pl-9")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ideas, audiences or headlines"
            aria-label="Search carousels"
          />
        </div>
        <div className="flex gap-1 rounded-full bg-studio-surface-alt p-1">
          {(
            [
              ["all", "All"],
              ["animal", "Animal"],
              ["edu", "Education"],
              ["final", "Final"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "min-h-9 rounded-full px-3 text-xs font-semibold transition",
                filter === value
                  ? "bg-studio-card text-studio-ink shadow-sm"
                  : "text-studio-muted hover:text-studio-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-[#f0c9cc] bg-studio-error-soft p-3 text-sm text-studio-error" role="alert">
          {error}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<FileBraces className="h-10 w-10" aria-hidden />}
            title={drafts.length === 0 ? "No carousels yet" : "No matches"}
            body={
              drafts.length === 0
                ? "Start with a brief, or restore the two finished samples to inspect the workflow."
                : "Try a different search or filter."
            }
            action={
              drafts.length === 0 ? (
                <div className="flex flex-wrap justify-center gap-2">
                  <Link to="/" className={buttonStyles("primary", "sm")}>
                    <Plus className="h-4 w-4" aria-hidden />
                    New brief
                  </Link>
                  <Button variant="secondary" size="sm" onClick={() => void restoreSamples()}>
                    Restore samples
                  </Button>
                </div>
              ) : null
            }
          />
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((draft) => {
            const theme = THEMES[draft.brief.theme];
            return (
              <Card as="li" key={draft.id} className="flex flex-col overflow-hidden">
                <button
                  type="button"
                  onClick={() => navigate(`/studio/${draft.id}`)}
                  className="group block p-3 text-left"
                  aria-label={`Open ${draft.brief.idea}`}
                >
                  {draft.slides[0] ? (
                    <SlidePreview
                      slide={draft.slides[0]}
                      theme={draft.brief.theme}
                      index={0}
                      total={draft.slides.length}
                      disclaimer={draft.disclaimer}
                    />
                  ) : (
                    <div
                      className="flex aspect-[4/5] flex-col justify-between rounded-[18px] p-5"
                      style={{ backgroundColor: theme.surface, color: theme.ink }}
                    >
                      <span style={{ color: theme.primary }} className="text-xs font-bold uppercase tracking-[0.2em]">
                        {theme.brand}
                      </span>
                      <span className="font-display text-2xl font-bold leading-tight">
                        {draft.brief.idea}
                      </span>
                      <span className="text-xs" style={{ color: theme.muted }}>
                        No slides yet
                      </span>
                    </div>
                  )}
                </button>
                <div className="flex flex-1 flex-col gap-3 p-4 pt-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={draft.brief.theme === "animal" ? "primary" : "info"}>
                        {draft.brief.theme === "animal" ? "Animal care" : "AI education"}
                      </Badge>
                      <StatusPill carousel={draft} />
                      {draft.demo ? <Badge tone="accent">Demo</Badge> : null}
                    </div>
                    <h2 className="mt-2 line-clamp-2 font-bold leading-snug text-studio-ink">
                      {draft.chosen_headline || draft.brief.idea}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-studio-muted">
                      {draft.brief.audience}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 text-[11px] text-studio-muted">
                    <span>{new Date(draft.updatedAt).toLocaleString()}</span>
                    <span>{draft.slides.length} slides</span>
                  </div>
                  <div className="flex flex-wrap gap-1 border-t border-studio-border pt-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/studio/${draft.id}`)}>
                      Open
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => duplicate(draft)} aria-label="Duplicate">
                      <CopyPlus className="h-4 w-4" aria-hidden />
                      Duplicate
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => download(draft)} aria-label="Download JSON">
                      <Download className="h-4 w-4" aria-hidden />
                      JSON
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-studio-error hover:bg-studio-error-soft"
                      onClick={() => void remove(draft)}
                      aria-label="Delete"
                    >
                      <Trash className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </ul>
      )}
    </div>
  );
}
