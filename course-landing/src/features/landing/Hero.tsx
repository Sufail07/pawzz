import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getTrack } from "../../content/course";
import { useLead } from "../../components/lead/LeadContext";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { TrackSwitcher } from "./TrackSwitcher";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  const { track, setTrack, openIntro, openSyllabus } = useLead();
  const selected = getTrack(track);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-edu-highlight/20 blur-3xl" />
      <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-20">
        <div>
          <Badge tone="primary" icon={<span className="size-1.5 rounded-full bg-edu-primary" />}>
            Live cohorts · 12–16 learners
          </Badge>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-edu-ink sm:text-5xl">
            Learn AI by{" "}
            <span className="bg-[linear-gradient(transparent_58%,#C6F432_58%)] px-0.5 [box-decoration-break:clone]">
              building real things
            </span>
            .
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-edu-muted sm:text-lg">
            {selected.heroSubhead}
          </p>

          <TrackSwitcher value={track} onChange={setTrack} />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" onClick={() => openIntro(track)}>
              Book a free intro session
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button variant="secondary" size="lg" onClick={openSyllabus}>
              Download the syllabus
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-edu-muted">
            {[
              "No coding background needed",
              "Small, live cohorts",
              "Mentor-led projects",
            ].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2
                  className="size-4 shrink-0 text-edu-success"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual track={selected} />
      </div>
    </section>
  );
}
