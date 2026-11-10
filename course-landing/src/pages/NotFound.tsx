import { Link } from "react-router-dom";
import { buttonStyles } from "../components/ui/Button";

export function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] max-w-xl flex-col items-center justify-center py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-edu-primary">
        404
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-edu-ink">
        That page is not here
      </h1>
      <p className="mt-3 text-base text-edu-muted">
        The link may be old. The programme details, outcomes and booking form are
        all on the landing page.
      </p>
      <Link to="/" className={`${buttonStyles("primary")} mt-6`}>
        Back to the landing page
      </Link>
    </div>
  );
}
