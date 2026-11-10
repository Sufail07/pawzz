import { cn } from "@/components/ui/utils";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  theme?: "bg" | "pfa-surface" | "edu-surface" | "ink";
  className?: string;
}

export function Section({ children, id, theme = "bg", className }: SectionProps) {
  const bgClass =
    theme === "pfa-surface"
      ? "bg-pfa-surface"
      : theme === "edu-surface"
        ? "bg-edu-surface"
        : theme === "ink"
          ? "bg-ink text-surface"
          : "bg-bg";

  return (
    <section
      id={id}
      className={cn(
        "relative py-20 md:py-32 px-4 md:px-8 min-h-[60vh] flex flex-col justify-center",
        bgClass,
        className,
      )}
    >
      {children}
    </section>
  );
}
