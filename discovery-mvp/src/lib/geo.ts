import type { City, Provider } from "../data/types";

export const CITY_CENTERS: Record<City, { lat: number; lng: number }> = {
  Kochi: { lat: 9.97, lng: 76.28 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
};

export const DEFAULT_CITY: City = "Kochi";

export interface Origin {
  lat: number;
  lng: number;
  label: string;
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const earthRadiusKm = 6371;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function resolveOrigin(
  location: string,
  allProviders: Provider[],
): Origin {
  const query = normalize(location);
  if (!query) {
    return { ...CITY_CENTERS[DEFAULT_CITY], label: DEFAULT_CITY };
  }

  for (const city of Object.keys(CITY_CENTERS) as City[]) {
    if (
      query.includes(city.toLowerCase()) ||
      (city === "Bengaluru" && query.includes("bangalore"))
    ) {
      return { ...CITY_CENTERS[city], label: city };
    }
  }

  const match = allProviders.find(
    (provider) =>
      normalize(provider.area).includes(query) ||
      normalize(provider.city).includes(query) ||
      provider.pinCode.includes(query),
  );
  if (match) {
    return {
      lat: match.lat,
      lng: match.lng,
      label: `${match.area}, ${match.city}`,
    };
  }

  return { ...CITY_CENTERS[DEFAULT_CITY], label: DEFAULT_CITY };
}

export function nearestCity(point: {
  lat: number;
  lng: number;
}): { city: City; lat: number; lng: number } {
  let best: City = DEFAULT_CITY;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const city of Object.keys(CITY_CENTERS) as City[]) {
    const distance = haversineKm(point, CITY_CENTERS[city]);
    if (distance < bestDistance) {
      best = city;
      bestDistance = distance;
    }
  }
  return { city: best, ...CITY_CENTERS[best] };
}

export async function detectApproximateLocation(): Promise<{
  city: City;
  lat: number;
  lng: number;
}> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return { city: DEFAULT_CITY, ...CITY_CENTERS[DEFAULT_CITY] };
  }

  return new Promise((resolve) => {
    const fallback = { city: DEFAULT_CITY, ...CITY_CENTERS[DEFAULT_CITY] };
    const timer = window.setTimeout(() => resolve(fallback), 6000);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(timer);
        resolve(
          nearestCity({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        );
      },
      () => {
        window.clearTimeout(timer);
        resolve(fallback);
      },
      { timeout: 5000, maximumAge: 600000 },
    );
  });
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
