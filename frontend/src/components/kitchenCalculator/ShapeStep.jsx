"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { kitchenShapes } from "@/data/kitchenCalculatorData";

/*
  Palette: Espresso #593719 | Warm Gold #dba343 | Ivory #F7F3ED | Soft Beige #E8DED0 | Charcoal #292622 | White
  - Title, step count and Back live in KitchenCostCalculator now.
  - Layouts are real radio buttons. The preview shows the selected layout (or the first one until you choose).
  - Removed: rainbow icon colours, the endlessly spinning icon, and "Scroll down to see action buttons".
  - "Best for" and "Work triangle" only appear when your data has them (no made-up "Various spaces").
*/

export default function ShapeStep({ selected, onSelect, onNext }) {
  const active = kitchenShapes.find((s) => s.id === selected) || kitchenShapes[0];

  return (
    <div>
      <p className="font-body max-w-xl text-[15px] font-light leading-7 text-[#292622]/75">
        Select the layout that matches your space and the way you cook.
      </p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Preview (first on phones so you see what you're choosing) */}
        <div className="order-1 rounded-sm border border-[#E8DED0] bg-[#F7F3ED] p-4 sm:p-5 lg:order-2 lg:sticky lg:top-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-white lg:aspect-square">
            <Image
              key={active.id}
              src={active.image}
              alt={`${active.title} kitchen layout`}
              fill
              priority
              sizes="(min-width: 1024px) 400px, 90vw"
              className="object-contain p-3"
            />
          </div>
          <p className="font-heading mt-4 text-2xl text-[#292622]">{active.title}</p>
          {(active.bestFor || active.workTriangle) && (
            <dl className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["Best for", active.bestFor],
                ["Work triangle", active.workTriangle],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="rounded-sm bg-white p-3">
                    <dt className="font-body text-[11px] uppercase tracking-[0.18em] text-[#292622]/60">{k}</dt>
                    <dd className="font-body mt-1 text-sm text-[#292622]">{v}</dd>
                  </div>
                ))}
            </dl>
          )}
        </div>

        {/* Choices */}
        <fieldset className="order-2 lg:order-1">
          <legend className="sr-only">Kitchen layout</legend>
          <div className="space-y-3">
            {kitchenShapes.map((shape) => {
              const on = selected === shape.id;
              return (
                <label key={shape.id} className="relative block">
                  <input type="radio" name="shape" value={shape.id} checked={on} onChange={() => onSelect(shape.id)} className="peer sr-only" />
                  <span className="flex cursor-pointer items-start gap-4 rounded-sm border border-[#292622]/20 bg-[#F7F3ED] p-5 transition-colors duration-300 hover:border-[#593719] peer-checked:border-[#593719] peer-checked:bg-white peer-checked:ring-1 peer-checked:ring-[#593719] peer-focus-visible:ring-2 peer-focus-visible:ring-[#dba343] peer-focus-visible:ring-offset-2">
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-[#593719] bg-[#593719] text-[#F7F3ED]" : "border-[#292622]/30 bg-white"}`}
                    >
                      {on && <Check size={14} />}
                    </span>
                    <span className="min-w-0">
                      <span className="font-heading block text-xl leading-tight text-[#292622]">{shape.title}</span>
                      <span className="font-body mt-1.5 block text-sm font-light leading-6 text-[#292622]/70">{shape.description}</span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3">
        <button
          type="button"
          onClick={onNext}
          disabled={!selected}
          aria-describedby={!selected ? "shape-hint" : undefined}
          className="font-body group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#593719] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F3ED] transition-colors duration-300 hover:bg-[#dba343] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#E8DED0] disabled:text-[#292622]/50 sm:w-auto"
        >
          Continue
          <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
        </button>
        {!selected && (
          <p id="shape-hint" className="font-body text-sm text-[#292622]/60">
            Choose a layout to continue.
          </p>
        )}
      </div>
    </div>
  );
}