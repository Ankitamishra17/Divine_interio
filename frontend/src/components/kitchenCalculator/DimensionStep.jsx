"use client";

import { ArrowRight, Building2, Check, Home, PencilRuler, Sofa } from "lucide-react";
import { dimensions } from "@/data/kitchenCalculatorData";

/*
  Palette: Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED | Soft Beige #E8DED0 | Charcoal #292622 | White
  The title, "Step 1 of 4" and Back button now live in KitchenCostCalculator, so they are not repeated here.
  Sizes are real radio buttons (arrow keys work, screen readers say "1 of 5").
*/

const dimensionDetails = {
  "8x10": { icon: Home, sqft: "80 sq ft", label: "Compact" },
  "10x12": { icon: Sofa, sqft: "120 sq ft", label: "Standard" },
  "12x15": { icon: Building2, sqft: "180 sq ft", label: "Spacious" },
  "15x18": { icon: Building2, sqft: "270 sq ft", label: "Grand" },
};
const customDetails = { icon: PencilRuler, sqft: "Share your size on the next screen", label: "Custom" };

export default function DimensionStep({ selected, onSelect, onNext }) {
  return (
    <div>
      <p className="font-body max-w-xl text-[15px] font-light leading-7 text-[#292622]/75">
        Pick the closest match to your kitchen&rsquo;s total floor space. The final cost depends on your choices in the next steps.
      </p>

      <fieldset className="mt-6">
        <legend className="sr-only">Kitchen size</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {dimensions.map((dimension) => {
            const info = dimensionDetails[dimension] || customDetails;
            const Icon = info.icon;
            const on = selected === dimension;
            return (
              <label key={dimension} className="relative block">
                <input
                  type="radio"
                  name="dimension"
                  value={dimension}
                  checked={on}
                  onChange={() => onSelect(dimension)}
                  className="peer sr-only"
                />
                <span className="flex h-full cursor-pointer items-center gap-4 rounded-sm border border-[#292622]/20 bg-[#F7F3ED] p-5 transition-colors duration-300 hover:border-[#593719] peer-checked:border-[#593719] peer-checked:bg-white peer-checked:ring-1 peer-checked:ring-[#593719] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C18A35] peer-focus-visible:ring-offset-2">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${on ? "bg-[#C18A35] text-[#292622]" : "bg-white text-[#593719]"}`}>
                    <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-heading block text-2xl leading-tight text-[#292622]">{dimension}</span>
                    <span className="font-body mt-1 block text-sm text-[#292622]/65">
                      <span className="font-medium text-[#593719]">{info.label}</span> · {info.sqft}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-[#593719] bg-[#593719] text-[#F7F3ED]" : "border-[#292622]/30 bg-white"}`}
                  >
                    {on && <Check size={14} />}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col items-start gap-3">
        <button
          type="button"
          onClick={onNext}
          disabled={!selected}
          aria-describedby={!selected ? "dimension-hint" : undefined}
          className="font-body group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#593719] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#E8DED0] disabled:text-[#292622]/50 sm:w-auto"
        >
          Continue
          <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
        </button>
        {!selected && (
          <p id="dimension-hint" className="font-body text-sm text-[#292622]/60">
            Choose a size to continue.
          </p>
        )}
      </div>
    </div>
  );
}