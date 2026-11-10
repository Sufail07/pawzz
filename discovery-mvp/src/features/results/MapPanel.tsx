import { Suspense, lazy } from "react";
import { MapPin } from "lucide-react";
import type { ProviderResult } from "../../lib/search";
import type { Origin } from "../../lib/geo";

const LazyProviderMap = lazy(() => import("./ProviderMap"));

export function MapPanel({
  results,
  origin,
  height = 420,
  showOrigin = true,
  title,
}: {
  results: ProviderResult[];
  origin?: Origin;
  height?: number;
  showOrigin?: boolean;
  title?: string;
}) {
  return (
    <div>
      {title !== "" && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-sm font-bold text-pfa-ink">
            <MapPin className="size-4 text-pfa-primary" aria-hidden />
            {title ?? `${results.length} provider${results.length === 1 ? "" : "s"} on the map`}
          </p>
          <span className="text-[11px] text-pfa-muted">
            OpenStreetMap · sample pins
          </span>
        </div>
      )}
      <Suspense
        fallback={
          <div
            style={{ height }}
            className="w-full animate-pulse rounded-card border border-pfa-border bg-pfa-border/60"
            aria-label="Loading map"
          />
        }
      >
        <LazyProviderMap
          results={results}
          origin={origin}
          height={height}
          showOrigin={showOrigin}
        />
      </Suspense>
    </div>
  );
}
