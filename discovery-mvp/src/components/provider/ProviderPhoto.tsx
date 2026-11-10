import {
  Ambulance,
  Bird,
  Cat,
  Dog,
  FlaskConical,
  HeartHandshake,
  Hospital,
  PawPrint,
  Rabbit,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { Provider, ProviderType } from "../../data/types";
import { cn } from "../../lib/cn";
import { initials } from "../../lib/format";

const gradients: Record<ProviderType, string> = {
  clinic: "from-[#dcefec] to-[#bfe3de] text-[#0f6b63]",
  hospital: "from-[#fde8d7] to-[#f9d3b4] text-[#9a5316]",
  boarding: "from-[#f6ecd2] to-[#ecdcb4] text-[#7a5514]",
  diagnostics: "from-[#e2e6fb] to-[#cbd2f7] text-[#3b3fd9]",
  ambulance: "from-[#fbe1e1] to-[#f6c8c8] text-[#a52f2f]",
  ngo: "from-[#dff0e6] to-[#c4e6d2] text-[#1f6b41]",
};

const icons: Record<ProviderType, LucideIcon> = {
  clinic: Stethoscope,
  hospital: Hospital,
  boarding: PawPrint,
  diagnostics: FlaskConical,
  ambulance: Ambulance,
  ngo: HeartHandshake,
};

export function ProviderPhoto({
  provider,
  className,
}: {
  provider: Provider;
  className?: string;
}) {
  const Icon = icons[provider.type];
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br",
        gradients[provider.type],
        className,
      )}
      aria-hidden
    >
      <span className="absolute -right-4 -top-5 opacity-20">
        <Icon className="size-20" strokeWidth={1.5} />
      </span>
      <span className="relative font-display text-xl font-bold">
        {initials(provider.name)}
      </span>
    </div>
  );
}

export function SpeciesIcons({
  species,
  className,
}: {
  species: Provider["speciesTreated"];
  className?: string;
}) {
  const map = {
    dog: Dog,
    cat: Cat,
    bird: Bird,
    exotic: Rabbit,
    livestock: PawPrint,
    "small-mammal": Rabbit,
  };

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {species.slice(0, 4).map((item) => {
        const Icon = map[item];
        return <Icon key={item} className="size-4" aria-hidden />;
      })}
    </span>
  );
}
