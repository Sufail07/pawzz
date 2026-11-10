import { getTrack } from "../../content/course";
import { useLead } from "../../components/lead/LeadContext";
import { Card } from "../../components/ui/Badge";
import { Reveal } from "../../components/ui/Reveal";
import { Section } from "../../components/ui/Section";

export function Outcomes() {
  const { track } = useLead();
  const selected = getTrack(track);

  return (
    <Section
      id="outcomes"
      tone="alt"
      eyebrow="Outcomes"
      title={`What you'll be able to do on ${selected.name}`}
      lead="Every outcome is a skill you can show, not a topic you watched. The structure stays the same across tracks; the work changes."
    >
      <p role="status" aria-live="polite" className="sr-only">
        {selected.name} selected. Outcomes updated.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {selected.outcomes.map((outcome, index) => (
          <Reveal key={outcome.title} delay={index * 60} className="h-full">
            <Card className="flex h-full flex-col p-5">
              <span className="text-2xl font-extrabold tracking-tight text-edu-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-bold text-edu-ink">
                {outcome.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-edu-muted">
                {outcome.detail}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-sm text-edu-muted">
        Not sure which track fits? The intro call is there to help you choose,
        not to sell.
      </p>
    </Section>
  );
}
