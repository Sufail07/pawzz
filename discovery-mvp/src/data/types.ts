export type ProviderType =
  | "clinic"
  | "hospital"
  | "boarding"
  | "diagnostics"
  | "ambulance"
  | "ngo";

export type Species =
  | "dog"
  | "cat"
  | "bird"
  | "exotic"
  | "livestock"
  | "small-mammal";

export type VerificationStatus = "unverified" | "phone-verified" | "visited";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface DayHours {
  closed: boolean;
  open: string | null;
  close: string | null;
}

export interface OpeningHours {
  known: boolean;
  is24x7: boolean;
  days: Record<Weekday, DayHours>;
  raw?: string;
}

export type ProviderSource = "sample" | "osm";

export interface ContactSource {
  label: string;
  url?: string;
  checkedOn: string;
}

export interface OsmInfo {
  elementType: "node" | "way" | "relation";
  elementId: number;
  url: string;
  lastEditedOn: string;
  tags: Record<string, string>;
}

interface ProviderBase {
  id: string;
  name: string;
  type: ProviderType;
  description: string;
  address: string;
  area: string;
  city: string;
  pinCode: string;
  lat: number;
  lng: number;
  phone?: string;
  whatsapp?: string;
  website?: string;
  openingHours: OpeningHours;
  speciesTreated: Species[];
  languages: string[];
  services: string[];
  photos: string[];
  verificationStatus?: VerificationStatus;
  lastVerifiedOn?: string;
  claimed: boolean;
  source: ProviderSource;
  osm?: OsmInfo;
  contactSource?: ContactSource;
  homeVisit?: boolean;
  pickupAvailable?: boolean;
}

export interface ClinicProvider extends ProviderBase {
  type: "clinic";
}

export interface HospitalProvider extends ProviderBase {
  type: "hospital";
  emergencyAdmission?: boolean;
  icu?: boolean;
  specialists: string[];
}

export interface BoardingProvider extends ProviderBase {
  type: "boarding";
  pricePerDayRange?: string;
  facilityFeatures: string[];
  vaccinationRequirements?: string;
}

export interface DiagnosticsProvider extends ProviderBase {
  type: "diagnostics";
  testCatalogue: string[];
  homeCollection?: boolean;
  turnaroundHours?: number;
}

export interface AmbulanceProvider extends ProviderBase {
  type: "ambulance";
  serviceAreaKm?: number;
  typicalResponseMinutes?: number;
  equipment: string[];
  largeAnimal?: boolean;
}

export interface NgoProvider extends ProviderBase {
  type: "ngo";
  focus: Array<"rescue" | "shelter" | "adoption" | "sterilisation">;
  donationLink?: string;
  volunteerContact?: string;
  registrationNumber?: string;
}

export type Provider =
  | ClinicProvider
  | HospitalProvider
  | BoardingProvider
  | DiagnosticsProvider
  | AmbulanceProvider
  | NgoProvider;

export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  clinic: "Veterinary clinics",
  hospital: "Animal hospitals",
  boarding: "Boarding & daycare",
  diagnostics: "Diagnostics & labs",
  ambulance: "Ambulances",
  ngo: "NGOs & rescue",
};

export const PROVIDER_TYPE_SINGULAR: Record<ProviderType, string> = {
  clinic: "Veterinary clinic",
  hospital: "Animal hospital",
  boarding: "Boarding & daycare",
  diagnostics: "Diagnostics & lab",
  ambulance: "Animal ambulance",
  ngo: "NGO & rescue",
};

export const SPECIES_LABELS: Record<Species, string> = {
  dog: "Dogs",
  cat: "Cats",
  bird: "Birds",
  exotic: "Exotics",
  livestock: "Livestock",
  "small-mammal": "Small mammals",
};

export const VERIFICATION_EXPLAINER: Record<
  VerificationStatus,
  { label: string; description: string }
> = {
  unverified: {
    label: "Unverified",
    description: "Added from public sources. Details have not been checked yet.",
  },
  "phone-verified": {
    label: "Phone verified",
    description: "Our team confirmed the phone number and basic details by call.",
  },
  visited: {
    label: "Verified",
    description:
      "Our team confirmed the address, phone and services on an in-person visit.",
  },
};

export const CITIES = ["Kochi", "Bengaluru"] as const;
export type City = (typeof CITIES)[number];
