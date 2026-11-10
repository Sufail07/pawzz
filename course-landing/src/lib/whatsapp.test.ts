import { buildWhatsAppUrl, introMessage, whatsAppLink } from "./whatsapp";

describe("WhatsApp links", () => {
  it("strips formatting from the number and encodes the message", () => {
    const url = buildWhatsAppUrl("+91 90000 00000", "Hi there & hello");
    expect(url).toBe("https://wa.me/919000000000?text=Hi%20there%20%26%20hello");
    expect(url.startsWith("https://wa.me/")).toBe(true);
  });

  it("includes the chosen track in the intro message", () => {
    expect(introMessage("AI at Work")).toContain("AI at Work");
    expect(introMessage()).not.toContain("interested in");
    expect(whatsAppLink(introMessage("AI Foundations"))).toContain("AI%20Foundations");
  });
});
