import { describe, expect, it } from "vitest";
import { buildCopyDeck, fileBase } from "./export";
import { animalSample } from "../../shared/fixtures/samples";

describe("export helpers", () => {
  it("names files from the chosen headline and theme", () => {
    expect(fileBase(animalSample)).toBe(
      "5-signs-your-pet-needs-a-vet-today-animal",
    );
  });

  it("falls back to the brief idea when no headline is chosen", () => {
    expect(fileBase({ ...animalSample, chosen_headline: "" })).toBe(
      "5-signs-your-pet-needs-a-vet-today-animal",
    );
  });

  it("builds a copy deck with slide text, sources and disclaimer", () => {
    const deck = buildCopyDeck(animalSample);
    expect(deck).toContain("# 5 signs your pet needs a vet today");
    expect(deck).toContain("## Caption");
    expect(deck).toContain("## Hashtags");
    expect(deck).toContain("## Sources");
    expect(deck).toContain("merckvetmanual.com");
    expect(deck).toContain(animalSample.disclaimer);
    expect(deck).toContain("Hook");
    expect(deck).toContain("CTA");
  });

  it("does not duplicate sources in the deck", () => {
    const deck = buildCopyDeck(animalSample);
    const matches = deck.match(/https:\/\/www\.merckvetmanual\.com\/multimedia\/case-study\/puppy-with-vomiting-and-diarrhea/g);
    expect(matches?.length ?? 0).toBeLessThanOrEqual(1);
  });
});
