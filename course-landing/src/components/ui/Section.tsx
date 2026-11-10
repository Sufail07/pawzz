import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
  tone = "light",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: "light" | "alt";
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn(
        "py-14 sm:py-20",
        tone === "alt" && "bg-white",
        className,
      )}
    >
      <div className="container-page">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-edu-primary">
              {eyebrow}
            </p>
          )}
          <h2
            id={id ? `${id}-title` : undefined}
            className="mt-2 text-3xl font-extrabold tracking-tight text-edu-ink sm:text-4xl"
          >
            {title}
          </h2>
          {lead && (
            <p className="mt-3 text-base leading-relaxed text-edu-muted sm:text-lg">
              {lead}
            </p>
          )}
        </div>
        <div className="mt-8 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
