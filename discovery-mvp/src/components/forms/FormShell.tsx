import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CircleCheck, NotebookPen } from "lucide-react";
import { buttonStyles } from "../../components/ui/Button";
import { Card } from "../../components/ui/Badge";

export function FormPageShell({
  title,
  intro,
  aside,
  children,
  backTo = "/",
  backLabel = "Back to home",
}: {
  title: string;
  intro: string;
  aside?: ReactNode;
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <div className="container-page py-8 sm:py-12">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-pfa-muted hover:text-pfa-primary"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        {backLabel}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h1 className="font-display text-3xl font-bold text-pfa-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-pfa-muted sm:text-base">
            {intro}
          </p>
          <Card className="mt-6 p-5 sm:p-6">{children}</Card>
        </div>
        {aside && <aside className="space-y-4">{aside}</aside>}
      </div>
    </div>
  );
}

export function FormSuccess({
  title,
  reference,
  delivered,
  children,
  backTo = "/",
}: {
  title: string;
  reference: string;
  delivered: boolean;
  children?: ReactNode;
  backTo?: string;
}) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e6f3ec] text-[#1f6b41]">
        <CircleCheck className="size-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-pfa-muted">
        Your reference is{" "}
        <span className="rounded bg-pfa-surface-alt px-1.5 py-0.5 font-mono font-bold text-pfa-ink">
          {reference}
        </span>
        . {delivered ? "It has been sent to our team." : "It is saved in this demo browser."}
      </p>
      {children}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link to={backTo} className={buttonStyles("primary")}>
          Back to search
        </Link>
        <Link to="/" className={buttonStyles("secondary")}>
          Homepage
        </Link>
      </div>
    </div>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-[#eadcc0] bg-[#fff8ea] p-3 text-xs text-[#7a5514]">
      <NotebookPen className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}

export function ConsentField({
  checked,
  onChange,
  error,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 rounded-xl border border-pfa-border bg-pfa-surface/60 p-3 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-[#0f6b63]"
          aria-invalid={error ? true : undefined}
        />
        <span className="text-pfa-muted">{children}</span>
      </label>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-pfa-emergency">
          {error}
        </p>
      )}
    </div>
  );
}
