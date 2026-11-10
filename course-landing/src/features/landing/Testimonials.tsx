import { Quote } from "lucide-react";
import { testimonials } from "../../content/course";
import { Card } from "../../components/ui/Badge";
import { Placeholder } from "../../components/ui/Placeholder";
import { Reveal } from "../../components/ui/Reveal";
import { Section } from "../../components/ui/Section";

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      tone="alt"
      eyebrow="Testimonials"
      title="No invented social proof"
      lead="This section stays deliberately empty until real learners finish a cohort. Every card below is a visible placeholder."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.name} delay={index * 70} className="h-full">
            <Card className="flex h-full flex-col border-dashed p-5">
              <div className="flex items-center justify-between gap-2">
                <Quote className="size-6 text-edu-border" aria-hidden />
                <Placeholder />
              </div>
              <blockquote className="mt-3 flex-1 text-sm italic leading-relaxed text-edu-muted">
                {testimonial.quote}
              </blockquote>
              <footer className="mt-4 border-t border-edu-border pt-3">
                <p className="text-sm font-semibold text-edu-ink">
                  {testimonial.name}
                </p>
                <p className="text-xs text-edu-muted">{testimonial.track}</p>
              </footer>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
