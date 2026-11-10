import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pawzz.shortlist.v1";

function readShortlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeShortlist(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable in private mode; the shortlist simply stays in memory.
  }
}

export function useShortlist() {
  const [ids, setIds] = useState<string[]>(() => readShortlist());

  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setIds(readShortlist());
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((current) => {
      const next = current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id];
      writeShortlist(next);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, isSaved, count: ids.length };
}
