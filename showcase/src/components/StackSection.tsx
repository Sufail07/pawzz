interface ToolRow {
  layer: string;
  tool: string;
  usedIn: string;
  url?: string;
}

import { cn } from "@/components/ui/utils";

const TOOLS: ToolRow[] = [
  { layer: "Framework", tool: "React", usedIn: "All three systems", url: "https://react.dev" },
  { layer: "Build tool", tool: "Vite", usedIn: "All three systems", url: "https://vitejs.dev" },
  { layer: "Styling", tool: "Tailwind CSS", usedIn: "All three systems", url: "https://tailwindcss.com" },
  { layer: "Lead pipeline", tool: "Google Apps Script → Google Sheets", usedIn: "Course landing page", url: "https://developers.google.com/apps-script" },
  { layer: "Copy generation", tool: "LLM", usedIn: "Carousel content system" },
  { layer: "Hosting", tool: "Vercel", usedIn: "All three systems", url: "https://vercel.com" },
  { layer: "Design", tool: "Figma", usedIn: "All three systems", url: "https://figma.com" },
];

const TIME_BUDGET = [30, 90, 60, 90, 30];

export function StackSection() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="font-display font-bold text-44 md:text-56 text-ink mb-8 text-center">
          Stack and process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TOOLS.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-[16px] border border-line bg-surface hover:border-ink/40 transition-colors"
            >
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                {t.layer}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={t.url || "#"}
                  target={t.url ? "_blank" : undefined}
                  rel={t.url ? "noopener noreferrer" : undefined}
                  className={cn(
                    "font-medium text-ink hover:text-pfa-primary transition-colors",
                    t.url ? "underline underline-offset-4" : "",
                  )}
                >
                  {t.tool}
                </a>
              </div>
              <p className="text-xs text-muted mt-1">{t.usedIn}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto">
        <h3 className="font-bold text-ink text-lg mb-6">Time budget</h3>
        <div className="flex items-end gap-2 h-32">
          {TIME_BUDGET.map((minutes, i) => {
            const total = TIME_BUDGET.reduce((a, b) => a + b, 0);
            const pct = (minutes / total) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 relative group">
                <div
                  className="w-full bg-line/30 rounded-full overflow-hidden relative"
                >
                  <div
                    className="h-full bg-edu-primary transition-all duration-700 ease-out absolute bottom-0 left-0"
                    style={{ width: "0%", height: "100%" }}
                    data-width={`${pct}%`}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-ink">{minutes} min</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted">
          <span>Discovery</span>
          <span>Course</span>
          <span>Carousel</span>
          <span>Showcase</span>
          <span>Notes</span>
        </div>
      </section>
    </div>
  );
}
