import { toPng, getFontEmbedCSS } from "html-to-image";
import { LAYOUT_LABELS } from "../../shared/limits";
import { slugify, type Carousel } from "../../shared/schema";
import { platformLabel, THEMES } from "../../shared/themes";

export function fileBase(carousel: Carousel): string {
  const headline = carousel.chosen_headline || carousel.brief.idea;
  return `${slugify(headline)}-${carousel.brief.theme}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadText(text: string, filename: string, type = "text/plain;charset=utf-8"): void {
  downloadBlob(new Blob([text], { type }), filename);
}

async function prepareFonts(): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
}

async function renderNode(node: HTMLElement, backgroundColor: string): Promise<string> {
  return toPng(node, {
    width: 1080,
    height: 1350,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor,
  });
}

export async function exportPngZip(
  carousel: Carousel,
  nodes: HTMLElement[],
): Promise<void> {
  await prepareFonts();
  const theme = THEMES[carousel.brief.theme];
  const base = fileBase(carousel);
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  let fontEmbedCSS = "";
  try {
    fontEmbedCSS = await getFontEmbedCSS(nodes[0], { cacheBust: true });
  } catch {
    fontEmbedCSS = "";
  }

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node) continue;
    const dataUrl = await toPng(node, {
      width: 1080,
      height: 1350,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: theme.surface,
      ...(fontEmbedCSS ? { fontEmbedCSS } : {}),
    });
    const base64 = dataUrl.split(",")[1] ?? "";
    zip.file(`${base}-${String(index + 1).padStart(2, "0")}.png`, base64, { base64: true });
  }

  zip.file(`${base}-copy-deck.md`, buildCopyDeck(carousel));
  zip.file(`${base}.json`, JSON.stringify(carousel, null, 2));
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `${base}-instagram-png.zip`);
}

export async function exportPdf(carousel: Carousel, nodes: HTMLElement[]): Promise<void> {
  await prepareFonts();
  const theme = THEMES[carousel.brief.theme];
  const base = fileBase(carousel);
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [1080, 1350],
    compress: true,
  });

  let fontEmbedCSS = "";
  try {
    fontEmbedCSS = await getFontEmbedCSS(nodes[0], { cacheBust: true });
  } catch {
    fontEmbedCSS = "";
  }

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node) continue;
    const dataUrl = await toPng(node, {
      width: 1080,
      height: 1350,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: theme.surface,
      ...(fontEmbedCSS ? { fontEmbedCSS } : {}),
    });
    if (index > 0) pdf.addPage([1080, 1350], "portrait");
    pdf.addImage(dataUrl, "PNG", 0, 0, 1080, 1350, undefined, "FAST");
  }

  downloadBlob(pdf.output("blob"), `${base}-linkedin.pdf`);
}

export async function exportSinglePng(
  carousel: Carousel,
  node: HTMLElement,
  index: number,
): Promise<void> {
  await prepareFonts();
  const theme = THEMES[carousel.brief.theme];
  const base = fileBase(carousel);
  const dataUrl = await renderNode(node, theme.surface);
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  downloadBlob(blob, `${base}-${String(index + 1).padStart(2, "0")}.png`);
}

export function buildCopyDeck(carousel: Carousel): string {
  const theme = THEMES[carousel.brief.theme];
  const lines: string[] = [];
  lines.push(`# ${carousel.chosen_headline || carousel.brief.idea}`);
  lines.push("");
  lines.push(`Brand: ${theme.label}`);
  lines.push(`Theme: ${carousel.brief.theme}`);
  lines.push(`Platform: ${platformLabel(carousel.brief.platform)}`);
  lines.push(`Audience: ${carousel.brief.audience}`);
  lines.push(`Status: ${carousel.status}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  carousel.slides.forEach((slide, index) => {
    lines.push(`## Slide ${index + 1} · ${LAYOUT_LABELS[slide.layout]}`);
    if (slide.layout === "hook") {
      lines.push(`Title: ${slide.title}`);
      lines.push(`Subtitle: ${slide.subtitle}`);
    } else if (slide.layout === "statement") {
      lines.push(`Title: ${slide.title}`);
      lines.push(`Body: ${slide.body}`);
    } else if (slide.layout === "list") {
      lines.push(`Title: ${slide.title}`);
      slide.items.forEach((item) => lines.push(`- ${item}`));
    } else if (slide.layout === "stat") {
      lines.push(`Number: ${slide.number}`);
      lines.push(`Label: ${slide.label}`);
      lines.push(`Source: ${slide.source}`);
    } else if (slide.layout === "quote") {
      lines.push(`Tip: ${slide.body}`);
      lines.push(`Label: ${slide.label}`);
    } else if (slide.layout === "cta") {
      lines.push(`Action: ${slide.title}`);
      lines.push(`Handle: ${slide.handle}`);
    }
    if (slide.notes) lines.push(`Notes: ${slide.notes}`);
    lines.push("");
  });

  lines.push("---");
  lines.push("");
  lines.push("## Caption");
  lines.push(carousel.caption);
  lines.push("");
  lines.push("## Hashtags");
  lines.push(carousel.hashtags.join(" "));
  lines.push("");
  lines.push("## Sources");
  const seen = new Set<string>();
  carousel.research.key_points.forEach((point) => {
    if (!point.source_url || seen.has(point.source_url)) return;
    seen.add(point.source_url);
    lines.push(`- ${point.source_title || point.source_url} — ${point.source_url}`);
  });
  if (seen.size === 0) {
    carousel.research.sources.forEach((source) => {
      if (seen.has(source.url)) return;
      seen.add(source.url);
      lines.push(`- ${source.title || source.url} — ${source.url}`);
    });
  }
  lines.push("");
  lines.push("## Disclaimer");
  lines.push(carousel.disclaimer || theme.disclaimer);
  lines.push("");
  return lines.join("\n");
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}
