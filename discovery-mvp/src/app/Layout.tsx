import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { DataSourceBanner } from "../components/ui/DataSourceBanner";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col bg-pfa-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-input focus:bg-pfa-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <DataSourceBanner />
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
