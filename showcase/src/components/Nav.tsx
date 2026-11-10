import { useEffect, useState, useRef } from "react";
import { SYSTEMS, CANDIDATE_NAME } from "@/content";
import { cn } from "@/components/ui/utils";

const NAV_ITEMS = [
  { id: "overview", label: "Systems" },
  { id: "discovery", label: "Discovery" },
  { id: "course", label: "Course" },
  { id: "carousel", label: "Carousel" },
  { id: "criteria", label: "Criteria" },
  { id: "notes", label: "Notes" },
];

export function Nav() {
  const [activeId, setActiveId] = useState<string>("overview");
  const [isOpen, setIsOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0% -55% 0%" },
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-line"
        aria-label="Main navigation"
        style={{ paddingTop: `max(env(safe-area-inset-top, 0), 0)px` }}
      >
        <div className="max-w-1200 mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-ink">
            {`${CANDIDATE_NAME} · Submission`}
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "transition-colors py-1",
                  activeId === item.id ? "text-ink font-semibold" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-all border border-line",
                "bg-ink text-surface hover:bg-ink/90 hover:text-surface",
              )}
              aria-expanded={isOpen}
              aria-haspopup="menu"
            >
              Open all live links
            </button>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed left-0 right-0 z-50 bg-surface border-b border-line px-4 pb-2 overflow-x-auto scrollbar-hidden whitespace-nowrap",
          isOpen ? "block" : "hidden",
        )}
      >
        <div className="max-w-1200 mx-auto flex gap-4 py-2">
          {SYSTEMS.map((sys) => (
            <a
              key={sys.id}
              href={sys.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-line",
                "bg-surface text-ink hover:bg-ink hover:text-surface transition-colors",
              )}
            >
              {sys.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
