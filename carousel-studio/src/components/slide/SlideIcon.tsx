import {
  Activity,
  ArrowRight,
  BookOpen,
  Bone,
  Bot,
  Brain,
  Calendar,
  Cat,
  CircleCheck,
  Clock,
  Dog,
  Droplet,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  MapPin,
  MessageCircle,
  Moon,
  PawPrint,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Syringe,
  Target,
  Thermometer,
  TriangleExclamationPoint,
  Utensils,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "../../../shared/limits";

const ICON_MAP: Record<IconName, LucideIcon> = {
  activity: Activity,
  "alert-triangle": TriangleExclamationPoint,
  "arrow-right": ArrowRight,
  "book-open": BookOpen,
  bone: Bone,
  bot: Bot,
  brain: Brain,
  calendar: Calendar,
  cat: Cat,
  "check-circle": CircleCheck,
  clock: Clock,
  dog: Dog,
  droplet: Droplet,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  lightbulb: Lightbulb,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  moon: Moon,
  "paw-print": PawPrint,
  phone: Phone,
  rocket: Rocket,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  sun: Sun,
  syringe: Syringe,
  target: Target,
  thermometer: Thermometer,
  utensils: Utensils,
  wind: Wind,
  zap: Zap,
};

export function SlideIcon({
  name,
  className,
  strokeWidth = 1.8,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICON_MAP[name] ?? PawPrint;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
