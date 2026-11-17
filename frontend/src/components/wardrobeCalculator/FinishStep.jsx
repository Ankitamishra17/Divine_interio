// components/calculator/FinishStep.jsx

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { finishes } from "@/data/wardrobeData";

const TOTAL_STEPS = 6;
const CURRENT_STEP = 3;

export default function FinishStep({
  formData,
  setFormData,
  nextStep,
  prevStep,
}) {
  return (
    <section className="font-body max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-body inline-flex items-center gap-2 rounded-full border border-[#dba343]/40 bg-[#dba343]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#593719]">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </span>

        {/* Progress */}
        <div className="mx-auto mt-5 flex max-w-xs gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < CURRENT_STEP ? "bg-[#dba343]" : "bg-[#E8DED0]"
              }`}
            />
          ))}
        </div>

        <h2 className="font-heading mt-6 mb-4 text-4xl font-bold text-[#593719] md:text-5xl">
          Choose Finish Material
        </h2>

        <p className="font-body text-[#292622]/70 max-w-2xl mx-auto">
          Select a finish that matches your style, durability requirements,
          and budget.
        </p>
      </motion.div>

      {/* Finish Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {finishes.map((item, index) => {
          const selected = formData.finish === item.title;

          return (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() =>
                setFormData({
                  ...formData,
                  finish: item.title,
                })
              }
              className={`font-body group overflow-hidden rounded-3xl bg-[#FFFFFF] border text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl

              ${
                selected
                  ? "border-[#dba343] ring-2 ring-[#dba343]/30"
                  : "border-[#E8DED0]"
              }
              `}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#292622]/70 via-[#292622]/10 to-transparent" />

                {selected && (
                  <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#dba343] shadow-lg">
                    <Check size={16} className="text-[#FFFFFF]" />
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading mb-3 text-2xl font-bold text-[#593719]">
                  {item.title}
                </h3>

                <p className="font-body text-[#292622]/70 text-sm leading-relaxed mb-5">
                  {item.description}
                </p>

                <div className="flex items-center justify-between border-t border-[#E8DED0] pt-4">
                  <span className="font-body text-sm font-medium text-[#dba343]">
                    Select Finish
                  </span>

                  {selected && (
                    <span className="font-body rounded-full bg-[#593719] px-3 py-1 text-xs text-[#FFFFFF]">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-12">
        <button
          onClick={prevStep}
          className="font-body flex items-center gap-2 rounded-xl border border-[#593719] px-6 py-3 text-[#593719] transition-all hover:bg-[#593719] hover:text-[#FFFFFF]"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          disabled={!formData.finish}
          onClick={nextStep}
          className={`font-body flex items-center gap-2 rounded-xl px-8 py-3 transition-all duration-300

          ${
            formData.finish
              ? "bg-[#593719] text-[#FFFFFF] hover:bg-[#dba343]"
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