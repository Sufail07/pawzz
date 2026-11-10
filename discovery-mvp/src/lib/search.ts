import { isOpenAt } from "../data/hours";
import {
  PROVIDER_TYPE_LABELS,
  PROVIDER_TYPE_SINGULAR,
  type Provider,
  type ProviderType,
  type Species,
} from "../data/types";
import { haversineKm, resolveOrigin, type Origin } from "./geo";

export type SortKey = "relevance" | "nearest" | "open-first" | "recently-verified";

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "relevance", label: "Relevance" },
  { value: "nearest", label: "Nearest first" },
  { value: "open-first", label: "Open now first" },
  { value: "recently-verified", label: "Recently verified" },
];

export interface SearchState {
  q: string;
  location: string;
  type: ProviderType | "";
  species: Species[];
  openNow: boolean;
  is24x7: boolean;
  maxDistanceKm: number;
  verifiedOnly: boolean;
  homeVisit: boolean;
  languages: string[];
  services: string[];
  sort: SortKey;
  emergency: boolean;
}

export const DEFAULT_SEARCH: SearchState = {
  q: "",
  location: "",
  type: "",
  species: [],
  openNow: false,
  is24x7: false,
  maxDistanceKm: 25,
  verifiedOnly: false,
  homeVisit: false,
  languages: [],
  services: [],
  sort: "relevance",
  emergency: false,
};

export const DISTANCE_STEPS = [1, 3, 5, 10, 25];

export const ALL_LANGUAGES = [
  "English",
  "Malayalam",
  "Hindi",
  "Kannada",
  "Tamil",
  "Telugu",
];

export const SERVICE_FILTERS: Record<ProviderType, string[]> = {
  clinic: [
    "Vaccination",
    "Surgery",
    "Dental care",
    "Dermatology",
    "X-ray",
    "Spay & neuter",
  ],
  hospital: [
    "Emergency admission",
    "ICU",
    "Surgery",
    "X-ray",
    "Blood bank",
    "Oncology",
  ],
  boarding: [
    "Cage-free",
    "Air-conditioned",
    "CCTV",
    "Daily updates",
    "Pickup available",
  ],
  diagnostics: [
    "Blood tests",
    "Imaging",
    "Pathology",
    "Home sample collection",
  ],
  ambulance: [
    "Oxygen support",
    "Large animal transport",
    "Stretcher",
  ],
  ngo: ["Rescue", "Shelter", "Adoption", "Sterilisation", "Volunteering"],
};

export interface ProviderResult {
  provider: Provider;
  distanceKm: number;
  openNow: boolean | null;
}

function includesText(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}

const OSM_QUERY_TYPE_HINTS: Array<{
  terms: string[];
  types: ProviderType[];
}> = [
  {
    terms: [
      "vet",
      "veterinary",
      "vaccination",
      "vaccine",
      "checkup",
      "check-up",
      "spay",
      "neuter",
      "dental",
      "surgery",
      "dermatology",
      "grooming",
      "deworming",
    ],
    types: ["clinic", "hospital"],
  },
  {
    terms: ["hospital", "emergency", "icu", "critical care", "admission"],
    types: ["hospital", "ambulance"],
  },
  {
    terms: ["boarding", "daycare", "day care", "pet hotel", "kennel", "cattery", "stay"],
    types: ["boarding"],
  },
  {
    terms: [
      "diagnostic",
      "diagnostics",
      "lab",
      "laboratory",
      "blood test",
      "blood tests",
      "pathology",
      "x-ray",
      "xray",
      "ultrasound",
      "imaging",
    ],
    types: ["diagnostics"],
  },
  {
    terms: ["ambulance", "animal transport", "emergency transport"],
    types: ["ambulance"],
  },
  {
    terms: ["rescue", "shelter", "adoption", "ngo", "stray", "sterilisation", "sterilization", "volunteer"],
    types: ["ngo"],
  },
];

function matchesOsmTypeHint(provider: Provider, query: string): boolean {
  if (provider.source !== "osm") return false;
  const value = query.trim().toLowerCase();
  if (value.length < 3) return false;
  return OSM_QUERY_TYPE_HINTS.some(
    (hint) =>
      hint.types.includes(provider.type) &&
      hint.terms.some(
        (term) => term.includes(value) || value.includes(term),
      ),
  );
}

function matchesText(provider: Provider, query: string): boolean {
  if (!query) return true;
  const haystack = [
    provider.name,
    provider.description,
    provider.area,
    provider.city,
    PROVIDER_TYPE_LABELS[provider.type],
    PROVIDER_TYPE_SINGULAR[provider.type],
    ...provider.services,
    ...provider.speciesTreated,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query) || matchesOsmTypeHint(provider, query);
}

function matchesLocation(provider: Provider, location: string): boolean {
  if (!location) return true;
  return (
    includesText(provider.city, location) ||
    includesText(provider.area, location) ||
    provider.pinCode.includes(location) ||
    includesText(provider.address, location)
  );
}

function matchesServices(provider: Provider, services: string[]): boolean {
  if (services.length === 0) return true;
  const haystack = [
    ...provider.services,
    ...("facilityFeatures" in provider ? provider.facilityFeatures : []),
    ...("testCatalogue" in provider ? provider.testCatalogue : []),
    ...("equipment" in provider ? provider.equipment : []),
    ...("focus" in provider ? provider.focus : []),
  ]
    .join(" ")
    .toLowerCase();
  return services.some((service) => haystack.includes(service.toLowerCase()));
}

export interface SearchOptions {
  now?: Date;
  origin?: Origin;
}

export function searchProviders(
  allProviders: Provider[],
  state: SearchState,
  options: SearchOptions = {},
): ProviderResult[] {
  const now = options.now ?? new Date();
  const origin = options.origin ?? resolveOrigin(state.location, allProviders);
  const query = state.q.trim().toLowerCase();
  const location = state.location.trim().toLowerCase();

  const results: ProviderResult[] = [];

  for (const provider of allProviders) {
    if (state.type && provider.type !== state.type) continue;
    if (!matchesText(provider, query)) continue;
    if (!matchesLocation(provider, location)) continue;
    if (!matchesServices(provider, state.services)) continue;

    const distanceKm = haversineKm(origin, provider);

    if (state.emergency) {
      if (!provider.openingHours.is24x7) continue;
      if (!isOpenAt(provider.openingHours, now)) continue;
    }
    if (state.openNow && !isOpenAt(provider.openingHours, now)) continue;
    if (state.is24x7 && !provider.openingHours.is24x7) continue;
    if (state.maxDistanceKm < 25 && distanceKm > state.maxDistanceKm) continue;
    if (
      state.verifiedOnly &&
      provider.verificationStatus !== "phone-verified" &&
      provider.verificationStatus !== "visited"
    )
      continue;
    if (
      state.homeVisit &&
      !provider.homeVisit &&
      !provider.pickupAvailable
    )
      continue;
    if (
      state.languages.length > 0 &&
      !state.languages.every((language) => provider.languages.includes(language))
    )
      continue;
    if (
      state.species.length > 0 &&
      !state.species.some((species) =>
        provider.speciesTreated.includes(species),
      )
    )
      continue;

    results.push({
      provider,
      distanceKm,
      openNow: isOpenAt(provider.openingHours, now),
    });
  }

  sortResults(results, state.sort);
  return results;
}

export function sortResults(results: ProviderResult[], sort: SortKey): void {
  switch (sort) {
    case "nearest":
      results.sort((a, b) => a.distanceKm - b.distanceKm);
      break;
    case "open-first":
      results.sort(
        (a, b) =>
          Number(b.openNow) - Number(a.openNow) ||
          a.distanceKm - b.distanceKm,
      );
      break;
    case "recently-verified":
      results.sort(
        (a, b) =>
          freshnessDate(b.provider).getTime() -
          freshnessDate(a.provider).getTime(),
      );
      break;
    case "relevance":
    default:
      results.sort((a, b) => {
        const verifiedScore =
          Number(b.provider.verificationStatus === "visited") -
          Number(a.provider.verificationStatus === "visited");
        if (verifiedScore !== 0) return verifiedScore;
        const openScore = Number(b.openNow) - Number(a.openNow);
        if (openScore !== 0) return openScore;
        return a.distanceKm - b.distanceKm;
      });
      break;
  }
}

export function freshnessDate(provider: Provider): Date {
  const value =
    provider.lastVerifiedOn ?? provider.osm?.lastEditedOn ?? "1970-01-01";
  return new Date(value);
}

export function activeFilterCount(state: SearchState): number {
  let count = 0;
  if (state.openNow) count += 1;
  if (state.is24x7) count += 1;
  if (state.maxDistanceKm < 25) count += 1;
  if (state.verifiedOnly) count += 1;
  if (state.homeVisit) count += 1;
  if (state.species.length > 0) count += 1;
  if (state.languages.length > 0) count += 1;
  if (state.services.length > 0) count += 1;
  return count;
}

const SPECIES_VALUES: Species[] = [
  "dog",
  "cat",
  "bird",
  "exotic",
  "livestock",
  "small-mammal",
];

export function parseSearchParams(params: URLSearchParams): SearchState {
  const type = params.get("type");
  const species = (params.get("species") ?? "")
    .split(",")
    .filter((value): value is Species =>
      SPECIES_VALUES.includes(value as Species),
    );
  const languages = (params.get("lang") ?? "")
    .split(",")
    .filter((value) => ALL_LANGUAGES.includes(value));
  const services = (params.get("services") ?? "")
    .split(",")
    .filter(Boolean);
  const sortValue = params.get("sort") as SortKey | null;
  const sort = SORT_OPTIONS.some((option) => option.value === sortValue)
    ? (sortValue as SortKey)
    : "relevance";
  const distance = Number(params.get("dist") ?? "25");

  return {
    q: params.get("q") ?? "",
    location: params.get("location") ?? "",
    type: type && type in PROVIDER_TYPE_LABELS ? (type as ProviderType) : "",
    species,
    openNow: params.get("open") === "1",
    is24x7: params.get("x24") === "1",
    maxDistanceKm: DISTANCE_STEPS.includes(distance) ? distance : 25,
    verifiedOnly: params.get("verified") === "1",
    homeVisit: params.get("home") === "1",
    languages,
    services,
    sort,
    emergency: params.get("emergency") === "1",
  };
}

export function toSearchParams(state: SearchState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.location) params.set("location", state.location);
  if (state.type) params.set("type", state.type);
  if (state.species.length > 0) params.set("species", state.species.join(","));
  if (state.openNow) params.set("open", "1");
  if (state.is24x7) params.set("x24", "1");
  if (state.maxDistanceKm !== 25) params.set("dist", String(state.maxDistanceKm));
  if (state.verifiedOnly) params.set("verified", "1");
  if (state.homeVisit) params.set("home", "1");
  if (state.languages.length > 0) params.set("lang", state.languages.join(","));
  if (state.services.length > 0)
    params.set("services", state.services.join(","));
  if (state.sort !== "relevance") params.set("sort", state.sort);
  if (state.emergency) params.set("emergency", "1");
  return params;
}

export function searchUrl(state: Partial<SearchState>): string {
  const merged = { ...DEFAULT_SEARCH, ...state };
  const params = toSearchParams(merged);
  const query = params.toString();
  return query ? `/results?${query}` : "/results";
}
