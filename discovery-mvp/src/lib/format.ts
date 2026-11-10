import type { Provider } from "../data/types";

export function digitsOnly(phone: string): string {
  return phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
}

export function callHref(phone: string): string {
  return `tel:${digitsOnly(phone)}`;
}

export function whatsappHref(phone: string): string {
  return `https://wa.me/${digitsOnly(phone)}`;
}

export function mapsHref(provider: Provider): string {
  return `https://www.google.com/maps/search/?api=1&query=${provider.lat},${provider.lng}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function typeSummary(provider: Provider): string {
  switch (provider.type) {
    case "ambulance":
      return provider.typicalResponseMinutes
        ? `~${provider.typicalResponseMinutes} min typical response`
        : "Emergency transport";
    case "boarding":
      return provider.pricePerDayRange ?? "Boarding & daycare";
    case "ngo":
      return provider.focus.includes("adoption")
        ? "Adoption available"
        : "Rescue support";
    case "diagnostics":
      return provider.turnaroundHours
        ? `${provider.turnaroundHours}-hour reports`
        : "Diagnostics & lab";
    case "hospital":
      return provider.emergencyAdmission
        ? "Emergency admission"
        : "Animal hospital";
    case "clinic":
    default:
      return "Veterinary care";
  }
}

export function shortDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function monthYear(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}
