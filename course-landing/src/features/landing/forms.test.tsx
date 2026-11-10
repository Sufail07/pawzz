import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LeadProvider } from "../../components/lead/LeadContext";
import { IntroLeadForm } from "../../components/lead/IntroLeadForm";
import { SyllabusLeadForm } from "../../components/lead/SyllabusLeadForm";
import { Home } from "../../pages/Home";
import { readLeads } from "../../lib/submit";
import { resetUtmForTests } from "../../lib/utm";

function renderWithProviders(ui: React.ReactNode) {
  return render(
    <MemoryRouter>
      <LeadProvider>{ui}</LeadProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  resetUtmForTests();
});

describe("intro lead form", () => {
  it("validates required fields inline", async () => {
    const user = userEvent.setup();
    renderWithProviders(<IntroLeadForm initialTrack="foundations" idPrefix="test" />);

    await user.click(screen.getByRole("button", { name: /book my free intro/i }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp number is required")).toBeInTheDocument();
    expect(screen.getByText("Please agree to be contacted")).toBeInTheDocument();
    expect(readLeads()).toHaveLength(0);
  });

  it("submits, shows the confirmation and records source data", async () => {
    window.sessionStorage.setItem(
      "lumen.utm.v1",
      JSON.stringify({
        utm_source: "instagram",
        utm_medium: "social",
        utm_campaign: "launch",
      }),
    );
    const user = userEvent.setup();
    renderWithProviders(<IntroLeadForm initialTrack="at-work" idPrefix="test" />);

    await user.type(screen.getByLabelText("Full name"), "Asha Menon");
    await user.type(screen.getByLabelText("WhatsApp number"), "98765 43210");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /book my free intro/i }));

    expect(
      await screen.findByRole("heading", { name: "You're booked in" }),
    ).toBeInTheDocument();

    const [lead] = readLeads();
    expect(lead.kind).toBe("intro_call");
    expect(lead.payload).toMatchObject({
      name: "Asha Menon",
      whatsapp: "+919876543210",
      track: "AI at Work",
      track_id: "at-work",
      lead_type: "intro_call",
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "launch",
      page_variant: "course-landing-v1",
      consent: true,
    });
  });
});

describe("syllabus form", () => {
  it("rejects a bad email, then reveals the PDF link", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyllabusLeadForm idPrefix="test" />);

    await user.type(screen.getByLabelText("Full name"), "Asha");
    await user.type(screen.getByLabelText("Email address"), "nope");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /download the syllabus/i }));

    expect(
      screen.getByText("Enter a valid email address"),
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Email address"));
    await user.type(screen.getByLabelText("Email address"), "asha@example.com");
    await user.click(screen.getByRole("button", { name: /download the syllabus/i }));

    expect(
      await screen.findByRole("heading", { name: "Your syllabus is ready" }),
    ).toBeInTheDocument();

    const download = screen.getByRole("link", { name: /download the syllabus/i });
    expect(download).toHaveAttribute(
      "href",
      "/AI_Skills_Studio_Sample_Syllabus.pdf",
    );

    const [lead] = readLeads();
    expect(lead.kind).toBe("syllabus");
    expect(lead.payload).toMatchObject({ lead_type: "syllabus" });
  });
});

describe("track switcher", () => {
  it("updates the outcomes for the selected track and remembers it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /what you'll be able to do on ai foundations/i,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "AI at Work" }));

    expect(
      screen.getByRole("heading", {
        name: /what you'll be able to do on ai at work/i,
      }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem("lumen.track.v1")).toBe("at-work");
  });

  it("supports arrow-key navigation of the track picker", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);

    const first = screen.getByRole("radio", { name: "AI Foundations" });
    first.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "AI at Work" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
