"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { wardrobeType } from "@/data/wardrobeData";

/*
  Palette
  Charcoal #292622 (primary) | Warm Gold #C18A35 (accent) | Ivory #F7F3ED | Beige #E8DED0 | Espresso #593719 | White #FFFFFF

  Layout: clean product cards. Photo on top, text on a white panel below so it is always easy to read.
  Pick one and a charcoal summary bar at the bottom shows your choice with the Continue button.
  Props, data and behaviour are unchanged.
*/

const TOTAL_STEPS = 6;
const CURRENT_STEP = 1;
const EASE = [0.22, 1, 0.36, 1];

const goldText = {
  backgroundImage: "linear-gradient(90deg,#C18A35 0%,#EBC882 50%,#C18A35 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F3ED]";

export default function WardrobeTypeStep({ formData, setFormData, nextStep }) {
  const reduce = useReducedMotion();
  const selectedItem = wardrobeType.find((i) => i.id === formData.type);

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.6, delay, ease: EASE },
        };

  return (
    <section className="font-body py-10">
      {/* Header */}
      <motion.div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16" {...rise()}>
        <span className="inline-flex items-center gap-2.5 rounded-full border border-[#C18A35]/40 bg-[#C18A35]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#292622]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C18A35]" aria-hidden="true" />
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </span>

        {/* Progress */}
        <div
          className="mx-auto mt-5 flex max-w-xs gap-1.5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={CURRENT_STEP}
          aria-label={`Step ${CURRENT_STEP} of ${TOTAL_STEPS}`}
        >
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i < CURRENT_STEP ? "bg-[#C18A35]" : "bg-[#292622]/10"
              }`}
            />
          ))}
        </div>

        <h1 className="font-heading mt-7 text-4xl font-bold leading-[1.1] text-[#292622] md:text-5xl lg:text-6xl">
          Choose Your <span style={goldText}>Wardrobe</span> Style
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#292622]/70">
          Select the wardrobe type that best suits your space and lifestyle. Get an instant estimate in just a few steps.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {wardrobeType.map((item, index) => {
          const selected = formData.type === item.id;

          return (
            <motion.button
              key={item.id}
              type="button"
              aria-pressed={selected}
              {...rise(index * 0.1)}
              onClick={() => setFormData({ ...formData, type: item.id })}
              className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white text-left transition-all duration-500 ${ring} ${
                selected
                  ? "-translate-y-1 shadow-[0_28px_55px_-22px_rgba(193,138,53,0.6)] ring-2 ring-[#C18A35]"
                  : "shadow-lg shadow-[#292622]/10 ring-1 ring-[#292622]/10 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#292622]/20"
              }`}
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8DED0]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />

                {/* Soft fade at the bottom of the photo */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgba(41,38,34,.35), rgba(41,38,34,0))",
                  }}
                />

                {/* Number */}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-widest text-[#292622] shadow-sm backdrop-blur-md">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Check badge */}
                <span
                  aria-hidden="true"
                  className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                    selected
                      ? "scale-100 bg-[#C18A35] text-[#292622] shadow-lg"
                      : "scale-75 bg-white/90 text-transparent opacity-0 group-hover:scale-100 group-hover:opacity-100"
                  }`}
                >
                  <Check size={18} strokeWidth={3} />
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <span className="mb-4 block h-0.5 w-10 rounded bg-[#C18A35] transition-all duration-500 group-hover:w-16" />

                <h3 className="font-heading text-2xl font-bold leading-tight text-[#292622]">
                  {item.title}
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-[#292622]/70">
                  {item.description}
                </p>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-[#E8DED0] pt-4">
                  <span
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      selected ? "text-[#593719]" : "text-[#292622] group-hover:text-[#593719]"
                    }`}
                  >
                    {selected ? "Selected" : "Select style"}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                      selected
                        ? "bg-[#C18A35] text-[#292622]"
                        : "bg-[#292622]/[0.06] text-[#292622] group-hover:bg-[#C18A35]"
                    }`}
                  >
                    {selected ? (
                      <Check size={16} strokeWidth={3} />
                    ) : (
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    )}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Summary + Continue bar */}
      <div className="sticky bottom-4 z-20 mx-auto mt-14 max-w-2xl px-1">
        <div
          className={`flex items-center justify-between gap-4 rounded-2xl border p-3 pl-4 shadow-2xl backdrop-blur-md transition-colors duration-500 sm:pl-5 ${
            selectedItem
              ? "border-[#C18A35]/40 bg-[#292622] shadow-[#292622]/40"
              : "border-[#292622]/10 bg-white/80 shadow-[#292622]/10"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3" aria-live="polite">
            {selectedItem ? (
              <>
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-[#C18A35]/60">
                  <Image src={selectedItem.image} alt="" fill sizes="44px" className="object-cover" />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#C18A35]">Your choice</span>
                  <span className="block truncate font-heading text-lg text-white">{selectedItem.title}</span>
                </span>
              </>
            ) : (
              <span className="text-sm text-[#292622]/65">Select a style above to continue</span>
            )}
          </div>

          <button
            type="button"
            disabled={!formData.type}
            onClick={nextStep}
            className={`group relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-xl px-7 py-3.5 text-[15px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 ${
              formData.type
                ? "bg-[#C18A35] text-[#292622] hover:-translate-y-0.5 focus-visible:ring-offset-[#292622]"
                : "cursor-not-allowed bg-[#E8DED0] text-[#292622]/40"
            }`}
          >
            {formData.type && (
              <span className="absolute inset-0 -translate-x-full bg-[#F7F3ED] transition-transform duration-500 group-hover:translate-x-0 motion-reduce:hidden" />
            )}
            <span className="relative inline-flex items-center gap-2.5">
              Continue
              <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}