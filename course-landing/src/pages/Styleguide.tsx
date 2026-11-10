import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge, Card } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { Input, Select } from "../components/ui/Field";
import { Placeholder } from "../components/ui/Placeholder";

const colors = [
  { token: "--edu-primary", value: "#3B3FD9", cls: "bg-edu-primary" },
  { token: "--edu-primary-dark", value: "#2E31B0", cls: "bg-edu-primary-dark" },
  { token: "--edu-ink", value: "#14152B", cls: "bg-edu-ink" },
  { token: "--edu-highlight", value: "#C6F432", cls: "bg-edu-highlight" },
  { token: "--edu-surface", value: "#F6F6FF", cls: "bg-edu-surface" },
  { token: "--edu-border", value: "#E1E1F2", cls: "bg-edu-border" },
  { token: "--edu-muted", value: "#55567A", cls: "bg-edu-muted" },
  { token: "--edu-whatsapp", value: "#0E7367", cls: "bg-edu-whatsapp" },
];

const type = [
  ["text-5xl", "56 / Display", "text-5xl"],
  ["text-4xl", "44 / Section", "text-4xl"],
  ["text-3xl", "32 / Section mobile", "text-3xl"],
  ["text-2xl", "24 / Card heading", "text-2xl"],
  ["text-xl", "24 / Dialog heading", "text-xl"],
  ["text-lg", "18 / Lead", "text-lg"],
  ["text-base", "16 / Body", "text-base"],
  ["text-sm", "14 / Secondary", "text-sm"],
  ["text-xs", "12 / Labels", "text-xs"],
];

export function Styleguide() {
  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-edu-muted hover:text-edu-primary"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to the landing page
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-edu-ink sm:text-4xl">
        Coded design system
      </h1>
      <p className="mt-3 max-w-2xl text-base text-edu-muted">
        Coded source of truth for the education tokens in Doc 00. Mirror these
        values into Figma. Lime and amber are fills behind dark text, never text
        on light backgrounds.
      </p>

      <h2 className="mt-10 text-xl font-extrabold">Colour tokens</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {colors.map((color) => (
          <div key={color.token} className="rounded-card border border-edu-border bg-white p-3">
            <div className={`h-14 rounded-input ${color.cls}`} />
            <p className="mt-2 font-mono text-[11px] font-semibold text-edu-ink">
              {color.token}
            </p>
            <p className="text-[11px] text-edu-muted">{color.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-extrabold">Type scale</h2>
      <div className="mt-4 divide-y divide-edu-border rounded-card border border-edu-border bg-white px-5">
        {type.map(([token, label, cls]) => (
          <div key={token} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
            <p className={`${cls} font-extrabold tracking-tight text-edu-ink`}>
              Build real things
            </p>
            <p className="font-mono text-[11px] text-edu-muted">
              {token} · {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-extrabold">Buttons</h2>
          <Card className="mt-4 flex flex-wrap items-center gap-2 p-5">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="highlight">Highlight</Button>
            <Button variant="white">White</Button>
            <Button variant="whatsapp">WhatsApp</Button>
            <Button variant="ghost">Ghost</Button>
          </Card>
          <p className="mt-2 text-xs text-edu-muted">
            All buttons meet the 44 × 44 px minimum tap target.
          </p>

          <h2 className="mt-8 text-xl font-extrabold">Chips and badges</h2>
          <Card className="mt-4 flex flex-wrap items-center gap-2 p-5">
            <Chip selected>Chip selected</Chip>
            <Chip>Chip default</Chip>
            <Badge tone="primary">Primary</Badge>
            <Badge tone="highlight">Highlight</Badge>
            <Badge tone="success">Verified</Badge>
            <Badge tone="outline">Outline</Badge>
            <Placeholder />
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-extrabold">Fields</h2>
          <Card className="mt-4 space-y-4 p-5">
            <Input label="Full name" placeholder="Your name" />
            <Input
              label="WhatsApp number"
              placeholder="+91 98765 43210"
              hint="India format."
            />
            <Input
              label="Email address"
              placeholder="you@example.com"
              error="Enter a valid email address"
            />
            <Select label="Track of interest" defaultValue="foundations">
              <option value="foundations">AI Foundations</option>
              <option value="at-work">AI at Work</option>
              <option value="studio">Digital Skills Studio</option>
            </Select>
          </Card>
          <p className="mt-2 text-xs text-edu-muted">
            Radii: 12 px inputs, 20 px cards, pills for chips. Focus ring is a
            3 px indigo outline.
          </p>
        </div>
      </div>
    </div>
  );
}
