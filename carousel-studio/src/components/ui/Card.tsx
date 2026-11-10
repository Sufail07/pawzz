import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-[20px] border border-studio-border bg-studio-card shadow-[0_1px_2px_rgb(29_43_42/0.04),0_8px_24px_rgb(29_43_42/0.05)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
