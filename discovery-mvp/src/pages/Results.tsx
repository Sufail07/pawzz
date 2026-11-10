import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  List,
  Map as MapIcon,
  MapPin,
  Search,
  Siren,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useDataSource } from "../data/DataSourceContext";
import {
  PROVIDER_TYPE_LABELS,
  PROVIDER_TYPE_SINGULAR,
  SPECIES_LABELS,
  type ProviderType,
} from "../data/types";
import {
  DEFAULT_SEARCH,
  SORT_OPTIONS,
  activeFilterCount,
  parseSearchParams,
  searchProviders,
  toSearchParams,
  type SearchState,
} from "../lib/search";
import { resolveOrigin } from "../lib/geo";
import { formatDistance } from "../lib/geo";
import { useNow } from "../hooks/useNow";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useShortlist } from "../hooks/useShortlist";
import { ProviderCard } from "../components/provider/ProviderCard";
import { Button, buttonStyles } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { BottomSheet } from "../components/ui/BottomSheet";
import { StickyBar } from "../components/ui/StickyBar";
import { Skeleton } from "../components/ui/Feedback";
import { Card } from "../components/ui/Badge";
import { FilterPanel } from "../features/results/FilterPanel";
import { MapPanel } from "../features/results/MapPanel";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import {
  NEED_SUGGESTIONS,
  buildLocationSuggestions,
} from "../lib/suggestions";

function ResultSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex gap-4 rounded-card border border-pfa-border bg-pfa-card p-4"
        >
          <Skeleton className="size-24 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Results() {
  const [params, setParams] = useSearchParams();
  const { providers, mode, setMode } = useDataSource();
  const state = useMemo(() => parseSearchParams(params), [params]);
  const now = useNow();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [view, setView] = useState<"list" | "map">(
    params.get("view") === "map" ? "map" : "list",
  );
  const [ready, setReady] = useState(false);
  const { ids, toggle, isSaved } = useShortlist();

  const [needDraft, setNeedDraft] = useState(state.q);
  const [locationDraft, setLocationDraft] = useState(state.location);
  const locationSuggestions = useMemo(
    () => buildLocationSuggestions(providers),
    [providers],
  );

  const activeSavedCount = ids.filter((id) =>
    providers.some((provider) => provider.id === id),
  ).length;

  useEffect(() => {
    if (mode !== "osm") return;
    if (
      !state.verifiedOnly &&
      !state.homeVisit &&
      state.species.length === 0 &&
      state.languages.length === 0 &&
      state.services.length === 0
    ) {
      return;
    }
    setParams(
      toSearchParams({
        ...state,
        verifiedOnly: false,
        homeVisit: false,
        species: [],
        languages: [],
        services: [],
      }),
      { replace: true },
    );
  }, [mode, state, setParams]);

  useEffect(() => {
    setNeedDraft(state.q);
    setLocationDraft(state.location);
  }, [state.q, state.location]);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 280);
    return () => window.clearTimeout(timer);
  }, []);

  const origin = useMemo(
    () => resolveOrigin(state.location, providers),
    [state.location, providers],
  );

  const allResults = useMemo(
    () => searchProviders(providers, state, { now, origin }),
    [providers, state, now, origin],
  );

  const results = savedOnly
    ? allResults.filter((result) => ids.includes(result.provider.id))
    : allResults;

  const nearest24x7 = useMemo(
    () =>
      searchProviders(
        providers,
        { ...DEFAULT_SEARCH, is24x7: true, openNow: true, sort: "nearest" },
        { now, origin },
      )[0],
    [providers, now, origin],
  );

  function update(patch: Partial<SearchState>) {
    const next = { ...state, ...patch };
    setParams(toSearchParams(next), { replace: true });
  }

  function clearFilters() {
    const next: SearchState = {
      ...DEFAULT_SEARCH,
      q: state.q,
      location: state.location,
      type: state.type,
    };
    setParams(toSearchParams(next), { replace: true });
    setSavedOnly(false);
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update({ q: needDraft.trim(), location: locationDraft.trim() });
  }

  const filterCount = activeFilterCount(state) + (savedOnly ? 1 : 0);
  const heading = state.emergency
    ? "Emergency care near you"
    : state.type
      ? PROVIDER_TYPE_LABELS[state.type]
      : "Animal care near you";
  useDocumentTitle(`${heading} · Pawzz`);

  const appliedChips: Array<{ key: string; label: string; remove: () => void }> =
    [];
  if (state.emergency)
    appliedChips.push({
      key: "emergency",
      label: "Emergency: open 24x7",
      remove: () => update({ emergency: false }),
    });
  if (state.openNow)
    appliedChips.push({
      key: "open",
      label: "Open now",
      remove: () => update({ openNow: false }),
    });
  if (state.is24x7)
    appliedChips.push({
      key: "x24",
      label: "24x7",
      remove: () => update({ is24x7: false }),
    });
  if (state.maxDistanceKm < 25)
    appliedChips.push({
      key: "dist",
      label: `Within ${state.maxDistanceKm} km`,
      remove: () => update({ maxDistanceKm: 25 }),
    });
  if (state.verifiedOnly)
    appliedChips.push({
      key: "verified",
      label: "Verified only",
      remove: () => update({ verifiedOnly: false }),
    });
  if (state.homeVisit)
    appliedChips.push({
      key: "home",
      label: "Home visit or pickup",
      remove: () => update({ homeVisit: false }),
    });
  for (const species of state.species)
    appliedChips.push({
      key: `species-${species}`,
      label: SPECIES_LABELS[species],
      remove: () =>
        update({
          species: state.species.filter((value) => value !== species),
        }),
    });
  for (const language of state.languages)
    appliedChips.push({
      key: `lang-${language}`,
      label: language,
      remove: () =>
        update({
          languages: state.languages.filter((value) => value !== language),
        }),
    });
  for (const service of state.services)
    appliedChips.push({
      key: `service-${service}`,
      label: service,
      remove: () =>
        update({
          services: state.services.filter((value) => value !== service),
        }),
    });
  if (savedOnly)
    appliedChips.push({
      key: "saved",
      label: "Shortlisted only",
      remove: () => setSavedOnly(false),
    });

  return (
    <div className="pb-28 lg:pb-10">
      <div className="border-b border-pfa-border bg-pfa-card">
        <div className="container-page py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pfa-muted hover:text-pfa-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Home
          </Link>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h1 className="font-display text-3xl font-bold text-pfa-ink sm:text-4xl">
                {heading}
              </h1>
              <p className="mt-1 text-sm text-pfa-muted">
                Showing care near{" "}
                <span className="font-semibold text-pfa-ink">
                  {state.location || origin.label}
                </span>
                .{" "}
                {mode === "osm"
                  ? "Real OpenStreetMap listings; details may be incomplete."
                  : "Sample data only."}
              </p>
            </div>
            {state.type && (
              <span className="rounded-pill bg-pfa-surface-alt px-3 py-1.5 text-xs font-semibold text-pfa-muted">
                {PROVIDER_TYPE_SINGULAR[state.type as ProviderType]}
              </span>
            )}
          </div>

          <form onSubmit={submitSearch} className="mt-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <AutocompleteInput
                className="flex-1"
                ariaLabel="What do you need?"
                value={needDraft}
                onChange={setNeedDraft}
                suggestions={NEED_SUGGESTIONS}
                placeholder="Vaccination, boarding, ambulance…"
                icon={<Search className="size-4" aria-hidden />}
              />
              <AutocompleteInput
                className="flex-1 sm:max-w-64"
                ariaLabel="Where?"
                value={locationDraft}
                onChange={setLocationDraft}
                suggestions={locationSuggestions}
                placeholder="Area, city or pin code"
                icon={<MapPin className="size-4" aria-hidden />}
              />
              <Button type="submit" variant="primary">
                Update search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container-page py-6">
        {state.emergency && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-card border border-[#f0cccc] bg-[#fdf1f1] p-4">
            <p className="inline-flex items-start gap-2 text-sm font-semibold text-[#a52f2f]">
              <Siren className="mt-0.5 size-4 shrink-0" aria-hidden />
              Emergency mode: only 24x7 providers that are open right now.
            </p>
            <button
              type="button"
              onClick={() => update({ emergency: false })}
              className="tap-target rounded-pill px-3 py-1.5 text-xs font-bold text-[#a52f2f] underline-offset-2 hover:underline"
            >
              Show all care instead
            </button>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-card border border-pfa-border bg-pfa-card p-5">
              <FilterPanel
                state={state}
                onChange={update}
                onClear={clearFilters}
                mode={mode}
              />
            </div>
          </aside>

          <section aria-label="Search results">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-pfa-ink" role="status">
                  {ready
                    ? `${results.length} provider${results.length === 1 ? "" : "s"} found`
                    : "Finding providers…"}
                </p>
                <p className="text-xs text-pfa-muted">
                  Distances use the centre of {origin.label} (demo location).
                </p>
                {mode === "osm" && state.q.trim() && results.length > 0 && (
                  <p className="text-xs text-pfa-muted">
                    OSM listings often omit service tags, so search can include
                    the whole relevant provider category.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-pfa-muted">
                  Sort
                  <select
                    value={state.sort}
                    onChange={(event) =>
                      update({
                        sort: event.target.value as SearchState["sort"],
                      })
                    }
                    className="min-h-11 rounded-input border border-pfa-border bg-pfa-card px-2.5 text-sm font-medium text-pfa-ink focus:border-pfa-primary focus:outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value === "recently-verified" && mode === "osm"
                          ? "Recently updated"
                          : option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div
                  className="hidden items-center rounded-pill border border-pfa-border bg-pfa-card p-1 sm:flex lg:hidden"
                  role="group"
                  aria-label="Results view"
                >
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-pressed={view === "list"}
                    className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-xs font-semibold ${
                      view === "list"
                        ? "bg-pfa-primary text-white"
                        : "text-pfa-muted hover:text-pfa-ink"
                    }`}
                  >
                    <List className="size-4" aria-hidden />
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("map")}
                    aria-pressed={view === "map"}
                    className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-xs font-semibold ${
                      view === "map"
                        ? "bg-pfa-primary text-white"
                        : "text-pfa-muted hover:text-pfa-ink"
                    }`}
                  >
                    <MapIcon className="size-4" aria-hidden />
                    Map
                  </button>
                </div>
              </div>
            </div>

            {activeSavedCount > 0 && (
              <div className="mt-3">
                <Chip
                  selected={savedOnly}
                  onClick={() => setSavedOnly((value) => !value)}
                  icon={<Bookmark className="size-4" aria-hidden />}
                >
                  Shortlisted ({activeSavedCount})
                </Chip>
              </div>
            )}

            {appliedChips.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {appliedChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1 rounded-pill bg-[#e6f0ef] py-1 pl-3 pr-1 text-xs font-semibold text-pfa-primary-dark"
                  >
                    {chip.label}
                    <button
                      type="button"
                      onClick={chip.remove}
                      aria-label={`Remove filter: ${chip.label}`}
                      className="tap-target inline-flex items-center justify-center rounded-full hover:bg-pfa-primary/10"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="tap-target rounded-pill px-2 py-1 text-xs font-bold text-pfa-primary underline-offset-2 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
              <div className={view === "map" && results.length > 0 ? "hidden lg:block" : ""}>
              {!ready ? (
                <ResultSkeleton />
              ) : results.length === 0 ? (
                <Card className="p-8 text-center">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e6f0ef] text-pfa-primary">
                    <Search className="size-6" aria-hidden />
                  </span>
                  <h2 className="mt-4 text-lg font-bold">
                    No providers match those filters
                  </h2>
                  <p className="mx-auto mt-1 max-w-md text-sm text-pfa-muted">
                    {mode === "osm"
                      ? state.emergency
                        ? "OpenStreetMap rarely records 24x7 hours or emergency status, so live emergency results are often empty. Switch to the sample demo to walk through the emergency fast-lane."
                        : `OpenStreetMap has no matching live ${
                            state.type
                              ? PROVIDER_TYPE_LABELS[state.type].toLowerCase()
                              : "providers"
                          }${state.location ? ` near ${state.location}` : ""}. Live coverage is incomplete, especially for boarding, labs and ambulances.`
                      : "Try widening the distance, removing a filter, or searching a different area. If this is urgent, start with the nearest open 24x7 option."}
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {mode === "osm" && state.location && (
                      <Button
                        variant="primary"
                        onClick={() => update({ location: "" })}
                      >
                        Search all areas
                      </Button>
                    )}
                    {mode === "osm" && (
                      <Button
                        variant={state.location ? "secondary" : "primary"}
                        onClick={() => setMode("sample")}
                      >
                        Switch to sample demo
                      </Button>
                    )}
                    <Button variant="secondary" onClick={clearFilters}>
                      Widen filters
                    </Button>
                    <Link
                      to="/list-business"
                      className={buttonStyles("ghost")}
                    >
                      List a missing provider
                    </Link>
                    {nearest24x7 && (
                      <Link
                        to={`/provider/${nearest24x7.provider.id}`}
                        className={buttonStyles("accent")}
                      >
                        <Siren className="size-4" aria-hidden />
                        Nearest 24x7: {nearest24x7.provider.name} (
                        {formatDistance(nearest24x7.distanceKm)})
                      </Link>
                    )}
                  </div>
                </Card>
              ) : (
                <ul className="space-y-3">
                  {results.map((result) => (
                    <li key={result.provider.id}>
                      <ProviderCard
                        provider={result.provider}
                        distanceKm={result.distanceKm}
                        openNow={result.openNow}
                        saved={isSaved(result.provider.id)}
                        onToggleSave={toggle}
                      />
                    </li>
                  ))}
                </ul>
              )}
              </div>

              {ready && results.length > 0 && view === "map" && (
                <div className="mt-5 lg:hidden">
                  <MapPanel results={results} origin={origin} height={480} />
                </div>
              )}

              {ready && results.length > 0 && (
                <div className="hidden lg:sticky lg:top-24 lg:block">
                  <MapPanel results={results} origin={origin} height={560} />
                </div>
              )}
            </div>

            {ready && results.length > 0 && (
              <p className="mt-5 text-center text-xs text-pfa-muted">
                Every listing is fictional sample data. Always call ahead for
                emergencies.
              </p>
            )}
          </section>
        </div>
      </div>

      <StickyBar>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => setSheetOpen(true)}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters
          {filterCount > 0 && (
            <span className="ml-1 rounded-full bg-pfa-primary px-1.5 text-xs text-white">
              {filterCount}
            </span>
          )}
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => setView(view === "list" ? "map" : "list")}
        >
          {view === "list" ? (
            <>
              <MapIcon className="size-4" aria-hidden />
              Map
            </>
          ) : (
            <>
              <List className="size-4" aria-hidden />
              List
            </>
          )}
        </Button>
      </StickyBar>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filter providers"
        description={`${results.length} matching provider${results.length === 1 ? "" : "s"} right now.`}
      >
        <FilterPanel
          state={state}
          onChange={update}
          onClear={clearFilters}
          mode={mode}
          footer={
            <div className="sticky bottom-0 -mx-5 -mb-5 mt-2 flex gap-2 border-t border-pfa-border bg-pfa-card px-5 py-3">
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                variant="accent"
                onClick={() => setSheetOpen(false)}
                className="flex-[2]"
              >
                Show {results.length} result{results.length === 1 ? "" : "s"}
              </Button>
            </div>
          }
        />
      </BottomSheet>
    </div>
  );
}
