import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useDataSource } from "../data/DataSourceContext";
import { PROVIDER_TYPE_SINGULAR } from "../data/types";
import {
  submissionsEndpointConfigured,
  submitForm,
  validateLink,
} from "../lib/forms";
import { Button } from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/Field";
import { Card } from "../components/ui/Badge";
import {
  ConsentField,
  DemoNote,
  FormPageShell,
  FormSuccess,
} from "../components/forms/FormShell";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const ISSUE_TYPES = [
  "Wrong phone number",
  "Missing phone or hours",
  "Wrong address or location",
  "Opening hours are wrong",
  "Services are missing or wrong",
  "This place has closed",
  "Something else",
];

export function Correction() {
  useDocumentTitle("Submit a correction · Pawzz");
  const [params] = useSearchParams();
  const { providers } = useDataSource();
  const preset = providers.find(
    (provider) => provider.id === params.get("provider"),
  );

  const [listingId, setListingId] = useState(preset?.id ?? "");
  const [issueType, setIssueType] = useState(() =>
    params.get("issue") === "missing" ? "Missing phone or hours" : "",
  );
  const [details, setDetails] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [consentError, setConsentError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    reference: string;
    delivered: boolean;
  }>();

  function validate(): boolean {
    const next: Record<string, string | undefined> = {};
    if (!listingId) next.listingId = "Choose the listing you are correcting";
    if (!issueType) next.issueType = "Choose what is wrong";
    if (details.trim().length < 10)
      next.details = "Add at least a sentence of correct information";
    next.proofLink = validateLink(proofLink);
    setErrors(next);
    setConsentError(consent ? undefined : "Please confirm before submitting");
    return !Object.values(next).some(Boolean) && consent;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(undefined);
    if (!validate()) return;

    const listing = providers.find((provider) => provider.id === listingId);
    setSubmitting(true);
    try {
      const outcome = await submitForm("correction", {
        listingId,
        listingName: listing?.name,
        issueType,
        details,
        proofLink,
        contact,
        consent: true,
      });
      setResult(outcome);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? `We could not send this just now. ${error.message} Please try again.`
          : "We could not send this just now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const backTo = preset ? `/provider/${preset.id}` : "/results";

  return (
    <FormPageShell
      title="Submit a correction"
      intro="Spot a wrong number, closed clinic or missing service? Tell us what to fix. No account needed — every correction goes to a moderation queue."
      backTo={backTo}
      backLabel={preset ? "Back to listing" : "Back to results"}
      aside={
        <>
          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck className="size-4 text-pfa-primary" aria-hidden />
              How corrections work
            </p>
            <ul className="mt-3 space-y-2 text-sm text-pfa-muted">
              <li>• A moderator checks each report against the listing.</li>
              <li>• We may call the provider to confirm before changing it.</li>
              <li>• Your contact details are optional and never shown publicly.</li>
            </ul>
          </Card>
          <DemoNote>
            Prototype form. {submissionsEndpointConfigured()
              ? "Submissions are sent to the configured form endpoint."
              : "Submissions are saved in this browser only — no data is sent anywhere."}{" "}
            Do not enter real personal data.
          </DemoNote>
        </>
      }
    >
      {result ? (
        <FormSuccess
          title="Correction submitted"
          reference={result.reference}
          delivered={result.delivered}
          backTo={preset ? `/provider/${preset.id}` : "/results"}
        >
          <p className="mx-auto mt-3 max-w-md text-sm text-pfa-muted">
            Thanks for helping keep listings accurate. A moderator will review
            this report before the listing changes.
          </p>
        </FormSuccess>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {preset ? (
            <div className="rounded-xl border border-pfa-border bg-pfa-surface p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
                Correcting
              </p>
              <p className="mt-1 text-sm font-semibold">
                {preset.name}{" "}
                <span className="font-normal text-pfa-muted">
                  · {PROVIDER_TYPE_SINGULAR[preset.type]} · {preset.area},{" "}
                  {preset.city}
                </span>
              </p>
            </div>
          ) : (
            <Select
              label="Which listing is wrong?"
              value={listingId}
              onChange={(event) => {
                setListingId(event.target.value);
                setErrors((current) => ({ ...current, listingId: undefined }));
              }}
              error={errors.listingId}
            >
              <option value="">Choose a listing</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} — {provider.area}, {provider.city}
                </option>
              ))}
            </Select>
          )}

          <Select
            label="What is wrong?"
            value={issueType}
            onChange={(event) => {
              setIssueType(event.target.value);
              setErrors((current) => ({ ...current, issueType: undefined }));
            }}
            error={errors.issueType}
          >
            <option value="">Choose an issue</option>
            {ISSUE_TYPES.map((issue) => (
              <option key={issue} value={issue}>
                {issue}
              </option>
            ))}
          </Select>

          <Textarea
            label="Correct information"
            value={details}
            onChange={(event) => {
              setDetails(event.target.value);
              setErrors((current) => ({ ...current, details: undefined }));
            }}
            error={errors.details}
            placeholder="e.g. The clinic moved to 14 Bazaar Road and the new number is +91 98470 00000."
            hint="Include what you know is correct and how you know."
          />

          <Input
            label="Proof link"
            value={proofLink}
            onChange={(event) => {
              setProofLink(event.target.value);
              setErrors((current) => ({ ...current, proofLink: undefined }));
            }}
            error={errors.proofLink}
            type="url"
            optional
            placeholder="https://"
            hint="A clinic website, Google listing or social post helps us verify."
          />

          <Input
            label="Your contact"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            optional
            placeholder="Email or phone, if we may follow up"
            hint="Never shown on the listing."
          />

          <ConsentField checked={consent} onChange={setConsent} error={consentError}>
            I confirm this correction is made in good faith. I understand this
            is a sample prototype and no real personal data should be entered.
          </ConsentField>

          {formError && (
            <p role="alert" className="rounded-xl bg-[#fdf1f1] p-3 text-sm font-medium text-[#a52f2f]">
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="accent" size="lg" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit correction"}
            </Button>
            <Link
              to={backTo}
              className="tap-target inline-flex items-center rounded-pill px-3 text-sm font-semibold text-pfa-muted hover:text-pfa-ink"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </FormPageShell>
  );
}
