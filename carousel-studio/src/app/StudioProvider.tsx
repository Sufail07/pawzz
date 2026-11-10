import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { carouselSchema, newId, type Carousel } from "../../shared/schema";
import {
  deleteServerDraft,
  getConfig,
  listServerDrafts,
  saveServerDraft,
  type StudioConfig,
} from "../lib/api";
import {
  loadLocalDrafts,
  mergeDrafts,
  saveLocalDrafts,
  seedDrafts,
} from "../lib/repository";

const FALLBACK_CONFIG: StudioConfig = {
  demoMode: true,
  demoSetting: "auto",
  provider: "offline",
  providerLabel: "Offline demo",
  model: "fixture",
  researchProvider: "manual",
  storageMode: "browser",
  configured: false,
  rateLimitPerMin: 10,
  capabilities: { drafts: false, export: "browser" },
};

interface StudioContextValue {
  drafts: Carousel[];
  config: StudioConfig;
  loading: boolean;
  apiReachable: boolean;
  getDraft: (id: string) => Carousel | undefined;
  updateDraft: (id: string, updater: (draft: Carousel) => Carousel) => void;
  saveDraftNow: (draft: Carousel) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;
  duplicateDraft: (id: string) => Carousel | null;
  importDraft: (input: unknown) => Carousel;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Carousel[]>([]);
  const [config, setConfig] = useState<StudioConfig>(FALLBACK_CONFIG);
  const [loading, setLoading] = useState(true);
  const [apiReachable, setApiReachable] = useState(false);
  const draftsRef = useRef<Carousel[]>([]);
  const configRef = useRef<StudioConfig>(FALLBACK_CONFIG);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const booted = useRef(false);

  const apply = useCallback((next: Carousel[]) => {
    draftsRef.current = next;
    setDrafts(next);
    saveLocalDrafts(next);
  }, []);

  const queueServerSave = useCallback((draft: Carousel) => {
    if (configRef.current.storageMode !== "filesystem") return;
    const existing = timers.current.get(draft.id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      timers.current.delete(draft.id);
      saveServerDraft(draft).catch(() => {
        // The local copy remains the source of truth when the API is unavailable.
      });
    }, 700);
    timers.current.set(draft.id, timer);
  }, []);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const local = loadLocalDrafts();
    apply(local.length > 0 ? local : seedDrafts());

    (async () => {
      try {
        const loaded = await getConfig();
        setConfig(loaded);
        configRef.current = loaded;
        setApiReachable(true);
        if (loaded.storageMode === "filesystem") {
          const remote = await listServerDrafts();
          apply(mergeDrafts(draftsRef.current, remote.drafts));
        }
      } catch {
        setConfig(FALLBACK_CONFIG);
        configRef.current = FALLBACK_CONFIG;
        setApiReachable(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [apply]);

  useEffect(() => {
    const current = timers.current;
    return () => {
      for (const timer of current.values()) clearTimeout(timer);
    };
  }, []);

  const getDraft = useCallback(
    (id: string) => draftsRef.current.find((draft) => draft.id === id),
    [],
  );

  const updateDraft = useCallback(
    (id: string, updater: (draft: Carousel) => Carousel) => {
      const target = draftsRef.current.find((draft) => draft.id === id);
      if (!target) return;
      const updated = {
        ...updater(target),
        id: target.id,
        updatedAt: new Date().toISOString(),
      };
      apply(draftsRef.current.map((draft) => (draft.id === id ? updated : draft)));
      queueServerSave(updated);
    },
    [apply, queueServerSave],
  );

  const saveDraftNow = useCallback(
    async (draft: Carousel) => {
      const updated = { ...draft, updatedAt: new Date().toISOString() };
      const exists = draftsRef.current.some((item) => item.id === updated.id);
      apply(
        exists
          ? draftsRef.current.map((item) => (item.id === updated.id ? updated : item))
          : [updated, ...draftsRef.current],
      );
      if (configRef.current.storageMode === "filesystem") {
        await saveServerDraft(updated);
      }
    },
    [apply],
  );

  const deleteDraft = useCallback(
    async (id: string) => {
      apply(draftsRef.current.filter((draft) => draft.id !== id));
      const timer = timers.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timers.current.delete(id);
      }
      if (configRef.current.storageMode === "filesystem") {
        await deleteServerDraft(id).catch(() => undefined);
      }
    },
    [apply],
  );

  const duplicateDraft = useCallback(
    (id: string) => {
      const source = draftsRef.current.find((draft) => draft.id === id);
      if (!source) return null;
      const now = new Date().toISOString();
      const copy: Carousel = {
        ...structuredClone(source),
        id: newId(),
        createdAt: now,
        updatedAt: now,
        status: source.status === "final" ? "facts_approved" : source.status,
        demo: source.demo,
      };
      apply([copy, ...draftsRef.current]);
      queueServerSave(copy);
      return copy;
    },
    [apply, queueServerSave],
  );

  const importDraft = useCallback(
    (input: unknown) => {
      const parsed = carouselSchema.parse(input);
      const now = new Date().toISOString();
      const collision = draftsRef.current.some((draft) => draft.id === parsed.id);
      const imported: Carousel = {
        ...parsed,
        id: collision ? newId() : parsed.id,
        updatedAt: now,
        createdAt: parsed.createdAt || now,
      };
      apply([imported, ...draftsRef.current.filter((draft) => draft.id !== imported.id)]);
      queueServerSave(imported);
      return imported;
    },
    [apply, queueServerSave],
  );

  const value = useMemo<StudioContextValue>(
    () => ({
      drafts,
      config,
      loading,
      apiReachable,
      getDraft,
      updateDraft,
      saveDraftNow,
      deleteDraft,
      duplicateDraft,
      importDraft,
    }),
    [
      drafts,
      config,
      loading,
      apiReachable,
      getDraft,
      updateDraft,
      saveDraftNow,
      deleteDraft,
      duplicateDraft,
      importDraft,
    ],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioContextValue {
  const value = useContext(StudioContext);
  if (!value) throw new Error("useStudio must be used inside StudioProvider");
  return value;
}
