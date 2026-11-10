import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../src/data/osm-snapshot.json");

const CITIES = {
  Kochi: [9.85, 76.15, 10.12, 76.45],
  Bengaluru: [12.8, 77.4, 13.15, 77.8],
};

const ENDPOINTS = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

function buildQuery([south, west, north, east]) {
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

async function queryOverpass(query) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    for (const endpoint of ENDPOINTS) {
      const url = `${endpoint}?data=${encodeURIComponent(query)}`;
      try {
        console.log(`  trying ${new URL(endpoint).host} (attempt ${attempt + 1})`);
        const response = await fetch(url, {
          signal: AbortSignal.timeout(90_000),
          headers: {
            "User-Agent":
              "PawzzPrototype/0.1 (animal-care directory prototype; sample demo)",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const body = await response.json();
        if (!Array.isArray(body.elements)) {
          throw new Error("Unexpected Overpass payload");
        }
        return body;
      } catch (error) {
        lastError = error;
        console.warn(`    failed: ${error instanceof Error ? error.message : error}`);
      }
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 15_000));
  }
  throw new Error(
    `All Overpass endpoints failed: ${lastError instanceof Error ? lastError.message : lastError}`,
  );
}

function dedupe(elements) {
  const seen = new Set();
  return elements.filter((element) => {
    const key = `${element.type}/${element.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function summarise(elements) {
  const tagged = elements.filter((element) => element.tags?.name);
  return {
    total: elements.length,
    named: tagged.length,
    phone: tagged.filter(
      (element) =>
        element.tags.phone || element.tags["contact:phone"] || element.tags.whatsapp,
    ).length,
    hours: tagged.filter((element) => element.tags.opening_hours).length,
    website: tagged.filter(
      (element) => element.tags.website || element.tags["contact:website"],
    ).length,
  };
}

const snapshot = {
  fetchedAt: new Date().toISOString(),
  attribution: "© OpenStreetMap contributors",
  license: "ODbL 1.0",
  licenseUrl: "https://www.openstreetmap.org/copyright",
  source: "OpenStreetMap",
  cities: {},
};

for (const [city, bbox] of Object.entries(CITIES)) {
  console.log(`Fetching ${city}…`);
  const payload = await queryOverpass(buildQuery(bbox));
  const elements = dedupe(payload.elements);
  snapshot.cities[city] = {
    bbox,
    osmBaseTimestamp: payload.osm3s?.timestamp_osm_base,
    elements,
  };
  console.log(`  ${city}: ${JSON.stringify(summarise(elements))}`);
}

writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf-8");
console.log(`Wrote ${outputPath}`);
