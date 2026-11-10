import type { ReactNode } from "react";

interface Step {
  key: string;
  label: string;
  description: string;
  status?: "current" | "done" | "todo" | "upcoming";
  icon: ReactNode;
}

interface WorkflowDiagramProps {
  steps: Step[];
  heading: string;
  intro: string;
  demoMode?: boolean;
  className?: string;
}

export function WorkflowDiagram({
  steps,
  heading,
  intro,
  demoMode = false,
  className,
}: WorkflowDiagramProps) {
  return (
    <section className={className} aria-labelledby="workflow-heading">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex flex-col gap-4 min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-studio-primary text-white shadow-sm">
              <svg
                aria-hidden
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l2.5 2.5" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2
                id="workflow-heading"
                className="font-display text-2xl font-bold text-studio-ink"
              >
                {heading}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-studio-muted">
                {intro}
              </p>
            </div>
          </div>

          <ol className="flex flex-col gap-4">
            {steps.map((step, index) => (
              <li key={step.key} className="relative flex gap-4 pb-4 last:pb-0">
                <div className="flex flex-col items-center gap-3 min-w-[72px]">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-2xl text-sm font-bold shadow-sm ${
                      step.status === "current"
                        ? "bg-studio-primary text-white ring-2 ring-studio-primary/30"
                        : step.status === "done"
                          ? "bg-studio-success-soft text-studio-success"
                          : step.status === "upcoming"
                            ? "bg-studio-surface-alt text-studio-muted"
                            : "bg-studio-card text-studio-muted border border-studio-border"
                    }`}
                  >
                    {step.icon}
                  </span>
                  {index < steps.length - 1 ? (
                    <span
                      aria-hidden
                      className="w-px h-full min-h-[48px] bg-studio-border"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-display text-xl font-bold text-studio-ink">
                      {step.label}
                    </h3>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        step.status === "current"
                          ? "text-studio-primary"
                          : step.status === "done"
                            ? "text-studio-success"
                            : "text-studio-muted"
                      }`}
                    >
                      {step.status === "current"
                        ? "Now"
                        : step.status === "done"
                          ? "Done"
                          : step.status === "upcoming"
                            ? "Future step"
                            : "Start here"}
                    </span>
                  </div>
                  <p
                    className="mt-1 text-sm leading-relaxed text-studio-muted"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="w-full max-w-xl flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-studio-muted">
            {demoMode ? (
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-studio-accent-soft text-[#8a5a10] border border-[#f2d8ac]">
                <svg
                  aria-hidden
                  fill="none"
                  viewBox="0 0 16 16"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2v4M8 10v4M2 8h4M10 8h4" />
                </svg>
              </span>
            ) : (
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-studio-primary-soft text-studio-primary-dark">
                <svg
                  aria-hidden
                  fill="none"
                  viewBox="0 0 16 16"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="8" r="5" />
                </svg>
              </span>
            )}
            {demoMode ? "Demo mode" : "Live preview"}
          </div>
          <div className="mt-3 flex flex-col gap-4 rounded-[20px] border border-studio-border bg-studio-card p-4">
            {steps.map((step) => (
              <div
                key={step.key}
                className="flex items-start gap-3 rounded-xl border border-studio-border/70 p-3"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    step.status === "current"
                      ? "bg-studio-primary text-white"
                      : step.status === "done"
                        ? "bg-studio-success-soft text-studio-success"
                        : "bg-studio-surface-alt text-studio-muted"
                  }`}
                >
                  {step.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-studio-ink">
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-studio-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
