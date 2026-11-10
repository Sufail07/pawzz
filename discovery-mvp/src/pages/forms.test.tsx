import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DataSourceProvider } from "../data/DataSourceContext";
import { ListBusiness } from "./ListBusiness";
import { Correction } from "./Correction";

function renderAt(ui: React.ReactNode, entry: string) {
  return render(
    <DataSourceProvider>
      <MemoryRouter initialEntries={[entry]}>{ui}</MemoryRouter>
    </DataSourceProvider>,
  );
}

describe("ListBusiness form", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("pawzz.datasource.v1", "sample");
  });

  it("shows validation errors and blocks empty submits", async () => {
    const user = userEvent.setup();
    renderAt(<ListBusiness />, "/list-business");

    await user.click(screen.getByRole("button", { name: "Submit listing" }));

    expect(await screen.findByText("Business name is required")).toBeInTheDocument();
    expect(screen.getByText("Choose a provider type")).toBeInTheDocument();
    expect(screen.getByText("Area is required")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required")).toBeInTheDocument();
    expect(
      screen.getByText("Please confirm you agree to be contacted"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Listing submitted")).not.toBeInTheDocument();
  });

  it("submits a valid listing and shows a confirmation", async () => {
    const user = userEvent.setup();
    renderAt(<ListBusiness />, "/list-business");

    await user.type(
      screen.getByLabelText("Business or organisation name"),
      "Harbour Paws Clinic",
    );
    await user.selectOptions(screen.getByLabelText("Provider type"), "clinic");
    await user.type(
      screen.getByLabelText("Area or locality"),
      "Fort Kochi",
    );
    await user.type(screen.getByLabelText("Phone number"), "+91 98470 12345");
    await user.type(
      screen.getByLabelText("Services offered"),
      "Vaccination, dental",
    );
    await user.type(screen.getByLabelText("Your name"), "Anita");
    await user.click(
      screen.getByRole("checkbox", {
        name: /I agree to be contacted/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Submit listing" }));

    expect(
      await screen.findByRole("heading", { name: "Listing submitted" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^PZ-/)).toBeInTheDocument();
  });

  it("pre-fills a claim from a provider id", () => {
    renderAt(<ListBusiness />, "/list-business?mode=claim&provider=cochin-pet-hospital");
    expect(
      screen.getByDisplayValue("Cochin Pet Hospital"),
    ).toBeInTheDocument();
    expect(screen.getByText("Claiming:")).toBeInTheDocument();
  });
});

describe("Correction form", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("pawzz.datasource.v1", "sample");
  });

  it("requires an issue and enough detail", async () => {
    const user = userEvent.setup();
    renderAt(<Correction />, "/correction?provider=rapid-paws-ambulance");

    await user.click(screen.getByRole("button", { name: "Submit correction" }));

    expect(await screen.findByText("Choose what is wrong")).toBeInTheDocument();
    expect(
      screen.getByText("Add at least a sentence of correct information"),
    ).toBeInTheDocument();
  });

  it("submits a valid correction", async () => {
    const user = userEvent.setup();
    renderAt(<Correction />, "/correction?provider=rapid-paws-ambulance");

    await user.selectOptions(
      screen.getByLabelText("What is wrong?"),
      "Wrong phone number",
    );
    await user.type(
      screen.getByLabelText("Correct information"),
      "The ambulance number changed to +91 98470 99999 last week.",
    );
    await user.click(
      screen.getByRole("checkbox", {
        name: /I confirm this correction/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Submit correction" }));

    expect(
      await screen.findByRole("heading", { name: "Correction submitted" }),
    ).toBeInTheDocument();
  });
});
