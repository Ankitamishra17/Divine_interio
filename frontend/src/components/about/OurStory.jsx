
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const fadeLeft = {
  hidden: { opacity: 0, x: -45 },
  visible: { opacity: 1, x: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 45 },
  visible: { opacity: 1, x: 0 },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

export default function OurStory() {
  return (
    <section
      id="our-story"
      className="relative overflow-hidden bg-[#F7F3ED] py-20 sm:py-24 lg:py-32"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full border border-[#C18A35]/10" />
      <div className="pointer-events-none absolute -right-20 top-24 h-64 w-64 rounded-full border border-[#C18A35]/10" />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-16 px-6 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:px-16 xl:px-20">

        {/* LEFT - IMAGE COMPOSITION */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[590px] pb-12 pr-8 sm:pb-14 sm:pr-12"
        >
          {/* Decorative frame */}
          <div className="absolute -left-4 top-8 h-[85%] w-[75%] rounded-[4px] border border-[#C18A35]/60 sm:-left-7 sm:top-12" />

          {/* Main image */}
          <div className="relative aspect-[4/5.5] overflow-hidden rounded-[5px]">
            <Image
              src="https://i.pinimg.com/736x/22/a9/29/22a929c0a392a65d8e5bbf0357c714bd.jpg"
              alt="Elegant luxury interior designed by Divine Interiors"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
className="object-cover transition-transform duration-1000 hover:scale-105 shadow-xl shadow-black"            />
          </div>

          {/* Secondary overlapping image */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="absolute -bottom-2 right-0 w-[47%] overflow-hidden rounded-[5px] border-[6px] border-[#F7F3ED] shadow-xl sm:-bottom-3"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src="https://i.pinimg.com/1200x/e9/93/6a/e9936a03e02300bd8a0ac5495ad1435f.jpg"
                alt="Premium interior design details"
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Experience badge - no unverified numbers */}
          <div className="absolute bottom-2 left-0 flex items-center gap-3 bg-[#593719] px-4 py-4 text-[#F7F3ED] shadow-xl sm:bottom-3 sm:px-6">
            <Sparkles className="h-7 w-7 text-[#C18A35]" />
            <div>
              <p className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl">
                Thoughtful
              </p>
              <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.15em] text-white/70">
                Design & Detail
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT - CONTENT */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* Section label */}
          <motion.div
            variants={fadeUp}
            className="mb-5 flex items-center gap-4"
          >
            <span className="font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-[0.3em] text-[#C18A35]">
              Our Story
            </span>
            <span className="h-px w-16 bg-[#C18A35]/70" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="font-[family-name:var(--font-heading)] text-4xl leading-[1.15] tracking-tight text-[#593719] sm:text-5xl lg:text-[58px]"
          >
            The Story Behind
            <br />
            <span className=" text-[#C18A35]">
              Divine Interiors
            </span>
          </motion.h2>

          {/* Highlight text */}
          <motion.p
            variants={fadeUp}
            className="mt-7 border-l-[2px] border-[#C18A35] pl-5 font-[family-name:var(--font-body)] text-lg font-medium leading-relaxed text-[#593719] sm:text-xl"
          >
            We believe every space has a story, and every
            beautiful space begins with a vision.
          </motion.p>

          {/* Description */}
          <motion.div
            variants={fadeUp}
            className="mt-6 space-y-5 font-[family-name:var(--font-body)] text-[15px] font-normal leading-[1.9] text-[#292622]/75 sm:text-base"
          >
            <p>
              At Divine Interiors, we believe interior design
              is more than arranging furniture or selecting
              beautiful colours. It is about understanding
              the people who live and work in a space and
              creating environments that inspire comfort,
              creativity and connection.
            </p>

            <p>
              Our approach combines thoughtful planning,
              creative design, quality materials and attention
              to every detail. From contemporary living spaces
              to functional kitchens and elegant workspaces,
              we aim to bring every client's vision to life.
            </p>

            <p>
              Every project is an opportunity to create
              something meaningful — spaces that look
              beautiful, work effortlessly and feel
              uniquely yours.
            </p>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-6"
          >
            <Link
              href="/services"
              className="group inline-flex items-center gap-4 rounded-full bg-[#593719] px-7 py-4 font-[family-name:var(--font-body)] text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#C18A35] hover:text-[#292622] hover:shadow-lg"
            >
              Explore Our Services
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <span className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.16em] text-[#593719]/60">
              Designed Around You
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
