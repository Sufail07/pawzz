import { useState } from "react";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { getTrack, tracks, type TrackId } from "../../content/course";
import { site } from "../../content/site";
import {
  hasErrors,
  preferredTimeLabels,
  segmentLabels,
  toE164India,
  validateIntroLead,
  type FieldErrors,
  type IntroLeadFields,
  type PreferredTime,
  type Segment,
} from "../../lib/lead";
import { submitLead, type SubmitResult } from "../../lib/submit";
import { currentUtm } from "../../lib/utm";
import { introMessage, whatsAppLink } from "../../lib/whatsapp";
import { useLead } from "./LeadContext";
import { ConsentField } from "./ConsentField";
import { Input, Select } from "../ui/Field";
import { Button } from "../ui/Button";
import { LeadSuccess } from "./LeadSuccess";

const emptyFields: IntroLeadFields = {
  name: "",
  whatsapp: "",
  segment: "student",
  track: "foundations",
  preferredTime: "",
  consent: false,
};

export function IntroLeadForm({
  initialTrack,
  idPrefix,
  onDone,
  className,
}: {
  initialTrack: TrackId;
  idPrefix: string;
  onDone?: () => void;
  className?: string;
}) {
  const { setTrack } = useLead();
  const [fields, setFields] = useState<IntroLeadFields>({
    ...emptyFields,
    track: initialTrack,
  });
  const [errors, setErrors] = useState<FieldErrors<IntroLeadFields>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [submitError, setSubmitError] = useState<string>();
  const [result, setResult] = useState<SubmitResult>();

  function update<K extends keyof IntroLeadFields>(
    key: K,
    value: IntroLeadFields[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateIntroLead(fields);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setStatus("submitting");
    setSubmitError(undefined);
    try {
      const chosenTrack = getTrack(fields.track);
      const submitted = await submitLead("intro_call", {
        name: fields.name.trim(),
        whatsapp: toE164India(fields.whatsapp),
        segment: segmentLabels[fields.segment],
        segment_id: fields.segment,
        track: chosenTrack.name,
        track_id: chosenTrack.id,
        preferred_time: fields.preferredTime
          ? preferredTimeLabels[fields.preferredTime]
          : "No preference",
        preferred_time_id: fields.preferredTime || "any",
        lead_type: "intro_call",
        page_variant: site.pageVariant,
        consent: true,
        consent_version: "2026-11",
        status: "new",
        ...currentUtm(),
      });
      setResult(submitted);
      setStatus("success");
    } catch {
      setStatus("idle");
      setSubmitError(
        "We could not send the form just now. Please try again, or message us on WhatsApp.",
      );
    }
  }

  if (status === "success" && result) {
    return (
      <LeadSuccess
        title="You're booked in"
        reference={result.reference}
        delivered={result.delivered}
        onClose={onDone}
      >
        <p>
          We'll message you on WhatsApp within a few hours during working hours
          to agree on a time for your free intro session.
        </p>
        <ul className="space-y-1 rounded-input bg-edu-surface p-3 text-edu-ink">
          <li>
            <span className="font-semibold">Track:</span>{" "}
            {getTrack(fields.track).name}
          </li>
          <li>
            <span className="font-semibold">Preferred call time:</span>{" "}
            {fields.preferredTime
              ? preferredTimeLabels[fields.preferredTime]
              : "No preference"}
          </li>
        </ul>
        <a
          href={whatsAppLink(introMessage(getTrack(fields.track).name))}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-edu-whatsapp underline underline-offset-2"
        >
          <MessageCircle className="size-4" aria-hidden />
          Message us on WhatsApp now
        </a>
      </LeadSuccess>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={(event) => update("name", event.target.value)}
          error={errors.name}
        />
        <Input
          label="WhatsApp number"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          hint="India format. We use this to confirm your intro session."
          value={fields.whatsapp}
          onChange={(event) => update("whatsapp", event.target.value)}
          error={errors.whatsapp}
        />
        <Select
          label="I am a..."
          name="segment"
          value={fields.segment}
          onChange={(event) => update("segment", event.target.value as Segment)}
          error={errors.segment}
        >
          <option value="student">Student</option>
          <option value="professional">Working professional</option>
        </Select>
        <Select
          label="Track of interest"
          name="track"
          value={fields.track}
          onChange={(event) => {
            const next = event.target.value as TrackId;
            update("track", next);
            setTrack(next);
          }}
          error={errors.track}
        >
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.name}
            </option>
          ))}
        </Select>
        <div className="sm:col-span-2">
          <Select
            label="Preferred call time"
            name="preferredTime"
            optional
            value={fields.preferredTime}
            onChange={(event) =>
              update("preferredTime", event.target.value as PreferredTime | "")
            }
          >
            <option value="">No preference</option>
            <option value="morning">{preferredTimeLabels.morning}</option>
            <option value="afternoon">{preferredTimeLabels.afternoon}</option>
            <option value="evening">{preferredTimeLabels.evening}</option>
          </Select>
        </div>
      </div>

      <div className="mt-3 sm:mt-4">
        <ConsentField
          idPrefix={`${idPrefix}-intro`}
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
            Sending...
          </>
        ) : (
          <>
            Book my free intro
            <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </Button>
      <p className="mt-2 text-center text-xs text-edu-muted">
        Free, no payment. We reply on WhatsApp during working hours.
      </p>
    </form>
  );
}
