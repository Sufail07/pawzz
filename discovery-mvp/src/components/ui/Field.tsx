import { useId } from "react";
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
      <label htmlFor={htmlFor} className="text-sm font-semibold text-pfa-ink">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-pfa-muted">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-pfa-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-pfa-emergency">
          {error}
        </p>
      )}
    </div>
  );
}

const controlClass =
  "min-h-11 w-full rounded-input border border-pfa-border bg-pfa-card px-3.5 py-2.5 text-base text-pfa-ink placeholder:text-pfa-muted/70 transition-colors hover:border-pfa-muted/50 focus:border-pfa-primary focus:outline-none disabled:opacity-50";

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
        className={cn(controlClass, error && "border-pfa-emergency")}
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
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(controlClass, "appearance-none", error && "border-pfa-emergency")}
        {...rest}
      >
        {children}
      </select>
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
        className={cn(controlClass, "min-h-28 resize-y", error && "border-pfa-emergency")}
        {...rest}
      />
    </FieldShell>
  );
}
