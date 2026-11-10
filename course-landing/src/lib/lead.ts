import { isTrackId, type TrackId } from "../content/course";

export type Segment = "student" | "professional";
export type PreferredTime = "morning" | "afternoon" | "evening";
export type LeadType = "intro_call" | "syllabus";

export const segmentLabels: Record<Segment, string> = {
  student: "Student (college or final year)",
  professional: "Working professional (0–5 years)",
};

export const preferredTimeLabels: Record<PreferredTime, string> = {
  morning: "Morning (9am–12pm)",
  afternoon: "Afternoon (12pm–4pm)",
  evening: "Evening (4pm–8pm)",
};

export const leadTypeLabels: Record<LeadType, string> = {
  intro_call: "Free intro session",
  syllabus: "Syllabus download",
};

export interface IntroLeadFields {
  name: string;
  whatsapp: string;
  segment: Segment;
  track: TrackId;
  preferredTime: PreferredTime | "";
  consent: boolean;
}

export interface SyllabusLeadFields {
  name: string;
  email: string;
  consent: boolean;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Name is required";
  if (trimmed.length < 2) return "Enter at least two characters";
  if (trimmed.length > 80) return "Keep the name under 80 characters";
  return undefined;
}

export function normalizePhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function validateIndianPhone(value: string): string | undefined {
  if (!value.trim()) return "WhatsApp number is required";
  if (value.replace(/\D/g, "").length < 10)
    return "Enter a 10-digit Indian mobile number";
  const digits = normalizePhone(value);
  if (digits.length !== 10 || !/^[6-9]/.test(digits))
    return "Enter a valid Indian mobile number (10 digits, starting 6–9)";
  return undefined;
}

export function toE164India(value: string): string {
  return `+91${normalizePhone(value)}`;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()))
    return "Enter a valid email address";
  return undefined;
}

export function validateIntroLead(
  fields: IntroLeadFields,
): FieldErrors<IntroLeadFields> {
  const errors: FieldErrors<IntroLeadFields> = {};
  const name = validateName(fields.name);
  if (name) errors.name = name;
  const phone = validateIndianPhone(fields.whatsapp);
  if (phone) errors.whatsapp = phone;
  if (!isTrackId(fields.track)) errors.track = "Choose a track";
  if (fields.segment !== "student" && fields.segment !== "professional")
    errors.segment = "Tell us which group you are in";
  if (!fields.consent) errors.consent = "Please agree to be contacted";
  return errors;
}

export function validateSyllabusLead(
  fields: SyllabusLeadFields,
): FieldErrors<SyllabusLeadFields> {
  const errors: FieldErrors<SyllabusLeadFields> = {};
  const name = validateName(fields.name);
  if (name) errors.name = name;
  const email = validateEmail(fields.email);
  if (email) errors.email = email;
  if (!fields.consent) errors.consent = "Please agree to be contacted";
  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
