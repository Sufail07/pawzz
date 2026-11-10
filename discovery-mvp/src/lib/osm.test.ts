import { beforeEach, describe, expect, it } from "vitest";
import snapshotJson from "../data/osm-snapshot.json";
import {
  applyContactOverlay,
  dedupeOsmProviders,
  isOsmCacheFresh,
  mapOsmElement,
  mapOsmSnapshot,
  parseOsmOpeningHours,
  readOsmCache,
  writeOsmCache,
  type ContactOverlay,
  type OsmElement,
  type OsmSnapshot,
} from "./osm";
import { isOpenAt } from "../data/hours";
import { searchProviders, DEFAULT_SEARCH } from "./search";
import { resolveOrigin } from "./geo";

const snapshot = snapshotJson as unknown as OsmSnapshot;

function element(tags: Record<string, string>, id = 1): OsmElement {
  return {
    type: "node",
    id,
    lat: 9.97,
    lon: 76.28,
    timestamp: "2026-09-01T10:00:00Z",
    tags,
  };
}

describe("mapOsmElement", () => {
  it("maps a real veterinary clinic with contact details", () => {
    const provider = mapOsmElement(
      element({
        amenity: "veterinary",
        name: "Example Vet Clinic",
        phone: "+91 98470 12345",
        website: "example.org/clinic",
        "opening_hours": "24/7",
        "addr:street": "1 Main Road",
        "addr:suburb": "Fort Kochi",
        "addr:postcode": "682001",
        "animal_boarding": "dog;cat",
        "healthcare:speciality": "surgery;dental",
      }),
      "Kochi",
    );

    expect(provider).not.toBeNull();
    expect(provider?.source).toBe("osm");
    expect(provider?.type).toBe("clinic");
    expect(provider?.phone).toBe("+91 98470 12345");
    expect(provider?.website).toBe("https://example.org/clinic");
    expect(provider?.openingHours.known).toBe(true);
    expect(provider?.openingHours.is24x7).toBe(true);
    expect(provider?.speciesTreated).toEqual(["dog", "cat"]);
    expect(provider?.services).toContain("Boarding");
    expect(provider?.services).toContain("surgery");
    expect(provider?.address).toContain("1 Main Road");
    expect(provider?.pinCode).toBe("682001");
    expect(provider?.osm?.url).toBe(
      "https://www.openstreetmap.org/node/1",
    );
  });

  it("classifies hospitals, boarding and shelters without inventing details", () => {
    const hospital = mapOsmElement(
      element({ amenity: "veterinary", name: "City Veterinary Hospital" }),
      "Kochi",
    );
    expect(hospital?.type).toBe("hospital");
    expect(hospital?.phone).toBeUndefined();

    const boarding = mapOsmElement(
      element({
        amenity: "animal_boarding",
        name: "Paws Boarding",
        animal_boarding: "dog",
      }),
      "Kochi",
    );
    expect(boarding?.type).toBe("boarding");
    if (boarding?.type !== "boarding") throw new Error("expected boarding");
    expect(boarding.pricePerDayRange).toBeUndefined();
    expect(boarding.facilityFeatures).toEqual([]);

    const shelter = mapOsmElement(
      element({
        amenity: "animal_shelter",
        name: "Rescue Shelter",
        "animal_shelter:adoption": "yes",
      }),
      "Kochi",
    );
    expect(shelter?.type).toBe("ngo");
    if (shelter?.type !== "ngo") throw new Error("expected ngo");
    expect(shelter.focus).toContain("adoption");
  });

  it("drops unnamed and closed records", () => {
    expect(
      mapOsmElement(element({ amenity: "veterinary" }), "Kochi"),
    ).toBeNull();
    expect(
      mapOsmElement(
        element({ amenity: "veterinary", name: "Old Vet", disused: "yes" }),
        "Kochi",
      ),
    ).toBeNull();
  });

  it("keeps unknown hours unknown instead of calling them closed", () => {
    const provider = mapOsmElement(
      element({
        amenity: "veterinary",
        name: "Complex Hours Vet",
        opening_hours: "Mo-Fr 09:00-13:00,16:00-19:00",
      }),
      "Kochi",
    );
    expect(provider?.openingHours.known).toBe(false);
    expect(provider?.openingHours.raw).toContain("Mo-Fr");
    expect(isOpenAt(provider!.openingHours)).toBeNull();
  });

  it("normalises invalid phone and website values", () => {
    const provider = mapOsmElement(
      element({
        amenity: "veterinary",
        name: "Bad Contact Vet",
        phone: "call the clinic",
        website: "javascript:alert(1)",
      }),
      "Kochi",
    );
    expect(provider?.phone).toBeUndefined();
    expect(provider?.website).toBeUndefined();
  });
});

describe("parseOsmOpeningHours", () => {
  it("parses 24/7", () => {
    const hours = parseOsmOpeningHours("24/7");
    expect(hours.known).toBe(true);
    expect(hours.is24x7).toBe(true);
  });

  it("parses weekday ranges and closed days", () => {
    const hours = parseOsmOpeningHours("Mo-Sa 09:00-18:00; Su off");
    expect(hours.known).toBe(true);
    expect(hours.days.sat.closed).toBe(false);
    expect(hours.days.sun.closed).toBe(true);
    expect(hours.days.mon.open).toBe("09:00");
  });

  it("returns unknown for unsupported syntax", () => {
    expect(parseOsmOpeningHours("Mo-Su,PH 10:00-20:00").known).toBe(false);
    expect(parseOsmOpeningHours(undefined).known).toBe(false);
  });
});

describe("dedupeOsmProviders", () => {
  it("keeps the record with richer contact details", () => {
    const bare = mapOsmElement(
      element({ amenity: "veterinary", name: "Same Name Vet" }, 1),
      "Kochi",
    )!;
    const rich = mapOsmElement(
      element(
        {
          amenity: "veterinary",
          name: "Same Name Vet",
          phone: "+91 98470 11111",
          opening_hours: "24/7",
        },
        2,
      ),
      "Kochi",
    )!;
    const result = dedupeOsmProviders([bare, rich]);
    expect(result).toHaveLength(1);
    expect(result[0].phone).toBe("+91 98470 11111");
  });
});

describe("contact overlay", () => {
  it("adds verified contact details without changing the OSM source", () => {
    const base = mapOsmElement(
      element({ amenity: "veterinary", name: "Overlay Vet" }, 99),
      "Kochi",
    )!;
    const overlay: ContactOverlay = {
      [base.id]: {
        phone: "+91 98470 22222",
        openingHours: "Mo-Sa 09:00-18:00",
        sourceName: "Public clinic website",
        sourceUrl: "https://example.org/clinic",
        checkedOn: "2026-11-10",
      },
    };
    const [provider] = applyContactOverlay([base], overlay);
    expect(provider.source).toBe("osm");
    expect(provider.phone).toBe("+91 98470 22222");
    expect(provider.openingHours.known).toBe(true);
    expect(provider.contactSource?.label).toBe("Public clinic website");
    expect(provider.contactSource?.checkedOn).toBe("2026-11-10");
  });
});

describe("checked-in OSM snapshot", () => {
  const providers = mapOsmSnapshot(snapshot);

  it("contains a useful set of real providers", () => {
    expect(snapshot.cities.Kochi.elements.length).toBeGreaterThan(20);
    expect(snapshot.cities.Bengaluru.elements.length).toBeGreaterThan(20);
    expect(providers.length).toBeGreaterThan(80);
  });

  it("only produces OSM-sourced providers with unique ids", () => {
    expect(providers.every((provider) => provider.source === "osm")).toBe(true);
    expect(new Set(providers.map((provider) => provider.id)).size).toBe(
      providers.length,
    );
  });

  it("never invents verification or contact data", () => {
    expect(
      providers.every((provider) => provider.verificationStatus === undefined),
    ).toBe(true);
    const noPhoneTags = providers.filter(
      (provider) => !provider.osm?.tags.phone && !provider.osm?.tags["contact:phone"],
    );
    expect(noPhoneTags.some((provider) => provider.phone === undefined)).toBe(
      true,
    );
  });

  it("is excluded by sample-only trust filters", () => {
    const origin = resolveOrigin("Kochi", providers);
    const results = searchProviders(
      providers,
      { ...DEFAULT_SEARCH, verifiedOnly: true },
      { origin, now: new Date("2026-11-09T04:30:00Z") },
    );
    expect(results).toHaveLength(0);
  });
});

describe("OSM cache", () => {
  beforeEach(() => window.localStorage.clear());

  it("round-trips a snapshot and reports its age", () => {
    writeOsmCache(snapshot);
    const cached = readOsmCache();
    expect(cached?.snapshot.cities.Kochi.elements.length).toBe(
      snapshot.cities.Kochi.elements.length,
    );
    expect(cached && isOsmCacheFresh(cached.ageMs)).toBe(true);
  });
});
