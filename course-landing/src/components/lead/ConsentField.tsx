import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

export function ConsentField({
  idPrefix,
  checked,
  onChange,
  error,
}: {
  idPrefix: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 rounded-input border border-edu-border bg-edu-surface/70 p-3 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-[#3b3fd9]"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${idPrefix}-consent-error` : undefined}
        />
        <span className="text-edu-muted">
          I agree to be contacted about this programme.
        </span>
      </label>
      <p className="mt-1.5 pl-1 text-xs text-edu-muted">
        Read the{" "}
        <Link
          to="/privacy"
          className={cn(
            "font-semibold text-edu-primary underline underline-offset-2",
          )}
        >
          privacy note
        </Link>
        . We only use your details to reply about this programme.
      </p>
      {error && (
        <p
          id={`${idPrefix}-consent-error`}
          role="alert"
          className="mt-1 text-xs font-medium text-edu-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
