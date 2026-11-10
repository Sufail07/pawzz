import { Check } from "lucide-react";
import { getTrack } from "../../content/course";
import { useLead } from "../../components/lead/LeadContext";
import { IntroLeadForm } from "../../components/lead/IntroLeadForm";
import { Card } from "../../components/ui/Badge";

export function FinalCta() {
  const { track } = useLead();
  const selected = getTrack(track);

  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-title"
      className="scroll-mt-24 bg-edu-ink py-14 text-white sm:py-20"
    >
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:gap-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-edu-highlight">
            Start here
          </p>
          <h2
            id="final-cta-title"
            className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Learn AI by building real things.
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            Practical AI and digital-skills programmes for students and young
            professionals. Live cohorts, real projects, no coding background
            needed.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-white/85">
            {selected.outcomes.slice(0, 3).map((outcome) => (
              <li key={outcome.title} className="flex items-start gap-2">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-edu-highlight"
                  aria-hidden
                />
                {outcome.title}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-white/60">
            Currently showing the{" "}
            <span className="font-semibold text-white">{selected.name}</span>{" "}
            track. Four fields, one free intro call.
          </p>

        </div>

        <Card className="p-5 text-edu-ink sm:p-6">
          <h3 className="text-lg font-extrabold tracking-tight">
            Book a free intro session
          </h3>
          <p className="mt-1 text-sm text-edu-muted">
            We reply on WhatsApp within a few hours during working hours.
          </p>
          <IntroLeadForm
            key={track}
            initialTrack={track}
            idPrefix="final"
            className="mt-5"
          />
        </Card>
      </div>
    </section>
  );
}
