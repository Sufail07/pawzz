import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type BadgeTone = "primary" | "highlight" | "neutral" | "outline" | "success";

const tones: Record<BadgeTone, string> = {
  primary: "bg-edu-primary-soft text-edu-primary-dark",
  highlight: "bg-edu-highlight text-edu-ink",
  neutral: "bg-edu-surface-alt text-edu-muted",
  outline: "border border-edu-border bg-white text-edu-muted",
  success: "bg-[#e6f3ec] text-[#1f6b41]",
};

interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-card border border-edu-border bg-edu-card shadow-card",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
