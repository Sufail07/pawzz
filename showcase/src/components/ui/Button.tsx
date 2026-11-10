"use client";

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>({
  props,
  ref,
}) => {
  const { asChild, className, ...buttonProps } = props;
  const CompoundComponent = asChild ? React.forwardRef((props, ref) => {
    return <button ref={React.merge(ref, props.ref)} {...props} />;
  }) : "button";

  return (
    <CompoundComponent
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none gap-2",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "active:bg-primary/80",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...buttonProps}
    />
  );
});

Button.displayName = "Button";