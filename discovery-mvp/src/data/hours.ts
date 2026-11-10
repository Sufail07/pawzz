import type { DayHours, OpeningHours, Weekday } from "./types";

export const WEEKDAYS: Weekday[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const SHORT_TO_WEEKDAY: Record<string, Weekday> = {
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
  Sun: "sun",
};

export function makeHours(
  is24x7: boolean,
  open: string,
  close: string,
  closedOn: Weekday[] = [],
): OpeningHours {
  const days = {} as Record<Weekday, DayHours>;
  for (const day of WEEKDAYS) {
    const closed = closedOn.includes(day);
    days[day] = {
      closed,
      open: closed ? null : open,
      close: closed ? null : close,
    };
  }
  return { known: true, is24x7, days };
}

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatTime(value: string | null): string {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return minutes === 0
    ? `${hour12} ${suffix}`
    : `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export interface LocalClock {
  weekday: Weekday;
  minutes: number;
}

export function kolkataClock(date: Date = new Date()): LocalClock {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  let weekday: Weekday = "mon";
  let hours = 0;
  let minutes = 0;

  for (const part of parts) {
    if (part.type === "weekday") {
      weekday = SHORT_TO_WEEKDAY[part.value] ?? "mon";
    } else if (part.type === "hour") {
      hours = Number(part.value) % 24;
    } else if (part.type === "minute") {
      minutes = Number(part.value);
    }
  }

  return { weekday, minutes: hours * 60 + minutes };
}

export function makeUnknownHours(raw?: string): OpeningHours {
  const days = {} as Record<Weekday, DayHours>;
  for (const day of WEEKDAYS) {
    days[day] = { closed: true, open: null, close: null };
  }
  return { known: false, is24x7: false, days, raw };
}

export function isOpenAt(
  openingHours: OpeningHours,
  date: Date = new Date(),
): boolean | null {
  if (!openingHours.known) return null;
  if (openingHours.is24x7) return true;

  const { weekday, minutes } = kolkataClock(date);
  const day = openingHours.days[weekday];
  if (!day || day.closed || !day.open || !day.close) return false;

  const open = toMinutes(day.open);
  const close = toMinutes(day.close);

  if (close <= open) {
    return minutes >= open || minutes < close;
  }
  return minutes >= open && minutes < close;
}

export function todayHours(
  openingHours: OpeningHours,
  date: Date = new Date(),
): DayHours {
  const { weekday } = kolkataClock(date);
  return openingHours.days[weekday];
}

export function describeToday(
  openingHours: OpeningHours,
  date: Date = new Date(),
): string {
  if (!openingHours.known) return "Hours not listed";
  if (isOpenAt(openingHours, date)) return "Open now";
  if (openingHours.is24x7) return "Open now";
  const day = todayHours(openingHours, date);
  if (!day.closed && day.open) {
    return `Closed · opens ${formatTime(day.open)}`;
  }
  return "Closed today";
}
