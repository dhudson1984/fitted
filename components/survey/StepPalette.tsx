"use client";

import { PALETTES, type PaletteItem } from "@/lib/survey-data";

interface StepPaletteProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function StepPalette({ selected, onChange }: StepPaletteProps) {
  function toggle(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else {
      onChange([...selected, name]);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl" data-testid="step-palette">
      {PALETTES.map((palette: PaletteItem) => {
        const isSelected = selected.includes(palette.name);
        return (
          <button
            key={palette.name}
            type="button"
            onClick={() => toggle(palette.name)}
            data-testid={`palette-${palette.name.toLowerCase().replace(/\s+/g, "-")}`}
            className={`
              rounded-md border overflow-hidden text-left transition-all duration-200
              ${isSelected
                ? "border-charcoal ring-1 ring-charcoal"
                : "border-sand hover:border-stone"
              }
            `}
            style={{ borderWidth: "1.5px", animation: "fadeUp 0.4s ease both" }}
          >
            <div className="flex h-16">
              {palette.swatches.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 h-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className={`p-3 ${isSelected ? "bg-charcoal" : "bg-transparent"}`}>
              <div className={`font-medium text-[14px] ${isSelected ? "text-cream" : "text-charcoal"}`}>
                {palette.name}
              </div>
              <div className={`text-[12px] mt-0.5 ${isSelected ? "text-stone" : "text-muted"}`}>
                {palette.sub}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
