import { useState } from "react";
import { cn } from "@/components/ui/utils";


const LEAD_STEPS = [
  { id: 1, title: "Land on page", what: "Visitor arrives via organic, paid or direct traffic. UTM parameters captured on load." },
  { id: 2, title: "Choose track", what: "Track switcher updates hero and outcome cards: AI Foundations, AI at Work, Digital Skills Studio." },
  { id: 3, title: "Read outcomes", what: "Outcome cards show what each track leads to — jobs, skills, portfolios." },
  { id: 4, title: "Click primary CTA", what: "Free intro session is the single primary CTA, visible at all scroll positions." },
  { id: 5, title: "Fill form", what: "Four-field lead form: name, WhatsApp, segment, track, time, consent. Inline validation." },
  { id: 6, title: "Submit", what: "Form submits to Google Apps Script → Google Sheet row + confirmation email." },
  { id: 7, title: "Confirmation", what: "Success screen confirms booking and next steps." },
  { id: 8, title: "Follow-up", what: "WhatsApp follow-up for course leads (planned)." },
];

export function LeadStepper() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {LEAD_STEPS.map((step) => {
        const isActive = expanded === step.id;
        return (
          <div key={step.id} className="group cursor-pointer" onClick={() => setExpanded(isActive ? null : step.id)}>
            <div className="flex items-start justify-between gap-3 p-4 rounded-[12px] border border-line bg-surface hover:bg-surface/50 transition-colors">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors",
                    isActive ? "bg-edu-primary text-white" : "bg-surface text-muted border border-line",
                  )}
                >
                  {step.id}
                </span>
                <h4 className="font-bold text-ink text-sm">{step.title}</h4>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("transition-transform", isActive && "rotate-180")}
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
            {isActive && (
              <div className="px-4 pb-4 pt-2 text-sm text-muted leading-relaxed border-t border-line/50">
                {step.what}
                {step.id === 5 && (
                  <div className="mt-3 p-3 rounded-[8px] border border-line bg-surface/50">
                    <p className="text-xs font-semibold text-muted mb-1 uppercase tracking-wider">Form fields</p>
                    <ul className="text-xs text-ink space-y-1 list-disc pl-4">
                      <li>Name</li>
                      <li>WhatsApp</li>
                      <li>Segment</li>
                      <li>Track</li>
                      <li>Time</li>
                      <li>Consent</li>
                    </ul>
                    <p className="text-xs text-muted mt-2">→ Google Apps Script → Google Sheet row + confirmation email</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
