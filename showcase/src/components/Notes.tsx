import { DOCS } from "@/content";
import { cn } from "@/components/ui/utils";

export function Notes() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h2 className="font-display font-bold text-3xl md:text-44 text-ink">Honest notes</h2>
        <div className="space-y-4">
          <div className="p-6 rounded-[16px] border border-line bg-surface">
            <h3 className="font-bold text-ink text-lg mb-3">Limits and assumptions</h3>
            <ul className="text-sm text-muted space-y-3 list-disc pl-5">
              <li>All providers, prices and programme details are sample data.</li>
              <li>Testimonials and student counts are placeholders.</li>
              <li>The working title needs trademark review.</li>
              <li>Health copy needs veterinary review before real publication.</li>
              <li>Canva free has no Bulk Create, so that handoff is manual.</li>
            </ul>
          </div>
          <div className="p-6 rounded-[16px] border border-line bg-surface">
            <h3 className="font-bold text-ink text-lg mb-3">If I had another week</h3>
            <ul className="text-sm text-muted space-y-3 list-disc pl-5">
              <li>Real provider data pipeline and claim flow.</li>
              <li>Online booking after supply density.</li>
              <li>Make or n8n for scheduled carousel batches.</li>
              <li>Automated WhatsApp follow-up for course leads.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-display font-bold text-3xl md:text-44 text-ink">Supporting specs</h2>
        <div className="space-y-4">
          {DOCS.map((doc) => (
            <a
              key={doc.name}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-between p-4 rounded-[16px] border border-line bg-surface hover:border-ink/40 transition-colors group",
              )}
            >
              <span className="text-sm font-medium text-ink">{doc.name}</span>
              <span className="text-xs text-muted">Open PDF →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
