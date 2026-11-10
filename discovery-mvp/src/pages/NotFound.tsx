import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { buttonStyles } from "../components/ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function NotFound() {
  useDocumentTitle("Page not found · Pawzz");
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-[#e6f0ef] text-pfa-primary">
        <PawPrint className="size-8" aria-hidden />
      </span>
      <h1 className="mt-5 font-display text-3xl font-bold">
        This trail went cold
      </h1>
      <p className="mt-2 max-w-md text-pfa-muted">
        The page you were looking for does not exist. Try searching for care
        instead.
      </p>
      <Link to="/" className={`${buttonStyles("primary")} mt-6`}>
        Back to homepage
      </Link>
    </div>
  );
}
