import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileBraces,
  FileText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TriangleExclamationPoint,
} from "lucide-react";
import { Link } from "react-router-dom";
import { exportIssues, type Carousel } from "../../shared/schema";
import { platformLabel, THEMES } from "../../shared/themes";
import { useStudio } from "../app/StudioProvider";
import { StudioShell } from "../app/StudioShell";
import { Badge } from "../components/ui/Badge";
import { Button, buttonStyles } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SlidePreview } from "../components/slide/SlidePreview";
import { SlideCanvas } from "../components/slide/SlideCanvas";
import {
  buildCopyDeck,
  copyToClipboard,
  downloadText,
  exportPdf,
  exportPngZip,
  exportSinglePng,
  fileBase,
} from "../lib/export";

type Exporting = "png" | "pdf" | "single" | null;

export function ExportPage() {
  const { id = "" } = useParams<{ id: string }>();
  return (
    <StudioShell id={id} step="export">
      {(carousel) => <ExportBody carousel={carousel} />}
    </StudioShell>
  );
}

function ExportBody({ carousel }: { carousel: Carousel }) {
  const { updateDraft, saveDraftNow, getDraft } = useStudio();
  const [exporting, setExporting] = useState<Exporting>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nodes = useRef<Array<HTMLDivElement | null>>([]);
  const theme = THEMES[carousel.brief.theme];
  const issues = useMemo(() => exportIssues(carousel), [carousel]);
  const otherIssues = issues.filter((issue) => issue !== "Approve the final read before exporting");
  const isFinal = carousel.status === "final";
  const ready = isFinal && otherIssues.length === 0;

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  };

  const getNodes = () =>
    carousel.slides
      .map((_, index) => nodes.current[index])
      .filter((node): node is HTMLDivElement => Boolean(node));

  const run = async (kind: Exclude<Exporting, null>, action: () => Promise<void>) => {
    setExporting(kind);
    setError(null);
    try {
      await action();
      flash("Download ready");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Export failed. Try again.");
    } finally {
      setExporting(null);
    }
  };

  const approve = async () => {
    const latest = getDraft(carousel.id) ?? carousel;
    const latestIssues = exportIssues({ ...latest, status: "final" });
    if (latestIssues.length > 0) {
      setError(latestIssues[0] ?? "Fix the readiness checklist first.");
      return;
    }
    const approved = { ...latest, status: "final" as const };
    updateDraft(carousel.id, () => approved);
    await saveDraftNow(approved).catch(() => undefined);
    flash("Final read approved");
  };

  const copy = async (text: string, label: string) => {
    try {
      await copyToClipboard(text);
      flash(`${label} copied`);
    } catch {
      setError("Clipboard access was blocked. Select and copy manually.");
    }
  };

  const sources = carousel.research.key_points.filter((point) => point.source_url);
  const base = fileBase(carousel);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-studio-ink">Gate 2 · Review & export</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-studio-muted">
            Read every slide at phone size, then export the Instagram PNG set, LinkedIn PDF and copy
            deck. Sources stay attached.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={ready ? "success" : "accent"}>
            {ready ? "Ready to export" : "Needs review"}
          </Badge>
          <Badge>{platformLabel(carousel.brief.platform)}</Badge>
          <Badge tone={carousel.brief.theme === "animal" ? "primary" : "info"}>
            {carousel.brief.theme === "animal" ? "Animal care" : "AI education"}
          </Badge>
        </div>
      </div>

      {notice ? (
        <div className="flex items-center gap-2 rounded-2xl border border-[#c8e5d3] bg-studio-success-soft p-3 text-sm font-semibold text-[#1f6b43]" role="status">
          <Check className="h-4 w-4" aria-hidden />
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="flex items-start gap-2 rounded-2xl border border-[#f0c9cc] bg-studio-error-soft p-3 text-sm text-studio-error" role="alert">
          <TriangleExclamationPoint className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      ) : null}

      {!isFinal ? (
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-studio-ink">Approve the final read</h3>
              <p className="mt-1 max-w-xl text-sm text-studio-muted">
                Check the phone previews below. When the copy and sources look right, approve the
                final read to unlock exports.
              </p>
            </div>
            <Button
              onClick={() => void approve()}
              disabled={otherIssues.length > 0}
              icon={<ShieldCheck className="h-4 w-4" aria-hidden />}
            >
              Approve final read
            </Button>
          </div>
          {otherIssues.length > 0 ? (
            <ul className="mt-4 grid gap-1.5 sm:grid-cols-2" aria-label="Readiness issues">
              {otherIssues.map((issue) => (
                <li key={issue} className="flex gap-2 text-xs leading-relaxed text-studio-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-accent" aria-hidden />
                  {issue}
                </li>
              ))}
            </ul>
          ) : null}
          {otherIssues.length > 0 ? (
            <Link
              to={`/studio/${carousel.id}/draft`}
              className={buttonStyles("secondary", "sm", "mt-4")}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to the draft
            </Link>
          ) : null}
        </Card>
      ) : null}

      {ready ? (
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => void run("png", () => exportPngZip(carousel, getNodes()))}
              loading={exporting === "png"}
              icon={<Download className="h-4 w-4" aria-hidden />}
            >
              Download PNG set
            </Button>
            <Button
              variant="secondary"
              onClick={() => void run("pdf", () => exportPdf(carousel, getNodes()))}
              loading={exporting === "pdf"}
              icon={<FileText className="h-4 w-4" aria-hidden />}
            >
              Download LinkedIn PDF
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                downloadText(buildCopyDeck(carousel), `${base}-copy-deck.md`, "text/markdown")
              }
              icon={<FileText className="h-4 w-4" aria-hidden />}
            >
              Copy deck
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                downloadText(
                  JSON.stringify(carousel, null, 2),
                  `${base}.json`,
                  "application/json",
                )
              }
              icon={<FileBraces className="h-4 w-4" aria-hidden />}
            >
              JSON
            </Button>
            <Button
              variant="ghost"
              onClick={() => void copy(carousel.caption, "Caption")}
              icon={<Copy className="h-4 w-4" aria-hidden />}
            >
              Copy caption
            </Button>
            <Button
              variant="ghost"
              onClick={() => void copy(carousel.hashtags.join(" "), "Hashtags")}
              icon={<Copy className="h-4 w-4" aria-hidden />}
            >
              Copy hashtags
            </Button>
          </div>
          <p className="mt-3 text-xs text-studio-muted">
            Instagram PNGs are 1080 × 1350. LinkedIn PDF uses the same 4:5 pages. Exports are
            generated in this browser.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {carousel.slides.map((slide, index) => (
          <Card key={slide.n} className="overflow-hidden p-2">
            <SlidePreview
              slide={slide}
              theme={carousel.brief.theme}
              index={index}
              total={carousel.slides.length}
              disclaimer={carousel.disclaimer}
            />
            <div className="flex items-center justify-between gap-2 px-1.5 py-2">
              <span className="text-xs font-semibold text-studio-muted">
                {String(index + 1).padStart(2, "0")} · {slide.layout}
              </span>
              {ready ? (
                <button
                  type="button"
                  onClick={() =>
                    void run("single", async () => {
                      const node = nodes.current[index];
                      if (!node) throw new Error("Slide is not ready to render.");
                      await exportSinglePng(carousel, node, index);
                    })
                  }
                  className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full text-studio-muted hover:bg-studio-surface-alt hover:text-studio-ink"
                  aria-label={`Download slide ${index + 1}`}
                >
                  <Download className="h-4 w-4" aria-hidden />
                </button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display text-lg font-bold text-studio-ink">Caption</h3>
          <textarea
            readOnly
            className="mt-3 min-h-40 w-full resize-y rounded-xl border border-studio-border bg-studio-surface-alt/60 p-3 text-sm leading-relaxed text-studio-ink"
            value={carousel.caption}
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {carousel.hashtags.map((tag) => (
              <span key={tag} className="rounded-full border border-studio-border bg-studio-card px-2.5 py-1 text-xs font-semibold text-studio-muted">
                {tag}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-studio-ink">Sources</h3>
            <Badge tone="primary">{sources.length} cited</Badge>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {sources.map((point) => (
              <li key={point.id}>
                <a
                  href={point.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-2 rounded-xl border border-studio-border bg-studio-card p-3 text-xs leading-relaxed hover:border-studio-primary"
                >
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-studio-primary" aria-hidden />
                  <span>
                    <span className="block font-semibold text-studio-ink">
                      {point.source_title || point.source_url}
                    </span>
                    <span className="mt-0.5 block break-all text-studio-muted">{point.source_url}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl border border-studio-border bg-studio-surface-alt/60 p-3 text-xs leading-relaxed text-studio-muted">
            {carousel.disclaimer || theme.disclaimer}
          </p>
          {carousel.brief.theme === "animal" ? (
            <p className="mt-3 flex items-start gap-2 rounded-xl border border-[#f2d8ac] bg-studio-accent-soft p-3 text-xs leading-relaxed text-[#6d470d]">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Health content needs review by a licensed vet before real publication. The sample
              carousel carries that note.
            </p>
          ) : null}
        </Card>
      </div>

      <details className="rounded-2xl border border-studio-border bg-studio-card p-4">
        <summary className="cursor-pointer text-sm font-semibold text-studio-ink">
          Preview the copy deck
        </summary>
        <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-studio-surface-alt/60 p-4 text-xs leading-relaxed text-studio-ink">
          {buildCopyDeck(carousel)}
        </pre>
      </details>

      <div className="flex flex-wrap gap-2">
        <Link to={`/studio/${carousel.id}/draft`} className={buttonStyles("secondary", "sm")}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to draft
        </Link>
        <Link to={`/studio/${carousel.id}/facts`} className={buttonStyles("ghost", "sm")}>
          <RefreshCw className="h-4 w-4" aria-hidden />
          Revisit facts
        </Link>
      </div>

      <div aria-hidden style={{ position: "fixed", left: -22000, top: 0 }}>
        {carousel.slides.map((slide, index) => (
          <div
            key={slide.n}
            ref={(node) => {
              nodes.current[index] = node;
            }}
            style={{ width: 1080, height: 1350 }}
          >
            <SlideCanvas
              slide={slide}
              theme={carousel.brief.theme}
              index={index}
              total={carousel.slides.length}
              disclaimer={carousel.disclaimer}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
