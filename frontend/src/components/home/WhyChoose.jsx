"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

/*
  Palette (unchanged)
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF

  Layout: four photo panels side by side, each carrying one number.
  The selected panel opens wide and shows its title and description over the photo;
  the others stay as narrow strips with just the number and label.
  Hover, focus or tap a panel to open it. Numbers count up once on scroll.
  Phones: the same four panels, stacked, and the selected one opens downward.
*/

const STATS = [
  {
    value: 2014,
    count: false, // a year, so it doesn't count up
    suffix: "",
    label: "Founded",
    title: "Full-service interior design",
    description:
      "We design complete interiors, from the first plan to the final styling.",
    img: "/Design/image1.avif",
  },
  {
    value: 12,
    count: true,
    suffix: "+",
    label: "Years of experience",
    title: "Homes, kitchens and architecture",
    description:
      "More than a decade shaping private homes, kitchens and architectural spaces that balance clean geometry with comfortable living.",
    img: "/Design/contact_banner.avif",
  },
  {
    value: 35,
    count: true,
    suffix: "+",
    label: "People on the team",
    title: "Designers and craftsmen",
    description:
      "Interior architects, project leaders and furniture makers working together on every surface.",
    img: "/Design/collective.avif",
  },
  {
    value: 18,
    count: true,
    suffix: "",
    label: "Awards won",
    title: "Recognised for our work",
    description:
      "Eighteen regional awards for structural planning, lighting design and material selection.",
    img: "/image/living_room13.webp",
  },
];

const EASE = [0.22, 1, 0.36, 1];

function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export default function WhyChooseUs() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section
      className="bg-[#F7F3ED] py-20 md:py-28"
      aria-labelledby="why-choose-us-heading"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 xl:px-12">
        {/* ───────── Header ───────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-16"
        >
          <h2
            id="why-choose-us-heading"
            className="max-w-3xl font-heading text-4xl font-medium leading-[1.08] tracking-tight text-[#292622] sm:text-5xl xl:text-[64px]"
          >
            Design that lives with you, not just in it.
          </h2>

          <div className="flex flex-shrink-0 flex-col items-start gap-5 md:items-end md:text-right">
            <p className="max-w-xs text-base leading-relaxed text-[#292622]/70">
              Hover or tap a panel to see the work behind the number.
            </p>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2.5 rounded-sm bg-[#593719] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
            >
              See our work
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>

        {/* ───────── Expanding panels ───────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-12 flex h-[680px] flex-col gap-2 md:mt-16 lg:h-[620px] lg:flex-row xl:h-[680px]"
        >
          {STATS.map((stat, i) => {
            const isActive = i === active;
            return (
              <button
                key={stat.label}
                type="button"
                aria-expanded={isActive}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group relative min-h-0 min-w-0 overflow-hidden rounded-sm bg-[#E8DED0] text-left transition-[flex-grow] duration-700 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED] motion-reduce:transition-none ${
                  isActive ? "flex-[6_1_0%] lg:flex-[4_1_0%]" : "flex-[1_1_0%]"
                }`}
              >
                {/* photo */}
                <Image
                  src={stat.img}
                  alt={isActive ? stat.title : ""}
                  aria-hidden={!isActive}
                  fill
                  priority={i === 0}
                  sizes="(max-width:1024px) 92vw, 60vw"
                  className={`object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none ${
                    isActive ? "scale-100" : "scale-110"
                  }`}
                />

                {/* shade: heavier on closed panels, lighter when open */}
                <span
                  className={`pointer-events-none absolute inset-0 transition-colors duration-700 ${
                    isActive
                      ? "bg-gradient-to-t from-[#292622]/85 via-[#292622]/20 to-transparent"
                      : "bg-[#292622]/60 group-hover:bg-[#292622]/45"
                  }`}
                  aria-hidden="true"
                />

                {/* gold line along the bottom of the open panel */}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[#C18A35] transition-transform duration-700 ease-out motion-reduce:transition-none ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden="true"
                />

                {/* content */}
                <span
                  className={`absolute inset-0 flex flex-col p-5 sm:p-7 lg:justify-end lg:p-8 ${
                    isActive ? "justify-end" : "justify-center"
                  }`}
                >
                  <span className="flex items-baseline gap-4 lg:flex-col lg:items-start lg:gap-3">
                    <span
                      className={`font-heading text-4xl leading-none transition-colors duration-500 sm:text-5xl xl:text-6xl ${
                        isActive ? "text-[#C18A35]" : "text-white"
                      }`}
                    >
                      {stat.count ? (
                        <CountUp to={stat.value} suffix={stat.suffix} />
                      ) : (
                        stat.value
                      )}
                    </span>
                    <span className="text-sm font-medium text-[#F7F3ED] sm:text-base">
                      {stat.label}
                    </span>
                  </span>

                  {/* title + description, only on the open panel */}
                  <span
                    className={`block max-w-md overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none lg:w-[26rem] lg:max-w-none ${
                      isActive
                        ? "mt-5 max-h-64 opacity-100 delay-300 motion-reduce:delay-0"
                        : "mt-0 max-h-0 opacity-0"
                    }`}
                  >
                    <span className="block font-heading text-2xl font-medium leading-tight text-white sm:text-3xl">
                      {stat.title}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-[#F7F3ED]/85 sm:text-base">
                      {stat.description}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}