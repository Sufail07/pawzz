import { useLayoutEffect, useRef } from "react";
import { cn } from "../../lib/cn";

interface EditableTextProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  label: string;
  multiline?: boolean;
}

export function EditableText({
  value,
  onChange,
  className,
  placeholder,
  label,
  multiline = false,
}: EditableTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (document.activeElement !== element && element.textContent !== value) {
      element.textContent = value;
    }
  }, [value]);

  if (!onChange) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span
      ref={ref}
      role="textbox"
      aria-label={label}
      aria-multiline={multiline}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-placeholder={placeholder}
      className={cn("block min-w-1", className)}
      style={multiline ? { whiteSpace: "pre-wrap" } : undefined}
      onBlur={(event) => {
        const raw = event.currentTarget.textContent ?? "";
        const next = multiline
          ? raw.replace(/\u00a0/g, " ").trim()
          : raw.replace(/\s+/g, " ").trim();
        if (next !== value) onChange(next);
        event.currentTarget.textContent = next;
      }}
      onKeyDown={(event) => {
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
        if (event.key === "Escape") {
          event.currentTarget.textContent = value;
          event.currentTarget.blur();
        }
      }}
      onPaste={(event) => {
        event.preventDefault();
        const text = event.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }}
    />
  );
}
