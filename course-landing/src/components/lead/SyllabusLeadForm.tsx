import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { site } from "../../content/site";
import {
  hasErrors,
  validateSyllabusLead,
  type FieldErrors,
  type SyllabusLeadFields,
} from "../../lib/lead";
import { submitLead, type SubmitResult } from "../../lib/submit";
import { currentUtm } from "../../lib/utm";
import { triggerSyllabusDownload } from "../../lib/download";
import { ConsentField } from "./ConsentField";
import { Input } from "../ui/Field";
import { Button } from "../ui/Button";
import { SyllabusReady } from "./LeadSuccess";

export function SyllabusLeadForm({
  idPrefix,
  onDone,
}: {
  idPrefix: string;
  onDone?: () => void;
}) {
  const [fields, setFields] = useState<SyllabusLeadFields>({
    name: "",
    email: "",
    consent: false,
  });
  const [errors, setErrors] = useState<FieldErrors<SyllabusLeadFields>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [submitError, setSubmitError] = useState<string>();
  const [result, setResult] = useState<SubmitResult>();

  function update<K extends keyof SyllabusLeadFields>(
    key: K,
    value: SyllabusLeadFields[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSyllabusLead(fields);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setStatus("submitting");
    setSubmitError(undefined);
    try {
      const submitted = await submitLead("syllabus", {
        name: fields.name.trim(),
        email: fields.email.trim(),
        lead_type: "syllabus",
        page_variant: site.pageVariant,
        consent: true,
        consent_version: "2026-11",
        status: "new",
        ...currentUtm(),
      });
      setResult(submitted);
      setStatus("success");
      triggerSyllabusDownload();
    } catch {
      setStatus("idle");
      setSubmitError(
        "We could not record the download just now. Please try again, or message us on WhatsApp.",
      );
    }
  }

  if (status === "success" && result) {
    return (
      <SyllabusReady
        reference={result.reference}
        delivered={result.delivered}
        onClose={onDone}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="space-y-3 sm:space-y-4">
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={(event) => update("name", event.target.value)}
          error={errors.name}
        />
        <Input
          label="Email address"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          hint="Recorded with your name for this download. The PDF downloads right away; we do not email it."
          value={fields.email}
          onChange={(event) => update("email", event.target.value)}
          error={errors.email}
        />
      </div>

      <div className="mt-3 sm:mt-4">
        <ConsentField
          idPrefix={`${idPrefix}-syllabus`}
          checked={fields.consent}
          onChange={(checked) => update("consent", checked)}
          error={errors.consent}
        />
      </div>

      {submitError && (
        <p
          role="alert"
          className="mt-3 rounded-input border border-edu-error/30 bg-[#fbe9e9] p-3 text-sm text-edu-error"
        >
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="mt-3 w-full sm:mt-4"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Preparing...
          </>
        ) : (
          <>
            <Download className="size-4" aria-hidden />
            Download the syllabus
          </>
        )}
      </Button>
    </form>
  );
}
