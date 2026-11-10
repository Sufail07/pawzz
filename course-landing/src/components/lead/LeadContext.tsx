import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isTrackId, type TrackId } from "../../content/course";
import { captureUtmFromLocation } from "../../lib/utm";

export type DialogKind = "intro" | "syllabus";

export interface DialogState {
  kind: DialogKind;
  track: TrackId;
}

interface LeadContextValue {
  dialog: DialogState | null;
  isOpen: boolean;
  track: TrackId;
  setTrack: (track: TrackId) => void;
  openIntro: (track?: TrackId) => void;
  openSyllabus: () => void;
  close: () => void;
}

const LeadContext = createContext<LeadContextValue | null>(null);
const TRACK_KEY = "lumen.track.v1";

function readStoredTrack(): TrackId {
  if (typeof window === "undefined") return "foundations";
  try {
    const stored = window.localStorage.getItem(TRACK_KEY);
    return isTrackId(stored) ? stored : "foundations";
  } catch {
    return "foundations";
  }
}

export function LeadProvider({ children }: { children: ReactNode }) {
  const [track, setTrackState] = useState<TrackId>(readStoredTrack);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    captureUtmFromLocation();
  }, []);

  const setTrack = useCallback((next: TrackId) => {
    setTrackState(next);
    try {
      window.localStorage.setItem(TRACK_KEY, next);
    } catch {
      // The choice still applies for this session.
    }
  }, []);

  const openIntro = useCallback(
    (nextTrack?: TrackId) => {
      const chosen = nextTrack ?? track;
      if (nextTrack) setTrack(nextTrack);
      setDialog({ kind: "intro", track: chosen });
    },
    [setTrack, track],
  );

  const openSyllabus = useCallback(() => {
    setDialog({ kind: "syllabus", track });
  }, [track]);

  const close = useCallback(() => setDialog(null), []);

  const value = useMemo<LeadContextValue>(
    () => ({
      dialog,
      isOpen: Boolean(dialog),
      track,
      setTrack,
      openIntro,
      openSyllabus,
      close,
    }),
    [dialog, track, setTrack, openIntro, openSyllabus, close],
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLead(): LeadContextValue {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLead must be used inside LeadProvider");
  }
  return context;
}
