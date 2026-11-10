import { Link } from "react-router-dom";
import { Flag, MailQuestion } from "lucide-react";
import { buttonStyles } from "../../components/ui/Button";

export function CorrectionStrip() {
  return (
    <section className="container-page pb-14">
      <div className="flex flex-col items-start justify-between gap-4 rounded-card border border-[#eadcc0] bg-[#fff8ea] p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fbe8c7] text-[#7a5514]">
            <MailQuestion className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-bold text-pfa-ink">
              Spotted wrong information?
            </h2>
            <p className="mt-1 max-w-xl text-sm text-pfa-muted">
              Report a wrong phone number, closed clinic or missing service. No
              account needed, and corrections go straight to our moderation
              queue.
            </p>
          </div>
        </div>
        <Link to="/correction" className={buttonStyles("secondary", "md")}>
          <Flag className="size-4" aria-hidden />
          Submit a Correction
        </Link>
      </div>
    </section>
  );
}
