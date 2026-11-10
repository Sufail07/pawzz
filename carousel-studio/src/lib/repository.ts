import { carouselSchema, type Carousel } from "../../shared/schema";
import { eduSample, animalSample } from "../../shared/fixtures/samples";

const STORAGE_KEY = "pawzz.carousel.v1";

export function loadLocalDrafts(): Carousel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => carouselSchema.safeParse(item))
      .filter((result): result is { success: true; data: Carousel } => result.success)
      .map((result) => result.data);
  } catch {
    return [];
  }
}

export function saveLocalDrafts(drafts: Carousel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    // Storage can be full or blocked; the app keeps working in memory.
  }
}

export function seedDrafts(): Carousel[] {
  return [structuredClone(animalSample), structuredClone(eduSample)];
}

export function mergeDrafts(local: Carousel[], remote: Carousel[]): Carousel[] {
  const byId = new Map<string, Carousel>();
  for (const draft of local) byId.set(draft.id, draft);
  for (const draft of remote) {
    const existing = byId.get(draft.id);
    if (!existing || draft.updatedAt > existing.updatedAt) {
      byId.set(draft.id, draft);
    }
  }
  return [...byId.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
