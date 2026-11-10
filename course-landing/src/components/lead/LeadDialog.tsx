import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLead } from "./LeadContext";
import { IntroLeadForm } from "./IntroLeadForm";
import { SyllabusLeadForm } from "./SyllabusLeadForm";

const titles = {
  intro: "Book a free intro session",
  syllabus: "Download the syllabus",
} as const;

const descriptions = {
  intro:
    "Four quick fields. We reply on WhatsApp during working hours.",
  syllabus:
    "Enter your name and email and the sample syllabus PDF downloads right away.",
} as const;

export function LeadDialog() {
  const { dialog, close } = useLead();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [dialog, close]);

  if (!dialog) return null;

  const { kind, track } = dialog;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-edu-ink/50 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-dialog-title"
        aria-describedby="lead-dialog-description"
        tabIndex={-1}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-card bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lift outline-none sm:max-w-xl sm:rounded-card sm:p-6"
      >
        <div className="mb-3 flex items-start justify-between gap-4 sm:mb-4">
          <div>
            <h2
              id="lead-dialog-title"
              className="text-xl font-extrabold text-edu-ink"
            >
              {titles[kind]}
            </h2>
            <p id="lead-dialog-description" className="mt-1 text-sm text-edu-muted">
              {descriptions[kind]}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="tap-target -mr-2 -mt-2 inline-flex items-center justify-center rounded-pill text-edu-muted hover:bg-edu-surface-alt hover:text-edu-ink"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {kind === "intro" ? (
          <IntroLeadForm
            key={track}
            initialTrack={track}
            idPrefix="dialog"
            onDone={close}
          />
        ) : (
          <SyllabusLeadForm key={track} idPrefix="dialog" onDone={close} />
        )}
      </div>
    </div>
  );
}
