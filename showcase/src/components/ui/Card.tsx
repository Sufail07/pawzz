"use client";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>({
  props,
  ref,
}) => {
  const { asChild, className, ...cardProps } = props;
  const CompoundComponent = asChild ? React.forwardRef((props, ref) => {
    return <div ref={React.merge(ref, props.ref)} {...props} />;
  }) : "div";

  return (
    <CompoundComponent
      className={cn(
        "rounded-lg border border-border p-6",
        "shadow-sm",
        className
      )}
      {...cardProps}
    />
  );
});

Card.displayName = "Card";