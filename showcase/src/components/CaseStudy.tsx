import { System } from "@/content";
import { DeviceFrame } from "@/components/DeviceFrame";

interface CaseStudyProps {
  system: System;
  children: React.ReactNode;
  previewImage: string;
  previewLabel: string;
  liveUrl: string;
}

export function CaseStudy({
  children,
  previewImage,
  previewLabel,
  liveUrl,
}: CaseStudyProps) {
  return (
    <section className="px-4 md:px-8 pb-20 md:pb-32">
      <div className="max-w-1200 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Text column - 5 of 12 */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-8">
            {children}
          </div>

          {/* Preview column - 7 of 12 */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <DeviceFrame
              src={liveUrl}
              label={previewLabel}
              width="100%"
              height="600px"
              fallback={previewImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  problem: string;
}

export function CaseStudyHeader({ eyebrow, title, problem }: SectionHeaderProps) {
  return (
    <>
      <span className="inline-block px-3 py-1 rounded-full border border-line text-xs font-semibold uppercase tracking-wider text-muted">
        {eyebrow}
      </span>
      <h2 className="font-display font-bold text-44 md:text-56 text-ink mb-4 leading-tight">
        {title}
        <span className="inline-block px-2.5 py-0.5 rounded-full border border-ink text-ink text-[10px] font-bold uppercase tracking-wider ml-2">
          Live prototype
        </span>
      </h2>
      <p className="text-muted text-lg leading-relaxed">{problem}</p>
    </>
  );
}

interface BuiltListProps {
  items: string[];
}

export function BuiltList({ items }: BuiltListProps) {
  return (
    <>
      <h3 className="font-bold text-ink text-lg mb-3">What I built</h3>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-muted text-sm leading-relaxed">
            <span className="w-2.5 h-2.5 shrink-0 mt-1.5 rounded-full bg-ink"></span>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

interface DecisionCardProps {
  title: string;
  body: string;
}

export function DecisionCard({ title, body }: DecisionCardProps) {
  return (
    <div className="p-4 rounded-[12px] border border-line bg-surface">
      <h4 className="font-bold text-ink text-sm mb-1">{title}</h4>
      <p className="text-muted text-sm leading-relaxed">{body}</p>
    </div>
  );
}

interface CriteriaTagsProps {
  tags: string[];
}

export function CriteriaTags({ tags }: CriteriaTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 rounded-full border border-line text-xs font-semibold text-muted hover:bg-surface/50 transition-colors"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

interface StackChipsProps {
  stack: string[];
}

export function StackChips({ stack }: StackChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {stack.map((tool) => (
        <span
          key={tool}
          className="px-3 py-1 rounded-full border border-line text-xs font-semibold text-muted"
        >
          {tool}
        </span>
      ))}
    </div>
  );
}

interface LinkRowProps {
  links: { live: string; spec: string; figma?: string; download?: string };
}

export function LinkRow({ links }: LinkRowProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={links.live}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] border border-line bg-surface text-ink font-medium text-sm hover:bg-surface/80 transition-colors"
      >
        Open live
      </a>
      <a
        href={links.spec}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] border border-line bg-surface text-ink font-medium text-sm hover:bg-surface/80 transition-colors"
      >
        View spec
      </a>
      {links.figma && (
        <a
          href={links.figma}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] border border-line bg-surface text-ink font-medium text-sm hover:bg-surface/80 transition-colors"
        >
          View Figma
        </a>
      )}
    </div>
  );
}
