import { site } from "../content/site";

export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function introMessage(trackName?: string): string {
  const base = "Hi Lumen AI Academy, I would like to book a free intro session.";
  return trackName ? `${base} I am interested in ${trackName}.` : base;
}

export function syllabusMessage(): string {
  return "Hi Lumen AI Academy, I would like to know more about the programme syllabus.";
}

export function whatsAppLink(message: string): string {
  return buildWhatsAppUrl(site.whatsappNumber, message);
}
