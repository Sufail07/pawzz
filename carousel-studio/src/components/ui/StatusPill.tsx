import { CircleCheck, CircleDashed, FileCheck } from "lucide-react";
import type { Carousel } from "../../../shared/schema";
import { Badge } from "./Badge";

const STATUS = {
  draft: { label: "Draft", tone: "neutral" as const, icon: CircleDashed },
  facts_approved: { label: "Facts approved", tone: "info" as const, icon: CircleCheck },
  final: { label: "Final", tone: "success" as const, icon: FileCheck },
};

export function StatusPill({ carousel }: { carousel: Carousel }) {
  const value = STATUS[carousel.status];
  const Icon = value.icon;
  return (
    <Badge tone={value.tone}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {value.label}
    </Badge>
  );
}
