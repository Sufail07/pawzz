import { Link } from "react-router-dom";
import { ArrowRight, Building2, CircleCheck } from "lucide-react";
import { buttonStyles } from "../../components/ui/Button";

const benefits = [
  "Claim an existing listing and keep details accurate",
  "Add services, hours, species and contact channels",
  "Reach pet owners at the moment they are searching",
];

export function ProviderCta() {
  return (
    <section className="container-page py-10 sm:py-14">
      <div className="overflow-hidden rounded-card bg-pfa-primary text-white">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-pill bg-white/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em]">
              <Building2 className="size-4" aria-hidden />
              For providers and NGOs
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              Is your clinic, shelter or ambulance service listed?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
              Add your business or claim an existing listing. Tell us what you
              offer and we will review it before it goes live.
            </p>
            <ul className="mt-4 space-y-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm">
                  <CircleCheck
                    className="mt-0.5 size-4 shrink-0 text-pfa-accent"
                    aria-hidden
                  />
                  {benefit}
                </li>
              ))}
            </ul>
            <Link
              to="/list-business"
              className={`${buttonStyles("accent", "lg")} mt-6`}
            >
              List Your Business
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white">
              What happens next
            </p>
            <ol className="mt-3 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pfa-accent text-xs font-bold text-pfa-ink">
                  1
                </span>
                Submit basic business details and contact info.
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pfa-accent text-xs font-bold text-pfa-ink">
                  2
                </span>
                We verify by phone before publishing.
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pfa-accent text-xs font-bold text-pfa-ink">
                  3
                </span>
                Corrections and new listings enter a moderation queue.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
