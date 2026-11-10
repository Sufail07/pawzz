import { useEffect, useState } from "react";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { getTrack } from "../../content/course";
import { introMessage, whatsAppLink } from "../../lib/whatsapp";
import { useLead } from "./LeadContext";

export function StickyCTA() {
  const { isOpen, openIntro, track } = useLead();
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("final-cta");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        setFormVisible(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.2 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (isOpen || formVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-edu-border bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <div className="container-page flex gap-2">
        <button
          type="button"
          onClick={() => openIntro()}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-pill bg-edu-primary px-4 text-base font-semibold text-white hover:bg-edu-primary-dark"
        >
          <CalendarCheck className="size-4" aria-hidden />
          Book a free intro
        </button>
        <a
          href={whatsAppLink(introMessage(getTrack(track).name))}
          target="_blank"
          rel="noreferrer"
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-pill bg-edu-whatsapp text-white hover:bg-[#0a5c53]"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="size-5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
