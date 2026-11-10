import { useRef } from "react";
import { tracks, type TrackId } from "../../content/course";
import { cn } from "../../lib/cn";

export function TrackSwitcher({
  value,
  onChange,
}: {
  value: TrackId;
  onChange: (track: TrackId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = tracks.findIndex((track) => track.id === value);
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % tracks.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + tracks.length) % tracks.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = tracks.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    onChange(tracks[next].id);
    containerRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [next]?.focus();
  }

  return (
    <div className="mt-7">
      <p
        id="track-switcher-label"
        className="text-xs font-bold uppercase tracking-[0.14em] text-edu-muted"
      >
        Choose your track
      </p>
      <div
        ref={containerRef}
        role="radiogroup"
        aria-labelledby="track-switcher-label"
        onKeyDown={onKeyDown}
        className="mt-2 inline-flex max-w-full flex-wrap gap-1 rounded-pill border border-edu-border bg-white p-1.5 shadow-card"
      >
        {tracks.map((track) => {
          const selected = track.id === value;
          return (
            <button
              key={track.id}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(track.id)}
              className={cn(
                "tap-target rounded-pill px-3.5 text-sm font-semibold transition-colors",
                selected
                  ? "bg-edu-ink text-white"
                  : "text-edu-muted hover:bg-edu-surface-alt hover:text-edu-ink",
              )}
            >
              {track.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
