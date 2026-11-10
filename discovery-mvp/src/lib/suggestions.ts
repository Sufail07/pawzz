import type { Provider } from "../data/types";

export const NEED_SUGGESTIONS = [
  "Vaccination",
  "Spay & neuter",
  "Boarding",
  "Blood tests",
  "Ambulance",
  "Rescue help",
  "Dental care",
  "Surgery",
  "Emergency care",
  "Grooming",
];

export function buildLocationSuggestions(providers: Provider[]): string[] {
  return Array.from(
    new Set([
      "Kochi",
      "Bengaluru",
      ...providers.map((provider) =>
        provider.area === provider.city
          ? provider.city
          : `${provider.area}, ${provider.city}`,
      ),
    ]),
  );
}
