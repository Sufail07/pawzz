import { useState } from "react";

interface HotspotProps {
  id: string;
  x: string;
  y: string;
  label: string;
  tooltip: string;
}

export function Hotspot({ id, x, y, label, tooltip }: HotspotProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        aria-label={label}
        aria-expanded={open}
        className="absolute w-6 h-6 rounded-full bg-ink text-surface flex items-center justify-center text-[10px] font-bold shadow-md transform -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
        style={{ left: x, top: y }}
      >
        {id}
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-48 rounded-[8px] border border-line bg-surface p-3 shadow-lg">
          <span className="text-[11px] font-semibold text-ink">{label}</span>
          <p className="text-[11px] text-muted mt-1 leading-tight">{tooltip}</p>
        </div>
      )}
    </div>
  );
}

const HOTSPOTS: HotspotProps[] = [
  {
    id: "1",
    x: "20%",
    y: "35%",
    label: "Emergency fast-lane",
    tooltip: "One-tap access to 24x7 vets and ambulances sits above the main search.",
  },
  {
    id: "2",
    x: "55%",
    y: "45%",
    label: "Open now & 24x7 filters",
    tooltip: "Filter providers by availability and round-the-clock coverage.",
  },
  {
    id: "3",
    x: "75%",
    y: "60%",
    label: "Verified badge",
    tooltip: "Verification level with a last-verified date builds trust without invented ratings.",
  },
  {
    id: "4",
    x: "40%",
    y: "80%",
    label: "Submit a Correction",
    tooltip: "Community-driven correction flow keeps provider data accurate.",
  },
  {
    id: "5",
    x: "85%",
    y: "90%",
    label: "Sticky call bar",
    tooltip: "Sticky Call / WhatsApp / Directions bar on mobile provider profiles.",
  },
];

export function Hotspots() {
  return (
    <div className="relative">
      {HOTSPOTS.map((h) => (
        <Hotspot key={h.id} {...h} />
      ))}
    </div>
  );
}

interface CTARowProps {
  cta: string;
  location: string;
}

export function CTARow({ cta, location }: CTARowProps) {
  return (
    <tr className="border-b border-line/50">
      <td className="py-3 text-sm text-muted">{cta}</td>
      <td className="py-3 text-sm text-muted text-right">{location}</td>
    </tr>
  );
}

export function CTAMiniMap() {
  const ctas = [
    { cta: "Emergency fast-lane", location: "Homepage, above search" },
    { cta: "Hero search", location: "Homepage hero" },
    { cta: "Filter chips", location: "Homepage + Results" },
    { cta: "Provider profile", location: "Results → Profile" },
    { cta: "Call / WhatsApp / Directions", location: "Sticky bar on profile" },
    { cta: "List Your Business", location: "Footer + header" },
    { cta: "Submit a Correction", location: "Profile page" },
  ];

  return (
    <div className="mt-8">
      <h3 className="font-bold text-ink text-sm mb-3">Mini CTA map</h3>
      <div className="rounded-[12px] border border-line bg-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-line/50">
            {ctas.map((c, i) => (
              <CTARow key={i} cta={c.cta} location={c.location} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
