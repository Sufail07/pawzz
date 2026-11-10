import { useRef, useEffect, useState, useCallback } from "react";

interface Slide {
  id: number;
  image: string;
  heading: string;
}

const SLIDES: Slide[] = [
  { id: 1, image: "/assets/carousal-studio.png", heading: "5 signs your pet needs a vet today" },
  { id: 2, image: "/assets/carousal-studio.png", heading: "Sign 1: Persistent vomiting or diarrhoea" },
  { id: 3, image: "/assets/carousal-studio.png", heading: "Sign 2: Difficulty breathing" },
  { id: 4, image: "/assets/carousal-studio.png", heading: "Sign 3: Sudden collapse or weakness" },
  { id: 5, image: "/assets/carousal-studio.png", heading: "Sign 4: Ingestion of toxins" },
  { id: 6, image: "/assets/carousal-studio.png", heading: "Sign 5: Seizures or tremors" },
  { id: 7, image: "/assets/carousal-studio.png", heading: "When to call the emergency vet" },
  { id: 8, image: "/assets/carousal-studio.png", heading: "Book now — 24x7 care available" },
];

const SLIDE_JSON = `{
  "slides": [
    { "heading": "5 signs your pet needs a vet today", "layout": "hook" },
    { "heading": "Sign 1: Persistent vomiting or diarrhoea", "layout": "list" },
    { "heading": "Sign 2: Difficulty breathing", "layout": "statement" },
    { "heading": "Sign 3: Sudden collapse or weakness", "layout": "stat" },
    { "heading": "Sign 4: Ingestion of toxins", "layout": "quote" },
    { "heading": "Sign 5: Seizures or tremors", "layout": "list" },
    { "heading": "When to call the emergency vet", "layout": "cta" },
    { "heading": "Book now — 24x7 care available", "layout": "cta" }
  ]
}`;

interface SlideViewerProps {
  onDownload?: () => void;
}

export function SlideViewer({ onDownload }: SlideViewerProps = {}) {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const touchStartRef = useRef<{ x: number } | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex((current) => {
      if (i < 0 || i >= SLIDES.length) return current;
      return i;
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  }, [index, goTo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const diff = touchStartRef.current.x - e.changedTouches[0].clientX;
    if (diff > 30) goTo(index + 1);
    if (diff < -30) goTo(index - 1);
    touchStartRef.current = null;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="relative rounded-[20px] border border-line bg-surface overflow-hidden shadow-lg aspect-[4/5] w-full max-w-xs mx-auto">
          <img
            src={SLIDES[index].image}
            alt={SLIDES[index].heading}
            className="w-full h-full object-cover"
            loading="lazy"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-ink hover:bg-surface disabled:opacity-0 disabled:pointer-events-none transition-all z-10"
            aria-label="Previous slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="15" y1="18" x2="6" y2="12" /><line x1="15" y1="6" x2="6" y2="18" />
            </svg>
          </button>
          <button
            onClick={() => goTo(index + 1)}
            disabled={index === SLIDES.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-ink hover:bg-surface disabled:opacity-0 disabled:pointer-events-none transition-all z-10"
            aria-label="Next slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="9" y1="18" x2="18" y2="12" /><line x1="9" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="flex gap-1">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-colors ${index === i ? "bg-ink" : "bg-line"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="text-xs font-medium text-muted">
            {index + 1} / {SLIDES.length}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-line">
        <p className="text-muted text-sm italic">
          Sample carousel made with this workflow. Health content is general
          information and needs veterinary review before real publication.
        </p>
        <button
          onClick={() => onDownload?.()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] border border-line bg-surface text-ink font-medium text-sm hover:bg-surface/80 transition-colors"
        >
          Download PDF
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs font-semibold text-muted underline underline-offset-4 hover:text-ink transition-colors"
      >
        {isOpen ? "Hide slide JSON" : "Show slide JSON contract"}
      </button>

      {isOpen && (
        <div className="mt-4 rounded-[12px] border border-line bg-surface p-4 overflow-x-auto">
          <pre className="text-xs text-muted overflow-x-auto whitespace-pre break-all font-mono">{SLIDE_JSON}</pre>
        </div>
      )}
    </div>
  );
}
