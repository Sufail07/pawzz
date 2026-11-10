import type { Brief, Carousel, CopyResponse, KeyPoint, Source } from "../schema.js";
import type { ThemeName } from "../themes.js";
import { animalSample, eduSample, SAMPLE_CAROUSELS } from "./samples.js";

export function sampleForTheme(theme: ThemeName): Carousel {
  return theme === "edu" ? eduSample : animalSample;
}

export function demoResearch(theme: ThemeName): {
  key_points: KeyPoint[];
  sources: Source[];
} {
  const sample = sampleForTheme(theme);
  return {
    key_points: sample.research.key_points.map((point) => ({
      ...point,
      approved: false,
    })),
    sources: sample.research.sources,
  };
}

export function demoCopy(theme: ThemeName): CopyResponse {
  const sample = sampleForTheme(theme);
  return {
    headline_options: sample.headline_options,
    slides: sample.slides,
    caption: sample.caption,
    hashtags: sample.hashtags,
  };
}

export function demoResearchForBrief(brief: Brief): {
  key_points: KeyPoint[];
  sources: Source[];
} {
  return demoResearch(brief.theme);
}

export function findSample(id: string): Carousel | undefined {
  return SAMPLE_CAROUSELS.find((sample) => sample.id === id);
}

export { animalSample, eduSample, SAMPLE_CAROUSELS };
