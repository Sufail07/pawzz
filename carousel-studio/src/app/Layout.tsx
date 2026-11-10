import { Link, NavLink, useLocation } from "react-router-dom";
import { Clock, Palette, PawPrint, Plus, Sparkles, WifiOff } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { useStudio } from "../app/StudioProvider";
import { Badge } from "../components/ui/Badge";

function navClass(active: boolean): string {
  return cn(
    "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition",
    active
      ? "bg-studio-primary text-white"
      : "text-studio-muted hover:bg-studio-surface-alt hover:text-studio-ink",
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { config, apiReachable } = useStudio();
  const location = useLocation();
  const inStudio = location.pathname.startsWith("/studio/");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print sticky top-0 z-40 border-b border-studio-border/80 bg-studio-surface/90 backdrop-blur">
        <div className="container-page flex flex-wrap items-center gap-3 py-3">
          <Link to="/" className="mr-auto flex items-center gap-3 rounded-xl py-1 pr-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-studio-primary text-white shadow-sm">
              <PawPrint className="h-6 w-6" aria-hidden />
            </span>
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-studio-primary">
                Pawzz Studio
              </span>
              <span className="block font-display text-xl font-bold leading-tight text-studio-ink">
                Carousel Studio
              </span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="order-3 flex w-full gap-1 overflow-x-auto scrollbar-none sm:order-none sm:w-auto">
            <NavLink to="/" end className={({ isActive }) => navClass(isActive && !inStudio)}>
              <Plus className="h-4 w-4" aria-hidden />
              New brief
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => navClass(isActive)}>
              <Clock className="h-4 w-4" aria-hidden />
              History
            </NavLink>
            <NavLink to="/styleguide" className={({ isActive }) => navClass(isActive)}>
              <Palette className="h-4 w-4" aria-hidden />
              Styleguide
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            {!apiReachable ? (
              <Badge tone="error">
                <WifiOff className="h-3.5 w-3.5" aria-hidden />
                API offline
              </Badge>
            ) : config.demoMode ? (
              <Badge tone="accent">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Demo mode
              </Badge>
            ) : (
              <Badge tone="success">
                <span className="h-2 w-2 rounded-full bg-studio-success" aria-hidden />
                {config.providerLabel}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="no-print mt-16 border-t border-studio-border bg-studio-card/60">
        <div className="container-page flex flex-col gap-3 py-8 text-xs text-studio-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            A fictional sample prototype. Health content needs review by a licensed vet before
            publication.
          </p>
          <p>
            Model: <span className="font-semibold text-studio-ink">{config.model}</span>
            {config.storageMode === "filesystem" ? " · local JSON archive on" : " · browser storage"}
          </p>
        </div>
      </footer>
    </div>
  );
}
