"use client";

import { motion, useReducedMotion } from "framer-motion";

// One step. The number sits in a solid gold badge that overlaps the photo edge,
// and on large screens a thin line runs from it to the next step's badge.
export default function ProcessCard({
  num,
  title,
  desc,
  img,
  index = 0,
  isLast = false,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        // Stagger within a row only, so lower cards never wait on earlier ones
        delay: (index % 4) * 0.1,
      }}
      className="group"
    >
      {/* Photo: always in full colour (the old grayscale hid the work on desktop) */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200 sm:aspect-[4/5]">
        {/* Decorative: the title below names the step.
            Plain <img> so any image host works; swap for next/image if all hosts are configured. */}
        <img
          src={img}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-105"
        />
      </div>

      {/* Number badge + connector */}
      <div className="relative z-10 -mt-6 flex items-center pl-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C8972B] font-heading text-lg text-[#1E0F06] ring-4 ring-white">
          <span className="sr-only">Step </span>
          {num}
        </span>

        {!isLast && (
          <span
            aria-hidden="true"
            className="-mr-[2.75rem] ml-3 hidden h-px flex-1 bg-[#C8972B]/40 lg:block"
          />
        )}
      </div>

      {/* Text */}
      <div className="mt-5">
        <h3 className="font-heading text-2xl leading-snug text-stone-900 sm:text-[26px]">
          {title}
        </h3>
        <p className="mt-2 text-[15px] leading-7 text-stone-600">{desc}</p>
      </div>
    </motion.li>
  );
}