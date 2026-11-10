import { describe, expect, it } from "vitest";
import {
  describeToday,
  formatTime,
  isOpenAt,
  kolkataClock,
  makeHours,
  makeUnknownHours,
} from "./hours";

const hours = makeHours(false, "09:00", "19:00", ["sun"]);
const overnight = makeHours(false, "20:00", "02:00");

const at = (iso: string) => new Date(iso);

describe("isOpenAt", () => {
  it("reads the clock in Asia/Kolkata", () => {
    const clock = kolkataClock(at("2026-11-09T04:00:00Z"));
    expect(clock).toEqual({ weekday: "mon", minutes: 570 });
  });

  it("is open during opening hours", () => {
    expect(isOpenAt(hours, at("2026-11-09T04:30:00Z"))).toBe(true);
  });

  it("is closed at the closing minute", () => {
    expect(isOpenAt(hours, at("2026-11-09T13:30:00Z"))).toBe(false);
  });

  it("is closed on a configured closed day", () => {
    expect(isOpenAt(hours, at("2026-11-08T04:30:00Z"))).toBe(false);
  });

  it("supports overnight hours", () => {
    expect(isOpenAt(overnight, at("2026-11-09T17:30:00Z"))).toBe(true);
    expect(isOpenAt(overnight, at("2026-11-09T18:30:00Z"))).toBe(true);
    expect(isOpenAt(overnight, at("2026-11-09T06:30:00Z"))).toBe(false);
  });

  it("always opens a 24x7 provider", () => {
    expect(isOpenAt(makeHours(true, "00:00", "23:59"), at("2026-11-09T18:45:00Z"))).toBe(
      true,
    );
  });

  it("returns unknown for hours that were never supplied", () => {
    const hours = makeUnknownHours("Mo-Fr 09:00-13:00,16:00-19:00");
    expect(isOpenAt(hours, at("2026-11-09T04:30:00Z"))).toBeNull();
    expect(describeToday(hours, at("2026-11-09T04:30:00Z"))).toBe(
      "Hours not listed",
    );
  });
});

describe("formatting", () => {
  it("formats 24-hour times into friendly labels", () => {
    expect(formatTime("19:00")).toBe("7 pm");
    expect(formatTime("09:30")).toBe("9:30 am");
    expect(formatTime("00:00")).toBe("12 am");
    expect(formatTime(null)).toBe("");
  });

  it("describes today's status", () => {
    expect(describeToday(hours, at("2026-11-09T04:30:00Z"))).toBe("Open now");
    expect(describeToday(hours, at("2026-11-09T14:30:00Z"))).toBe(
      "Closed · opens 9 am",
    );
    expect(describeToday(hours, at("2026-11-08T04:30:00Z"))).toBe(
      "Closed today",
    );
  });
});
