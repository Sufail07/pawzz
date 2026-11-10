import type { HTMLAttributes, ReactNode } from "react";
import {
  BadgeCheck,
  Database,
  MapPin,
  ShieldCheck,
  Siren,
  Stethoscope,
} from "lucide-react";
import { cn } from "../../lib/cn";
import type { Provider, VerificationStatus } from "../../data/types";

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-card border border-pfa-border bg-pfa-card shadow-card",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

type BadgeTone = "verified" | "emergency" | "neutral" | "teal" | "outline";

const tones: Record<BadgeTone, string> = {
  verified: "bg-[#e6f3ec] text-[#1f6b41]",
  emergency: "bg-[#fbe9e9] text-[#a52f2f]",
  neutral: "bg-pfa-surface-alt text-pfa-muted",
  teal: "bg-[#e6f0ef] text-pfa-primary-dark",
  outline: "border border-pfa-border bg-pfa-card text-pfa-muted",
};

interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

const verificationLabels: Record<VerificationStatus, string> = {
  unverified: "Unverified",
  "phone-verified": "Phone verified",
  visited: "Verified",
};

export function VerificationBadge({
  status,
  className,
}: {
  status?: VerificationStatus;
  className?: string;
}) {
  if (!status) return null;
  if (status === "unverified") {
    return (
      <Badge tone="outline" className={className}>
        {verificationLabels[status]}
      </Badge>
    );
  }
  return (
    <Badge
      tone="verified"
      icon={
        status === "visited" ? (
          <BadgeCheck className="size-3.5" aria-hidden />
        ) : (
          <ShieldCheck className="size-3.5" aria-hidden />
        )
      }
      className={className}
    >
      {verificationLabels[status]}
    </Badge>
  );
}

export function EmergencyBadge({ children = "24x7" }: { children?: ReactNode }) {
  return (
    <Badge tone="emergency" icon={<Siren className="size-3.5" aria-hidden />}>
      {children}
    </Badge>
  );
}

export function DistanceBadge({ children }: { children: ReactNode }) {
  return (
    <Badge tone="neutral" icon={<MapPin className="size-3.5" aria-hidden />}>
      {children}
    </Badge>
  );
}

export function TypeBadge({ children }: { children: ReactNode }) {
  return (
    <Badge tone="teal" icon={<Stethoscope className="size-3.5" aria-hidden />}>
      {children}
    </Badge>
  );
}

export function SourceBadge({
  provider,
  className,
}: {
  provider: Provider;
  className?: string;
}) {
  if (provider.source === "osm") {
    return (
      <Badge
        tone="outline"
        icon={<Database className="size-3.5" aria-hidden />}
        className={className}
      >
        OSM
      </Badge>
    );
  }
  return (
    <Badge tone="neutral" className={className}>
      Sample
    </Badge>
  );
}
