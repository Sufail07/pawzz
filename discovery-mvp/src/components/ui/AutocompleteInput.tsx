import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/cn";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  ariaLabel: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

export function AutocompleteInput({
  value,
  onChange,
  suggestions,
  ariaLabel,
  placeholder,
  icon,
  className,
  inputClassName,
}: AutocompleteInputProps) {
  const id = useId();
  const listId = `${id}-list`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase();
    const pool = query
      ? suggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(query),
        )
      : suggestions;
    return pool.slice(0, 8);
  }, [value, suggestions]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(-1);
  }, [filtered.length, activeIndex]);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        filtered.length === 0 ? -1 : (index + 1) % filtered.length,
      );
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        filtered.length === 0
          ? -1
          : index <= 0
            ? filtered.length - 1
            : index - 1,
      );
      return;
    }
    if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault();
      choose(filtered[activeIndex]);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showList = open && filtered.length > 0;

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-pfa-muted">
          {icon}
        </span>
      )}
      <input
        type="text"
        role="combobox"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={cn(
          "min-h-11 w-full rounded-input border border-pfa-border bg-pfa-surface/60 py-2.5 pr-3 text-base text-pfa-ink placeholder:text-pfa-muted/80 focus:border-pfa-primary focus:bg-pfa-card focus:outline-none",
          icon ? "pl-9" : "pl-3",
          inputClassName,
        )}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label={`${ariaLabel} suggestions`}
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-pfa-border bg-pfa-card py-1 shadow-lift"
          onMouseDown={(event) => event.preventDefault()}
        >
          {filtered.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(suggestion)}
              className={cn(
                "cursor-pointer px-3 py-2.5 text-sm",
                index === activeIndex
                  ? "bg-[#e6f0ef] font-semibold text-pfa-primary-dark"
                  : "text-pfa-ink hover:bg-pfa-surface",
              )}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
