"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProcessCard from "./ProcessCard";
import { steps } from "@/data/interiorData";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dba343]";

export default function Process() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="process-heading"
      className="bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header: one reveal, left aligned */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12 max-w-2xl sm:mb-16"
        >
          <p className="text-sm font-semibold text-[#8A6416]">How we work</p>
          <h2
            id="process-heading"
            className="mt-4 font-heading text-4xl leading-tight text-stone-950 sm:text-5xl lg:text-6xl"
          >
            Our design process
          </h2>
          <p className="mt-5 text-base leading-8 text-stone-600">
            A clear, step-by-step approach that takes your project from the
            first idea to the finished space.
          </p>
        </motion.div>

        {/* Steps */}
        <ol className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <ProcessCard
              key={step.num}
              {...step}
              index={i}
              isLast={i === steps.length - 1}
            />
          ))}
        </ol>

        {/* Next step */}
        <div className="mt-14 flex flex-col items-start gap-5 border-t border-stone-200 pt-10 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
          <p className="font-heading text-2xl text-stone-900 sm:text-3xl">
            Ready to begin?
          </p>
          <Link
            href="/contact"
            className={`group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#593719] px-8 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-[#dba343] hover:text-stone-950 ${focusRing}`}
          >
            Start your project
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}