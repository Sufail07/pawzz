import { useId } from "react";
import { ChevronDown } from "lucide-react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";

interface FieldShellProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  hint,
  error,
  optional,
  children,
}: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-edu-ink">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-edu-muted">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-edu-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-xs font-medium text-edu-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const controlClass =
  "min-h-11 w-full rounded-input border border-edu-border bg-white px-3.5 py-2.5 text-base text-edu-ink placeholder:text-edu-muted/70 transition-colors hover:border-edu-muted/50 focus:border-edu-primary focus:outline-none disabled:opacity-50";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function Input({ label, hint, error, optional, ...rest }: InputProps) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      optional={optional}
    >
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(controlClass, error && "border-edu-error")}
        {...rest}
      />
    </FieldShell>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export function Select({
  label,
  hint,
  error,
  optional,
  children,
  ...rest
}: SelectProps) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      optional={optional}
    >
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={cn(
            controlClass,
            "appearance-none pr-9",
            error && "border-edu-error",
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-edu-muted"
          aria-hidden
        />
      </div>
    </FieldShell>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function Textarea({
  label,
  hint,
  error,
  optional,
  ...rest
}: TextareaProps) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      optional={optional}
    >
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(
          controlClass,
          "min-h-28 resize-y",
          error && "border-edu-error",
        )}
        {...rest}
      />
    </FieldShell>
  );
}
