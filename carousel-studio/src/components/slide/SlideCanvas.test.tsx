import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideCanvas } from "./SlideCanvas";
import { animalSample } from "../../../shared/fixtures/samples";

describe("slide canvas", () => {
  it("renders every sample layout without throwing", () => {
    for (const [index, slide] of animalSample.slides.entries()) {
      const { unmount } = render(
        <SlideCanvas slide={slide} theme="animal" index={index} />,
      );
      expect(document.querySelector(`[data-layout="${slide.layout}"]`)).not.toBeNull();
      unmount();
    }
  });

  it("shows the hook title and slide number", () => {
    const hook = animalSample.slides[0];
    if (!hook) throw new Error("Sample hook slide missing");
    render(<SlideCanvas slide={hook} theme="animal" index={0} />);
    expect(screen.getByText("5 signs your pet needs a vet today")).toBeInTheDocument();
    expect(screen.getByText("01 / 09")).toBeInTheDocument();
  });

  it("renders the education theme with the same template set", () => {
    const slide = { ...animalSample.slides[0]!, title: "An AI course hook" };
    render(<SlideCanvas slide={slide} theme="edu" index={0} />);
    expect(screen.getByText("An AI course hook")).toBeInTheDocument();
    expect(document.querySelector('[data-theme="edu"]')).not.toBeNull();
  });
});
