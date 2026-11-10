import { Link } from "react-router-dom";
import { Bookmark, Clock, MapPin, Navigation, Phone } from "lucide-react";
import type { Provider } from "../../data/types";
import { PROVIDER_TYPE_SINGULAR } from "../../data/types";
import { isOpenAt } from "../../data/hours";
import { cn } from "../../lib/cn";
import { callHref, mapsHref, typeSummary } from "../../lib/format";
import { formatDistance } from "../../lib/geo";
import { Badge, Card, SourceBadge, VerificationBadge } from "../ui/Badge";
import { buttonStyles } from "../ui/Button";
import { ProviderPhoto } from "./ProviderPhoto";

interface ProviderCardProps {
  provider: Provider;
  distanceKm?: number;
  openNow?: boolean | null;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  variant?: "list" | "featured";
  compactActions?: boolean;
}

export function ProviderCard({
  provider,
  distanceKm,
  openNow,
  saved = false,
  onToggleSave,
  variant = "list",
  compactActions = false,
}: ProviderCardProps) {
  const openState = openNow ?? isOpenAt(provider.openingHours);
  const open = openState === true;
  const hoursUnknown = openState === null;
  const featured = variant === "featured";

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden transition-shadow hover:shadow-lift",
        featured ? "w-[272px] shrink-0 snap-start" : "sm:flex-row",
      )}
    >
      <div className={featured ? "" : "sm:p-3 sm:pr-0"}>
        <ProviderPhoto
          provider={provider}
          className={cn(
            featured
              ? "h-24 w-full rounded-none"
              : "h-36 w-full rounded-none sm:size-28 sm:rounded-2xl",
          )}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-pfa-muted">
              {PROVIDER_TYPE_SINGULAR[provider.type]}
            </p>
            <h3
              className={cn(
                "text-base font-bold text-pfa-ink",
                featured ? "line-clamp-2" : "truncate",
              )}
            >
              <Link
                to={`/provider/${provider.id}`}
                className="hover:text-pfa-primary"
              >
                {provider.name}
              </Link>
            </h3>
          </div>
          {onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(provider.id)}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${provider.name} from shortlist` : `Save ${provider.name} to shortlist`}
              className={cn(
                "tap-target -mr-1 -mt-1 inline-flex items-center justify-center rounded-full transition-colors",
                saved
                  ? "bg-[#e6f0ef] text-pfa-primary"
                  : "text-pfa-muted hover:bg-pfa-surface-alt hover:text-pfa-ink",
              )}
            >
              <Bookmark
                className="size-5"
                fill={saved ? "currentColor" : "none"}
                aria-hidden
              />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {hoursUnknown ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-pfa-muted">
              <Clock className="size-3.5" aria-hidden />
              Hours not listed
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-semibold",
                open ? "text-[#1f6b41]" : "text-pfa-muted",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  open ? "bg-pfa-success" : "bg-pfa-muted/50",
                )}
                aria-hidden
              />
              {open ? "Open now" : "Closed"}
            </span>
          )}
          {typeof distanceKm === "number" && (
            <span className="inline-flex items-center gap-1 text-pfa-muted">
              <MapPin className="size-3.5" aria-hidden />
              {formatDistance(distanceKm)}
            </span>
          )}
          {provider.openingHours.is24x7 && (
            <Badge tone="emergency" className="px-2 py-0.5">
              24x7
            </Badge>
          )}
          {provider.verificationStatus ? (
            <VerificationBadge status={provider.verificationStatus} />
          ) : (
            <SourceBadge provider={provider} />
          )}
        </div>

        <p className="line-clamp-2 text-sm text-pfa-muted">
          {provider.services.slice(0, 3).join(" · ")}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-xs font-semibold text-pfa-primary-dark">
            {typeSummary(provider)}
          </span>
          {!compactActions && (
            <div className="flex items-center gap-2">
              <Link
                to={`/provider/${provider.id}`}
                className={buttonStyles("secondary", "sm", "px-3")}
              >
                View
              </Link>
              {provider.phone ? (
                <a
                  href={callHref(provider.phone)}
                  className={buttonStyles("accent", "sm", "px-3")}
                  aria-label={`Call ${provider.name}`}
                >
                  <Phone className="size-4" aria-hidden />
                  Call
                </a>
              ) : (
                <a
                  href={mapsHref(provider)}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonStyles("accent", "sm", "px-3")}
                  aria-label={`Directions to ${provider.name}`}
                >
                  <Navigation className="size-4" aria-hidden />
                  Directions
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
