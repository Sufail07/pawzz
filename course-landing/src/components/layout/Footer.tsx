import { Link } from "react-router-dom";
import { ExternalLink, Mail, MessageCircle } from "lucide-react";
import { site } from "../../content/site";
import { introMessage, whatsAppLink } from "../../lib/whatsapp";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="border-t border-edu-border bg-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2.5"
            >
            <BrandMark className="size-9" />
            <span className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight">
                Lumen
              </span>
              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-edu-muted">
                AI Academy
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-edu-muted">
            Practical AI and digital-skills programmes for students and young
            professionals. Live cohorts, real projects, no coding background
            needed.
          </p>
          <p className="mt-4 rounded-input bg-edu-surface p-3 text-xs leading-relaxed text-edu-muted">
            Fictional working brand and sample prototype. Programme names,
            durations, prices, mentors and testimonials are placeholders. Not
            affiliated with any existing academy.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-edu-ink">Explore</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex py-1 text-edu-muted hover:text-edu-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#faq"
                className="inline-flex py-1 text-edu-muted hover:text-edu-primary"
              >
                FAQ
              </a>
            </li>
            <li>
              <Link
                to="/styleguide"
                className="inline-flex py-1 text-edu-muted hover:text-edu-primary"
              >
                Design system
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-edu-ink">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={whatsAppLink(introMessage())}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 py-1 text-edu-muted hover:text-edu-primary"
              >
                <MessageCircle className="size-4" aria-hidden />
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 py-1 text-edu-muted hover:text-edu-primary"
              >
                <Mail className="size-4" aria-hidden />
                {site.email}
              </a>
            </li>
            {site.socials.map((social) => {
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 py-1 text-edu-muted hover:text-edu-primary"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    {social.label}
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-edu-muted">
                      placeholder
                    </span>
                  </a>
                </li>
              );
            })}
            <li>
              <Link
                to="/privacy"
                className="inline-flex py-1 text-edu-muted hover:text-edu-primary"
              >
                Privacy note
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-edu-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-edu-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lumen AI Academy (fictional sample).</p>
          <p>
            Confirm branding and India data-protection requirements before
            collecting real personal data.
          </p>
        </div>
      </div>
    </footer>
  );
}
