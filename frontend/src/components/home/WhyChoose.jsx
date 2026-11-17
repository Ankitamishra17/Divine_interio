"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

/*
  Palette
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF

  Design idea (kept): architectural DIMENSION LINES  |-----label-----|  under each number,
  like measurements on a floor plan. Numbers count up once when scrolled into view.

  UX changes:
  - One large photo instead of four static ones. Hover, focus or tap a stat and the
    photo + caption change to match it, so every number is explained by an image.
  - Stats are real buttons (keyboard + screen reader friendly, aria-pressed).
  - Active stat gets a solid gold dimension line, so people can see what is selected.
  - Dimension lines draw themselves once on scroll. Reduced motion is respected.
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

// |------ label ------|  like a measurement on a floor plan
function DimensionLine({ label, active, delay = 0 }) {
  const reduce = useReducedMotion();
  const line = active ? "bg-[#C18A35]" : "bg-[#C18A35]/40";

  return (
    <motion.div
      className="mt-4 flex items-center gap-3"
      initial={reduce ? false : { scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={{ originX: 0 }}
    >
      <span className={`h-3 w-px transition-colors duration-300 ${active ? "bg-[#C18A35]" : "bg-[#C18A35]/70"}`} aria-hidden="true" />
      <span className={`h-px flex-1 transition-colors duration-300 ${line}`} aria-hidden="true" />
      <span
        className={`text-[13px] font-medium transition-colors duration-300 ${
          active ? "text-[#593719]" : "text-[#593719]/70"
        }`}
      >
        {label}
      </span>
      <span className={`h-px flex-1 transition-colors duration-300 ${line}`} aria-hidden="true" />
      <span className={`h-3 w-px transition-colors duration-300 ${active ? "bg-[#C18A35]" : "bg-[#C18A35]/70"}`} aria-hidden="true" />
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = STATS[active];

  return (
    <section className="bg-[#F7F3ED] py-20 md:py-28" aria-labelledby="why-choose-us-heading">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 xl:px-12">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          {/* ───────── Featured photo (changes with the selected stat) ───────── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:sticky lg:top-28 lg:col-span-5"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#E8DED0] shadow-[0_24px_60px_-28px_rgba(41,38,34,0.45)]">
              {/* All photos stay mounted and fade, so switching never flickers or reloads */}
              {STATS.map((s, i) => (
                <Image
                  key={s.img}
                  src={s.img}
                  alt={i === active ? s.title : ""}
                  aria-hidden={i !== active}
                  fill
                  priority={i === 0}
                  sizes="(max-width:1024px) 92vw, 40vw"
                  className={`object-cover transition-opacity duration-700 ease-out ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              {/* Caption */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#292622]/85 via-[#292622]/45 to-transparent px-5 pb-5 pt-20 sm:px-7 sm:pb-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    aria-live="polite"
                  >
                    <p className="font-heading text-2xl leading-tight text-[#F7F3ED] sm:text-3xl">
                      {current.value}
                      {current.suffix}{" "}
                      <span className="text-[#C18A35]">{current.label.toLowerCase()}</span>
                    </p>
                    <p className="mt-1 text-sm text-[#F7F3ED]/80">{current.title}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress ticks: show which of the four is selected, and let people jump */}
              <div className="absolute right-4 top-4 flex gap-1.5 sm:right-5 sm:top-5">
                {STATS.map((s, i) => (
                  <span
                    key={s.label}
                    aria-hidden="true"
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === active ? "w-7 bg-[#C18A35]" : "w-3 bg-[#FFFFFF]/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ───────── Heading + stats ───────── */}
          <div className="lg:col-span-7">
            <motion.h2
              id="why-choose-us-heading"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="max-w-2xl font-heading text-4xl font-medium leading-[1.1] text-[#593719] sm:text-5xl xl:text-6xl"
            >
              Design that lives with you, not just in it.
            </motion.h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#292622]/70">
              Hover or tap a number to see the work behind it.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12">
              {STATS.map((stat, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={stat.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`group rounded-sm p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED] xl:p-6 ${
                      isActive
                        ? "bg-[#FFFFFF] shadow-[0_18px_40px_-26px_rgba(89,55,25,0.55)]"
                        : "bg-transparent hover:bg-[#E8DED0]/45"
                    }`}
                  >
                    <p
                      className={`font-heading text-6xl leading-none transition-colors duration-300 xl:text-7xl ${
                        isActive ? "text-[#593719]" : "text-[#593719]/55"
                      }`}
                    >
                      {stat.count ? <CountUp to={stat.value} suffix={stat.suffix} /> : stat.value}
                    </p>

                    <DimensionLine label={stat.label} active={isActive} delay={i * 0.12} />

                    <h3 className="mt-5 font-heading text-xl text-[#292622]">{stat.title}</h3>
                    <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[#292622]/70">
                      {stat.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <Link
              href="/portfolio"
              className="group mt-12 inline-flex items-center gap-2 rounded-sm bg-[#593719] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
            >
              See our work
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}