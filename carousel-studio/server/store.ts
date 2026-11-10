import { mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { carouselSchema, type Carousel } from "../shared/schema.js";

const DATA_DIR = path.join(process.cwd(), "data", "carousels");
const SAFE_ID = /^[a-zA-Z0-9_-]{1,120}$/;

function assertId(id: string): void {
  if (!SAFE_ID.test(id)) {
    throw new Error("Invalid draft id");
  }
}

async function ensureDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function saveDraft(input: unknown): Promise<Carousel> {
  const draft = carouselSchema.parse(input);
  assertId(draft.id);
  await ensureDir();
  const target = path.join(DATA_DIR, `${draft.id}.json`);
  const temporary = `${target}.tmp`;
  await writeFile(temporary, JSON.stringify(draft, null, 2), "utf8");
  await rename(temporary, target);
  return draft;
}

export async function listDrafts(): Promise<Carousel[]> {
  await ensureDir();
  const files = await readdir(DATA_DIR);
  const drafts: Carousel[] = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    try {
      const raw = await readFile(path.join(DATA_DIR, file), "utf8");
      const parsed = carouselSchema.safeParse(JSON.parse(raw));
      if (parsed.success) drafts.push(parsed.data);
    } catch {
      // skip corrupt files
    }
  }
  return drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getDraft(id: string): Promise<Carousel | null> {
  assertId(id);
  try {
    const raw = await readFile(path.join(DATA_DIR, `${id}.json`), "utf8");
    const parsed = carouselSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function deleteDraft(id: string): Promise<void> {
  assertId(id);
  await rm(path.join(DATA_DIR, `${id}.json`), { force: true });
}
