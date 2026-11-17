"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { wardrobeType } from "@/data/wardrobeData";

const TOTAL_STEPS = 6;
const CURRENT_STEP = 1;

export default function WardrobeTypeStep({
  formData,
  setFormData,
  nextStep,
}) {
  return (
    <section className="font-body py-10">
      {/* Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto mb-14"
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

        <h1 className="font-heading mt-6 mb-4 text-4xl font-bold text-[#593719] md:text-5xl">
          Choose Your Wardrobe Style
        </h1>

        <p className="font-body text-[#292622]/70 text-lg">
          Select the wardrobe type that best suits your space and lifestyle.
          Get an instant estimate in just a few steps.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid lg:grid-cols-3 gap-8">
        {wardrobeType.map((item, index) => {
          const selected = formData.type === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() =>
                setFormData({
                  ...formData,
                  type: item.id,
                })
              }
              className={`font-body group text-left overflow-hidden rounded-3xl bg-[#FFFFFF] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl

              ${
                selected
                  ? "border-[#C18A35] ring-2 ring-[#C18A35]/30"
                  : "border-[#E8DED0]"
              }
              `}
            >
              {/* Image */}
              <div className="relative h-[250px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#292622]/70 via-[#292622]/10 to-transparent" />

                {selected && (
                  <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#C18A35] shadow-lg">
                    <Check size={16} className="text-[#FFFFFF]" />
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading mb-3 text-2xl font-bold text-[#593719]">
                  {item.title}
                </h3>

                <p className="font-body text-[#292622]/70 leading-relaxed mb-5">
                  {item.description}
                </p>

                <div className="flex items-center justify-between border-t border-[#E8DED0] pt-4">
                  <span className="font-body text-sm font-medium text-[#C18A35]">
                    {selected ? "Selected" : "Select Style"}
                  </span>

                  <ArrowRight
                    size={20}
                    className="text-[#C18A35] transition-transform duration-300 group-hover:translate-x-2"
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center mt-14">
        <button
          disabled={!formData.type}
          onClick={nextStep}
          className={`font-body flex items-center gap-3 rounded-xl px-10 py-4 font-semibold transition-all duration-300

          ${
            formData.type
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