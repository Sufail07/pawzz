import { describe, expect, it } from "vitest";
import {
  CHARACTER_LIMITS,
  ICONS,
  LAYOUTS,
  countChars,
  slideIssues,
  type SlideLike,
} from "./limits.js";

const base: SlideLike = {
  layout: "hook",
  title: "A short hook",
  subtitle: "A useful subtitle",
  icon: "paw-print",
};

describe("template limits", () => {
  it("counts characters by code point", () => {
    expect(countChars("pet")).toBe(3);
    expect(countChars("🐾🐾")).toBe(2);
  });

  it("keeps all six layouts available", () => {
    expect([...LAYOUTS]).toEqual(["hook", "statement", "list", "stat", "quote", "cta"]);
  });

  it("accepts a valid hook", () => {
    expect(slideIssues(base, true)).toEqual([]);
  });

  it("flags long hook copy", () => {
    const issues = slideIssues(
      { ...base, title: "x".repeat(CHARACTER_LIMITS.hook.title + 1) },
      true,
    );
    expect(issues.some((issue) => issue.includes("Title is"))).toBe(true);
  });

  it("requires three or four list points when content is required", () => {
    const slide: SlideLike = {
      layout: "list",
      title: "A list",
      items: ["one", "two"],
      icon: "check-circle",
    };
    expect(slideIssues(slide, true)).toContain("List needs three or four points");
  });

  it("rejects icons outside the whitelist", () => {
    expect(slideIssues({ ...base, icon: "not-real" })).toContain(
      'Icon "not-real" is not in the template library',
    );
    expect(ICONS).toContain("paw-print");
  });

  it("requires stat source only when content is required", () => {
    const stat: SlideLike = {
      layout: "stat",
      number: "12",
      label: "a useful metric",
      icon: "activity",
    };
    expect(slideIssues(stat, false)).toEqual([]);
    expect(slideIssues(stat, true)).toContain("Source is required");
  });

  it("requires CTA action and handle", () => {
    const cta: SlideLike = { layout: "cta", title: "", handle: "", icon: "arrow-right" };
    const issues = slideIssues(cta, true);
    expect(issues).toContain("Action line is required");
    expect(issues).toContain("Handle or link is required");
  });
});
