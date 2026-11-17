"use client";

import { ArrowRight, Check } from "lucide-react";
import { packages } from "@/data/kitchenCalculatorData";

/*
  Palette: Espresso #593719 | Warm Gold #dba343 | Ivory #F7F3ED | Soft Beige #E8DED0 | Charcoal #292622 | White
  - Title, step count and Back live in KitchenCostCalculator now.
  - Each package is one real radio card. (Before, a clickable <div> held another <button>, so keyboard
    users couldn't pick a package.) Package colours (green, blue, black) are replaced by the site palette.
  - The price is the biggest thing on each card, so packages are easy to compare.
*/

export default function PackageStep({ selected, onSelect, onNext }) {
  return (
    <div>
      <p className="font-body max-w-xl text-[15px] font-light leading-7 text-[#292622]/75">
        Choose the package that best suits your requirements. You can discuss changes with our team later.
      </p>

      <fieldset className="mt-6">
        <legend className="sr-only">Package</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const on = selected === pkg.id;
            return (
              <label key={pkg.id} className="relative block h-full">
                <input type="radio" name="package" value={pkg.id} checked={on} onChange={() => onSelect(pkg.id)} className="peer sr-only" />
                <span className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-sm border border-[#292622]/20 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#593719] peer-checked:border-[#593719] peer-checked:ring-1 peer-checked:ring-[#593719] peer-focus-visible:ring-2 peer-focus-visible:ring-[#dba343] peer-focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <span aria-hidden="true" className={`block h-[3px] w-full transition-colors ${on ? "bg-[#dba343]" : "bg-[#E8DED0]"}`} />

                  <span className={`flex items-start justify-between gap-3 p-5 transition-colors duration-300 ${on ? "bg-[#F7F3ED]" : ""}`}>
                    <span className="min-w-0">
                      <span className="font-heading block text-2xl leading-tight text-[#292622]">{pkg.name}</span>
                      <span className="font-body mt-2 block text-lg font-semibold text-[#593719]">{pkg.price}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-[#593719] bg-[#593719] text-[#F7F3ED]" : "border-[#292622]/30 bg-white"}`}
                    >
                      {on && <Check size={14} />}
                    </span>
                  </span>

                  <ul className="flex-1 space-y-3 border-t border-[#E8DED0] p-5">
                    {pkg.features.map((item, i) => (
                      <li key={i} className="font-body flex items-start gap-3 text-sm leading-6 text-[#292622]/80">
                        <Check size={16} className="mt-1 shrink-0 text-[#dba343]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <span className={`font-body block border-t border-[#E8DED0] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${on ? "bg-[#593719] text-[#F7F3ED]" : "text-[#593719]"}`}>
                    {on ? "Selected" : "Select package"}
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
          aria-describedby={!selected ? "package-hint" : undefined}
          className="font-body group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#593719] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F3ED] transition-colors duration-300 hover:bg-[#dba343] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#E8DED0] disabled:text-[#292622]/50 sm:w-auto"
        >
          Continue to details
          <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
        </button>
        {!selected && (
          <p id="package-hint" className="font-body text-sm text-[#292622]/60">
            Choose a package to continue.
          </p>
        )}
      </div>
    </div>
  );
}