import { beforeEach, describe, expect, it } from "vitest";
import {
  loadLocalDrafts,
  mergeDrafts,
  saveLocalDrafts,
  seedDrafts,
} from "./repository";
import { animalSample, eduSample } from "../../shared/fixtures/samples";
import type { Carousel } from "../../shared/schema";

function withUpdate(sample: Carousel, updatedAt: string): Carousel {
  return { ...structuredClone(sample), updatedAt };
}

describe("draft repository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("seeds both sample themes", () => {
    const seeds = seedDrafts();
    expect(seeds.map((draft) => draft.brief.theme)).toEqual(["animal", "edu"]);
    expect(seeds[0]?.id).toBe(animalSample.id);
    expect(seeds[1]?.id).toBe(eduSample.id);
  });

  it("round-trips drafts through local storage", () => {
    saveLocalDrafts([animalSample]);
    const loaded = loadLocalDrafts();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe(animalSample.id);
  });

  it("ignores corrupt local storage", () => {
    localStorage.setItem("pawzz.carousel.v1", "{not json");
    expect(loadLocalDrafts()).toEqual([]);
  });

  it("merges local and remote drafts by newest update", () => {
    const local = withUpdate(animalSample, "2026-11-10T10:00:00.000Z");
    const remote = withUpdate(animalSample, "2026-11-10T09:00:00.000Z");
    const merged = mergeDrafts([local], [remote]);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.updatedAt).toBe(local.updatedAt);
  });

  it("keeps distinct drafts and sorts newest first", () => {
    const older = withUpdate(eduSample, "2026-11-09T09:00:00.000Z");
    const newer = withUpdate(animalSample, "2026-11-10T09:00:00.000Z");
    const merged = mergeDrafts([older], [newer]);
    expect(merged.map((draft) => draft.id)).toEqual([newer.id, older.id]);
  });
});
