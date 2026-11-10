import { mentors } from "../../content/course";
import { Card } from "../../components/ui/Badge";
import { Placeholder } from "../../components/ui/Placeholder";
import { Reveal } from "../../components/ui/Reveal";
import { Section } from "../../components/ui/Section";

export function Mentors() {
  return (
    <Section
      id="mentors"
      tone="alt"
      eyebrow="Who teaches"
      title="Small cohorts, mentored personally"
      lead="Mentor names and bios are placeholders in this prototype. Real profiles will go here before launch."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {mentors.map((mentor, index) => (
          <Reveal key={mentor.name} delay={index * 70} className="h-full">
            <Card className="flex h-full gap-4 p-5 sm:p-6">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-edu-ink text-lg font-extrabold text-white">
                {mentor.initials}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-edu-ink">
                    {mentor.name}
                  </h3>
                  <Placeholder />
                </div>
                <p className="text-sm font-semibold text-edu-primary">
                  {mentor.role}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-edu-muted">
                  {mentor.bio}
                </p>
                <p className="mt-2 text-xs font-semibold text-edu-muted">
                  Focus: {mentor.focus}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
