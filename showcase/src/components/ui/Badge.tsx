"use client";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive";
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>({
  props,
  ref,
}) => {
  const { variant = "default", className, asChild, ...badgeProps } = props;
  const CompoundComponent = asChild ? React.forwardRef((props, ref) => {
    return <span ref={React.merge(ref, props.ref)} {...props} />;
  }) : "span";

  return (
    <CompoundComponent
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        "transition-colors",
        {
          default: "bg-primary/10 text-primary",
          secondary: "bg-secondary/10 text-secondary",
          destructive: "bg-destructive/10 text-destructive",
        }[variant],
        className
      )}
      {...badgeProps}
    />
  );
});

Badge.displayName = "Badge";