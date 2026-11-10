import { Hero } from "../features/landing/Hero";
import { Outcomes } from "../features/landing/Outcomes";
import { ProgrammeTracks } from "../features/landing/ProgrammeTracks";
import { HowItWorks } from "../features/landing/HowItWorks";
import { ProjectShowcase } from "../features/landing/ProjectShowcase";
import { Mentors } from "../features/landing/Mentors";
import { CohortPricing } from "../features/landing/CohortPricing";
import { Testimonials } from "../features/landing/Testimonials";
import { Faq } from "../features/landing/Faq";
import { FinalCta } from "../features/landing/FinalCta";

export function Home() {
  return (
    <div className="pb-20 lg:pb-0">
      <Hero />
      <Outcomes />
      <ProgrammeTracks />
      <HowItWorks />
      <ProjectShowcase />
      <Mentors />
      <CohortPricing />
      <Testimonials />
      <Faq />
      <FinalCta />
    </div>
  );
}
