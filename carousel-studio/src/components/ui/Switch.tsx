import { cn } from "../../lib/cn";

export function Switch({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  id?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl p-1 text-sm"
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition",
          checked
            ? "border-studio-primary bg-studio-primary"
            : "border-studio-border-strong bg-studio-surface-alt",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 rounded-full bg-white shadow transition",
            checked ? "left-[22px]" : "left-0.5",
          )}
          style={{ width: 18, height: 18 }}
        />
      </button>
      <span>
        <span className="block font-semibold text-studio-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-studio-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
