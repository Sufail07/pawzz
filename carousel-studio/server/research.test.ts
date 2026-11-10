import { describe, expect, it } from "vitest";
import { normalizeResearch } from "./research.js";
import type { ResearchResponse } from "../shared/schema.js";

const raw: ResearchResponse = {
  key_points: [
    {
      text: "Repeated vomiting can be a sign that a pet needs veterinary advice.",
      source_url: "https://example.com/vet",
      source_title: "Example vet guide",
      confidence: "high",
    },
    {
      text: "A sudden behaviour change can signal pain or illness.",
      source_url: "https://example.com/behaviour",
      source_title: "",
      confidence: "high",
    },
    {
      text: "A claim with no usable source should still reach the human gate.",
      source_url: "",
      source_title: "",
      confidence: "high",
    },
    {
      text: "This duplicate should be removed.",
      source_url: "https://example.com/vet",
      source_title: "Example vet guide",
      confidence: "high",
    },
    {
      text: "This duplicate should be removed.",
      source_url: "https://example.com/vet",
      source_title: "Example vet guide",
      confidence: "high",
    },
  ],
};

const sources = [
  { title: "Example vet guide", url: "https://example.com/vet" },
  { title: "Behaviour notes", url: "https://example.com/behaviour" },
];

describe("research normalization", () => {
  it("keeps supported claims as high confidence and demotes the rest", () => {
    const result = normalizeResearch(raw, sources, "ddg");
    expect(result.provider).toBe("ddg");
    expect(result.key_points).toHaveLength(4);
    expect(result.key_points[0]?.confidence).toBe("high");
    expect(result.key_points[1]?.source_title).toBe("Behaviour notes");
    expect(result.key_points[2]?.confidence).toBe("check");
    expect(result.key_points[3]?.confidence).toBe("high");
    expect(result.key_points.every((point) => point.approved === false)).toBe(true);
  });

  it("deduplicates sources and keeps the point sources", () => {
    const result = normalizeResearch(raw, sources, "manual");
    expect(result.sources.map((source) => source.url)).toEqual([
      "https://example.com/vet",
      "https://example.com/behaviour",
    ]);
  });

  it("rejects research with fewer than three usable points", () => {
    expect(() =>
      normalizeResearch({ key_points: raw.key_points.slice(0, 2) }, sources, "ddg"),
    ).toThrow(/fewer than three/i);
  });
});
