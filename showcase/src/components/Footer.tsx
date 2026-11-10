import { CANDIDATE_NAME, CONTACT, FIGMA_URL, REPO_URL, DOCS } from "@/content";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface pt-16 pb-12 px-4 md:px-8">
      <div className="max-w-1200 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-ink">
            {CANDIDATE_NAME}
          </div>
          <p className="text-sm text-muted">
            Built with the same tokens it describes.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 text-sm text-muted border-t border-line pt-6">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-ink">Links</span>
            <a
              href={FIGMA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:underline transition-colors"
            >
              Figma
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:underline transition-colors"
            >
              Repository
            </a>
            {DOCS.map((doc) => (
              <a
                key={doc.name}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:underline transition-colors"
              >
                {doc.name}
              </a>
            ))}
          </div>
          <div className="text-right">
            <span className="font-medium text-ink block mb-1">Contact</span>
            <span>{CONTACT}</span>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] text-muted uppercase tracking-widest">
          {CANDIDATE_NAME} · Submission · Sample data is fictional and labelled
        </p>
      </div>
    </footer>
  );
}
