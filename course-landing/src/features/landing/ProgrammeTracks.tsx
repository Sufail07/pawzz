import { ArrowRight, Check, Clock, Users } from "lucide-react";
import { tracks } from "../../content/course";
import { useLead } from "../../components/lead/LeadContext";
import { Badge, Card } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Placeholder } from "../../components/ui/Placeholder";
import { Reveal } from "../../components/ui/Reveal";
import { Section } from "../../components/ui/Section";
import { cn } from "../../lib/cn";

export function ProgrammeTracks() {
  const { track, openIntro } = useLead();

  return (
    <Section
      id="programmes"
      eyebrow="Programme tracks"
      title="Pick the track that matches where you are"
      lead="Three tracks, one method: live sessions, a real project every week, and mentor feedback. Names, durations and formats are illustrative until the founder confirms them."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {tracks.map((item, index) => {
          const selected = item.id === track;
          return (
            <Reveal key={item.id} delay={index * 70} className="h-full">
              <Card
                className={cn(
                  "flex h-full flex-col p-5 sm:p-6",
                  selected && "ring-2 ring-edu-primary ring-offset-2 ring-offset-edu-surface",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <Badge tone="primary">{item.audience}</Badge>
                  {selected ? (
                    <Badge tone="highlight">Your pick</Badge>
                  ) : (
                    <Placeholder />
                  )}
                </div>
                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-edu-ink">
                  {item.name}
                </h3>

                <dl className="mt-4 space-y-2 text-sm text-edu-muted">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 shrink-0" aria-hidden />
                    <dt className="sr-only">Duration</dt>
                    <dd className="flex items-center gap-1.5">
                      {item.duration}
                      <Placeholder />
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 shrink-0" aria-hidden />
                    <dt className="sr-only">Format</dt>
                    <dd>{item.format}</dd>
                  </div>
                </dl>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-edu-muted">
                  Key projects
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-edu-ink-soft">
                  {item.projects.map((project) => (
                    <li key={project} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-edu-success"
                        aria-hidden
                      />
                      {project}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Button
                    variant={selected ? "primary" : "secondary"}
                    className="w-full"
                    onClick={() => openIntro(item.id)}
                  >
                    Talk to us about this track
                    <ArrowRight className="size-4" aria-hidden />
                  </Button>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
