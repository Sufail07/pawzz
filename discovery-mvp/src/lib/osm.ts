import { makeHours, makeUnknownHours } from "../data/hours";
import type {
  AmbulanceProvider,
  BoardingProvider,
  ClinicProvider,
  DayHours,
  DiagnosticsProvider,
  HospitalProvider,
  NgoProvider,
  OpeningHours,
  OsmInfo,
  Provider,
  ProviderType,
  Species,
  Weekday,
} from "../data/types";
import { haversineKm } from "./geo";

export interface OsmElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  timestamp?: string;
  tags?: Record<string, string>;
}

export interface OsmCityData {
  bbox: [number, number, number, number];
  osmBaseTimestamp?: string;
  elements: OsmElement[];
}

export interface ContactOverlayEntry {
  phone?: string;
  whatsapp?: string;
  website?: string;
  openingHours?: string;
  sourceName: string;
  sourceUrl?: string;
  checkedOn: string;
}

export type ContactOverlay = Record<string, ContactOverlayEntry>;

export interface OsmSnapshot {
  fetchedAt: string;
  attribution: string;
  license: string;
  licenseUrl: string;
  source: string;
  cities: Record<string, OsmCityData>;
}

export const OSM_CITIES: Record<
  string,
  { bbox: [number, number, number, number] }
> = {
  Kochi: { bbox: [9.85, 76.15, 10.12, 76.45] },
  Bengaluru: { bbox: [12.8, 77.4, 13.15, 77.8] },
};

export const OSM_ATTRIBUTION = "© OpenStreetMap contributors";
export const OSM_LICENSE_URL = "https://www.openstreetmap.org/copyright";

const ENDPOINTS = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

const CACHE_KEY = "pawzz.osm.snapshot.v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const WEEKDAY_KEYS: Record<string, Weekday> = {
  mo: "mon",
  tu: "tue",
  we: "wed",
  th: "thu",
  fr: "fri",
  sa: "sat",
  su: "sun",
};

const WEEKDAY_ORDER: Weekday[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

const SPECIES_MAP: Record<string, Species> = {
  dog: "dog",
  cat: "cat",
  bird: "bird",
  horse: "livestock",
  cattle: "livestock",
  livestock: "livestock",
  mammal: "small-mammal",
  rabbit: "small-mammal",
  reptile: "exotic",
  amphibian: "exotic",
  fish: "exotic",
  wildlife: "exotic",
};

function weekdayIndex(key: string): number {
  const value = WEEKDAY_KEYS[key.toLowerCase()];
  return value ? WEEKDAY_ORDER.indexOf(value) : -1;
}

function timeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 24 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function parseOsmOpeningHours(raw?: string): OpeningHours {
  if (!raw || !raw.trim()) return makeUnknownHours();
  const value = raw.trim();

  if (value === "24/7") {
    return { ...makeHours(true, "00:00", "23:59"), raw: value };
  }

  const days = {} as Record<Weekday, DayHours>;
  for (const day of WEEKDAY_ORDER) {
    days[day] = { closed: true, open: null, close: null };
  }

  const rules = value.split(";").map((rule) => rule.trim()).filter(Boolean);
  if (rules.length === 0) return makeUnknownHours(value);

  for (const rule of rules) {
    if (/^(off|closed)$/i.test(rule)) continue;
    const offMatch =
      /^(mo|tu|we|th|fr|sa|su)(?:-(mo|tu|we|th|fr|sa|su))?\s+(off|closed)$/i.exec(
        rule,
      );
    if (offMatch) {
      const start = weekdayIndex(offMatch[1]);
      const end = weekdayIndex(offMatch[2] ?? offMatch[1]);
      if (start < 0 || end < 0) return makeUnknownHours(value);
      for (let index = start; index <= end; index += 1) {
        days[WEEKDAY_ORDER[index]] = {
          closed: true,
          open: null,
          close: null,
        };
      }
      continue;
    }
    const match =
      /^(mo|tu|we|th|fr|sa|su)(?:-(mo|tu|we|th|fr|sa|su))?\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/i.exec(
        rule,
      );
    if (!match) return makeUnknownHours(value);

    const start = weekdayIndex(match[1]);
    const end = weekdayIndex(match[2] ?? match[1]);
    const open = match[3];
    const close = match[4];
    if (
      start < 0 ||
      end < 0 ||
      timeToMinutes(open) === null ||
      timeToMinutes(close) === null
    ) {
      return makeUnknownHours(value);
    }

    for (let index = start; index <= end; index += 1) {
      const day = WEEKDAY_ORDER[index];
      days[day] = { closed: false, open, close };
    }
  }

  const hasOpenDay = WEEKDAY_ORDER.some((day) => !days[day].closed);
  if (!hasOpenDay) return makeUnknownHours(value);

  return { known: true, is24x7: false, days, raw: value };
}

function splitList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/[;,]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalisePhone(value?: string): string | undefined {
  if (!value) return undefined;
  const candidate = value.split(/[;,/]/)[0]?.trim();
  if (!candidate) return undefined;
  if (!/^\+?[\d][\d\s().-]{5,}$/.test(candidate)) return undefined;
  return candidate;
}

function normaliseWebsite(value?: string): string | undefined {
  if (!value) return undefined;
  const candidate = value.split(";")[0]?.trim();
  if (!candidate) return undefined;
  const withProtocol = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate.replace(/^\/\//, "")}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function inferSpecies(tags: Record<string, string>): Species[] {
  const raw = [
    tags.animal_boarding,
    tags.animal_shelter,
    tags.animal,
    tags["animal_shelter:adoption"],
  ]
    .filter(Boolean)
    .join(";")
    .toLowerCase();
  const found = new Set<Species>();
  for (const token of raw.split(/[;,]/)) {
    const mapped = SPECIES_MAP[token.trim()];
    if (mapped) found.add(mapped);
  }
  return [...found];
}

function inferType(tags: Record<string, string>): ProviderType | null {
  const amenity = tags.amenity;
  const healthcare = tags.healthcare;
  const name = tags.name ?? "";

  if (amenity === "veterinary" || healthcare === "veterinary") {
    const looksLikeHospital =
      tags.emergency === "yes" ||
      healthcare === "hospital" ||
      /\b(hospital|referral|critical care)\b/i.test(name);
    return looksLikeHospital ? "hospital" : "clinic";
  }
  if (amenity === "animal_boarding") return "boarding";
  if (amenity === "animal_shelter") return "ngo";
  if (healthcare === "hospital" && tags.veterinary === "yes") return "hospital";
  if (healthcare === "laboratory" && tags.veterinary === "yes")
    return "diagnostics";
  if (tags.emergency === "animal_ambulance") return "ambulance";
  return null;
}

function buildServices(type: ProviderType, tags: Record<string, string>): string[] {
  const services = new Set<string>();
  if (type === "clinic" || type === "hospital") services.add("Veterinary care");
  if (type === "boarding") services.add("Boarding");
  if (type === "ngo") services.add("Shelter & rescue");
  if (type === "diagnostics") services.add("Diagnostics");
  if (type === "ambulance") services.add("Emergency transport");
  if (tags.emergency === "yes") services.add("Emergency care");
  if (tags.animal_boarding) services.add("Boarding");
  if (tags.animal_shelter) services.add("Shelter & rescue");
  for (const speciality of splitList(tags["healthcare:speciality"])) {
    services.add(speciality.replace(/_/g, " "));
  }
  if (tags.healthcare === "laboratory") services.add("Laboratory tests");
  return [...services];
}

function buildAddress(
  tags: Record<string, string>,
  cityName: string,
): { address: string; area: string; pinCode: string } {
  const taggedArea =
    tags["addr:suburb"] ??
    tags["addr:neighbourhood"] ??
    tags["addr:quarter"] ??
    tags["addr:city"];
  const area = taggedArea ?? cityName;
  const street = [
    tags["addr:housenumber"],
    tags["addr:street"],
  ]
    .filter(Boolean)
    .join(" ");
  const address = street
    ? `${street}, ${area}`
    : taggedArea
      ? area
      : "Address not listed in OpenStreetMap.";
  return { address, area, pinCode: tags["addr:postcode"] ?? "" };
}

function describeOsmProvider(
  type: ProviderType,
  tags: Record<string, string>,
): string {
  const operator = tags.operator ? `${tags.operator} · ` : "";
  const subject: Record<ProviderType, string> = {
    clinic: "veterinary clinic",
    hospital: "animal hospital",
    boarding: "animal boarding facility",
    diagnostics: "veterinary diagnostics lab",
    ambulance: "animal ambulance service",
    ngo: "animal shelter or rescue organisation",
  };
  return `${operator}Real listing from OpenStreetMap. Tagged as: ${subject[type]}. Contact details and hours may be incomplete, so check before visiting.`;
}

function osmInfo(element: OsmElement): OsmInfo {
  return {
    elementType: element.type,
    elementId: element.id,
    url: `https://www.openstreetmap.org/${element.type}/${element.id}`,
    lastEditedOn:
      element.timestamp ?? new Date().toISOString().slice(0, 10),
    tags: element.tags ?? {},
  };
}

export function mapOsmElement(
  element: OsmElement,
  cityName: string,
): Provider | null {
  const tags = element.tags ?? {};
  if (!tags.name) return null;
  if (
    tags["disused:amenity"] ||
    tags.disused ||
    tags.construction ||
    tags.vacant ||
    tags["shop"] === "vacant"
  ) {
    return null;
  }

  const type = inferType(tags);
  if (!type) return null;

  const coordinates =
    element.type === "node"
      ? element.lat !== undefined && element.lon !== undefined
        ? { lat: element.lat, lng: element.lon }
        : null
      : element.center
        ? { lat: element.center.lat, lng: element.center.lon }
        : null;
  if (!coordinates) return null;

  const { address, area, pinCode } = buildAddress(tags, cityName);
  const species = inferSpecies(tags);
  const info = osmInfo(element);

  const base = {
    id: `osm-${element.type}-${element.id}`,
    name: tags.name,
    description: describeOsmProvider(type, tags),
    address,
    area,
    city: cityName,
    pinCode,
    lat: coordinates.lat,
    lng: coordinates.lng,
    phone: normalisePhone(
      tags.phone ??
        tags["contact:phone"] ??
        tags.mobile ??
        tags["contact:mobile"] ??
        tags.telephone ??
        tags["contact:telephone"],
    ),
    whatsapp: normalisePhone(
      tags["contact:whatsapp"] ?? tags.whatsapp,
    ),
    website: normaliseWebsite(
      tags.website ??
        tags["contact:website"] ??
        tags.url ??
        tags["contact:url"],
    ),
    openingHours: parseOsmOpeningHours(tags.opening_hours),
    speciesTreated: species,
    languages: [],
    services: buildServices(type, tags),
    photos: [],
    claimed: false,
    source: "osm" as const,
    osm: info,
  };

  let provider: Provider;
  switch (type) {
    case "hospital": {
      const specialists = splitList(tags["healthcare:speciality"]).map(
        (value) => value.replace(/_/g, " "),
      );
      const hospital: HospitalProvider = {
        ...base,
        type: "hospital",
        emergencyAdmission: tags.emergency === "yes",
        icu: tags.icu === "yes" || tags["emergency:icu"] === "yes",
        specialists,
      };
      provider = hospital;
      break;
    }
    case "boarding": {
      const boarding: BoardingProvider = {
        ...base,
        type: "boarding",
        facilityFeatures: [],
      };
      provider = boarding;
      break;
    }
    case "diagnostics": {
      const diagnostics: DiagnosticsProvider = {
        ...base,
        type: "diagnostics",
        testCatalogue: [],
        homeCollection: tags["home_collection"] === "yes",
      };
      provider = diagnostics;
      break;
    }
    case "ambulance": {
      const ambulance: AmbulanceProvider = {
        ...base,
        type: "ambulance",
        equipment: [],
        largeAnimal: species.includes("livestock"),
      };
      provider = ambulance;
      break;
    }
    case "ngo": {
      const focus: NgoProvider["focus"] = ["shelter"];
      if (tags["animal_shelter:adoption"] === "yes" || tags.adoption === "yes")
        focus.push("adoption");
      if (tags.rescue === "yes") focus.unshift("rescue");
      const ngo: NgoProvider = {
        ...base,
        type: "ngo",
        focus,
        registrationNumber: tags.ref,
        volunteerContact: tags["contact:email"],
        donationLink: normaliseWebsite(tags.donation_url),
      };
      provider = ngo;
      break;
    }
    case "clinic":
    default: {
      const clinic: ClinicProvider = { ...base, type: "clinic" };
      provider = clinic;
      break;
    }
  }

  return provider;
}

function tagScore(provider: Provider): number {
  let score = Object.keys(provider.osm?.tags ?? {}).length;
  if (provider.phone) score += 8;
  if (provider.openingHours.known) score += 4;
  if (provider.website) score += 3;
  return score;
}

export function dedupeOsmProviders(providers: Provider[]): Provider[] {
  const result: Provider[] = [];
  for (const candidate of providers) {
    const duplicate = result.find(
      (existing) =>
        existing.type === candidate.type &&
        existing.name.trim().toLowerCase() ===
          candidate.name.trim().toLowerCase() &&
        haversineKm(existing, candidate) < 0.25,
    );
    if (!duplicate) {
      result.push(candidate);
      continue;
    }
    const existingIndex = result.indexOf(duplicate);
    if (tagScore(candidate) > tagScore(duplicate)) {
      result[existingIndex] = candidate;
    }
  }
  return result;
}

export function applyContactOverlay(
  providers: Provider[],
  overlay: ContactOverlay,
): Provider[] {
  return providers.map((provider) => {
    const entry = overlay[provider.id];
    if (!entry) return provider;
    return {
      ...provider,
      phone: entry.phone ? normalisePhone(entry.phone) : provider.phone,
      whatsapp: entry.whatsapp
        ? normalisePhone(entry.whatsapp)
        : provider.whatsapp,
      website: entry.website
        ? normaliseWebsite(entry.website)
        : provider.website,
      openingHours: entry.openingHours
        ? parseOsmOpeningHours(entry.openingHours)
        : provider.openingHours,
      contactSource: {
        label: entry.sourceName,
        url: entry.sourceUrl,
        checkedOn: entry.checkedOn,
      },
    } as Provider;
  });
}

export function mapOsmSnapshot(
  snapshot: OsmSnapshot,
  overlay: ContactOverlay = {},
): Provider[] {
  const providers: Provider[] = [];
  for (const [cityName, city] of Object.entries(snapshot.cities)) {
    for (const element of city.elements) {
      const mapped = mapOsmElement(element, cityName);
      if (mapped) providers.push(mapped);
    }
  }
  return applyContactOverlay(dedupeOsmProviders(providers), overlay).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export interface CachedOsmSnapshot {
  snapshot: OsmSnapshot;
  ageMs: number;
}

export function readOsmCache(): CachedOsmSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { fetchedAt?: string; snapshot?: OsmSnapshot };
    if (!parsed.snapshot?.cities || !parsed.fetchedAt) return null;
    return {
      snapshot: parsed.snapshot,
      ageMs: Date.now() - new Date(parsed.fetchedAt).getTime(),
    };
  } catch {
    return null;
  }
}

export function writeOsmCache(snapshot: OsmSnapshot) {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ fetchedAt: snapshot.fetchedAt, snapshot }),
    );
  } catch {
    // Cache is optional; the checked-in snapshot remains the fallback.
  }
}

export function isOsmCacheFresh(ageMs: number): boolean {
  return ageMs < CACHE_TTL_MS;
}

function buildQuery([south, west, north, east]: [
  number,
  number,
  number,
  number,
]): string {
  const bbox = `${south},${west},${north},${east}`;
  return `[out:json][timeout:90];
(
  nwr["amenity"="veterinary"](${bbox});
  nwr["amenity"="animal_boarding"](${bbox});
  nwr["amenity"="animal_shelter"](${bbox});
  nwr["healthcare"="hospital"]["veterinary"="yes"](${bbox});
  nwr["healthcare"="laboratory"]["veterinary"="yes"](${bbox});
  nwr["healthcare"="veterinary"](${bbox});
  nwr["amenity"="animal_hospital"](${bbox});
  nwr["healthcare"="clinic"]["healthcare:speciality"~"veterinary"](${bbox});
  nwr["emergency"="animal_ambulance"](${bbox});
);
out meta center;`;
}

async function fetchCity(
  bbox: [number, number, number, number],
): Promise<OsmCityData> {
  let lastError: unknown;
  for (const endpoint of ENDPOINTS) {
    try {
      const response = await fetch(
        `${endpoint}?data=${encodeURIComponent(buildQuery(bbox))}`,
        { signal: AbortSignal.timeout(40_000) },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = (await response.json()) as {
        elements?: OsmElement[];
        osm3s?: { timestamp_osm_base?: string };
      };
      if (!Array.isArray(body.elements)) throw new Error("Unexpected payload");
      return {
        bbox,
        osmBaseTimestamp: body.osm3s?.timestamp_osm_base,
        elements: body.elements,
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("OpenStreetMap refresh failed");
}

export interface RefreshResult {
  snapshot: OsmSnapshot;
  failedCities: string[];
}

export async function refreshOsmSnapshot(
  previous: OsmSnapshot,
): Promise<RefreshResult> {
  const cities: Record<string, OsmCityData> = { ...previous.cities };
  const failedCities: string[] = [];

  const outcomes = await Promise.all(
    Object.entries(OSM_CITIES).map(async ([cityName, { bbox }]) => {
      try {
        return { cityName, data: await fetchCity(bbox) };
      } catch {
        return { cityName, data: null };
      }
    }),
  );

  for (const outcome of outcomes) {
    if (outcome.data) {
      cities[outcome.cityName] = outcome.data;
    } else {
      failedCities.push(outcome.cityName);
    }
  }

  if (failedCities.length === Object.keys(OSM_CITIES).length) {
    throw new Error("Could not refresh from OpenStreetMap");
  }

  return {
    snapshot: {
      ...previous,
      fetchedAt: new Date().toISOString(),
      cities,
    },
    failedCities,
  };
}
