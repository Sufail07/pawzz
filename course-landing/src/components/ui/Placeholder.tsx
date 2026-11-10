import { cn } from "../../lib/cn";

export function Placeholder({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border border-dashed border-edu-muted/50 bg-edu-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-edu-muted",
        className,
      )}
    >
      Placeholder
    </span>
  );
}
