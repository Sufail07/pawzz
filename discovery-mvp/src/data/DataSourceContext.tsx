import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import snapshotJson from "./osm-snapshot.json";
import overlayJson from "./osm-contact-overlay.json";
import { providers as sampleProviders } from "./providers";
import type { Provider } from "./types";
import {
  isOsmCacheFresh,
  mapOsmSnapshot,
  readOsmCache,
  refreshOsmSnapshot,
  writeOsmCache,
  type ContactOverlay,
  type OsmSnapshot,
} from "../lib/osm";

export type DataMode = "osm" | "sample";
export type OsmSource = "cache" | "snapshot" | "live";

const MODE_KEY = "pawzz.datasource.v1";
const BUNDLED_SNAPSHOT = snapshotJson as unknown as OsmSnapshot;
const CONTACT_OVERLAY = (overlayJson as { entries: ContactOverlay }).entries;

interface DataSourceValue {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  providers: Provider[];
  osmSnapshot: OsmSnapshot;
  osmSource: OsmSource;
  lastFetched: string;
  refreshing: boolean;
  refreshError?: string;
  failedCities: string[];
  refresh: () => Promise<void>;
}

const DataSourceContext = createContext<DataSourceValue | null>(null);

function initialMode(): DataMode {
  if (typeof window === "undefined") return "osm";
  const stored = window.localStorage.getItem(MODE_KEY);
  return stored === "sample" || stored === "osm" ? stored : "osm";
}

function initialSnapshot(): { snapshot: OsmSnapshot; source: OsmSource } {
  const cached = readOsmCache();
  if (cached) {
    const cachedTime = new Date(cached.snapshot.fetchedAt).getTime();
    const bundledTime = new Date(BUNDLED_SNAPSHOT.fetchedAt).getTime();
    if (
      isOsmCacheFresh(cached.ageMs) ||
      cachedTime > bundledTime ||
      Number.isNaN(bundledTime)
    ) {
      return { snapshot: cached.snapshot, source: "cache" };
    }
  }
  return { snapshot: BUNDLED_SNAPSHOT, source: "snapshot" };
}

export function DataSourceProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DataMode>(initialMode);
  const initial = useMemo(initialSnapshot, []);
  const [osmSnapshot, setOsmSnapshot] = useState<OsmSnapshot>(initial.snapshot);
  const [osmSource, setOsmSource] = useState<OsmSource>(initial.source);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string>();
  const [failedCities, setFailedCities] = useState<string[]>([]);

  const setMode = useCallback((next: DataMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(MODE_KEY, next);
    } catch {
      // Mode still applies for this session.
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshError(undefined);
    try {
      const result = await refreshOsmSnapshot(osmSnapshot);
      setOsmSnapshot(result.snapshot);
      setOsmSource("live");
      setFailedCities(result.failedCities);
      writeOsmCache(result.snapshot);
    } catch (error) {
      setRefreshError(
        error instanceof Error
          ? error.message
          : "Could not refresh from OpenStreetMap",
      );
    } finally {
      setRefreshing(false);
    }
  }, [osmSnapshot]);

  const providers = useMemo(
    () =>
      mode === "osm"
        ? mapOsmSnapshot(osmSnapshot, CONTACT_OVERLAY)
        : sampleProviders,
    [mode, osmSnapshot],
  );

  const value = useMemo<DataSourceValue>(
    () => ({
      mode,
      setMode,
      providers,
      osmSnapshot,
      osmSource,
      lastFetched: osmSnapshot.fetchedAt,
      refreshing,
      refreshError,
      failedCities,
      refresh,
    }),
    [
      mode,
      setMode,
      providers,
      osmSnapshot,
      osmSource,
      refreshing,
      refreshError,
      failedCities,
      refresh,
    ],
  );

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource(): DataSourceValue {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error("useDataSource must be used inside DataSourceProvider");
  }
  return context;
}
