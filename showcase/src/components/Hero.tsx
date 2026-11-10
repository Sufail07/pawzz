import { SYSTEMS } from "@/content";

export function Hero({ systems }: { systems: typeof SYSTEMS }) {
  return (
    <section className="bg-bg text-ink text-center pt-24 md:pt-40 pb-24 md:pb-32 px-4">
      <span className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-line text-xs font-semibold uppercase tracking-wider text-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-edu-success"></span>
        Live prototypes
      </span>
      <h1 className="font-display font-bold text-56 md:text-[72px] text-ink mb-6 leading-tight">
        From rough idea to working system. Three times.
      </h1>
      <p className="text-muted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12">
        A discovery platform for animal care, an AI course page with a real lead
        pipeline, and a content engine that turns one idea into a carousel.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {systems.map((sys) => (
          <a
            key={sys.id}
            href={`#${sys.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-surface text-ink hover:bg-ink hover:text-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-edu-success"></span>
            Live
          </a>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-7xl mx-auto">
        <a
          href="#overview"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[20px] bg-ink text-surface font-semibold text-base hover:bg-ink-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          See the three systems
        </a>
        <a
          href="#notes"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-[20px] border border-line bg-surface text-ink font-semibold text-base hover:bg-surface/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          Read the specs
        </a>
      </div>

      <div className="mt-20 md:mt-28 relative max-w-5xl mx-auto">
        <div className="relative rounded-[20px] border border-line bg-surface shadow-lg overflow-hidden w-full md:w-[320px] h-[560px] -translate-x-4 md:translate-x-0 translate-y-8 md:translate-y-0 opacity-50 md:opacity-100 transition-opacity duration-300">
          <img
            src={systems[0].previews[0].image}
            alt="Discovery MVP phone frame"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="relative rounded-[20px] border border-line bg-surface shadow-lg overflow-hidden w-full md:w-[420px] h-[260px] -mt-16 md:-mt-24 translate-x-4 md:translate-x-8 translate-y-8 md:translate-y-0 opacity-50 md:opacity-100 transition-opacity duration-300">
          <img
            src={systems[1].previews[0].image}
            alt="Course landing laptop frame"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="relative rounded-[20px] border border-line bg-surface shadow-lg overflow-hidden w-full md:w-[270px] h-[338px] -mt-12 md:-mt-0 translate-x-0 md:translate-x-16 translate-y-16 md:translate-y-0 opacity-50 md:opacity-100 transition-opacity duration-300">
          <img
            src={systems[2].previews[0].image}
            alt="Carousel slide card"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
