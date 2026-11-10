import type { ReactNode } from "react";
import { CheckCircle2, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { site } from "../../content/site";
import { Badge } from "../ui/Badge";
import { buttonStyles } from "../ui/Button";

export function LeadSuccess({
  title,
  reference,
  delivered,
  children,
  onClose,
}: {
  title: string;
  reference: string;
  delivered: boolean;
  children?: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="py-2">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e6f3ec] text-edu-success">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-bold text-edu-ink">{title}</h3>
          <p className="mt-1 text-sm text-edu-muted">
            Reference{" "}
            <span className="rounded bg-edu-surface-alt px-1.5 py-0.5 font-mono text-xs font-bold text-edu-ink">
              {reference}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm text-edu-muted">{children}</div>

      {!delivered && (
        <p className="mt-4 rounded-input border border-[#e6dcc2] bg-[#fff8ea] p-3 text-xs text-[#7a5514]">
          No form endpoint is configured in this demo, so the details were saved
          in this browser only. With a Google Apps Script endpoint set, the same
          submission also lands in the lead sheet.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {onClose && (
          <button type="button" onClick={onClose} className={buttonStyles("primary")}>
            Done
          </button>
        )}
        <Link to="/privacy" className={buttonStyles("ghost", "md")}>
          What happens next
        </Link>
      </div>
    </div>
  );
}

export function SyllabusReady({
  reference,
  delivered,
  onClose,
}: {
  reference: string;
  delivered: boolean;
  onClose?: () => void;
}) {
  return (
    <LeadSuccess
      title="Your syllabus is ready"
      reference={reference}
      delivered={delivered}
      onClose={onClose}
    >
      <p>
        Your download should start automatically. If it does not, use the button
        below — the sample syllabus shows the weekly plan, projects and the tools
        each track uses.
      </p>
      <p>
        <Badge tone="highlight">Sample document</Badge>
      </p>
      <a
        href={site.syllabusPath}
        download="AI_Skills_Studio_Sample_Syllabus.pdf"
        className={buttonStyles("highlight")}
      >
        <Download className="size-4" aria-hidden />
        Download the syllabus (PDF)
      </a>
    </LeadSuccess>
  );
}
