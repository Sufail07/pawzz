import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "highlight"
  | "white"
  | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 tap-target whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-edu-primary text-white hover:bg-edu-primary-dark active:bg-edu-primary-dark",
  secondary:
    "border-2 border-edu-primary bg-transparent text-edu-primary hover:bg-edu-primary-soft",
  ghost: "bg-transparent text-edu-ink hover:bg-edu-surface-alt",
  highlight:
    "bg-edu-highlight text-edu-ink hover:bg-edu-highlight-dark active:bg-edu-highlight-dark",
  white: "bg-white text-edu-primary hover:bg-edu-primary-soft",
  whatsapp: "bg-edu-whatsapp text-white hover:bg-[#0a5c53]",
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
