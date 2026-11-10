export const site = {
  name: "Lumen AI Academy",
  shortName: "Lumen",
  tagline: "Learn AI by building real things.",
  whatsappNumber:
    (import.meta.env.VITE_WHATSAPP_NUMBER ?? "").replace(/\D/g, "") ||
    "919000000000",
  email: "hello@example.com",
  syllabusPath: "/AI_Skills_Studio_Sample_Syllabus.pdf",
  pageVariant: "course-landing-v1",
  socials: [
    { label: "Instagram", href: "https://instagram.com/", placeholder: true },
    { label: "LinkedIn", href: "https://linkedin.com/", placeholder: true },
  ],
  nav: [
    { label: "Programmes", href: "#programmes" },
    { label: "Projects", href: "#projects" },
    { label: "Pricing", href: "#pricing" },
  ],
} as const;
