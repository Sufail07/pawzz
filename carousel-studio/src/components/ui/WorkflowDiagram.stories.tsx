import { type Meta, type StoryObj } from "@storybook/react";
import { SampleCarousel } from "./SampleCarousel";

const meta: Meta<typeof SampleCarousel> = {
  title: "Pages/WorkflowDiagram",
  component: SampleCarousel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SampleCarousel>;

export const Default: Story = {
  args: {
    demoMode: true,
    slides: 8,
    outline: "exported copy deck",
  },
};
