"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  MessageCircle,
  PencilRuler,
  Layers,
  Hammer,
  KeyRound,
  ArrowRight,
} from "lucide-react";

const processSteps = [
  {
    title: "Initial consultation",
    description:
      "We begin by understanding your lifestyle, requirements, preferences, budget and vision for your dream space.",
    outcome: "You get a clear brief and budget",
    icon: MessageCircle,
  },
  {
    title: "Design & planning",
    description:
      "Our design team develops creative concepts, layouts, colour palettes and 3D visualizations tailored to your space.",
    outcome: "You see your space before it's built",
    icon: PencilRuler,
  },
  {
    title: "Material selection",
    description:
      "Explore carefully selected materials, finishes, textures and furnishings that balance beauty, quality and functionality.",
    outcome: "You approve every finish and fitting",
    icon: Layers,
  },
  {
    title: "Execution & installation",
    description:
      "Our team brings the approved design to life through skilled craftsmanship, careful coordination and quality checks.",
    outcome: "Your design is built and checked",
    icon: Hammer,
  },
  {
    title: "Final handover",
    description:
      "We complete the finishing touches, review every detail and hand over a space ready for you to enjoy.",
    outcome: "You move into a finished space",
    icon: KeyRound,
  },
];

function CtaLink({ className = "" }) {
  return (
    <Link
      href="/contact"
      className={`group inline-flex items-center gap-3 rounded-full bg-[#593719] px-7 py-4 font-[family-name:var(--font-body)] text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C18A35] ${className}`}
    >
      Start your project
      <ArrowRight
        size={18}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
      />
    </Link>
  );
}

function Step({ step, index }) {
  const ref = useRef(null);
  // Becomes true once the step scrolls past the lower part of the viewport
  const reached = useInView(ref, { once: true, margin: "0px 0px -40% 0px" });
  const Icon = step.icon;

  return (
    <li ref={ref} className="relative pb-12 pl-16 last:pb-0 sm:pl-20">
      {/* Node on the timeline */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border font-[family-name:var(--font-heading)] text-lg transition-colors duration-500 motion-reduce:transition-none sm:h-12 sm:w-12 ${
          reached
            ? "border-[#593719] bg-[#593719] text-white"
            : "border-[#C18A35]/50 bg-[#F7F3ED] text-[#A36D28]"
        }`}
      >
        {index + 1}
      </span>

      <div className="flex items-center gap-3">
        <Icon
          size={22}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0 text-[#C18A35]"
        />
        <h3 className="font-[family-name:var(--font-heading)] text-2xl leading-snug text-[#593719] sm:text-3xl">
          <span className="sr-only">{`Step ${index + 1}: `}</span>
          {step.title}
        </h3>
      </div>

      <p className="mt-3 max-w-xl font-[family-name:var(--font-body)] text-base leading-8 text-[#292622]/75">
        {step.description}
      </p>

      <p className="mt-4 inline-flex items-center gap-2 border-l-2 border-[#C18A35] pl-3 font-[family-name:var(--font-body)] text-sm font-medium text-[#8A5F1F]">
        {step.outcome}
      </p>
    </li>
  );
}

export default function OurProcess() {
  const timelineRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // The brown line fills as the person scrolls through the steps
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 60%", "end 70%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      aria-labelledby="process-heading"
      className="relative bg-[#F7F3ED] px-5 py-16 sm:px-10 lg:px-16 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Intro: stays in view on desktop while the steps scroll */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="mb-4 font-[family-name:var(--font-body)] text-sm font-semibold text-[#C18A35]">
              How we work
            </p>

            <h2
              id="process-heading"
              className="font-[family-name:var(--font-heading)] text-4xl leading-tight text-[#593719] sm:text-5xl lg:text-6xl"
            >
              Our design process
            </h2>

            <p className="mt-5 max-w-md font-[family-name:var(--font-body)] text-base leading-8 text-[#292622]/75">
              From the first conversation to the final finishing touch, five
              clear steps turn your vision into a finished space.
            </p>

            <div className="mt-9 hidden lg:block">
              <p className="mb-4 font-[family-name:var(--font-body)] text-sm text-[#292622]/75">
                Ready to talk about your space?
              </p>
              <CtaLink />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-7">
          <ol ref={timelineRef} className="relative">
            {/* Track */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[21px] top-0 w-px bg-[#C18A35]/25 sm:left-6"
            />
            {/* Progress */}
            <motion.span
              aria-hidden="true"
              style={{ scaleY: reduceMotion ? 1 : progress }}
              className="absolute bottom-0 left-[21px] top-0 w-px origin-top bg-[#593719] sm:left-6"
            />

            {processSteps.map((step, index) => (
              <Step key={step.title} step={step} index={index} />
            ))}
          </ol>

          {/* CTA for mobile, after the steps */}
          <div className="mt-12 lg:hidden">
            <p className="mb-4 font-[family-name:var(--font-body)] text-sm text-[#292622]/75">
              Ready to talk about your space?
            </p>
            <CtaLink className="w-full justify-center sm:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}