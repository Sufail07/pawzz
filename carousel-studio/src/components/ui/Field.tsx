import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-studio-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-semibold text-studio-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-studio-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-[12px] border border-studio-border bg-studio-card px-3.5 py-2.5 text-sm text-studio-ink placeholder:text-studio-muted/60 focus:border-studio-primary focus:outline-none focus:ring-2 focus:ring-studio-primary/20";

export const textareaClass = cn(inputClass, "min-h-24 resize-y leading-relaxed");

export const selectClass = cn(inputClass, "appearance-none bg-[length:16px] pr-10");

export const monoClass = "font-mono text-xs";
