import { steps } from "../../content/course";
import { Reveal } from "../../components/ui/Reveal";
import { Section } from "../../components/ui/Section";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      tone="alt"
      eyebrow="How it works"
      title="Four steps, no surprises"
      lead="You always know what happens next. The intro call comes before any payment or commitment."
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="h-full">
            <Reveal delay={index * 70} className="h-full">
              <div className="relative flex h-full flex-col rounded-card border border-edu-border bg-edu-surface p-5">
                <span className="flex size-10 items-center justify-center rounded-pill bg-edu-highlight text-sm font-extrabold text-edu-ink">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-base font-bold text-edu-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-edu-muted">
                  {step.detail}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
