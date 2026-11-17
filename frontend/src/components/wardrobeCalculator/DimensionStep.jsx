// components/calculator/DimensionStep.jsx

"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import { dimensions } from "@/data/wardrobeData";

const TOTAL_STEPS = 6;
const CURRENT_STEP = 2;

/* Wardrobe illustration — grows with the size index */
function WardrobeIllustration({ index, selected }) {
  const panels = Math.min(index + 2, 6);
  const W = panels * 18 + 8;
  const H = 62;
  const x = (140 - W) / 2;
  const y = 30;
  const panelW = W / panels;

  const stroke = selected ? "#C18A35" : "#593719";
  const dim = "#C18A35";

  return (
    <svg
      viewBox="0 0 140 110"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      {/* Dimension line */}
      <line x1={x} y1="16" x2={x + W} y2="16" stroke={dim} strokeWidth="1" />
      <line x1={x} y1="11" x2={x} y2="21" stroke={dim} strokeWidth="1" />
      <line
        x1={x + W}
        y1="11"
        x2={x + W}
        y2="21"
        stroke={dim}
        strokeWidth="1"
      />

      {/* Body */}
      <rect
        x={x}
        y={y}
        width={W}
        height={H}
        rx="3"
        stroke={stroke}
        strokeWidth="2"
        fill="#FFFFFF"
        fillOpacity={selected ? 0.06 : 1}
        style={{ transition: "stroke 0.3s" }}
      />

      {/* Door dividers + handles */}
      {Array.from({ length: panels - 1 }).map((_, i) => {
        const dx = x + panelW * (i + 1);
        return (
          <g key={i}>
            <line
              x1={dx}
              y1={y}
              x2={dx}
              y2={y + H}
              stroke={stroke}
              strokeWidth="1.5"
              style={{ transition: "stroke 0.3s" }}
            />
            <line
              x1={dx - 4}
              y1={y + H / 2 - 6}
              x2={dx - 4}
              y2={y + H / 2 + 6}
              stroke={dim}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1={dx + 4}
              y1={y + H / 2 - 6}
              x2={dx + 4}
              y2={y + H / 2 + 6}
              stroke={dim}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* Floor */}
      <line
        x1="10"
        y1={y + H + 6}
        x2="130"
        y2={y + H + 6}
        stroke={selected ? "#C18A35" : "#E8DED0"}
        strokeWidth="1.5"
        strokeOpacity={selected ? 0.5 : 1}
      />
    </svg>
  );
}

export default function DimensionStep({
  formData,
  setFormData,
  nextStep,
  prevStep,
}) {
  return (
    <section className="font-body max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-body inline-flex items-center gap-2 rounded-full border border-[#C18A35]/40 bg-[#C18A35]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#593719]">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </span>

        {/* Progress */}
        <div className="mx-auto mt-5 flex max-w-xs gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < CURRENT_STEP ? "bg-[#C18A35]" : "bg-[#E8DED0]"
              }`}
            />
          ))}
        </div>

        <h2 className="font-heading mt-6 mb-4 text-4xl font-bold text-[#593719] md:text-5xl">
          Select Wardrobe Size
        </h2>

        <p className="font-body text-[#292622]/70 max-w-2xl mx-auto">
          Choose the wardrobe dimensions that best fit your room layout and
          storage requirements.
        </p>
      </motion.div>

      {/* Dimension Cards */}
      <div
        role="radiogroup"
        aria-label="Wardrobe size"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {dimensions.map((size, index) => {
          const selected = formData.dimension === size;

          return (
            <motion.button
              key={size}
              type="button"
              role="radio"
              aria-checked={selected}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              onClick={() =>
                setFormData({
                  ...formData,
                  dimension: size,
                })
              }
              className={`font-body group relative overflow-hidden rounded-3xl border text-left transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]

              ${
                selected
                  ? "bg-[#593719] border-[#593719] shadow-2xl shadow-[#593719]/25"
                  : "bg-[#FFFFFF] border-[#E8DED0] hover:border-[#C18A35] hover:shadow-xl"
              }
              `}
            >
              {/* Illustration */}
              <div
                className={`h-32 px-4 pt-3 transition-colors duration-300 md:h-40

                ${selected ? "bg-[#FFFFFF]/5" : "bg-[#F7F3ED]"}
                `}
              >
                <WardrobeIllustration index={index} selected={selected} />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className={`font-heading mb-1.5 text-2xl font-bold

                  ${selected ? "text-[#FFFFFF]" : "text-[#593719]"}
                  `}
                >
                  {size}
                </h3>

                <p
                  className={`font-body mb-5 text-sm leading-relaxed

                  ${selected ? "text-[#FFFFFF]/70" : "text-[#292622]/70"}
                  `}
                >
                  Ideal for modern bedroom layouts.
                </p>

                {/* Footer */}
                <div
                  className={`flex items-center justify-between border-t pt-4

                  ${selected ? "border-[#FFFFFF]/15" : "border-[#E8DED0]"}
                  `}
                >
                  <span
                    className={`font-body text-xs font-medium uppercase tracking-[0.15em]

                    ${selected ? "text-[#C18A35]" : "text-[#292622]/50"}
                    `}
                  >
                    {selected ? "Selected" : "Select"}
                  </span>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300

                    ${
                      selected
                        ? "border-[#C18A35] bg-[#C18A35]"
                        : "border-[#E8DED0] group-hover:border-[#C18A35]"
                    }
                    `}
                  >
                    {selected && (
                      <Check size={13} className="text-[#FFFFFF]" />
                    )}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Helper note */}
      <div className="font-body mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2.5 text-center text-sm text-[#292622]/60">
        <Info size={16} className="mt-0.5 shrink-0 text-[#C18A35]" />
        <p>
          Not sure about the size? Pick the closest one — our team will confirm
          exact measurements during your free design consultation.
        </p>
      </div>

      {/* Selection recap */}
      {(formData.type || formData.dimension) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-[#E8DED0] border-l-[3px] border-l-[#C18A35] bg-[#FFFFFF] px-6 py-4 shadow-sm"
        >
          {formData.type && (
            <p className="font-body text-sm text-[#292622]/70">
              Type:{" "}
              <span className="font-semibold text-[#593719]">
                {formData.type}
              </span>
            </p>
          )}

          {formData.dimension && (
            <p className="font-body text-sm text-[#292622]/70">
              Size:{" "}
              <span className="font-heading text-base font-bold text-[#593719]">
                {formData.dimension}
              </span>
            </p>
          )}
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12">
        <button
          onClick={prevStep}
          className="font-body flex items-center gap-2 rounded-xl border border-[#593719] px-6 py-3 text-[#593719] transition-all hover:bg-[#593719] hover:text-[#FFFFFF]"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          disabled={!formData.dimension}
          onClick={nextStep}
          className={`font-body flex items-center gap-2 rounded-xl px-8 py-3 transition-all duration-300

          ${
            formData.dimension
              ? "bg-[#593719] text-[#FFFFFF] hover:bg-[#C18A35]"
              : "bg-[#E8DED0] text-[#292622]/40 cursor-not-allowed"
          }
          `}
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}