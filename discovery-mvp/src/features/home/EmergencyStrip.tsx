import { Link } from "react-router-dom";
import { ArrowRight, Siren } from "lucide-react";
import { searchUrl } from "../../lib/search";
import { useDataSource } from "../../data/DataSourceContext";

export function EmergencyStrip() {
  const { mode } = useDataSource();
  return (
    <section aria-label="Emergency help" className="bg-pfa-emergency text-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2.5 text-center sm:justify-between sm:text-left">
        <p className="inline-flex items-center gap-2 text-sm font-semibold">
          <Siren className="size-4 shrink-0" aria-hidden />
          {mode === "osm"
            ? "Emergency? Search 24x7 listings from OpenStreetMap. Live coverage is limited."
            : "Emergency? Find 24x7 vets and ambulances near you."}
        </p>
        <Link
          to={searchUrl({ emergency: true })}
          className="tap-target inline-flex items-center gap-1.5 rounded-pill bg-white px-4 py-2 text-sm font-bold text-[#a52f2f] hover:bg-[#fff4f4]"
        >
          Emergency help
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
