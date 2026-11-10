import { Link } from "react-router-dom";
import {
  Ambulance,
  HeartHandshake,
  Scissors,
  ShieldPlus,
  Stethoscope,
  TestTube,
} from "lucide-react";
import { searchUrl } from "../../lib/search";
import { useDataSource } from "../../data/DataSourceContext";

const needs = [
  {
    label: "Vaccination",
    detail: "Book a routine shot",
    icon: ShieldPlus,
    query: { q: "Vaccination" },
    osmQuery: { type: "clinic" as const },
  },
  {
    label: "Spay & neuter",
    detail: "Planned surgery",
    icon: Scissors,
    query: { q: "Spay" },
    osmQuery: { type: "clinic" as const },
  },
  {
    label: "Boarding while travelling",
    detail: "Find boarding nearby",
    icon: Stethoscope,
    query: { type: "boarding" as const },
    osmQuery: { type: "boarding" as const },
  },
  {
    label: "Blood tests",
    detail: "Find a diagnostics lab",
    icon: TestTube,
    query: { type: "diagnostics" as const },
    osmQuery: { type: "diagnostics" as const },
  },
  {
    label: "Rescue help",
    detail: "Injured strays and animals",
    icon: HeartHandshake,
    query: { type: "ngo" as const },
    osmQuery: { type: "ngo" as const },
  },
  {
    label: "Emergency transport",
    detail: "Ambulance services",
    icon: Ambulance,
    query: { type: "ambulance" as const, openNow: true },
    osmQuery: { emergency: true },
  },
];

export function PopularNeeds() {
  const { mode } = useDataSource();
  return (
    <section className="border-y border-pfa-border bg-[#f7f0e2]">
      <div className="container-page py-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-pfa-muted">
            Popular needs
          </h2>
          <ul className="flex flex-1 flex-wrap gap-2">
            {needs.map(({ label, detail, icon: Icon, query, osmQuery }) => (
              <li key={label}>
                <Link
                  to={searchUrl(mode === "osm" ? osmQuery : query)}
                  className="group inline-flex tap-target items-center gap-2 rounded-pill border border-pfa-border bg-pfa-card px-3.5 py-2 text-sm font-semibold text-pfa-ink transition-colors hover:border-pfa-primary hover:text-pfa-primary"
                >
                  <Icon className="size-4 text-pfa-primary" aria-hidden />
                  {label}
                  <span className="hidden text-xs font-normal text-pfa-muted sm:inline">
                    · {detail}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
