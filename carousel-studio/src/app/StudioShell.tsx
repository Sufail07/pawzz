import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Sparkles, WifiOff } from "lucide-react";
import type { ReactNode } from "react";
import type { Carousel } from "../../shared/schema";
import { useStudio } from "../app/StudioProvider";
import { Badge } from "../components/ui/Badge";
import { EmptyState, LoadingBlock } from "../components/ui/Feedback";
import { StatusPill } from "../components/ui/StatusPill";
import { cn } from "../lib/cn";
import { platformLabel } from "../../shared/themes";

const STEPS = [
  { key: "facts", label: "Fact check", path: "facts", number: 1 },
  { key: "draft", label: "Draft", path: "draft", number: 2 },
  { key: "export", label: "Export", path: "export", number: 3 },
] as const;

export type StudioStep = (typeof STEPS)[number]["key"];

export function StudioShell({
  id,
  step,
  children,
}: {
  id: string;
  step: StudioStep;
  children: (carousel: Carousel) => ReactNode;
}) {
  const { drafts, loading, config, apiReachable } = useStudio();
  const carousel = drafts.find((draft) => draft.id === id);

  if (loading) {
    return (
      <div className="container-page py-10">
        <LoadingBlock label="Opening the carousel…" />
      </div>
    );
  }

  if (!carousel) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<Sparkles className="h-10 w-10" aria-hidden />}
          title="Carousel not found"
          body="It may have been deleted on this device. Open history or start a new brief."
          action={
            <Link
              to="/history"
              className="inline-flex min-h-11 items-center rounded-full bg-studio-primary px-5 text-sm font-semibold text-white"
            >
              Open history
            </Link>
          }
        />
      </div>
    );
  }

  const draftReady = carousel.slides.length > 0;

  return (
    <div className="container-page py-6 md:py-8">
      <div className="mb-5 flex flex-wrap items-start gap-3">
        <Link
          to="/history"
          className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-studio-muted hover:bg-studio-surface-alt hover:text-studio-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          History
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-2xl font-bold text-studio-ink md:text-3xl">
            {carousel.brief.idea}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone={carousel.brief.theme === "animal" ? "primary" : "info"}>
              {carousel.brief.theme === "animal" ? "Animal care" : "AI education"}
            </Badge>
            <Badge>{platformLabel(carousel.brief.platform)}</Badge>
            <StatusPill carousel={carousel} />
            {carousel.demo ? <Badge tone="accent">Demo output</Badge> : null}
            <span className="inline-flex items-center gap-1 text-xs text-studio-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              Saved locally
            </span>
          </div>
        </div>
      </div>

      {!apiReachable ? (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#f0c9cc] bg-studio-error-soft p-4 text-sm text-studio-error">
          <WifiOff className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p>
            The API is offline. You can edit and export the seeded sample carousels. Start the
            local server with <code className="font-mono text-xs">npm run dev</code> to generate
            new content.
          </p>
        </div>
      ) : config.demoMode ? (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#f2d8ac] bg-studio-accent-soft p-4 text-sm text-[#6d470d]">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p>
            Demo mode. The AI stages return a vetted sample fixture so you can test the full
            workflow. Add a free Gemini key to generate new research.
          </p>
        </div>
      ) : null}

      <nav aria-label="Studio steps" className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((item) => {
          const enabled = item.key === "facts" || draftReady;
          const active = item.key === step;
          const className = cn(
            "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
            active
              ? "border-studio-primary bg-studio-primary text-white"
              : enabled
                ? "border-studio-border bg-studio-card text-studio-ink hover:border-studio-primary"
                : "cursor-not-allowed border-studio-border bg-studio-surface-alt text-studio-muted/60",
          );
          return enabled ? (
            <Link key={item.key} to={`/studio/${id}/${item.path}`} className={className}>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs">
                {item.number}
              </span>
              {item.label}
            </Link>
          ) : (
            <span key={item.key} className={className} aria-disabled="true">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-studio-border/50 text-xs">
                {item.number}
              </span>
              {item.label}
            </span>
          );
        })}
      </nav>

      {children(carousel)}
    </div>
  );
}

export function StudioRedirect() {
  const { id = "" } = useParams();
  const { drafts, loading } = useStudio();
  if (loading) {
    return (
      <div className="container-page py-10">
        <LoadingBlock label="Opening the carousel…" />
      </div>
    );
  }
  const carousel = drafts.find((draft) => draft.id === id);
  if (!carousel) return <Navigate to="/history" replace />;
  if (carousel.status === "final") return <Navigate to={`/studio/${id}/export`} replace />;
  if (carousel.slides.length > 0) return <Navigate to={`/studio/${id}/draft`} replace />;
  return <Navigate to={`/studio/${id}/facts`} replace />;
}
