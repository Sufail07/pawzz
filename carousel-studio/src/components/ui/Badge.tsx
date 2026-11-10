import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BadgeTone = "neutral" | "primary" | "accent" | "success" | "error" | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-studio-surface-alt text-studio-muted border-studio-border",
  primary: "bg-studio-primary-soft text-studio-primary-dark border-[#c5e0da]",
  accent: "bg-studio-accent-soft text-[#8a5a10] border-[#f2d8ac]",
  success: "bg-studio-success-soft text-[#1f6b43] border-[#c8e5d3]",
  error: "bg-studio-error-soft text-studio-error border-[#f0c9cc]",
  info: "bg-studio-info-soft text-studio-info border-[#cdd4f5]",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
