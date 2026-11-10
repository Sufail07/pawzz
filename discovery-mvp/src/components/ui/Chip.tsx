import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Chip({
  selected = false,
  icon,
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex tap-target items-center gap-1.5 rounded-pill border px-3.5 py-2 text-sm font-medium transition-colors",
        selected
          ? "border-pfa-primary bg-pfa-primary text-white"
          : "border-pfa-border bg-pfa-card text-pfa-ink hover:border-pfa-primary hover:text-pfa-primary",
        className,
      )}
      {...rest}
    >
      {selected ? <Check className="size-4 shrink-0" aria-hidden /> : icon}
      {children}
    </button>
  );
}

interface TagProps {
  children: ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill bg-pfa-surface-alt px-2.5 py-1 text-xs font-semibold text-pfa-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
