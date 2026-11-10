import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-studio-primary text-white shadow-sm hover:bg-studio-primary-dark active:translate-y-px",
  secondary:
    "border border-studio-border bg-studio-card text-studio-ink hover:border-studio-border-strong hover:bg-studio-surface-alt",
  ghost: "text-studio-ink hover:bg-studio-surface-alt",
  accent:
    "bg-studio-accent text-studio-ink shadow-sm hover:brightness-95 active:translate-y-px",
  danger: "bg-studio-error text-white hover:brightness-95",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-10 gap-2 px-3.5 text-sm",
  md: "min-h-11 gap-2 px-5 text-sm",
  lg: "min-h-12 gap-2.5 px-6 text-base",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
