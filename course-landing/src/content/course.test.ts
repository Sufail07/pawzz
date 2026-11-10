import { getTrack, isTrackId, projects, faqs, steps, tracks } from "./course";

describe("course content", () => {
  it("has three tracks with unique ids and full outcome sets", () => {
    expect(tracks).toHaveLength(3);
    const ids = tracks.map((track) => track.id);
    expect(new Set(ids).size).toBe(3);
    for (const track of tracks) {
      expect(track.outcomes).toHaveLength(5);
      expect(track.projects).toHaveLength(3);
      expect(track.heroSubhead.length).toBeGreaterThan(40);
    }
  });

  it("resolves tracks safely", () => {
    expect(getTrack("at-work").name).toBe("AI at Work");
    expect(isTrackId("studio")).toBe(true);
    expect(isTrackId("nope")).toBe(false);
    expect(isTrackId(null)).toBe(false);
  });

  it("keeps the supporting content complete", () => {
    expect(projects).toHaveLength(3);
    expect(steps).toHaveLength(4);
    expect(faqs.length).toBeGreaterThanOrEqual(8);
    for (const faq of faqs) {
      expect(faq.question.length).toBeGreaterThan(5);
      expect(faq.answer.length).toBeGreaterThan(30);
    }
  });
});
