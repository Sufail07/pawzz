import { useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crosshair, MapPin, Search, Siren } from "lucide-react";
import { useDataSource } from "../../data/DataSourceContext";
import { detectApproximateLocation } from "../../lib/geo";
import { describeToday } from "../../data/hours";
import {
  NEED_SUGGESTIONS,
  buildLocationSuggestions,
} from "../../lib/suggestions";
import { searchUrl } from "../../lib/search";
import { Button } from "../../components/ui/Button";

export function HeroSearch() {
  const navigate = useNavigate();
  const { providers, mode } = useDataSource();
  const locationSuggestions = useMemo(
    () => buildLocationSuggestions(providers),
    [providers],
  );
  const [need, setNeed] = useState("");
  const [location, setLocation] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [status, setStatus] = useState("");
  const helperId = useId();
  const emergencyExamples =
    mode === "osm"
      ? providers.slice(0, 3).map((provider) => [
          provider.name,
          `${provider.area} · ${describeToday(provider.openingHours)}`,
        ])
      : [
          ["Cochin Pet Hospital", "Kochi · 2.1 km · Open now"],
          ["Rapid Paws Ambulance", "Kochi · ~20 min response"],
          ["Cubbon Animal Hospital", "Bengaluru · 4.4 km · 24x7"],
        ];

  async function detectLocation() {
    setDetecting(true);
    setStatus("Finding your approximate location…");
    const result = await detectApproximateLocation();
    setLocation(result.city);
    setDetecting(false);
    setStatus(
      `Using ${result.city} as your area (demo approximate location). You can type an area or pin code instead.`,
    );
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedNeed = need.trim();
    navigate(
      searchUrl({
        q: trimmedNeed,
        location: location.trim(),
        type: trimmedNeed ? "" : "clinic",
      }),
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-[#e3efe9]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-[#f6e6cd]"
      />

      <div className="container-page relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-pill border border-pfa-border bg-pfa-card px-3 py-1.5 text-xs font-semibold text-pfa-primary-dark">
            <MapPin className="size-3.5" aria-hidden />
            Kerala & Bengaluru ·{" "}
            {mode === "osm" ? "OpenStreetMap data" : "sample data"}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-pfa-ink sm:text-5xl">
            The right care for your pet, right when it matters.
          </h1>
          <p className="mt-4 max-w-xl text-base text-pfa-muted sm:text-lg">
            Find trusted vets, hospitals, boarding, diagnostics, ambulances and
            rescue teams near you — with clear verification on every listing.
          </p>

          <form onSubmit={submit} className="mt-7">
            <div className="rounded-card border border-pfa-border bg-pfa-card p-3 shadow-card sm:p-4">
              <div className="grid gap-2 sm:grid-cols-[1.2fr_1fr_auto]">
                <label className="relative block">
                  <span className="sr-only">What do you need?</span>
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-pfa-muted"
                    aria-hidden
                  />
                  <input
                    value={need}
                    onChange={(event) => setNeed(event.target.value)}
                    list="need-suggestions"
                    placeholder="Vaccination, boarding…"
                    className="min-h-11 w-full rounded-input border border-pfa-border bg-pfa-surface/60 py-2.5 pl-9 pr-3 text-base text-pfa-ink placeholder:text-pfa-muted/80 focus:border-pfa-primary focus:bg-pfa-card focus:outline-none"
                    aria-describedby={helperId}
                  />
                </label>
                <label className="relative block">
                  <span className="sr-only">Where?</span>
                  <MapPin
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-pfa-muted"
                    aria-hidden
                  />
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    list="location-suggestions"
                    placeholder="Area or pin code"
                    className="min-h-11 w-full rounded-input border border-pfa-border bg-pfa-surface/60 py-2.5 pl-9 pr-3 text-base text-pfa-ink placeholder:text-pfa-muted/80 focus:border-pfa-primary focus:bg-pfa-card focus:outline-none"
                  />
                </label>
                <Button type="submit" variant="accent" size="lg">
                  Find a Vet
                </Button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={detecting}
                  className="tap-target inline-flex items-center gap-1.5 rounded-pill px-2 py-1 text-xs font-semibold text-pfa-primary hover:bg-[#e6f0ef] disabled:opacity-60"
                >
                  <Crosshair className="size-3.5" aria-hidden />
                  {detecting ? "Detecting…" : "Use my location"}
                </button>
                <span className="text-xs text-pfa-muted">
                  or browse a category below
                </span>
              </div>

              <p id={helperId} role="status" className="mt-1 text-xs text-pfa-muted">
                {status}
              </p>
            </div>
          </form>

          <datalist id="need-suggestions">
            {NEED_SUGGESTIONS.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
          <datalist id="location-suggestions">
            {locationSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>

        <div className="relative hidden lg:block" aria-hidden>
          <div className="absolute inset-0 -rotate-2 rounded-card bg-pfa-primary/10" />
          <div className="relative rounded-card border border-pfa-border bg-pfa-card p-5 shadow-lift">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#dcefec] text-pfa-primary">
                <Siren className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Emergency? Start here.</p>
                <p className="text-xs text-pfa-muted">
                  Open 24x7 vets and ambulances, one tap away.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {emergencyExamples.map(([name, meta]) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-pfa-border bg-pfa-surface/60 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-pfa-muted">{meta}</p>
                  </div>
                  <span className="rounded-pill bg-pfa-accent px-2.5 py-1 text-xs font-bold text-pfa-ink">
                    {mode === "osm" ? "OSM" : "Call"}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-pfa-muted">
              {mode === "osm"
                ? "Real OpenStreetMap listings; details may be incomplete."
                : "Illustrative sample data, not real listings."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
