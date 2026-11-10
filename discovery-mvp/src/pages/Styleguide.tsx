import { useState } from "react";
import { CalendarDays, Cat, Dog, HeartPulse, Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Chip, Tag } from "../components/ui/Chip";
import {
  Badge,
  Card,
  DistanceBadge,
  EmergencyBadge,
  TypeBadge,
  VerificationBadge,
} from "../components/ui/Badge";
import { Input, Select, Textarea } from "../components/ui/Field";
import { BottomSheet } from "../components/ui/BottomSheet";
import { StickyBar } from "../components/ui/StickyBar";
import { SampleDataBanner } from "../components/ui/SampleDataBanner";
import { Skeleton } from "../components/ui/Feedback";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const colourTokens = [
  ["--pfa-primary", "#0F6B63", "Primary actions, headers"],
  ["--pfa-primary-dark", "#0A4F49", "Hover and pressed states"],
  ["--pfa-accent", "#F2A33A", "Key CTA highlights, badges"],
  ["--pfa-surface", "#FBF6EC", "Page background"],
  ["--pfa-card", "#FFFFFF", "Cards and sheets"],
  ["--pfa-ink", "#1D2B2A", "Body text"],
  ["--pfa-muted", "#5E6F6C", "Secondary text"],
  ["--pfa-border", "#E4DDCC", "Dividers and outlines"],
  ["--pfa-emergency", "#D64545", "Emergency only"],
  ["--pfa-success", "#2E8B57", "Verified badges"],
];

const typeScale = [
  ["56", "text-5xl"],
  ["44", "text-4xl"],
  ["32", "text-3xl"],
  ["24", "text-2xl"],
  ["18", "text-lg"],
  ["16", "text-base"],
  ["14", "text-sm"],
  ["12", "text-xs"],
];

function Block({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-pfa-border py-10">
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-pfa-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Styleguide() {
  useDocumentTitle("Design system · Pawzz");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [chip, setChip] = useState(true);

  return (
    <div className="min-h-dvh bg-pfa-surface pb-24">
      <SampleDataBanner />
      <div className="container-page py-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-pfa-primary">
          Foundations
        </p>
        <h1 className="mt-1 font-display text-4xl font-bold">Design system</h1>
        <p className="mt-2 max-w-2xl text-pfa-muted">
          Shared tokens and components from Doc 00, mirrored as CSS custom
          properties and Tailwind theme values.
        </p>

        <Block title="Colour tokens" description="AA contrast checked pairings.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {colourTokens.map(([token, hex, use]) => (
              <div
                key={token}
                className="overflow-hidden rounded-2xl border border-pfa-border bg-pfa-card"
              >
                <div
                  className="h-16 w-full"
                  style={{ backgroundColor: hex }}
                  aria-hidden
                />
                <div className="p-3">
                  <p className="text-xs font-bold">{token}</p>
                  <p className="text-xs text-pfa-muted">{hex}</p>
                  <p className="mt-1 text-[11px] text-pfa-muted">{use}</p>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Typography">
          <div className="space-y-2 rounded-card border border-pfa-border bg-pfa-card p-6">
            <p className="font-display text-4xl font-bold">
              Fraunces display headline
            </p>
            <p className="text-xl font-bold">Plus Jakarta Sans heading</p>
            <p className="text-base">
              Body copy at 16 px. Rounded, warm and friendly for pet owners in a
              hurry.
            </p>
            <p className="text-sm text-pfa-muted">
              14 px secondary copy in muted ink.
            </p>
            <div className="flex flex-wrap gap-3 pt-3">
              {typeScale.map(([size, className]) => (
                <span key={size} className={`${className} font-semibold`}>
                  {size}
                </span>
              ))}
            </div>
          </div>
        </Block>

        <Block title="Buttons" description="44 px minimum tap targets.">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="accent">Main conversion</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="emergency">Emergency</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Block>

        <Block title="Chips, tags and badges">
          <div className="flex flex-wrap items-center gap-3">
            <Chip selected={chip} onClick={() => setChip((value) => !value)}>
              Toggle chip
            </Chip>
            <Chip icon={<Dog className="size-4" aria-hidden />}>Dogs</Chip>
            <Chip icon={<Cat className="size-4" aria-hidden />}>Cats</Chip>
            <Chip icon={<CalendarDays className="size-4" aria-hidden />}>
              Boarding
            </Chip>
            <Tag>Tag label</Tag>
            <VerificationBadge status="visited" />
            <VerificationBadge status="phone-verified" />
            <VerificationBadge status="unverified" />
            <EmergencyBadge />
            <DistanceBadge>2.4 km</DistanceBadge>
            <TypeBadge>Veterinary clinic</TypeBadge>
            <Badge tone="teal">Open now</Badge>
          </div>
        </Block>

        <Block title="Card">
          <Card className="max-w-md p-5">
            <div className="flex items-center gap-2">
              <HeartPulse className="size-5 text-pfa-primary" aria-hidden />
              <h3 className="font-bold">Sample provider card</h3>
            </div>
            <p className="mt-2 text-sm text-pfa-muted">
              Cream surfaces, 20 px radius, one soft shadow and a single primary
              action.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="accent" size="sm">
                Call
              </Button>
              <Button variant="secondary" size="sm">
                Directions
              </Button>
            </div>
          </Card>
        </Block>

        <Block title="Form controls">
          <div className="grid max-w-2xl gap-4 rounded-card border border-pfa-border bg-pfa-card p-6">
            <Input label="Your name" placeholder="Anita Menon" />
            <Input
              label="Phone number"
              placeholder="+91"
              error="Enter a valid phone number"
            />
            <Select label="Provider type" defaultValue="clinic">
              <option value="clinic">Veterinary clinic</option>
              <option value="hospital">Animal hospital</option>
            </Select>
            <Textarea label="What is wrong?" placeholder="Describe the issue" />
          </div>
        </Block>

        <Block title="Overlays, loading and sticky actions">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setSheetOpen(true)}>Open bottom sheet</Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Skeleton className="h-16 w-40" />
            <Skeleton className="h-16 w-40" />
          </div>
          <div className="relative mt-6 h-24 overflow-hidden rounded-card border border-pfa-border bg-pfa-card">
            <p className="p-4 text-sm text-pfa-muted">
              Sticky action bar preview (mobile only)
            </p>
            <div className="absolute inset-x-0 bottom-0 border-t border-pfa-border bg-pfa-card/95 p-3">
              <div className="flex gap-2">
                <Button variant="accent" className="flex-1">
                  Call
                </Button>
                <Button variant="secondary" className="flex-1">
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-pfa-muted">
            <Search className="size-4" aria-hidden />
            Icons always pair with labels.
          </div>
        </Block>
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Bottom sheet"
        description="Full-screen sheet on mobile, centred modal on desktop."
      >
        <p className="text-sm text-pfa-muted">
          Focus moves to the close button, Escape closes the sheet and body
          scroll locks while it is open.
        </p>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setSheetOpen(false)}>Done</Button>
        </div>
      </BottomSheet>

      <StickyBar>
        <Button variant="accent" className="flex-1">
          Call
        </Button>
        <Button variant="secondary" className="flex-1">
          WhatsApp
        </Button>
      </StickyBar>
    </div>
  );
}
