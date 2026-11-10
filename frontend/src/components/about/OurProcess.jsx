
"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  PencilRuler,
  Layers,
  Hammer,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const processSteps = [
  {
    number: "01",
    title: "Initial Consultation",
    description:
      "We begin by understanding your lifestyle, requirements, preferences, budget and vision for your dream space.",
    icon: MessageCircle,
    duration: "Understanding Your Needs",
  },
  {
    number: "02",
    title: "Design & Planning",
    description:
      "Our design team develops creative concepts, layouts, colour palettes and 3D visualizations tailored to your space.",
    icon: PencilRuler,
    duration: "Bringing Ideas to Life",
  },
  {
    number: "03",
    title: "Material Selection",
    description:
      "Explore carefully selected materials, finishes, textures and furnishings that balance beauty, quality and functionality.",
    icon: Layers,
    duration: "Choosing Every Detail",
  },
  {
    number: "04",
    title: "Execution & Installation",
    description:
      "Our team brings the approved design to life through skilled craftsmanship, careful coordination and quality checks.",
    icon: Hammer,
    duration: "Creating Your Space",
  },
  {
    number: "05",
    title: "Final Handover",
    description:
      "We complete the finishing touches, review every detail and hand over a space ready for you to enjoy.",
    icon: KeyRound,
    duration: "Your Dream Space Awaits",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function OurProcess() {
  return (
    <section className="relative overflow-hidden bg-[#F7F3ED] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full border border-[#C18A35]/10" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full border border-[#C18A35]/10" />

      <div className="relative mx-auto max-w-[1440px]">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[#C18A35]" />

            <span className="font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-[0.3em] text-[#C18A35]">
              How We Work
            </span>

            <span className="h-px w-10 bg-[#C18A35]" />
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-4xl leading-tight text-[#593719] sm:text-5xl lg:text-6xl">
            Our Design
            <span className="italic text-[#C18A35]">
              {" "}Process
            </span>
          </h2>

          <p className="mt-5 font-[family-name:var(--font-body)] text-sm leading-8 text-[#292622]/65 sm:text-base">
            From the first conversation to the final finishing
            touch, we follow a thoughtful process to turn
            your vision into a beautiful reality.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="relative">

          {/* Desktop connecting line */}
          <div className="absolute left-[10%] right-[10%] top-[34px] hidden h-px bg-[#C18A35]/35 lg:block" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-7 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5"
          >
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  variants={cardVariants}
                  className="group relative flex flex-col items-center text-center"
                >

                  {/* Timeline Icon */}
                  <div className="relative z-10 mb-7 flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full border border-[#C18A35]/40 bg-[#F7F3ED] shadow-[0_5px_20px_rgba(89,55,25,0.06)] transition-all duration-500 group-hover:border-[#C18A35] group-hover:bg-[#593719] group-hover:shadow-[0_10px_25px_rgba(89,55,25,0.15)]">
                    <Icon
                      size={27}
                      strokeWidth={1.5}
                      className="text-[#C18A35] transition-colors duration-500 group-hover:text-white"
                    />
                  </div>

                  {/* Card */}
                  <div className="relative flex h-full w-full flex-col items-center rounded-xl border border-[#C18A35]/15 bg-white/80 px-5 py-7 transition-all duration-500 hover:-translate-y-2 hover:border-[#C18A35]/40 hover:shadow-[0_15px_40px_rgba(89,55,25,0.08)] sm:px-6">

                    {/* Number */}
                    <span className="font-[family-name:var(--font-heading)] text-5xl text-[#C18A35]/25 transition-colors duration-300 group-hover:text-[#C18A35]/50">
                      {step.number}
                    </span>

                    {/* Title */}
                    <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl leading-snug text-[#593719]">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-4 font-[family-name:var(--font-body)] text-sm leading-7 text-[#292622]/65">
                      {step.description}
                    </p>

                    {/* Bottom label */}
                    <div className="mt-auto pt-7">
                      <span className="inline-block rounded-full bg-[#F7F3ED] px-4 py-2 font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A36D28]">
                        {step.duration}
                      </span>
                    </div>

                    {/* Bottom accent */}
                    <span className="absolute bottom-0 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#C18A35] transition-all duration-500 group-hover:w-1/2" />
                  </div>

                </motion.article>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#C18A35]/20 bg-[#E8DED0]/50 px-7 py-9 text-center sm:px-10 lg:flex-row lg:text-left"
        >
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-3xl text-[#593719] sm:text-4xl">
              Ready to Begin Your Journey?
            </h3>

            <p className="mt-3 font-[family-name:var(--font-body)] text-sm leading-7 text-[#292622]/65">
              Let's create a space that truly feels like yours.
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#593719] px-7 py-4 font-[family-name:var(--font-body)] text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#C18A35] hover:text-[#292622] hover:shadow-lg"
          >
            Start Your Project
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
