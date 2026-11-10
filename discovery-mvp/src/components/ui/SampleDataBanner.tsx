import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "../../lib/cn";

export function SampleDataBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 border-b border-[#eadcc0] bg-[#fff4de] px-4 py-2 text-center text-xs font-medium text-[#7a5514]",
        className,
      )}
    >
      <Info className="size-3.5 shrink-0" aria-hidden />
      <span>
        Demo prototype — all providers, reviews and figures are fictional sample
        data.
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-wrap items-end justify-between gap-3",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-pfa-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold text-pfa-ink sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-pfa-muted sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
