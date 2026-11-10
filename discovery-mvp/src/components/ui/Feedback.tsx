import { cn } from "../../lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-2xl bg-pfa-border/60", className)}
    />
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span
      role="status"
      className="inline-flex items-center gap-2 text-sm text-pfa-muted"
    >
      <span className="size-4 animate-spin rounded-full border-2 border-pfa-muted border-t-transparent" />
      {label}
    </span>
  );
}
