import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { site } from "../../content/site";
import { introMessage, whatsAppLink } from "../../lib/whatsapp";
import { useLead } from "../lead/LeadContext";
import { Button } from "../ui/Button";
import { BrandMark } from "./BrandMark";

export function Header() {
  const { openIntro } = useLead();

  return (
    <header className="sticky top-0 z-30 border-b border-edu-border bg-edu-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
        >
          <BrandMark className="size-9" />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-edu-ink">
              Lumen
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-edu-muted">
              AI Academy
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex tap-target items-center rounded-pill px-3 text-sm font-semibold text-edu-ink-soft transition-colors hover:bg-edu-surface-alt hover:text-edu-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={whatsAppLink(introMessage())}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="hidden tap-target items-center justify-center rounded-pill text-edu-whatsapp hover:bg-edu-surface-alt lg:inline-flex"
          >
            <MessageCircle className="size-5" aria-hidden />
          </a>
          <Button size="sm" onClick={() => openIntro()}>
            Book a free intro
          </Button>
        </div>
      </div>
    </header>
  );
}
