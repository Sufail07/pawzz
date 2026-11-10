import { describe, expect, it } from "vitest";
import { applyVisualSelection } from "./generate.js";
import type { Slide } from "../shared/schema.js";
import type { IconName } from "../shared/limits.js";

const slides: Slide[] = [
  {
    n: 1,
    layout: "hook",
    title: "A hook",
    subtitle: "A subtitle",
    body: "",
    items: [],
    number: "",
    source: "",
    label: "",
    handle: "",
    icon: "sparkles",
    notes: "",
  },
  {
    n: 2,
    layout: "statement",
    title: "A statement",
    subtitle: "",
    body: "Body copy",
    items: [],
    number: "",
    source: "",
    label: "",
    handle: "",
    icon: "target",
    notes: "",
  },
];

describe("visual selection", () => {
  it("keeps valid layout and icon choices", () => {
    const result = applyVisualSelection(slides, [
      { n: 1, layout: "hook", icon: "paw-print" },
      { n: 2, layout: "quote", icon: "lightbulb" },
    ]);
    expect(result[0]?.icon).toBe("paw-print");
    expect(result[1]?.layout).toBe("statement");
    expect(result[1]?.icon).toBe("lightbulb");
  });

  it("falls back when a layout does not fit the slide content", () => {
    const result = applyVisualSelection(slides, [
      { n: 1, layout: "stat", icon: "activity" },
      { n: 2, layout: "list", icon: "not-real" as IconName },
    ]);
    expect(result[0]?.layout).toBe("hook");
    expect(result[1]?.layout).toBe("statement");
    expect(result[1]?.icon).toBe("activity");
  });

  it("fills missing selection entries with layout-safe icons", () => {
    const result = applyVisualSelection(slides, []);
    expect(result).toHaveLength(2);
    expect(result[0]?.icon).toBe("sparkles");
    expect(result[1]?.icon).toBe("activity");
  });
});
