import {
  BadgeCheck,
  CalendarCheck,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { VERIFICATION_EXPLAINER } from "../../data/types";
import { SectionHeading } from "../../components/ui/SampleDataBanner";
import { Badge, VerificationBadge } from "../../components/ui/Badge";
import { useDataSource } from "../../data/DataSourceContext";

const steps = [
  {
    icon: Search,
    title: "Search what you need",
    body: "Tell us the service and area, or start from a category or an emergency shortcut.",
  },
  {
    icon: CalendarCheck,
    title: "Compare trust signals",
    body: "Check open status, distance, species treated, verification level and last-checked date.",
  },
  {
    icon: MessageCircle,
    title: "Call or message directly",
    body: "One tap to call, WhatsApp or open directions. No account needed to get help.",
  },
];

const statuses = [
  "visited",
  "phone-verified",
  "unverified",
] as const;

export function HowItWorks() {
  const { mode } = useDataSource();
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-pfa-border bg-pfa-card">
      <div className="container-page py-10 sm:py-14">
        <SectionHeading
          eyebrow="How it works"
          title="Less guessing, more clarity"
          description={
          mode === "osm"
            ? "Pawzz reads real listings from OpenStreetMap, shows where the data came from, and never invents contact details."
            : "Pawzz is a directory with trust signals, not a booking platform. That keeps it useful on day one."
        }
        />

        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, index) => (
            <li
              key={title}
              className="rounded-card border border-pfa-border bg-pfa-surface/60 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-pfa-primary text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold">
                {index === 1 && mode === "osm" ? "Check the source" : title}
              </h3>
              <p className="mt-1.5 text-sm text-pfa-muted">
                {index === 1 && mode === "osm"
                  ? "Look at the OSM badge, the last-edited date and whether a phone or opening hours were actually listed."
                  : body}
              </p>
            </li>
          ))}
        </ol>

        <div
          id="trust"
          className="mt-10 scroll-mt-24 rounded-card border border-pfa-border bg-pfa-surface p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <ShieldCheck className="size-5 text-pfa-primary" aria-hidden />
                {mode === "osm" ? "What OpenStreetMap data means" : "What “Verified” means"}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-pfa-muted">
                {mode === "osm"
                  ? "These are real community-mapped listings, not Pawzz-verified providers. Every card shows the OSM source and last-edited date. Contact details and hours are often missing, so confirm before visiting."
                  : "Directories start with imperfect data. Every listing carries a visible verification level and a last-checked date so you know what was confirmed — and when."}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-pfa-surface-alt px-3 py-1.5 text-xs font-semibold text-pfa-muted">
              <CalendarCheck className="size-4" aria-hidden />
              {mode === "osm" ? "Edit dates from OSM" : "Re-checked on a rolling schedule"}
            </span>
          </div>

          {mode === "osm" ? (
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              <li className="rounded-xl border border-pfa-border bg-pfa-card p-4">
                <Badge tone="outline">OSM</Badge>
                <p className="mt-2 text-sm text-pfa-muted">
                  Real listing from OpenStreetMap. No Pawzz verification has been
                  performed.
                </p>
              </li>
              <li className="rounded-xl border border-pfa-border bg-pfa-card p-4">
                <Badge tone="neutral">Phone not listed</Badge>
                <p className="mt-2 text-sm text-pfa-muted">
                  Many OSM listings have no phone number. Use directions or the OSM
                  link instead.
                </p>
              </li>
              <li className="rounded-xl border border-pfa-border bg-pfa-card p-4">
                <Badge tone="neutral">Hours unknown</Badge>
                <p className="mt-2 text-sm text-pfa-muted">
                  Hours appear only when the OSM tag exists and can be read.
                </p>
              </li>
            </ul>
          ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {statuses.map((status) => (
              <li
                key={status}
                className="rounded-xl border border-pfa-border bg-pfa-card p-4"
              >
                <VerificationBadge status={status} />
                <p className="mt-2 text-sm text-pfa-muted">
                  {VERIFICATION_EXPLAINER[status].description}
                </p>
              </li>
            ))}
          </ul>
          )}

          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-pfa-muted">
            <BadgeCheck className="size-4 text-pfa-success" aria-hidden />
            {mode === "osm"
              ? "Switch to the sample demo to see the full Pawzz verification model."
              : "Sample listing “Cochin Pet Hospital” was last checked on 2 Oct 2026."}
          </p>
        </div>
      </div>
    </section>
  );
}
