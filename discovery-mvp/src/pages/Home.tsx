import { HeroSearch } from "../features/home/HeroSearch";
import { EmergencyStrip } from "../features/home/EmergencyStrip";
import { CategoryGrid } from "../features/home/CategoryGrid";
import { PopularNeeds } from "../features/home/PopularNeeds";
import { FeaturedProviders } from "../features/home/FeaturedProviders";
import { HowItWorks } from "../features/home/HowItWorks";
import { ProviderCta } from "../features/home/ProviderCta";
import { CorrectionStrip } from "../features/home/CorrectionStrip";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function Home() {
  useDocumentTitle("Pawzz — Find animal care near you");
  return (
    <>
      <EmergencyStrip />
      <HeroSearch />
      <CategoryGrid />
      <PopularNeeds />
      <FeaturedProviders />
      <HowItWorks />
      <ProviderCta />
      <CorrectionStrip />
    </>
  );
}
