import { describe, expect, it } from "vitest";
import { providers } from "../data/providers";
import { PROVIDER_TYPE_LABELS, type ProviderType } from "../data/types";
import {
  DEFAULT_SEARCH,
  activeFilterCount,
  parseSearchParams,
  searchProviders,
  searchUrl,
  toSearchParams,
  freshnessDate,
  type SearchState,
} from "./search";
import { resolveOrigin } from "./geo";
import snapshotJson from "../data/osm-snapshot.json";
import { mapOsmSnapshot, type OsmSnapshot } from "./osm";

const osmProviders = mapOsmSnapshot(snapshotJson as unknown as OsmSnapshot);

const mondayMorning = new Date("2026-11-09T04:30:00Z");

function state(overrides: Partial<SearchState> = {}): SearchState {
  return { ...DEFAULT_SEARCH, ...overrides };
}

describe("sample provider data", () => {
  it("contains a realistic sample set covering every provider type", () => {
    expect(providers.length).toBeGreaterThanOrEqual(14);
    const types = new Set(providers.map((provider) => provider.type));
    for (const type of Object.keys(PROVIDER_TYPE_LABELS) as ProviderType[]) {
      expect(types.has(type)).toBe(true);
    }
  });

  it("labels every record as sample data", () => {
    expect(providers.every((provider) => provider.source === "sample")).toBe(true);
  });

  it("has unique ids and valid Kolkata coordinates", () => {
    expect(new Set(providers.map((provider) => provider.id)).size).toBe(
      providers.length,
    );
    for (const provider of providers) {
      expect(provider.lat).toBeGreaterThan(8);
      expect(provider.lat).toBeLessThan(14);
      expect(provider.lng).toBeGreaterThan(75);
      expect(provider.lng).toBeLessThan(79);
    }
  });
});

describe("searchProviders", () => {
  const origin = resolveOrigin("Kochi", providers);

  it("returns all providers with the default state", () => {
    expect(searchProviders(providers, state(), { now: mondayMorning, origin })).toHaveLength(
      providers.length,
    );
  });

  it("filters by provider type", () => {
    const results = searchProviders(providers, state({ type: "ambulance" }), {
      now: mondayMorning,
      origin,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.provider.type === "ambulance")).toBe(
      true,
    );
  });

  it("filters by free text", () => {
    const results = searchProviders(providers, state({ q: "ICU" }), {
      now: mondayMorning,
      origin,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((result) =>
        JSON.stringify(result.provider).toLowerCase().includes("icu"),
      ),
    ).toBe(true);
  });

  it("filters by location", () => {
    const results = searchProviders(providers, state({ location: "Koramangala" }), {
      now: mondayMorning,
      origin,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((result) => result.provider.area === "Koramangala"),
    ).toBe(true);
  });

  it("filters open now using the injected clock", () => {
    const results = searchProviders(providers, state({ openNow: true }), {
      now: mondayMorning,
      origin,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.openNow)).toBe(true);
  });

  it("filters 24x7 providers", () => {
    const results = searchProviders(providers, state({ is24x7: true }), {
      now: mondayMorning,
      origin,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((result) => result.provider.openingHours.is24x7),
    ).toBe(true);
  });

  it("filters verified providers only", () => {
    const results = searchProviders(providers, state({ verifiedOnly: true }), {
      now: mondayMorning,
      origin,
    });
    expect(
      results.every(
        (result) => result.provider.verificationStatus !== "unverified",
      ),
    ).toBe(true);
  });

  it("filters by species", () => {
    const results = searchProviders(
      providers,
      state({ species: ["livestock"] }),
      { now: mondayMorning, origin },
    );
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((result) => result.provider.speciesTreated.includes("livestock")),
    ).toBe(true);
  });

  it("filters by language", () => {
    const results = searchProviders(providers, state({ languages: ["Kannada"] }), {
      now: mondayMorning,
      origin,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((result) => result.provider.languages.includes("Kannada")),
    ).toBe(true);
  });

  it("filters by distance from the resolved origin", () => {
    const results = searchProviders(providers, state({ maxDistanceKm: 3 }), {
      now: mondayMorning,
      origin,
    });
    expect(results.every((result) => result.distanceKm <= 3)).toBe(true);
  });

  it("filters home visit and pickup providers", () => {
    const results = searchProviders(providers, state({ homeVisit: true }), {
      now: mondayMorning,
      origin,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every(
        (result) => result.provider.homeVisit || result.provider.pickupAvailable,
      ),
    ).toBe(true);
  });

  it("emergency fast-lane returns only open 24x7 providers", () => {
    const results = searchProviders(providers, state({ emergency: true }), {
      now: mondayMorning,
      origin,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every(
        (result) => result.provider.openingHours.is24x7 && result.openNow,
      ),
    ).toBe(true);
  });

  it("sorts nearest first", () => {
    const results = searchProviders(providers, state({ sort: "nearest" }), {
      now: mondayMorning,
      origin,
    });
    const distances = results.map((result) => result.distanceKm);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
  });

  it("sorts recently verified first", () => {
    const results = searchProviders(
      providers,
      state({ sort: "recently-verified" }),
      { now: mondayMorning, origin },
    );
    const dates = results.map((result) =>
      freshnessDate(result.provider).getTime(),
    );
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });
});

describe("OSM category-aware search", () => {
  const origin = resolveOrigin("", osmProviders);

  it("matches common service words to the right OSM category", () => {
    const vaccination = searchProviders(
      osmProviders,
      { ...DEFAULT_SEARCH, q: "vacc" },
      { origin, now: mondayMorning },
    );
    expect(vaccination.length).toBeGreaterThan(0);
    expect(
      vaccination.every((result) => ["clinic", "hospital"].includes(result.provider.type)),
    ).toBe(true);

    const boarding = searchProviders(
      osmProviders,
      { ...DEFAULT_SEARCH, q: "boarding" },
      { origin, now: mondayMorning },
    );
    expect(boarding.length).toBeGreaterThan(0);
    expect(
      boarding.every((result) => result.provider.type === "boarding"),
    ).toBe(true);
  });

  it("still filters out an area with no live listings", () => {
    const results = searchProviders(
      osmProviders,
      { ...DEFAULT_SEARCH, q: "boarding", location: "Kochi" },
      { origin: resolveOrigin("Kochi", osmProviders), now: mondayMorning },
    );
    expect(results).toHaveLength(0);
  });
});

describe("URL state", () => {
  it("round-trips filters through the query string", () => {
    const original = state({
      q: "vaccination",
      location: "Kochi",
      type: "clinic",
      species: ["dog", "cat"],
      openNow: true,
      verifiedOnly: true,
      maxDistanceKm: 5,
      languages: ["English"],
      sort: "nearest",
    });
    const parsed = parseSearchParams(toSearchParams(original));
    expect(parsed).toEqual(original);
  });

  it("ignores invalid values safely", () => {
    const parsed = parseSearchParams(
      new URLSearchParams("type=nope&dist=999&sort=sideways&species=dragon"),
    );
    expect(parsed.type).toBe("");
    expect(parsed.maxDistanceKm).toBe(25);
    expect(parsed.sort).toBe("relevance");
    expect(parsed.species).toEqual([]);
  });

  it("builds shareable result urls", () => {
    expect(searchUrl({ type: "ngo", location: "Bengaluru" })).toBe(
      "/results?location=Bengaluru&type=ngo",
    );
    expect(searchUrl({})).toBe("/results");
  });

  it("counts active filters", () => {
    expect(activeFilterCount(state())).toBe(0);
    expect(
      activeFilterCount(
        state({ openNow: true, verifiedOnly: true, species: ["dog"] }),
      ),
    ).toBe(3);
  });
});
