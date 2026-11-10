import { useState } from "react";
import { cn } from "@/components/ui/utils";


interface PipelineStage {
  id: number;
  name: string;
  input: string;
  tool: string;
  output: string;
  humanGate: boolean;
}

const STAGES: PipelineStage[] = [
  { id: 1, name: "Intake", input: "Raw idea, audience, platform, theme", tool: "Typeform / form", output: "Structured brief", humanGate: false },
  { id: 2, name: "Research", input: "Brief + topic", tool: "Web search + LLM", output: "Key points with sources", humanGate: false },
  { id: 3, name: "Fact check", input: "Key points", tool: "Human review", output: "Approved / removed points", humanGate: true },
  { id: 4, name: "Copywriting", input: "Approved points", tool: "LLM copy generation", output: "Slide copy + captions", humanGate: false },
  { id: 5, name: "Visual design", input: "Copy + theme", tool: "Template library (6 layouts)", output: "Slide decks", humanGate: false },
  { id: 6, name: "Render", input: "Slide decks", tool: "Image export", output: "Instagram PNG + LinkedIn PDF", humanGate: false },
  { id: 7, name: "Publish", input: "Exported files", tool: "Human gate + scheduler", output: "Published carousel", humanGate: true },
];

interface PipelineStepperProps {
  onStageSelect?: (stage: PipelineStage) => void;
}

export function PipelineStepper({ onStageSelect }: PipelineStepperProps = {}) {
  const [selected, setSelected] = useState<PipelineStage | null>(STAGES[2]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {STAGES.map((stage) => {
          const isActive = selected?.id === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => {
                setSelected(stage);
                onStageSelect?.(stage);
              }}
              className={cn(
                "flex flex-col items-center gap-2 px-4 py-3 rounded-[12px] border transition-all duration-200",
                isActive
                  ? "bg-edu-highlight border-edu-highlight text-ink shadow-lg scale-105"
                  : "bg-surface border-line text-muted hover:border-ink/40",
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                  isActive ? "bg-ink text-surface" : "bg-surface text-muted border border-line",
                )}
              >
                {stage.id}
              </span>
              <span className="text-[11px] font-medium text-center leading-tight">
                {stage.name}
              </span>
              {stage.humanGate && (
                <span className="mt-1 px-2 py-0.5 rounded-full bg-edu-highlight text-ink text-[10px] font-bold uppercase tracking-wider">
                  Human gate
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="rounded-[16px] border border-line bg-surface p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="font-display font-bold text-2xl text-ink mb-2">
                {selected.name}
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Input</span>
                  <p className="text-sm text-ink mt-1">{selected.input}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Tool</span>
                  <p className="text-sm text-ink mt-1">{selected.tool}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Output</span>
                  <p className="text-sm text-ink mt-1">{selected.output}</p>
                </div>
              </div>
            </div>
            <div className="w-1 h-full bg-line hidden md:block" />
            <div className="flex-1">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                {stageGateLabel(selected.humanGate)}
              </span>
              <p className="text-sm text-ink mt-1">
                {selected.humanGate
                  ? "A human reviews and approves before moving to the next stage."
                  : "Automated stage — output feeds directly into the next step."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function stageGateLabel(isGate: boolean) {
  return isGate ? "Review gate" : "Automated";
}
