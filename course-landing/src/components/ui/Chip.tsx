import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ selected = false, className, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex tap-target items-center gap-1.5 rounded-pill border px-3.5 py-2 text-sm font-medium transition-colors",
        selected
          ? "border-edu-primary bg-edu-primary text-white"
          : "border-edu-border bg-white text-edu-ink hover:border-edu-primary hover:text-edu-primary",
        className,
      )}
      {...rest}
    />
  );
}
