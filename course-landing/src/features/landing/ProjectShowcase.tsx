import { Wrench } from "lucide-react";
import { projects } from "../../content/course";
import { Badge, Card } from "../../components/ui/Badge";
import { Reveal } from "../../components/ui/Reveal";
import { Section } from "../../components/ui/Section";

export function ProjectShowcase() {
  return (
    <Section
      id="projects"
      eyebrow="Project showcase"
      title="Practice on a day at the office, not a textbook."
      lead="Three example projects, one from each track. These are illustrative samples, not student work."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.title} delay={index * 70} className="h-full">
            <Card className="flex h-full flex-col overflow-hidden">
              <div className="border-b border-edu-border bg-edu-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="outline">Sample project</Badge>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-edu-muted">
                    {project.track}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center gap-1 rounded-pill bg-white px-2 py-1 text-[11px] font-semibold text-edu-ink-soft"
                    >
                      <Wrench className="size-3" aria-hidden />
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-extrabold tracking-tight text-edu-ink">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-edu-muted">
                  {project.summary}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-edu-muted">
                  What you practise
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {project.practice.map((item) => (
                    <li
                      key={item}
                      className="rounded-pill bg-edu-primary-soft px-2.5 py-1 text-xs font-semibold text-edu-primary-dark"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
