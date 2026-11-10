interface CriterionRow {
  name: string;
  weight: number;
  evidence: { label: string; href: string }[];
}

const CRITERIA: CriterionRow[] = [
  {
    name: "UI/UX and visual design",
    weight: 30,
    evidence: [
      { label: "Discovery MVP case study", href: "#discovery" },
      { label: "Course landing page case study", href: "#course" },
      { label: "Carousel Studio review UI", href: "#carousel" },
    ],
  },
  {
    name: "Product thinking and CTA strategy",
    weight: 20,
    evidence: [
      { label: "Discovery CTA map", href: "#discovery" },
      { label: "Course primary CTA", href: "#course" },
      { label: "Trust and correction flows", href: "#discovery" },
    ],
  },
  {
    name: "AI workflow and automation",
    weight: 25,
    evidence: [
      { label: "7-stage pipeline", href: "#carousel" },
      { label: "Slide JSON contract", href: "#carousel" },
      { label: "Two human gates", href: "#carousel" },
    ],
  },
  {
    name: "Technical execution and tool selection",
    weight: 15,
    evidence: [
      { label: "Tool table", href: "#stack" },
      { label: "Lead pipeline → Google Sheets", href: "#course" },
      { label: "React + Vite + Tailwind", href: "#stack" },
    ],
  },
  {
    name: "Initiative and communication",
    weight: 10,
    evidence: [
      { label: "Docs 00 to 04", href: "#notes" },
      { label: "Decisions log", href: "#discovery" },
      { label: "Risks and assumptions", href: "#notes" },
    ],
  },
];

export function CriteriaMap() {
  return (
    <div className="space-y-6">
      {CRITERIA.map((c, i) => {
        const barWidth = `${c.weight}%`;
        return (
          <section
            key={i}
            className="group p-6 rounded-[16px] border border-line bg-surface"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-ink text-lg">{c.name}</h3>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-line text-muted">
                  {c.weight}%
                </span>
              </div>
            </div>
            <div className="relative h-2 w-full bg-line/30 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-edu-primary transition-all duration-700 ease-out"
                style={{ width: "0%" }}
                data-width={barWidth}
              ></div>
            </div>
            <ul className="space-y-1 text-sm text-muted list-disc pl-5">
              {c.evidence.map((e, j) => (
                <li key={j}>
                  <a
                    href={e.href}
                    className="text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    {e.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
