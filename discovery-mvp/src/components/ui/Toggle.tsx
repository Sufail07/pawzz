import { cn } from "../../lib/cn";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  className?: string;
}

export function Toggle({
  label,
  checked,
  onChange,
  description,
  className,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex min-h-11 w-full items-center justify-between gap-3 rounded-input text-left",
        className,
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-pfa-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-pfa-muted">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-pfa-primary" : "bg-pfa-border",
        )}
      >
        <span
          className={cn(
            "absolute left-1 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}
