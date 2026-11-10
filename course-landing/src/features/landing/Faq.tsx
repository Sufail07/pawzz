import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { faqs } from "../../content/course";
import { Accordion, AccordionItem } from "../../components/ui/Accordion";
import { Section } from "../../components/ui/Section";
import { introMessage, whatsAppLink } from "../../lib/whatsapp";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Questions people ask before booking"
      lead="If something is still unclear, message us on WhatsApp and we will answer plainly."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              id={`faq-${index}`}
              question={faq.question}
              answer={faq.answer}
              open={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </Accordion>

        <aside className="h-fit rounded-card border border-edu-border bg-edu-surface p-5">
          <h3 className="text-base font-bold text-edu-ink">
            Still deciding?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-edu-muted">
            Ask a real person. No script, no pressure — just an honest answer
            about whether the programme fits.
          </p>
          <a
            href={whatsAppLink(introMessage())}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex tap-target items-center gap-2 rounded-pill bg-edu-whatsapp px-4 text-sm font-semibold text-white hover:bg-[#0a5c53]"
          >
            <MessageCircle className="size-4" aria-hidden />
            Chat on WhatsApp
          </a>
        </aside>
      </div>
    </Section>
  );
}
