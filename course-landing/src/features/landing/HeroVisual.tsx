import { CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
import type { Track } from "../../content/course";
import { trackProjects } from "../../content/extra";

export function HeroVisual({ track }: { track: Track }) {
  const project = trackProjects[track.id];

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-edu-highlight/25 blur-2xl" />
      <div className="relative rounded-card border border-edu-border bg-white p-3.5 shadow-lift sm:p-4">
        <div className="flex items-center gap-1.5 px-1 pb-3">
          <span className="size-2.5 rounded-full bg-[#ffb3b3]" />
          <span className="size-2.5 rounded-full bg-edu-highlight" />
          <span className="size-2.5 rounded-full bg-edu-border" />
          <span className="ml-2 rounded-pill bg-edu-surface px-2.5 py-1 text-[10px] font-semibold text-edu-muted">
            lumen.academy / cohort
          </span>
        </div>

        <div className="rounded-input bg-edu-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-edu-muted">
                Your cohort
              </p>
              <p className="mt-1 text-base font-extrabold text-edu-ink">
                {track.name}
              </p>
            </div>
            <span className="rounded-pill bg-edu-ink px-2.5 py-1 text-[10px] font-bold text-white">
              Week 03
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-edu-muted">
              <span>Project sprint</span>
              <span>3 of 4 milestones</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-pill bg-edu-border">
              <div className="h-full w-3/4 rounded-pill bg-edu-primary" />
            </div>
          </div>

          <div className="mt-4 rounded-input border border-edu-border bg-white p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-edu-primary" aria-hidden />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-edu-muted">
                  This week's build
                </p>
                <p className="mt-0.5 text-sm font-bold text-edu-ink">
                  {project}
                </p>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {["Prompt", "Review", "Ship"].map((label) => (
                <span
                  key={label}
                  className="rounded-pill bg-edu-surface-alt px-2 py-0.5 text-[10px] font-semibold text-edu-muted"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-input bg-white p-3">
              <p className="text-lg font-extrabold leading-none text-edu-ink">2</p>
              <p className="mt-1 text-[10px] font-semibold text-edu-muted">
                live sessions left
              </p>
            </div>
            <div className="rounded-input bg-white p-3">
              <p className="text-lg font-extrabold leading-none text-edu-ink">1</p>
              <p className="mt-1 text-[10px] font-semibold text-edu-muted">
                mentor review
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-3 hidden items-center gap-2 rounded-card border border-edu-border bg-white px-3.5 py-2.5 shadow-lift sm:flex">
        <CheckCircle2 className="size-5 text-edu-success" aria-hidden />
        <div>
          <p className="text-xs font-bold text-edu-ink">Project shipped</p>
          <p className="text-[10px] font-semibold text-edu-muted">
            feedback in 48 hours
          </p>
        </div>
      </div>

      <div className="absolute -right-2 -top-4 hidden items-center gap-2 rounded-card bg-edu-highlight px-3.5 py-2.5 shadow-card sm:flex">
        <PlayCircle className="size-5 text-edu-ink" aria-hidden />
        <p className="text-xs font-extrabold text-edu-ink">Build first, theory second</p>
      </div>
    </div>
  );
}
