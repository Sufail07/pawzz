export const THEMES = {
  animal: {
    label: "Pawzz · Animal care",
    shortLabel: "Animal care",
    brand: "PAWZZ",
    brandSub: "Animal care",
    handle: "@pawzz.care",
    primary: "#0F6B63",
    primaryDark: "#0A4F49",
    accent: "#F2A33A",
    accentDark: "#D98A24",
    surface: "#FBF6EC",
    surfaceAlt: "#F4ECDD",
    card: "#FFFFFF",
    ink: "#1D2B2A",
    muted: "#5E6F6C",
    border: "#E4DDCC",
    emergency: "#C23A3A",
    success: "#2E8B57",
    displayFont: "Fraunces",
    bodyFont: "Plus Jakarta Sans",
    disclaimer:
      "General information only. This is not a substitute for veterinary advice. If you are worried about your pet, contact a licensed vet.",
  },
  edu: {
    label: "Lumen AI Academy",
    shortLabel: "AI education",
    brand: "LUMEN",
    brandSub: "AI Academy",
    handle: "@lumen.ai",
    primary: "#3B3FD9",
    primaryDark: "#2E31B0",
    accent: "#C6F432",
    accentDark: "#B2E01C",
    surface: "#F6F6FF",
    surfaceAlt: "#EDEDF9",
    card: "#FFFFFF",
    ink: "#14152B",
    muted: "#55567A",
    border: "#E1E1F2",
    emergency: "#B4232F",
    success: "#1F7A45",
    displayFont: "Plus Jakarta Sans",
    bodyFont: "Plus Jakarta Sans",
    disclaimer:
      "General information only. Course outcomes and AI capabilities vary. Check current programme details before enrolling.",
  },
} as const;

export type ThemeName = keyof typeof THEMES;
export type Theme = (typeof THEMES)[ThemeName];

export const THEME_NAMES: ThemeName[] = ["animal", "edu"];

export function isThemeName(value: string): value is ThemeName {
  return value === "animal" || value === "edu";
}

export function themeVars(theme: ThemeName): Record<string, string> {
  const value = THEMES[theme];
  return {
    "--slide-primary": value.primary,
    "--slide-primary-dark": value.primaryDark,
    "--slide-accent": value.accent,
    "--slide-accent-dark": value.accentDark,
    "--slide-surface": value.surface,
    "--slide-surface-alt": value.surfaceAlt,
    "--slide-card": value.card,
    "--slide-ink": value.ink,
    "--slide-muted": value.muted,
    "--slide-border": value.border,
    "--slide-emergency": value.emergency,
    "--slide-success": value.success,
    "--slide-display-font": `"${value.displayFont}", ui-serif, Georgia, serif`,
    "--slide-body-font": `"${value.bodyFont}", ui-sans-serif, system-ui, sans-serif`,
  };
}

export function platformLabel(platform: "instagram" | "linkedin" | "both"): string {
  if (platform === "both") return "Instagram + LinkedIn";
  return platform === "instagram" ? "Instagram" : "LinkedIn";
}
