import { Database, Info, RefreshCw, ShieldCheck } from "lucide-react";
import { useDataSource } from "../../data/DataSourceContext";
import { OSM_ATTRIBUTION, OSM_LICENSE_URL } from "../../lib/osm";
import { shortDate } from "../../lib/format";
import { cn } from "../../lib/cn";

function ModeSwitch() {
  const { mode, setMode } = useDataSource();
  return (
    <div
      role="group"
      aria-label="Data source"
      className="inline-flex shrink-0 rounded-pill border border-pfa-border bg-pfa-card p-0.5"
    >
      <button
        type="button"
        onClick={() => setMode("osm")}
        aria-pressed={mode === "osm"}
        className={cn(
          "inline-flex min-h-11 items-center gap-1 rounded-pill px-3 text-xs font-bold transition-colors",
          mode === "osm"
            ? "bg-pfa-primary text-white"
            : "text-pfa-muted hover:text-pfa-ink",
        )}
      >
        <Database className="size-3.5" aria-hidden />
        OSM live
      </button>
      <button
        type="button"
        onClick={() => setMode("sample")}
        aria-pressed={mode === "sample"}
        className={cn(
          "inline-flex min-h-11 items-center gap-1 rounded-pill px-3 text-xs font-bold transition-colors",
          mode === "sample"
            ? "bg-pfa-primary text-white"
            : "text-pfa-muted hover:text-pfa-ink",
        )}
      >
        <ShieldCheck className="size-3.5" aria-hidden />
        Sample demo
      </button>
    </div>
  );
}

export function DataSourceBanner() {
  const {
    mode,
    providers,
    lastFetched,
    refreshing,
    refresh,
    refreshError,
    failedCities,
    osmSource,
  } = useDataSource();

  if (mode === "sample") {
    return (
      <div className="border-b border-[#eadcc0] bg-[#fff4de] px-4 py-2 text-[#7a5514]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center sm:justify-between sm:text-left">
          <p className="inline-flex items-center gap-2 text-xs font-medium">
            <Info className="size-3.5 shrink-0" aria-hidden />
            Sample demo — all providers, contact details and figures are
            fictional.
          </p>
          <ModeSwitch />
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[#cfe3de] bg-[#eef7f4] px-4 py-2 text-[#204f49]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-between">
        <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs font-medium sm:justify-start sm:text-left">
          <Database className="size-3.5 shrink-0" aria-hidden />
          <span>
            Live OpenStreetMap data · {providers.length} real listings ·{" "}
            {osmSource === "live"
              ? "refreshed"
              : osmSource === "cache"
                ? "cached"
                : "snapshot"}{" "}
            {shortDate(lastFetched)}
          </span>
          <a
            href={OSM_LICENSE_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-pfa-primary"
          >
            {OSM_ATTRIBUTION}
          </a>
          <span className="text-[#3f6a63]">· ODbL</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex min-h-11 items-center gap-1 rounded-pill border border-[#cfe3de] bg-pfa-card px-3 text-xs font-bold text-[#204f49] hover:border-pfa-primary disabled:opacity-60"
            aria-label="Refresh live OpenStreetMap data"
          >
            <RefreshCw
              className={cn("size-3.5", refreshing && "animate-spin")}
              aria-hidden
            />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <ModeSwitch />
        </div>
      </div>
      {refreshError && (
        <p role="alert" className="mx-auto mt-1 max-w-6xl text-center text-xs font-semibold text-[#a52f2f] sm:text-left">
          Could not refresh live data ({refreshError}). Showing the last saved
          OpenStreetMap snapshot instead.
        </p>
      )}
      {!refreshError && failedCities.length > 0 && (
        <p className="mx-auto mt-1 max-w-6xl text-center text-xs text-[#3f6a63] sm:text-left">
          Refreshed with saved data for {failedCities.join(", ")}.
        </p>
      )}
    </div>
  );
}
