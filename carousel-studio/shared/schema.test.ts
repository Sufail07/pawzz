import { describe, expect, it } from "vitest";
import { animalSample, eduSample, SAMPLE_CAROUSELS } from "./fixtures/samples.js";
import {
  carouselSchema,
  exportIssues,
  factsGateIssues,
  normalizeHashtags,
  slugify,
} from "./schema.js";

describe("carousel contract", () => {
  it("accepts both shipped sample carousels", () => {
    for (const sample of SAMPLE_CAROUSELS) {
      const result = carouselSchema.safeParse(sample);
      expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
    }
  });

  it("keeps both samples ready to export", () => {
    expect(exportIssues(animalSample)).toEqual([]);
    expect(exportIssues(eduSample)).toEqual([]);
  });

  it("reports missing approved sources at the facts gate", () => {
    const blocked = {
      ...animalSample,
      research: {
        ...animalSample.research,
        key_points: animalSample.research.key_points.map((point) => ({
          ...point,
          approved: false,
        })),
      },
    };
    const issues = factsGateIssues(blocked);
    expect(issues.some((issue) => issue.includes("must be approved"))).toBe(true);
  });

  it("blocks export until the read is final", () => {
    const issues = exportIssues({ ...animalSample, status: "draft" });
    expect(issues).toContain("Approve the final read before exporting");
  });

  it("requires the hook and CTA edges", () => {
    const issues = exportIssues({
      ...animalSample,
      slides: animalSample.slides.map((slide, index) => ({
        ...slide,
        layout: index === 0 ? "statement" : index === animalSample.slides.length - 1 ? "statement" : slide.layout,
      })),
    });
    expect(issues).toContain("Slide 1 must use the hook layout");
    expect(issues).toContain("The last slide must use the CTA layout");
  });

  it("normalizes hashtags and slugs", () => {
    expect(normalizeHashtags("#PetCare, pet health  #pawzz #pawzz")).toEqual([
      "#PetCare",
      "#pet",
      "#health",
      "#pawzz",
    ]);
    expect(slugify("5 signs your pet needs a vet today")).toBe("5-signs-your-pet-needs-a-vet-today");
  });

  it("keeps the education sample valid with its own theme", () => {
    expect(eduSample.brief.theme).toBe("edu");
    expect(carouselSchema.safeParse(eduSample).success).toBe(true);
    expect(eduSample.slides.length).toBeGreaterThanOrEqual(7);
  });
});
