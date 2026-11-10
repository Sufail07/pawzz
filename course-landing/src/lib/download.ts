import { site } from "../content/site";

export function triggerSyllabusDownload(): void {
  if (typeof document === "undefined") return;
  if (import.meta.env.MODE === "test") return;
  try {
    const anchor = document.createElement("a");
    anchor.href = site.syllabusPath;
    anchor.download = "AI_Skills_Studio_Sample_Syllabus.pdf";
    anchor.rel = "noopener";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  } catch {
    // The on-screen download button is always available as a fallback.
  }
}
