import { Link, useParams } from "react-router-dom";
import {
  Ambulance,
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  Clock,
  CreditCard,
  Database,
  ExternalLink,
  Globe,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Stethoscope,
  Syringe,
  TestTube,
} from "lucide-react";
import { useDataSource } from "../data/DataSourceContext";
import {
  PROVIDER_TYPE_SINGULAR,
  SPECIES_LABELS,
  VERIFICATION_EXPLAINER,
  type Provider,
} from "../data/types";
import {
  WEEKDAYS,
  WEEKDAY_LABELS,
  describeToday,
  formatTime,
  isOpenAt,
  kolkataClock,
} from "../data/hours";
import { callHref, mapsHref, shortDate, whatsappHref } from "../lib/format";
import { Badge, Card, SourceBadge, VerificationBadge } from "../components/ui/Badge";
import { buttonStyles } from "../components/ui/Button";
import { StickyBar } from "../components/ui/StickyBar";
import { ProviderPhoto, SpeciesIcons } from "../components/provider/ProviderPhoto";
import { NotFound } from "./NotFound";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { OSM_ATTRIBUTION, OSM_LICENSE_URL } from "../lib/osm";
import { MapPanel } from "../features/results/MapPanel";

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-pfa-border py-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-pfa-ink">
        {icon}
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TypeSpecific({ provider }: { provider: Provider }) {
  switch (provider.type) {
    case "hospital":
      return (
        <Section title="Hospital capabilities" icon={<Stethoscope className="size-5 text-pfa-primary" aria-hidden />}>
          <div className="flex flex-wrap gap-2">
            {provider.emergencyAdmission && (
              <Badge tone="emergency" icon={<Ambulance className="size-3.5" aria-hidden />}>
                Emergency admission
              </Badge>
            )}
            {provider.icu && <Badge tone="teal">ICU</Badge>}
            {provider.specialists.map((specialist) => (
              <Badge key={specialist} tone="neutral">
                {specialist}
              </Badge>
            ))}
          </div>
          {!provider.emergencyAdmission &&
            !provider.icu &&
            provider.specialists.length === 0 && (
              <p className="mt-3 text-sm text-pfa-muted">
                Hospital capabilities not listed in OpenStreetMap.
              </p>
            )}
        </Section>
      );
    case "boarding":
      return (
        <Section title="Boarding details" icon={<HeartHandshake className="size-5 text-pfa-primary" aria-hidden />}>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <CreditCard className="size-4 text-pfa-muted" aria-hidden />
            {provider.pricePerDayRange ?? "Price not listed"}
          </p>
          {provider.facilityFeatures.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {provider.facilityFeatures.map((feature) => (
                <Badge key={feature} tone="teal">
                  {feature}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-pfa-muted">
              Facilities not listed in OpenStreetMap.
            </p>
          )}
          {provider.vaccinationRequirements && (
            <p className="mt-3 text-sm text-pfa-muted">
              <span className="font-semibold text-pfa-ink">Vaccination: </span>
              {provider.vaccinationRequirements}
            </p>
          )}
        </Section>
      );
    case "diagnostics":
      return (
        <Section title="Tests and reports" icon={<TestTube className="size-5 text-pfa-primary" aria-hidden />}>
          {provider.testCatalogue.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {provider.testCatalogue.map((test) => (
                <Badge key={test} tone="teal">
                  {test}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-pfa-muted">
              Test catalogue not listed in OpenStreetMap.
            </p>
          )}
          <p className="mt-3 text-sm text-pfa-muted">
            {provider.homeCollection
              ? "Home sample collection available."
              : "Home collection not listed."}{" "}
            {provider.turnaroundHours
              ? `Typical reports in ${provider.turnaroundHours} hours.`
              : "Report turnaround not listed."}
          </p>
        </Section>
      );
    case "ambulance":
      return (
        <Section title="Ambulance coverage" icon={<Ambulance className="size-5 text-pfa-primary" aria-hidden />}>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl bg-pfa-surface p-3">
              <p className="text-xs text-pfa-muted">Service area</p>
              <p className="font-bold">
                {provider.serviceAreaKm ? `${provider.serviceAreaKm} km` : "Not listed"}
              </p>
            </div>
            <div className="rounded-xl bg-pfa-surface p-3">
              <p className="text-xs text-pfa-muted">Typical response</p>
              <p className="font-bold">
                {provider.typicalResponseMinutes
                  ? `~${provider.typicalResponseMinutes} min`
                  : "Not listed"}
              </p>
            </div>
            <div className="rounded-xl bg-pfa-surface p-3">
              <p className="text-xs text-pfa-muted">Large animals</p>
              <p className="font-bold">
                {provider.largeAnimal === undefined
                  ? "Not listed"
                  : provider.largeAnimal
                    ? "Yes"
                    : "No"}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {provider.equipment.map((item) => (
              <Badge key={item} tone="neutral">
                {item}
              </Badge>
            ))}
          </div>
        </Section>
      );
    case "ngo":
      return (
        <Section title="How to help or get help" icon={<HeartHandshake className="size-5 text-pfa-primary" aria-hidden />}>
          <div className="flex flex-wrap gap-2">
            {provider.focus.map((focus) => (
              <Badge key={focus} tone="teal">
                {focus.charAt(0).toUpperCase() + focus.slice(1)}
              </Badge>
            ))}
          </div>
          <dl className="mt-3 space-y-1.5 text-sm">
            {provider.registrationNumber && (
              <div className="flex gap-2">
                <dt className="font-semibold">Registration</dt>
                <dd className="text-pfa-muted">{provider.registrationNumber}</dd>
              </div>
            )}
            {provider.volunteerContact && (
              <div className="flex gap-2">
                <dt className="font-semibold">Volunteering</dt>
                <dd className="text-pfa-muted">{provider.volunteerContact}</dd>
              </div>
            )}
            {provider.donationLink && (
              <div>
                <a
                  className="inline-flex items-center gap-1 font-semibold text-pfa-primary underline-offset-2 hover:underline"
                  href={provider.donationLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe className="size-4" aria-hidden />
                  Donate
                </a>
              </div>
            )}
          </dl>
        </Section>
      );
    case "clinic":
    default:
      return null;
  }
}

export function ProviderProfile() {
  const { id } = useParams();
  const { providers } = useDataSource();
  const provider = id
    ? providers.find((candidate) => candidate.id === id)
    : undefined;
  useDocumentTitle(provider ? `${provider.name} · Pawzz` : "Provider not found · Pawzz");

  if (!provider) return <NotFound />;

  const open = isOpenAt(provider.openingHours);
  const isOsm = provider.source === "osm";
  const today = kolkataClock().weekday;
  const correctionHref = `/correction?provider=${provider.id}&name=${encodeURIComponent(provider.name)}${
    isOsm ? "&issue=missing" : ""
  }`;
  const claimHref = `/list-business?mode=claim&provider=${provider.id}`;

  return (
    <div className="pb-28 lg:pb-10">
      <div className="border-b border-pfa-border bg-pfa-card">
        <div className="container-page py-5">
          <Link
            to="/results"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pfa-muted hover:text-pfa-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to results
          </Link>

          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-start">
            <ProviderPhoto provider={provider} className="h-32 w-full sm:size-32" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="teal">{PROVIDER_TYPE_SINGULAR[provider.type]}</Badge>
                {isOsm ? (
                  <SourceBadge provider={provider} />
                ) : (
                  <VerificationBadge status={provider.verificationStatus} />
                )}
                {provider.openingHours.is24x7 && (
                  <Badge tone="emergency" icon={<Clock className="size-3.5" aria-hidden />}>
                    24x7
                  </Badge>
                )}
                {provider.claimed && (
                  <Badge tone="outline" icon={<BadgeCheck className="size-3.5" aria-hidden />}>
                    Claimed listing
                  </Badge>
                )}
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold text-pfa-ink sm:text-4xl">
                {provider.name}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-pfa-muted">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-4" aria-hidden />
                  {provider.area === provider.city
                    ? provider.city
                    : `${provider.area}, ${provider.city}`}
                  {provider.pinCode ? ` · ${provider.pinCode}` : ""}
                </span>
                <span
                  className={
                    open === true
                      ? "inline-flex items-center gap-1 font-semibold text-[#1f6b41]"
                      : "inline-flex items-center gap-1 font-semibold text-pfa-muted"
                  }
                >
                  <span
                    className={`size-2 rounded-full ${
                      open === true
                        ? "bg-pfa-success"
                        : open === null
                          ? "bg-pfa-border"
                          : "bg-pfa-muted/50"
                    }`}
                    aria-hidden
                  />
                  {open === true ? "Open now" : describeToday(provider.openingHours)}
                </span>
              </p>
              <p className="mt-3 max-w-2xl text-sm text-pfa-muted">
                {provider.description}
              </p>

              <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
                {provider.phone ? (
                  <a href={callHref(provider.phone)} className={buttonStyles("accent")}>
                    <Phone className="size-4" aria-hidden />
                    Call
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center rounded-pill bg-pfa-surface-alt px-3 text-sm font-medium text-pfa-muted">
                    Phone not listed in OpenStreetMap
                  </span>
                )}
                {provider.whatsapp && (
                  <a
                    href={whatsappHref(provider.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonStyles("secondary")}
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    WhatsApp
                  </a>
                )}
                <a
                  href={mapsHref(provider)}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonStyles("secondary")}
                >
                  <Navigation className="size-4" aria-hidden />
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <Section
              title="Services and species"
              icon={<Syringe className="size-5 text-pfa-primary" aria-hidden />}
            >
              {provider.services.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {provider.services.map((service) => (
                    <Badge key={service} tone="teal">
                      {service}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-pfa-muted">Services not listed.</p>
              )}
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
                  Species treated
                </p>
                {provider.speciesTreated.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {provider.speciesTreated.map((species) => (
                      <li key={species} className="flex items-center gap-1.5">
                        <SpeciesIcons species={[species]} className="text-pfa-primary" />
                        {SPECIES_LABELS[species]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-pfa-muted">
                    Species not listed in OpenStreetMap.
                  </p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-pfa-muted">
                {provider.languages.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="size-4" aria-hidden />
                    {provider.languages.join(", ")}
                  </span>
                )}
                {(provider.homeVisit || provider.pickupAvailable) && (
                  <span className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="size-4" aria-hidden />
                    {provider.homeVisit ? "Home visits" : "Pickup available"}
                  </span>
                )}
              </div>
            </Section>

            <Section title="Opening hours" icon={<Clock className="size-5 text-pfa-primary" aria-hidden />}>
              {!provider.openingHours.known ? (
                <div className="rounded-xl border border-pfa-border bg-pfa-surface p-3 text-sm">
                  <p className="font-semibold">
                    Hours not listed in OpenStreetMap.
                  </p>
                  {provider.openingHours.raw && (
                    <p className="mt-1 text-pfa-muted">
                      OSM tag:{" "}
                      <span className="font-mono text-xs">
                        {provider.openingHours.raw}
                      </span>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-pfa-muted">
                    Call ahead before travelling.
                  </p>
                </div>
              ) : provider.openingHours.is24x7 ? (
                <p className="rounded-xl bg-[#e6f3ec] px-3 py-2 text-sm font-semibold text-[#1f6b41]">
                  Open 24 hours, every day.
                </p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-pfa-border">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Weekly opening hours</caption>
                    <tbody>
                      {WEEKDAYS.map((day) => {
                        const hours = provider.openingHours.days[day];
                        const isToday = day === today;
                        return (
                          <tr
                            key={day}
                            className={isToday ? "bg-[#e6f0ef] font-semibold" : ""}
                          >
                            <th
                              scope="row"
                              className="px-3 py-2 text-left font-medium"
                            >
                              {WEEKDAY_LABELS[day]}
                              {isToday && (
                                <span className="ml-2 rounded-pill bg-pfa-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                  Today
                                </span>
                              )}
                            </th>
                            <td className="px-3 py-2 text-right text-pfa-muted">
                              {hours.closed
                                ? "Closed"
                                : `${formatTime(hours.open)} – ${formatTime(hours.close)}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>

            <TypeSpecific provider={provider} />

            <Section title="Location" icon={<MapPin className="size-5 text-pfa-primary" aria-hidden />}>
              <MapPanel
                results={[{ provider, distanceKm: 0, openNow: open }]}
                height={280}
                showOrigin={false}
                title=""
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-pfa-surface p-3">
                <div>
                  <p className="text-sm font-semibold">{provider.address}</p>
                  <p className="text-xs text-pfa-muted">
                    {provider.area === provider.city
                      ? provider.city
                      : `${provider.area}, ${provider.city}`}
                    {provider.pinCode ? ` — ${provider.pinCode}` : ""}
                  </p>
                </div>
                <a
                  href={mapsHref(provider)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-pill border-2 border-pfa-primary px-4 py-2 text-sm font-semibold text-pfa-primary hover:bg-[#e8f1ef]"
                >
                  <Navigation className="size-4" aria-hidden />
                  Open in Maps
                </a>
              </div>
            </Section>

            <div className="border-t border-pfa-border py-5">
              <p className="flex flex-wrap items-center gap-2 text-xs text-pfa-muted">
                <CalendarCheck className="size-4" aria-hidden />
                {isOsm && provider.osm ? (
                  <>
                    OpenStreetMap listing, last edited{" "}
                    {shortDate(provider.osm.lastEditedOn)}.{" "}
                    <a
                      href={provider.osm.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-pfa-primary underline-offset-2 hover:underline"
                    >
                      View on OSM
                    </a>
                  </>
                ) : (
                  <>Last verified on {shortDate(provider.lastVerifiedOn ?? "")}.</>
                )}
                <Link
                  to={correctionHref}
                  className="font-semibold text-pfa-primary underline-offset-2 hover:underline"
                >
                  Submit a Correction
                </Link>
              </p>
              <div className="mt-4 flex flex-col gap-3 rounded-card border border-pfa-border bg-pfa-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm">
                  <span className="font-bold">Is this your business?</span>{" "}
                  <span className="text-pfa-muted">
                    Claim or update this listing.
                  </span>
                </p>
                <Link to={claimHref} className={buttonStyles("secondary", "sm")}>
                  List or update it
                </Link>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
                  Contact
                </p>
                {provider.phone ? (
                  <p className="mt-2 text-lg font-bold">{provider.phone}</p>
                ) : (
                  <p className="mt-2 text-sm text-pfa-muted">
                    Phone not listed in OpenStreetMap. Use directions or the OSM
                    listing below.
                  </p>
                )}
                <div className="mt-4 flex flex-col gap-2">
                  {provider.phone && (
                    <a href={callHref(provider.phone)} className={buttonStyles("accent")}>
                      <Phone className="size-4" aria-hidden />
                      Call now
                    </a>
                  )}
                  {provider.whatsapp && (
                    <a
                      href={whatsappHref(provider.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonStyles("secondary")}
                    >
                      <MessageCircle className="size-4" aria-hidden />
                      Message on WhatsApp
                    </a>
                  )}
                  <a
                    href={mapsHref(provider)}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonStyles("ghost")}
                  >
                    <Navigation className="size-4" aria-hidden />
                    Get directions
                  </a>
                </div>
                {isOsm && (
                  <Link
                    to={correctionHref}
                    className="mt-3 inline-flex text-xs font-semibold text-pfa-primary underline-offset-2 hover:underline"
                  >
                    Know the phone or hours? Add missing details
                  </Link>
                )}
              </Card>

              {isOsm && provider.osm ? (
                <Card className="p-5">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
                    <Database className="size-4 text-pfa-primary" aria-hidden />
                    Data source
                  </p>
                  <div className="mt-2">
                    <SourceBadge provider={provider} />
                  </div>
                  <p className="mt-2 text-sm text-pfa-muted">
                    This is a real listing from OpenStreetMap, not a Pawzz-verified
                    provider. Details can be incomplete or out of date.
                  </p>
                  <p className="mt-3 text-xs text-pfa-muted">
                    Last edited on OSM {shortDate(provider.osm.lastEditedOn)}.
                  </p>
                  {provider.contactSource && (
                    <p className="mt-2 text-xs text-pfa-muted">
                      Phone/hours added from{" "}
                      {provider.contactSource.url ? (
                        <a
                          href={provider.contactSource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold underline underline-offset-2"
                        >
                          {provider.contactSource.label}
                        </a>
                      ) : (
                        <span className="font-semibold">
                          {provider.contactSource.label}
                        </span>
                      )}
                      , checked {shortDate(provider.contactSource.checkedOn)}.
                    </p>
                  )}
                  <a
                    href={provider.osm.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-pfa-primary underline-offset-2 hover:underline"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    View this listing on OpenStreetMap
                  </a>
                  <p className="mt-3 text-[11px] text-pfa-muted">
                    Data {OSM_ATTRIBUTION},{" "}
                    <a
                      href={OSM_LICENSE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      ODbL
                    </a>
                    .
                  </p>
                </Card>
              ) : (
                <Card className="p-5">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
                    <ShieldCheck className="size-4 text-pfa-primary" aria-hidden />
                    Verification
                  </p>
                  <div className="mt-2">
                    <VerificationBadge status={provider.verificationStatus} />
                  </div>
                  <p className="mt-2 text-sm text-pfa-muted">
                    {provider.verificationStatus
                      ? VERIFICATION_EXPLAINER[provider.verificationStatus]
                          .description
                      : ""}
                  </p>
                  <p className="mt-3 text-xs text-pfa-muted">
                    Sample listing, last checked{" "}
                    {shortDate(provider.lastVerifiedOn ?? "")}.
                  </p>
                </Card>
              )}

              {provider.website && (
                <Card className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
                    Website
                  </p>
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block break-all text-sm font-semibold text-pfa-primary underline-offset-2 hover:underline"
                  >
                    {provider.website}
                  </a>
                  <p className="mt-1 text-[11px] text-pfa-muted">
                    {isOsm ? "Listed on OpenStreetMap." : "Sample link."}
                  </p>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>

      <StickyBar>
        {provider.phone ? (
          <a href={callHref(provider.phone)} className={buttonStyles("accent", "md", "flex-1")}>
            <Phone className="size-4" aria-hidden />
            Call
          </a>
        ) : (
          <a
            href={mapsHref(provider)}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles("accent", "md", "flex-1")}
          >
            <Navigation className="size-4" aria-hidden />
            Directions
          </a>
        )}
        {provider.whatsapp && (
          <a
            href={whatsappHref(provider.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles("secondary", "md", "flex-1")}
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </a>
        )}
        {provider.phone && (
          <a
            href={mapsHref(provider)}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles("secondary", "md", "flex-1")}
          >
            <Navigation className="size-4" aria-hidden />
            Directions
          </a>
        )}
      </StickyBar>
    </div>
  );
}
