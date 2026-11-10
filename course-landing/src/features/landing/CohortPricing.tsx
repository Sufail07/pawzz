import { CalendarDays, Check, Info, Users } from "lucide-react";
import { getTrack } from "../../content/course";
import { useLead } from "../../components/lead/LeadContext";
import { Badge, Card } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Placeholder } from "../../components/ui/Placeholder";
import { Section } from "../../components/ui/Section";

const reassurance = [
  "Free intro session before any payment",
  "Live sessions with a mentor, not recorded lectures",
  "A finished project and a written case study",
  "WhatsApp support between sessions",
];

export function CohortPricing() {
  const { track, openIntro } = useLead();
  const selected = getTrack(track);

  return (
    <Section
      id="pricing"
      eyebrow="Cohort dates and pricing"
      title="Start with a conversation, not a payment"
      lead="Dates, seat counts and the price band are placeholders until the founder confirms them. The free intro call is how you decide whether the programme is worth it."
    >
      <Card className="grid gap-0 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-5 sm:p-7">
          <h3 className="text-xl font-extrabold tracking-tight text-edu-ink">
            Next {selected.name} cohort
          </h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-edu-primary" aria-hidden />
              <div>
                <p className="font-semibold text-edu-ink">Start date</p>
                <p className="flex flex-wrap items-center gap-2 text-edu-muted">
                  Date to be confirmed <Placeholder />
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 size-4 shrink-0 text-edu-primary" aria-hidden />
              <div>
                <p className="font-semibold text-edu-ink">Cohort size</p>
                <p className="flex flex-wrap items-center gap-2 text-edu-muted">
                  12–16 learners, live online <Placeholder />
                </p>
              </div>
            </div>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-edu-ink-soft">
            {reassurance.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-edu-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start gap-2 rounded-input bg-edu-surface p-3 text-xs leading-relaxed text-edu-muted">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            Programme names, durations and prices are illustrative in this
            prototype and need confirmation before launch.
          </p>
        </div>

        <div className="bg-edu-ink p-5 text-white sm:p-7">
          <Badge tone="highlight">Price band</Badge>
          <p className="mt-4 text-sm font-semibold text-white/70">
            {selected.name}
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight">
            To be confirmed
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            The founder shares the current cohort fee on the intro call, before
            you commit to anything.
          </p>
          <Button
            variant="highlight"
            size="lg"
            className="mt-5 w-full"
            onClick={() => openIntro(track)}
          >
            Book a free intro session
          </Button>
          <p className="mt-2 text-center text-xs text-white/60">
            No payment and no obligation.
          </p>
        </div>
      </Card>
    </Section>
  );
}
