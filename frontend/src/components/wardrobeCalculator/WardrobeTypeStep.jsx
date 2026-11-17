"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { wardrobeType } from "@/data/wardrobeData";

/*
  Palette
  Charcoal #292622 (primary) | Warm Gold #C18A35 (accent) | Ivory #F7F3ED | Beige #E8DED0 | Espresso #593719 | White #FFFFFF

  Layout: big photo cards with the text on the image. Pick one and a charcoal summary bar slides up
  at the bottom with a thumbnail of your choice and the Continue button.
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
              className={`group relative isolate h-[420px] overflow-hidden rounded-3xl text-left transition-all duration-500 sm:h-[460px] lg:h-[500px] ${ring} ${
                selected
                  ? "-translate-y-1 shadow-[0_30px_60px_-20px_rgba(193,138,53,0.55)] ring-2 ring-[#C18A35] ring-offset-4 ring-offset-[#F7F3ED]"
                  : "shadow-xl shadow-[#292622]/15 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#292622]/25"
              }`}
            >
              {/* Photo */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="-z-20 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />

              {/* Charcoal overlay */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(41,38,34,.95) 0%, rgba(41,38,34,.65) 38%, rgba(41,38,34,.05) 70%)",
                }}
              />
              {selected && <div className="absolute inset-0 -z-10 bg-[#C18A35]/10" />}

              {/* Top row: number + check */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <span className="rounded-full border border-white/30 bg-[#292622]/40 px-3 py-1 text-xs font-semibold tracking-widest text-white backdrop-blur-md">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                    selected
                      ? "scale-100 border-[#C18A35] bg-[#C18A35] text-[#292622] shadow-lg"
                      : "scale-90 border-white/40 bg-[#292622]/30 text-transparent backdrop-blur-md group-hover:scale-100"
                  }`}
                >
                  <Check size={18} strokeWidth={3} />
                </span>
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <span className="mb-4 block h-0.5 w-10 rounded bg-[#C18A35] transition-all duration-500 group-hover:w-20" />
                <h3 className="font-heading text-2xl font-bold leading-tight text-white sm:text-[28px]">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-white/75">{item.description}</p>

                <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-300 ${
                      selected
                        ? "bg-[#C18A35] text-[#292622]"
                        : "bg-white/10 text-white group-hover:bg-[#C18A35] group-hover:text-[#292622]"
                    }`}
                  >
                    {selected ? "Selected" : "Select Style"}
                  </span>

                  <ArrowRight
                    size={20}
                    aria-hidden="true"
                    className="text-[#EBC882] transition-transform duration-300 group-hover:translate-x-2"
                  />
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