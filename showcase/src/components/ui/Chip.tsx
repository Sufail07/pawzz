"use client";

import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "filled";
  asChild?: boolean;
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>({
  props,
  ref,
}) => {
  const { variant = "default", className, asChild, ...chipProps } = props;
  const CompoundComponent = asChild ? React.forwardRef((props, ref) => {
    return <span ref={React.merge(ref, props.ref)} {...props} />;
  }) : "span";

  return (
    <CompoundComponent
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        {
          default: "bg-primary/20 text-primary hover:bg-primary/30",
          outline: "border border-primary text-primary hover:bg-primary/10",
          filled: "bg-primary text-primary-foreground",
        }[variant],
        className
      )}
      {...chipProps}
    />
  );
});

Chip.displayName = "Chip";