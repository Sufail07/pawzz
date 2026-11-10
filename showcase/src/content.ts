export type SystemId = "discovery" | "course" | "carousel";

export interface System {
  id: SystemId;
  number: string;
  name: string;
  oneLiner: string;
  problem: string;
  built: string[];
  decisions: { title: string; body: string }[];
  criteria: string[];
  stack: string[];
  facts: string[];
  links: {
    live: string;
    spec: string;
    figma?: string;
    download?: string;
  };
  previews: {
    label: string;
    image: string;
    mobileImage?: string;
  }[];
}

export const CANDIDATE_NAME = "{{CANDIDATE_NAME}}";
export const CONTACT = "{{CONTACT}}";
export const FIGMA_URL = "{{FIGMA_URL}}";
export const REPO_URL = "{{REPO_URL}}";

export const SYSTEMS: System[] = [
  {
    id: "discovery",
    number: "01",
    name: "Animal-Care Discovery MVP",
    oneLiner: "Find the right animal-care provider, fast.",
    problem:
      "Pet owners struggle to find trusted vets, boarding, diagnostics, labs, ambulances and NGOs quickly — especially in an emergency.",
    built: [
      "Emergency fast-lane: one tap to 24x7 vets and ambulances",
      "Hero search (what + where) with location detection",
      "Six provider category chips with filters, sort and result count",
    ],
    decisions: [
      {
        title: "Emergency fast-lane above the main search",
        body: "Time-critical access sits before browsing so emergencies are handled first.",
      },
      {
        title: "Trust through verification level and last-verified date",
        body: "Providers carry a verified badge with a last-verified date instead of invented ratings.",
      },
      {
        title: "Booking and reviews deferred until density",
        body: "Booking and reviews are deliberately held back until the directory has enough provider density to be useful.",
      },
    ],
    criteria: ["UI/UX", "Product thinking", "CTA strategy"],
    stack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    facts: ["6 provider types", "3-screen clickable flow", "Emergency fast-lane"],
    links: {
      live: "https://discovery-mvp.vercel.app/",
      spec: "#discovery",
      figma: "{{FIGMA_URL}}",
    },
    previews: [
      {
        label: "Home",
        image: "/assets/discovery-mvp.png",
      },
      {
        label: "Results",
        image: "/assets/discovery-mvp.png",
      },
      {
        label: "Provider profile",
        image: "/assets/discovery-mvp.png",
      },
    ],
  },
  {
    id: "course",
    number: "02",
    name: "AI Course Landing Page",
    oneLiner: "Learn AI by building real things.",
    problem:
      "Practical AI and digital-skills programmes need a lead-capture page that converts visitors into booked intro sessions.",
    built: [
      "Track switcher: AI Foundations, AI at Work, Digital Skills Studio",
      "Primary CTA reachable at any scroll position via mobile sticky bar",
      "Four-field lead form piped to a Google Sheet",
    ],
    decisions: [
      {
        title: "One primary CTA: the free intro session",
        body: "A single call to action keeps the page focused on the lead pipeline.",
      },
      {
        title: "One form reused everywhere",
        body: "The same four-field form appears everywhere so there is one data pipeline.",
      },
      {
        title: "Clearly marked placeholders instead of invented social proof",
        body: "Testimonials and student counts are placeholders, visibly labelled as such.",
      },
    ],
    criteria: ["UI/UX", "CTA strategy", "Technical execution"],
    stack: ["React", "Vite", "Tailwind CSS", "Google Apps Script", "Vercel"],
    facts: ["12-section page", "2 audience tracks", "Lead form to Google Sheet"],
    links: {
      live: "https://course-landing-xi.vercel.app/",
      spec: "#course",
      figma: "{{FIGMA_URL}}",
    },
    previews: [
      {
        label: "Desktop",
        image: "/assets/course-landing.png",
        mobileImage: "/assets/course-landing.png",
      },
    ],
  },
  {
    id: "carousel",
    number: "03",
    name: "AI Carousel Content System",
    oneLiner: "Idea to publish-ready carousel in 30 minutes.",
    problem:
      "Turning one idea into a publish-ready Instagram and LinkedIn carousel is slow and inconsistent without a repeatable pipeline.",
    built: [
      "Brief intake: idea, audience, platform, theme",
      "Fact-check gate: key points with sources, approve or remove",
      "Export: Instagram PNG (1080×1350) + LinkedIn PDF, caption and hashtags",
    ],
    decisions: [
      {
        title: "Fixed template library instead of free-form design",
        body: "Six fixed layouts keep output consistent and publish-ready.",
      },
      {
        title: "Fact-check gate before copywriting",
        body: "Stage 3 verifies facts before any copy is generated.",
      },
      {
        title: "Free-tier stack with a documented scale-up path",
        body: "Starts on free tools, with Make or n8n for scheduled batches later.",
      },
    ],
    criteria: ["AI workflow and automation", "Technical execution", "Tool selection"],
    stack: ["React", "Vite", "Tailwind CSS", "LLM copy generation", "Vercel"],
    facts: ["7-stage pipeline", "2 human review gates", "6 slide layouts"],
    links: {
      live: "https://carousel-studio-seven-sand.vercel.app/",
      spec: "#carousel",
      figma: "{{FIGMA_URL}}",
      download: "#",
    },
    previews: [
      {
        label: "Slide viewer",
        image: "/assets/carousal-studio.png",
      },
    ],
  },
];

export function getSystem(id: SystemId) {
  return SYSTEMS.find((s) => s.id === id);
}

export interface Doc {
  name: string;
  url: string;
}

export const DOCS: Doc[] = [
  { name: "Doc 00 — Overview & Shared Foundations", url: "#" },
  { name: "Doc 01 — Animal-Care Discovery MVP", url: "#" },
  { name: "Doc 02 — AI Course Landing Page", url: "#" },
  { name: "Doc 03 — AI Carousel Content System", url: "#" },
  { name: "Doc 04 — Showcase Website Design Spec", url: "#" },
];
