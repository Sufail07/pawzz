import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function StickyBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-pfa-border bg-pfa-card/95 p-3 backdrop-blur lg:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="container-page flex gap-2">{children}</div>
    </div>
  );
}
