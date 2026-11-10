
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Play } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.15,
    },
  },
};

export default function AboutHero() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative isolate flex min-h-[650px] items-center overflow-hidden bg-[#593719] py-24 md:min-h-[720px] lg:min-h-[680px]"
    >
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src="/banner/about_banner.png"
          alt="Elegant luxury living room interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
      </motion.div>

      {/* Left Dark Gradient Overlay */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#241409]/95 via-[#3D2415]/85 to-[#593719]/10 md:from-[#241409]/95 md:via-[#3D2415]/75 md:to-transparent"
      />

      {/* Subtle bottom shadow */}
      {/* <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#241409]/35 to-transparent" /> */}

      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-[720px]"
        >
          {/* Breadcrumb */}
          <motion.nav
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            aria-label="Breadcrumb"
            className="mb-12 flex items-center gap-3 font-[family-name:var(--font-body)] text-sm text-white/80 md:text-base"
          >
            <Link
              href="/"
              className="transition-colors hover:text-[#C18A35]"
            >
              Home
            </Link>
            <ChevronRight
              size={16}
              className="text-[#C18A35]"
            />
            <span className="text-white">About Us</span>
          </motion.nav>

          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mb-6 flex items-center gap-4"
          >
            <span className="font-[family-name:var(--font-body)] text-xs font-medium uppercase tracking-[0.25em] text-[#E9BD76] sm:text-sm">
              About Divine Interiors
            </span>
            <span className="h-px w-12 bg-[#C18A35] sm:w-20" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="about-hero-heading"
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="font-[family-name:var(--font-heading)] text-[clamp(3rem,5.2vw,5.8rem)] leading-[1.12] tracking-[-0.02em] text-[#FFFFFF]"
          >
            Crafting Spaces
            <br />
            That Feel Like{" "}
            <span className="italic text-[#E9BD76]">
              Home
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-7 max-w-[570px] font-[family-name:var(--font-body)] text-base font-light leading-[1.9] text-[#F7F3ED]/90 md:text-lg"
          >
            A passionate team of designers, architects and
            execution experts, creating functional, stylish
            and personalized interiors for modern living.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <Link
              href="#our-story"
              className="group inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-[#C18A35] px-8 font-[family-name:var(--font-body)] text-sm font-semibold text-[#292622] transition-all duration-300 hover:-translate-y-1 hover:bg-[#E9BD76] hover:shadow-[0_12px_30px_rgba(193,138,53,0.25)]"
            >
              Our Story
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/projects"
              className="group inline-flex min-h-14 items-center gap-3 font-[family-name:var(--font-body)] text-sm font-medium text-white transition-colors hover:text-[#E9BD76]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 transition-all duration-300 group-hover:border-[#C18A35] group-hover:bg-[#C18A35]/15">
                <Play size={17} fill="currentColor" />
              </span>
              Explore Our Work
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute bottom-10 right-10 hidden items-center gap-3 lg:flex">
        <span className="h-px w-12 bg-[#C18A35]" />
        <span className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.25em] text-white/80">
          Design With Purpose
        </span>
      </div>
    </section>
  );
}
