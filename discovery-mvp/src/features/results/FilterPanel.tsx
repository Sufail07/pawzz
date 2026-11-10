import { SlidersHorizontal } from "lucide-react";
import {
  ALL_LANGUAGES,
  DISTANCE_STEPS,
  SERVICE_FILTERS,
  type SearchState,
} from "../../lib/search";
import { SPECIES_LABELS, PROVIDER_TYPE_LABELS } from "../../data/types";
import type { Species } from "../../data/types";
import type { DataMode } from "../../data/DataSourceContext";
import { Chip } from "../../components/ui/Chip";
import { Toggle } from "../../components/ui/Toggle";
import { Button } from "../../components/ui/Button";

const SPECIES_ORDER: Species[] = [
  "dog",
  "cat",
  "bird",
  "exotic",
  "livestock",
  "small-mammal",
];

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

interface FilterPanelProps {
  state: SearchState;
  onChange: (patch: Partial<SearchState>) => void;
  onClear: () => void;
  footer?: React.ReactNode;
  headingLevel?: "h2" | "h3";
  mode?: DataMode;
}

export function FilterPanel({
  state,
  onChange,
  onClear,
  footer,
  headingLevel = "h2",
  mode = "sample",
}: FilterPanelProps) {
  const Heading = headingLevel;
  const live = mode === "osm";
  const serviceOptions = state.type ? SERVICE_FILTERS[state.type] : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <Heading className="flex items-center gap-2 text-base font-bold">
          <SlidersHorizontal className="size-4 text-pfa-primary" aria-hidden />
          Filters
        </Heading>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>

      {live && (
        <p className="rounded-xl border border-[#d9e8e4] bg-[#f1f8f6] p-3 text-xs leading-relaxed text-[#3f6a63]">
          Live OSM listings often lack phone, hours, species and services. Only
          filters supported by real data are shown; switch to the sample demo for
          the full filter set.
        </p>
      )}

      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
          Provider type
        </legend>
        <select
          aria-label="Provider type"
          value={state.type}
          onChange={(event) =>
            onChange({
              type: event.target.value as SearchState["type"],
              services: [],
            })
          }
          className="min-h-11 w-full rounded-input border border-pfa-border bg-pfa-card px-3 text-sm font-medium text-pfa-ink focus:border-pfa-primary focus:outline-none"
        >
          <option value="">All provider types</option>
          {Object.entries(PROVIDER_TYPE_LABELS).map(([type, label]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
          Availability
        </legend>
        <Toggle
          label="Open now"
          checked={state.openNow}
          onChange={(value) => onChange({ openNow: value })}
        />
        <Toggle
          label="24x7"
          description="Open round the clock"
          checked={state.is24x7}
          onChange={(value) => onChange({ is24x7: value })}
        />
        {!live && (
          <Toggle
            label="Home visit or pickup"
            checked={state.homeVisit}
            onChange={(value) => onChange({ homeVisit: value })}
          />
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
          Distance
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {DISTANCE_STEPS.map((step) => (
            <Chip
              key={step}
              selected={state.maxDistanceKm === step}
              onClick={() => onChange({ maxDistanceKm: step })}
            >
              {step === 25 ? "25 km+" : `${step} km`}
            </Chip>
          ))}
        </div>
      </fieldset>

      {!live && (
      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
          Species treated
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {SPECIES_ORDER.map((species) => (
            <Chip
              key={species}
              selected={state.species.includes(species)}
              onClick={() =>
                onChange({ species: toggleValue(state.species, species) })
              }
            >
              {SPECIES_LABELS[species]}
            </Chip>
          ))}
        </div>
      </fieldset>
      )}

      {!live && (
      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
          Languages spoken
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {ALL_LANGUAGES.map((language) => (
            <Chip
              key={language}
              selected={state.languages.includes(language)}
              onClick={() =>
                onChange({ languages: toggleValue(state.languages, language) })
              }
            >
              {language}
            </Chip>
          ))}
        </div>
      </fieldset>
      )}

      {!live && (
      <fieldset className="space-y-3">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
          Trust
        </legend>
        <Toggle
          label="Verified only"
          description="Phone-verified or visited"
          checked={state.verifiedOnly}
          onChange={(value) => onChange({ verifiedOnly: value })}
        />
      </fieldset>
      )}

      {!live && state.type && serviceOptions.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-pfa-muted">
            {state.type === "boarding"
              ? "Facilities"
              : state.type === "diagnostics"
                ? "Tests"
                : state.type === "ambulance"
                  ? "Equipment"
                  : state.type === "ngo"
                    ? "Focus"
                    : "Services"}
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {serviceOptions.map((service) => (
              <Chip
                key={service}
                selected={state.services.includes(service)}
                onClick={() =>
                  onChange({ services: toggleValue(state.services, service) })
                }
              >
                {service}
              </Chip>
            ))}
          </div>
        </fieldset>
      )}

      {footer}
    </div>
  );
}
