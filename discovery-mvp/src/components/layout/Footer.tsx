import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { searchUrl } from "../../lib/search";
import { useDataSource } from "../../data/DataSourceContext";
import { OSM_ATTRIBUTION, OSM_LICENSE_URL } from "../../lib/osm";

export function Footer() {
  const { mode } = useDataSource();
  return (
    <footer className="mt-16 border-t border-pfa-border bg-pfa-card">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-pfa-primary text-white">
              <PawPrint className="size-4" aria-hidden />
            </span>
            <span className="font-display text-lg font-bold">Pawzz</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-pfa-muted">
            A calmer way to find vets, hospitals, boarding, diagnostics,
            ambulances and rescue support near you.
          </p>
        </div>

        <nav aria-label="Find care">
          <h2 className="text-sm font-bold">Find care</h2>
          <ul className="mt-3 space-y-2 text-sm text-pfa-muted">
            <li>
              <Link className="hover:text-pfa-primary" to="/results?type=clinic">
                Veterinary clinics
              </Link>
            </li>
            <li>
              <Link className="hover:text-pfa-primary" to="/results?type=hospital">
                Animal hospitals
              </Link>
            </li>
            <li>
              <Link className="hover:text-pfa-primary" to="/results?type=boarding">
                Boarding & daycare
              </Link>
            </li>
            <li>
              <Link className="hover:text-pfa-primary" to="/results?type=ngo">
                NGOs & rescue
              </Link>
            </li>
            <li>
              <Link
                className="font-semibold text-pfa-emergency hover:underline"
                to={searchUrl({ emergency: true })}
              >
                Emergency help
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="For providers">
          <h2 className="text-sm font-bold">For providers</h2>
          <ul className="mt-3 space-y-2 text-sm text-pfa-muted">
            <li>
              <Link className="hover:text-pfa-primary" to="/list-business">
                List Your Business
              </Link>
            </li>
            <li>
              <Link className="hover:text-pfa-primary" to="/list-business?mode=claim">
                Claim a listing
              </Link>
            </li>
            <li>
              <Link className="hover:text-pfa-primary" to="/correction">
                Submit a Correction
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold">About</h2>
          <ul className="mt-3 space-y-2 text-sm text-pfa-muted">
            <li>
              <Link className="hover:text-pfa-primary" to="/#how-it-works">
                How verification works
              </Link>
            </li>
            <li>
              <Link className="hover:text-pfa-primary" to="/#trust">
                Trust & data quality
              </Link>
            </li>
            <li>
              <span
                className="inline-flex items-center gap-1"
                title="Roadmap: English-first MVP"
              >
                English
                <span className="rounded-pill bg-pfa-surface-alt px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                  More languages soon
                </span>
              </span>
            </li>
            <li>
              <Link className="hover:text-pfa-primary" to="/styleguide">
                Design system
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-pfa-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-pfa-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {mode === "osm" ? (
              <>
                Live data from{" "}
                <a
                  href={OSM_LICENSE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline underline-offset-2 hover:text-pfa-primary"
                >
                  {OSM_ATTRIBUTION}
                </a>{" "}
                (ODbL). Some listings are incomplete.
              </>
            ) : (
              <>
                Demo prototype. All listings, reviews and figures are fictional
                sample data, not real businesses.
              </>
            )}
          </p>
          <p>
            Working title “Practo for Animals” is unconfirmed and not affiliated
            with Practo.
          </p>
        </div>
      </div>
    </footer>
  );
}
