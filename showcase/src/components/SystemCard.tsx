import { System } from "@/content";
import { cn } from "@/components/ui/utils";

export function SystemCard({ system }: { system: System }) {
  const isCarousel = system.id === "carousel";

  return (
    <article
      className={cn(
        "group p-8 md:p-10 rounded-[20px] border border-line bg-surface hover:border-ink/40 transition-colors",
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-line text-xs font-semibold text-muted">
          {system.number}
        </span>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
            isCarousel ? "bg-ink text-surface border-ink" : "bg-surface text-ink border-line",
          )}
        >
          {system.id === "discovery" ? "Discovery" : system.id === "course" ? "Course" : "Content"}
        </span>
      </div>

      <h3 className="font-display font-bold text-2xl md:text-3xl text-ink mb-3">
        {system.name}
      </h3>
      <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-2">{system.oneLiner}</p>

      <ul className="space-y-2 mb-8">
        {system.facts.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted">
            <span className="w-1.5 h-1.5 shrink-0 mt-1 rounded-full bg-ink"></span>
            {f}
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={system.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 px-5 py-3 rounded-[20px] font-semibold text-sm border transition-all",
            isCarousel
              ? "bg-ink text-surface border-ink hover:bg-ink-hover"
              : "bg-surface text-ink border-line hover:bg-surface/80",
          )}
        >
          {isCarousel ? "Open Carousel Studio" : "Open live"}
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
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
        <a
          href={`#${system.id}`}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-3 rounded-[20px] font-semibold text-sm border transition-all",
            isCarousel
              ? "bg-surface text-ink border-line hover:bg-surface/80"
              : "bg-ink text-surface border-ink hover:bg-ink-hover",
          )}
        >
          Case study
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
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </a>
      </div>
    </article>
  );
}
