import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BadgeCheck, ClipboardCheck, MailCheck } from "lucide-react";
import { useDataSource } from "../data/DataSourceContext";
import { PROVIDER_TYPE_LABELS, type ProviderType } from "../data/types";
import {
  submissionsEndpointConfigured,
  submitForm,
  validateEmail,
  validateLink,
  validatePhone,
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

interface FormValues {
  name: string;
  type: ProviderType | "";
  area: string;
  city: string;
  pinCode: string;
  phone: string;
  whatsapp: string;
  website: string;
  services: string;
  contactName: string;
  email: string;
  notes: string;
}

export function ListBusiness() {
  useDocumentTitle("List your business · Pawzz");
  const [params] = useSearchParams();
  const { providers } = useDataSource();
  const existing = params.get("provider")
    ? providers.find((provider) => provider.id === params.get("provider"))
    : undefined;
  const claiming = params.get("mode") === "claim" && Boolean(existing);

  const [values, setValues] = useState<FormValues>({
    name: existing?.name ?? "",
    type: existing?.type ?? "",
    area: existing?.area ?? "",
    city: existing?.city ?? "Kochi",
    pinCode: existing?.pinCode ?? "",
    phone: existing?.phone ?? "",
    whatsapp: existing?.whatsapp ?? "",
    website: existing?.website ?? "",
    services: existing?.services.join(", ") ?? "",
    contactName: "",
    email: "",
    notes: "",
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [consentError, setConsentError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    reference: string;
    delivered: boolean;
  }>();

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Record<string, string | undefined> = {};
    if (!values.name.trim()) next.name = "Business name is required";
    if (!values.type) next.type = "Choose a provider type";
    if (!values.area.trim()) next.area = "Area is required";
    if (!values.city.trim()) next.city = "City is required";
    next.phone = validatePhone(values.phone);
    next.email = validateEmail(values.email);
    next.website = validateLink(values.website);
    if (!values.contactName.trim())
      next.contactName = "Your name is required";
    if (!values.services.trim())
      next.services = "List at least one service";

    setErrors(next);
    const hasError = Object.values(next).some(Boolean);
    setConsentError(consent ? undefined : "Please confirm you agree to be contacted");
    return !hasError && consent;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(undefined);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const outcome = await submitForm("list-business", {
        mode: claiming ? "claim" : "new",
        listingId: existing?.id,
        ...values,
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

  const backTo = existing ? `/provider/${existing.id}` : "/";

  return (
    <FormPageShell
      title={claiming ? "Claim this listing" : "List your business"}
      intro={
        claiming
          ? "Confirm the details below so we can verify and hand control of this listing to you."
          : "Tell us about your clinic, hospital, boarding facility, lab, ambulance service or NGO. We verify every listing by phone before it goes live."
      }
      backTo={backTo}
      backLabel={existing ? "Back to listing" : "Back to home"}
      aside={
        <>
          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-bold">
              <ClipboardCheck className="size-4 text-pfa-primary" aria-hidden />
              What happens next
            </p>
            <ol className="mt-3 space-y-2 text-sm text-pfa-muted">
              <li className="flex gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pfa-surface-alt text-xs font-bold text-pfa-ink">
                  1
                </span>
                We check the phone number and basic details.
              </li>
              <li className="flex gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pfa-surface-alt text-xs font-bold text-pfa-ink">
                  2
                </span>
                Listings enter a moderation queue before publishing.
              </li>
              <li className="flex gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pfa-surface-alt text-xs font-bold text-pfa-ink">
                  3
                </span>
                You can ask for corrections at any time.
              </li>
            </ol>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-bold">
              <MailCheck className="size-4 text-pfa-primary" aria-hidden />
              Contact
            </p>
            <p className="mt-2 text-sm text-pfa-muted">
              Questions? Email{" "}
              <span className="font-semibold text-pfa-ink">
                providers@example.com
              </span>{" "}
              (sample address).
            </p>
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
          title="Listing submitted"
          reference={result.reference}
          delivered={result.delivered}
          backTo="/"
        >
          <p className="mx-auto mt-3 max-w-md text-sm text-pfa-muted">
            Our team will call the number you provided to verify the listing
            before it appears in search.
          </p>
        </FormSuccess>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {claiming && existing && (
            <div className="flex items-start gap-2 rounded-xl border border-[#cfe3de] bg-[#eef7f4] p-3 text-sm">
              <BadgeCheck
                className="mt-0.5 size-4 shrink-0 text-pfa-primary"
                aria-hidden
              />
              <p>
                <span className="font-semibold">Claiming:</span>{" "}
                {existing.name}. Details are pre-filled from the sample listing.
                Update anything that is wrong.
              </p>
            </div>
          )}

          <Input
            label="Business or organisation name"
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            error={errors.name}
            autoComplete="organization"
            placeholder="e.g. Marine Drive Boarding & Daycare"
          />

          <Select
            label="Provider type"
            value={values.type}
            onChange={(event) => set("type", event.target.value as ProviderType)}
            error={errors.type}
          >
            <option value="">Choose a type</option>
            {Object.entries(PROVIDER_TYPE_LABELS).map(([type, label]) => (
              <option key={type} value={type}>
                {label}
              </option>
            ))}
          </Select>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Area or locality"
              value={values.area}
              onChange={(event) => set("area", event.target.value)}
              error={errors.area}
              autoComplete="address-level3"
              placeholder="e.g. Panampilly Nagar"
            />
            <Select
              label="City"
              value={values.city}
              onChange={(event) => set("city", event.target.value)}
              error={errors.city}
            >
              <option value="Kochi">Kochi</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Other">Other (roadmap)</option>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Pin code"
              value={values.pinCode}
              onChange={(event) => set("pinCode", event.target.value)}
              error={errors.pinCode}
              inputMode="numeric"
              autoComplete="postal-code"
              optional
              placeholder="682036"
            />
            <Input
              label="Services offered"
              value={values.services}
              onChange={(event) => set("services", event.target.value)}
              error={errors.services}
              placeholder="Vaccination, surgery, boarding"
              hint="Separate services with commas."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone number"
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
              error={errors.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91 98470 00000"
            />
            <Input
              label="WhatsApp number"
              value={values.whatsapp}
              onChange={(event) => set("whatsapp", event.target.value)}
              error={errors.whatsapp}
              type="tel"
              inputMode="tel"
              optional
              placeholder="Same as phone if blank"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Your name"
              value={values.contactName}
              onChange={(event) => set("contactName", event.target.value)}
              error={errors.contactName}
              autoComplete="name"
              placeholder="Who should we ask for?"
            />
            <Input
              label="Email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
              error={errors.email}
              type="email"
              autoComplete="email"
              optional
              placeholder="you@example.com"
            />
          </div>

          <Input
            label="Website or listing link"
            value={values.website}
            onChange={(event) => set("website", event.target.value)}
            error={errors.website}
            type="url"
            optional
            placeholder="https://"
            hint="A link helps us verify the business faster."
          />

          <Textarea
            label="Anything else we should know?"
            optional
            placeholder="Additional branches, special equipment, home visit radius…"
            value={values.notes}
            onChange={(event) => set("notes", event.target.value)}
          />

          <ConsentField checked={consent} onChange={setConsent} error={consentError}>
            I agree to be contacted about this submission and confirm the details
            are accurate. I understand this is a sample prototype and no real
            personal data should be entered.
          </ConsentField>

          {formError && (
            <p role="alert" className="rounded-xl bg-[#fdf1f1] p-3 text-sm font-medium text-[#a52f2f]">
              {formError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="accent" size="lg" disabled={submitting}>
              {submitting
                ? "Submitting…"
                : claiming
                  ? "Submit claim"
                  : "Submit listing"}
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
