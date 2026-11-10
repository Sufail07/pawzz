import { Link, NavLink } from "react-router-dom";
import { Menu, PawPrint, Siren, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/cn";
import { searchUrl } from "../../lib/search";
import { buttonStyles } from "../ui/Button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-pill px-3 py-2 text-sm font-semibold transition-colors",
    isActive
      ? "bg-[#e6f0ef] text-pfa-primary-dark"
      : "text-pfa-ink hover:bg-pfa-surface-alt",
  );

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-pfa-border bg-pfa-surface/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-2 rounded-pill"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-pfa-primary text-white">
            <PawPrint className="size-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-bold text-pfa-ink">
              Pawzz
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-pfa-muted">
              Animal care finder
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <NavLink to="/results" className={navLinkClass} end>
            Find care
          </NavLink>
          <NavLink to="/results?emergency=1" className={navLinkClass}>
            Emergency
          </NavLink>
          <NavLink to="/#how-it-works" className={navLinkClass}>
            How it works
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Link
              to={searchUrl({ emergency: true })}
              className={buttonStyles("emergency", "sm")}
            >
              <Siren className="size-4" aria-hidden />
              Emergency help
            </Link>
          </span>
          <span className="hidden lg:block">
            <Link
              to="/list-business"
              className={buttonStyles("primary", "sm")}
            >
              List Your Business
            </Link>
          </span>
          <button
            type="button"
            className="tap-target inline-flex items-center justify-center rounded-pill text-pfa-ink hover:bg-pfa-surface-alt md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-pfa-border bg-pfa-card px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                to="/results"
                onClick={() => setOpen(false)}
                className="block min-h-11 rounded-input px-3 py-3 font-semibold hover:bg-pfa-surface-alt"
              >
                Find care
              </Link>
            </li>
            <li>
              <Link
                to={searchUrl({ emergency: true })}
                onClick={() => setOpen(false)}
                className="block min-h-11 rounded-input px-3 py-3 font-semibold text-pfa-emergency hover:bg-[#fbe9e9]"
              >
                Emergency help
              </Link>
            </li>
            <li>
              <Link
                to="/list-business"
                onClick={() => setOpen(false)}
                className="block min-h-11 rounded-input px-3 py-3 font-semibold hover:bg-pfa-surface-alt"
              >
                List Your Business
              </Link>
            </li>
            <li>
              <Link
                to="/#how-it-works"
                onClick={() => setOpen(false)}
                className="block min-h-11 rounded-input px-3 py-3 font-semibold hover:bg-pfa-surface-alt"
              >
                How it works
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
