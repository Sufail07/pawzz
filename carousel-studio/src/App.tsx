import { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { StudioProvider } from "./app/StudioProvider";
import { Layout } from "./app/Layout";
import { StudioRedirect } from "./app/StudioShell";
import { IntakePage } from "./pages/IntakePage";
import { FactsPage } from "./pages/FactsPage";
import { DraftPage } from "./pages/DraftPage";
import { ExportPage } from "./pages/ExportPage";
import { HistoryPage } from "./pages/HistoryPage";
import { StyleGuidePage } from "./pages/StyleGuidePage";
import { buttonStyles } from "./components/ui/Button";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <PawPrint className="h-12 w-12 text-studio-primary" aria-hidden />
      <h1 className="mt-4 font-display text-3xl font-bold text-studio-ink">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-studio-muted">
        The page you were looking for does not exist. Start a brief or open the history.
      </p>
      <Link to="/" className={buttonStyles("primary", "md", "mt-5")}>
        Start a new brief
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StudioProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<IntakePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/styleguide" element={<StyleGuidePage />} />
            <Route path="/studio/:id" element={<StudioRedirect />} />
            <Route path="/studio/:id/facts" element={<FactsPage />} />
            <Route path="/studio/:id/draft" element={<DraftPage />} />
            <Route path="/studio/:id/export" element={<ExportPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </StudioProvider>
    </BrowserRouter>
  );
}
