import { Section } from "@/components/section";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SystemCard } from "@/components/SystemCard";
import {
  CaseStudy,
  CaseStudyHeader,
  BuiltList,
  DecisionCard,
  CriteriaTags,
  StackChips,
  LinkRow,
} from "@/components/CaseStudy";
import { Hotspots, CTAMiniMap } from "@/components/Hotspots";
import { PipelineStepper } from "@/components/PipelineStepper";
import { SlideViewer } from "@/components/SlideViewer";
import { LeadStepper } from "@/components/LeadStepper";
import { ConnectionDiagram } from "@/components/ConnectionDiagram";
import { CriteriaMap } from "@/components/CriteriaMap";
import { StackSection } from "@/components/StackSection";
import { Notes } from "@/components/Notes";
import { Footer } from "@/components/Footer";
import { SYSTEMS } from "@/content";

const discovery = SYSTEMS[0];
const course = SYSTEMS[1];
const carousel = SYSTEMS[2];

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-ink selection:bg-pfa-accent/30 selection:text-ink">
      <Nav />
      <main>
        <Hero systems={SYSTEMS} />

        <Section id="overview" theme="bg">
          <div className="max-w-1200 mx-auto px-4 md:px-8">
            <h2 className="font-display font-bold text-44 md:text-56 text-ink mb-12 text-center">
              Three systems at a glance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SYSTEMS.map((sys) => (
                <SystemCard key={sys.id} system={sys} />
              ))}
            </div>
          </div>
        </Section>

        <Section id="connect" theme="bg">
          <div className="max-w-1200 mx-auto px-4 md:px-8">
            <ConnectionDiagram />
          </div>
        </Section>

        {/* System 1: Discovery */}
        <Section id="discovery" theme="pfa-surface">
          <div className="max-w-1200 mx-auto px-4 md:px-8">
            <CaseStudy
              system={discovery}
              previewImage={discovery.previews[0].image}
              previewLabel="Discovery MVP"
              liveUrl={discovery.links.live}
            >
              <CaseStudyHeader
                eyebrow="System 1 · Discovery"
                title={discovery.name}
                problem={discovery.problem}
              />
              <BuiltList items={discovery.built} />
              <div className="space-y-4">
                <h3 className="font-bold text-ink text-lg mb-3">Decisions that mattered</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {discovery.decisions.map((d, i) => (
                    <DecisionCard key={i} title={d.title} body={d.body} />
                  ))}
                </div>
              </div>
              <CriteriaTags tags={discovery.criteria} />
              <StackChips stack={discovery.stack} />
              <LinkRow links={discovery.links} />
              <Hotspots />
              <CTAMiniMap />
            </CaseStudy>
          </div>
        </Section>

        {/* System 2: Course */}
        <Section id="course" theme="edu-surface">
          <div className="max-w-1200 mx-auto px-4 md:px-8">
            <CaseStudy
              system={course}
              previewImage={course.previews[0].image}
              previewLabel="Course landing page"
              liveUrl={course.links.live}
            >
              <CaseStudyHeader
                eyebrow="System 2 · Course"
                title={course.name}
                problem={course.problem}
              />
              <BuiltList items={course.built} />
              <div className="space-y-4">
                <h3 className="font-bold text-ink text-lg mb-3">Decisions that mattered</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {course.decisions.map((d, i) => (
                    <DecisionCard key={i} title={d.title} body={d.body} />
                  ))}
                </div>
              </div>
              <CriteriaTags tags={course.criteria} />
              <StackChips stack={course.stack} />
              <LinkRow links={course.links} />
              <LeadStepper />
            </CaseStudy>
          </div>
        </Section>

        {/* System 3: Carousel */}
        <Section id="carousel" theme="ink">
          <div className="max-w-1200 mx-auto px-4 md:px-8">
            <CaseStudy
              system={carousel}
              previewImage={carousel.previews[0].image}
              previewLabel="Carousel Studio"
              liveUrl={carousel.links.live}
            >
              <CaseStudyHeader
                eyebrow="System 3 · Carousel"
                title={carousel.name}
                problem={carousel.problem}
              />
              <BuiltList items={carousel.built} />
              <div className="space-y-4">
                <h3 className="font-bold text-surface text-lg mb-3">Decisions that mattered</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {carousel.decisions.map((d, i) => (
                    <DecisionCard key={i} title={d.title} body={d.body} />
                  ))}
                </div>
              </div>
              <CriteriaTags tags={carousel.criteria} />
              <StackChips stack={carousel.stack} />
              <LinkRow links={carousel.links} />
              <PipelineStepper />
              <SlideViewer onDownload={() => {}} />
            </CaseStudy>
          </div>
        </Section>

        <Section id="criteria" theme="bg">
          <div className="max-w-1200 mx-auto px-4 md:px-8">
            <CriteriaMap />
          </div>
        </Section>

        <Section id="stack" theme="bg">
          <div className="max-w-1200 mx-auto px-4 md:px-8">
            <StackSection />
          </div>
        </Section>

        <Section id="notes" theme="bg">
          <div className="max-w-1200 mx-auto px-4 md:px-8">
            <Notes />
          </div>
        </Section>

        <Footer />
      </main>
    </div>
  );
}
