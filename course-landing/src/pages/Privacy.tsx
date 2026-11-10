import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { site } from "../content/site";

const collected = [
  ["Full name", "So we know who we are speaking to."],
  ["WhatsApp number", "So we can confirm your intro session."],
  ["Segment", "Student or working professional, to suggest a track."],
  ["Track of interest", "So the call starts with the right programme."],
  ["Preferred call time", "Optional. Helps us propose a sensible slot."],
  ["Email address", "Only on the syllabus form, so we can record the download."],
  ["Consent", "Your explicit agreement to be contacted."],
];

export function Privacy() {
  return (
    <div className="container-page max-w-3xl py-10 sm:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-edu-muted hover:text-edu-primary"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to the landing page
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-edu-ink sm:text-4xl">
        Privacy note
      </h1>
      <p className="mt-3 text-base leading-relaxed text-edu-muted">
        This is a prototype privacy note for {site.name}. It explains what the
        forms collect and why. It is not legal advice and must be reviewed
        against India&apos;s data-protection requirements before real personal
        data is collected.
      </p>

      <div className="mt-6 rounded-card border border-[#e6dcc2] bg-[#fff8ea] p-4 text-sm leading-relaxed text-[#7a5514]">
        <p className="font-bold">Demo behaviour</p>
        <p className="mt-1">
          No form endpoint is configured in this build. Submissions are stored
          only in this browser (localStorage) and can be cleared at any time.
          Nothing is sent to a server, a sheet or an email inbox.
        </p>
      </div>

      <h2 className="mt-8 text-xl font-extrabold text-edu-ink">
        What we collect
      </h2>
      <dl className="mt-3 divide-y divide-edu-border rounded-card border border-edu-border bg-white">
        {collected.map(([field, reason]) => (
          <div key={field} className="grid gap-1 p-4 sm:grid-cols-[160px_1fr] sm:gap-4">
            <dt className="text-sm font-bold text-edu-ink">{field}</dt>
            <dd className="text-sm text-edu-muted">{reason}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-8 text-xl font-extrabold text-edu-ink">
        Where it goes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-edu-muted">
        <li>
          With a configured Google Apps Script endpoint, the lead is appended to
          the founder&apos;s Google Sheet. This prototype does not send emails;
          the syllabus downloads directly in the browser.
        </li>
        <li>
          Source information (UTM parameters and page variant) is stored with
          the lead so the team knows which channel brought the visitor.
        </li>
        <li>
          Without an endpoint, submissions stay in this browser only, as
          described in the demo note above.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-extrabold text-edu-ink">
        Your choices
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-edu-muted">
        <li>Consent is required before a form can be submitted.</li>
        <li>
          You can ask for your details to be corrected or deleted by contacting
          the academy.
        </li>
        <li>
          No testimonials or student statistics are collected or shown until
          real ones exist with permission.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-extrabold text-edu-ink">Contact</h2>
      <p className="mt-3 text-sm leading-relaxed text-edu-muted">
        Email{" "}
        <a
          href={`mailto:${site.email}`}
          className="font-semibold text-edu-primary underline underline-offset-2"
        >
          {site.email}
        </a>{" "}
        (placeholder address until the founder confirms real contact details).
        The WhatsApp number on this site is also a placeholder.
      </p>
    </div>
  );
}
