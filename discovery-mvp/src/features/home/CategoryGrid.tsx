import { Link } from "react-router-dom";
import {
  Ambulance,
  ArrowRight,
  FlaskConical,
  HeartHandshake,
  Hospital,
  PawPrint,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { ProviderType } from "../../data/types";
import { PROVIDER_TYPE_LABELS } from "../../data/types";
import { searchUrl } from "../../lib/search";
import { SectionHeading } from "../../components/ui/SampleDataBanner";
import { useDataSource } from "../../data/DataSourceContext";

const categories: Array<{
  type: ProviderType;
  icon: LucideIcon;
  blurb: string;
  tone: string;
}> = [
  {
    type: "clinic",
    icon: Stethoscope,
    blurb: "Everyday checks and vaccinations",
    tone: "bg-[#e6f0ef] text-pfa-primary",
  },
  {
    type: "hospital",
    icon: Hospital,
    blurb: "Emergency admission and ICU",
    tone: "bg-[#fdeee2] text-[#9a5316]",
  },
  {
    type: "boarding",
    icon: PawPrint,
    blurb: "Safe stays while you travel",
    tone: "bg-[#f6ecd2] text-[#7a5514]",
  },
  {
    type: "diagnostics",
    icon: FlaskConical,
    blurb: "Blood tests, imaging and labs",
    tone: "bg-[#e7e9fb] text-[#3b3fd9]",
  },
  {
    type: "ambulance",
    icon: Ambulance,
    blurb: "Urgent transport with oxygen",
    tone: "bg-[#fbe4e4] text-[#a52f2f]",
  },
  {
    type: "ngo",
    icon: HeartHandshake,
    blurb: "Rescue, shelter and adoption",
    tone: "bg-[#e2f0e8] text-[#1f6b41]",
  },
];

export function CategoryGrid() {
  const { providers, mode } = useDataSource();
  const counts = providers.reduce<Record<string, number>>((accumulator, provider) => {
    accumulator[provider.type] = (accumulator[provider.type] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <section className="container-page py-10 sm:py-14">
      <SectionHeading
        eyebrow="Browse"
        title="What kind of care do you need?"
        description="Six provider types, each with the details that matter for that kind of visit."
        action={
          <Link
            to={searchUrl({})}
            className="tap-target inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold text-pfa-primary hover:bg-[#e6f0ef]"
          >
            Explore Services
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ type, icon: Icon, blurb, tone }) => (
          <li key={type}>
            <Link
              to={searchUrl({ type })}
              className="group flex h-full flex-col gap-3 rounded-card border border-pfa-border bg-pfa-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-pfa-primary/40 hover:shadow-lift focus-visible:-translate-y-0.5"
            >
              <span className="flex items-start justify-between gap-2">
                <span
                  className={`flex size-11 items-center justify-center rounded-2xl ${tone}`}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="rounded-pill bg-pfa-surface-alt px-2 py-0.5 text-[11px] font-bold text-pfa-muted">
                  {counts[type] ?? 0}
                </span>
              </span>
              <span>
                <span className="block text-sm font-bold leading-snug text-pfa-ink">
                  {PROVIDER_TYPE_LABELS[type]}
                </span>
                <span className="mt-1 block text-xs text-pfa-muted">{blurb}</span>
              </span>
              <ArrowRight
                className="mt-auto size-4 text-pfa-primary opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
      {mode === "osm" && (
        <p className="mt-3 text-xs text-pfa-muted">
          OpenStreetMap coverage is strongest for veterinary clinics. Boarding,
          rescue, ambulance and diagnostics listings are still sparse.
        </p>
      )}
    </section>
  );
}
