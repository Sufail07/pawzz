import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/cn";

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle className={cn("h-5 w-5 animate-spin", className)} aria-hidden />;
}

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-studio-border bg-studio-card p-5 text-sm text-studio-muted">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-dashed border-studio-border-strong bg-studio-card/70 px-6 py-14 text-center">
      {icon ? <div className="text-studio-primary">{icon}</div> : null}
      <div>
        <h3 className="text-lg font-bold text-studio-ink">{title}</h3>
        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-studio-muted">{body}</p>
      </div>
      {action}
    </div>
  );
}
