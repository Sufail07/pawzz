import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useDataSource } from "../../data/DataSourceContext";
import { useShortlist } from "../../hooks/useShortlist";
import { searchUrl } from "../../lib/search";
import { SectionHeading } from "../../components/ui/SampleDataBanner";
import { ProviderCard } from "../../components/provider/ProviderCard";
import { freshnessDate } from "../../lib/search";

export function FeaturedProviders() {
  const { toggle, isSaved } = useShortlist();
  const { providers, mode } = useDataSource();

  const featured = useMemo(() => {
    const pool =
      mode === "osm"
        ? providers
        : providers.filter(
            (provider) => provider.verificationStatus === "visited",
          );
    return [...pool]
      .sort((a, b) => freshnessDate(b).getTime() - freshnessDate(a).getTime())
      .slice(0, 6);
  }, [providers, mode]);

  return (
    <section className="container-page py-10 sm:py-14">
      <SectionHeading
        eyebrow={mode === "osm" ? "Real listings" : "Trusted nearby"}
        title={
          mode === "osm"
            ? "Recently mapped on OpenStreetMap"
            : "Featured and verified providers"
        }
        description={
          mode === "osm"
            ? "Real clinics from OpenStreetMap. Contact details and hours are often missing, so call or check before visiting."
            : "Each listing shows its verification level and the date it was last checked."
        }
        action={
          <Link
            to={
              mode === "osm"
                ? searchUrl({ location: "Kochi" })
                : searchUrl({ verifiedOnly: true })
            }
            className="tap-target inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold text-pfa-primary hover:bg-[#e6f0ef]"
          >
            {mode === "osm" ? "See all real listings" : "See all verified"}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {featured.map((provider) => (
          <li key={provider.id} className="flex">
            <ProviderCard
              provider={provider}
              variant="featured"
              saved={isSaved(provider.id)}
              onToggleSave={toggle}
            />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-pfa-muted">
        Swipe to see more. Distances appear once you search a location.
      </p>
    </section>
  );
}
