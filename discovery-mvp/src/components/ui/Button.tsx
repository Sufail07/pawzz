import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "ghost"
  | "emergency";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 tap-target whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-pfa-primary text-white hover:bg-pfa-primary-dark active:bg-pfa-primary-dark",
  accent:
    "bg-pfa-accent text-pfa-ink hover:bg-pfa-accent-dark active:bg-pfa-accent-dark",
  secondary:
    "border-2 border-pfa-primary bg-transparent text-pfa-primary hover:bg-[#e8f1ef]",
  ghost: "bg-transparent text-pfa-ink hover:bg-pfa-surface-alt",
  emergency:
    "bg-pfa-emergency text-white hover:bg-pfa-emergency-dark active:bg-pfa-emergency-dark",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-6 text-lg",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, size, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
