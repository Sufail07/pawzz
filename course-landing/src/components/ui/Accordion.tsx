import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

interface AccordionItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}

export function AccordionItem({
  question,
  answer,
  open,
  onToggle,
  id,
}: AccordionItemProps) {
  return (
    <div className="border-b border-edu-border last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-edu-ink hover:text-edu-primary"
        >
          {question}
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-edu-muted transition-transform duration-200",
              open && "rotate-180 text-edu-primary",
            )}
            aria-hidden
          />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        hidden={!open}
        className="pb-5 text-sm leading-relaxed text-edu-muted"
      >
        {answer}
      </div>
    </div>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="rounded-card border border-edu-border bg-white px-5 sm:px-6">{children}</div>;
}
