"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

/*
  Palette
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF

  Colours follow the ServicesSection: Charcoal wall, Gold accents and hairlines,
  Ivory text, Espresso only as the hover tint.

  UX changes in this version:
  - Always 2x2 on phones (was 4 tall rows), so all four proof points fit in one screen.
  - Numbers reserve their final width, so the layout never jitters while counting.
  - Removed the fake "focusable" cells (they did nothing on Tab). Focus now lands only on real links.
  - Contact row built for thumbs: 48px-high, full-width buttons on mobile.
    Add a phone / WhatsApp number below and those two buttons appear automatically.
*/

// Fill these in to show Call / WhatsApp buttons. Leave "" to hide them.
const PHONE = ""; // e.g. "+919876543210"
const WHATSAPP = ""; // digits only, with country code, e.g. "919876543210"
const WHATSAPP_TEXT = "Hi, I'd like to talk about a home interior project in Noida.";

const stats = [
  {
    value: 200,
    decimals: 0,
    suffix: "+",
    unit: "",
    title: "Projects delivered in Noida",
    desc: "Luxury homes and premium interiors completed across Noida and Greater Noida.",
  },
  {
    value: 12,
    decimals: 0,
    suffix: "",
    unit: "yr",
    title: "Warranty support",
    desc: "Long-term warranty coverage for modular kitchens and interiors.",
  },
  {
    value: 45,
    decimals: 0,
    suffix: "",
    unit: "days",
    title: "Fast delivery",
    desc: "Timely project execution with premium finishing and quality assurance.",
  },
  {
    value: 99.9,
    decimals: 1,
    suffix: "%",
    unit: "",
    title: "Client satisfaction",
    desc: "Trusted by homeowners for elegant and functional luxury interiors.",
  },
];

const EASE = [0.22, 1, 0.36, 1];

function Counter({ to, decimals, suffix, run }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  const finalText = `${to.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    if (!run) return;
    if (reduce) {
      setN(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [run, reduce, to]);

  // Both spans share one grid cell: the invisible one holds the final width,
  // the visible one counts. Nothing shifts while the number grows.
  return (
    <span className="inline-grid tabular-nums">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {finalText}
      </span>
      <span className="col-start-1 row-start-1 text-center" aria-hidden="true">
        {n.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}

function StatCell({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const spoken = `${stat.value.toFixed(stat.decimals)}${stat.suffix}${stat.unit ? " " + stat.unit : ""}`;

  return (
    <motion.li
      ref={ref}
      className="group relative flex flex-col items-center justify-start overflow-hidden bg-[#292622] px-4 py-8 text-center sm:px-8 sm:py-12 lg:px-10 lg:py-14"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
    >
      {/* Espresso tint + gold top line on hover (desktop) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[#593719]/45 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[#C18A35] transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      <span className="sr-only">{spoken}</span>

      <p className="relative flex items-baseline justify-center gap-1.5 font-[Cormorant_Garamond,serif] font-medium leading-none text-[#C18A35]">
        <span className="text-5xl sm:text-6xl lg:text-7xl">
          <Counter to={stat.value} decimals={stat.decimals} suffix={stat.suffix} run={inView} />
        </span>
        {stat.unit && (
          <span className="text-lg text-[#C18A35]/80 sm:text-2xl lg:text-3xl" aria-hidden="true">
            {stat.unit}
          </span>
        )}
      </p>

      <h3 className="relative mt-4 text-[15px] font-medium leading-snug text-[#F7F3ED] sm:mt-5 sm:text-base">
        {stat.title}
      </h3>

      <span
        aria-hidden="true"
        className="relative mt-3 h-px w-10 bg-[#C18A35]/40 transition-all duration-500 group-hover:w-16 group-hover:bg-[#C18A35] sm:mt-4"
      />

      <p className="relative mx-auto mt-3 max-w-[240px] text-[13px] leading-relaxed text-[#F7F3ED]/65 sm:mt-4 sm:text-sm">
        {stat.desc}
      </p>
    </motion.li>
  );
}

export default function StatsMarquee() {
  const waHref = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_TEXT)}`
    : null;

  return (
    <section className="bg-[#292622]" aria-label="Our track record">
      <div className="mx-auto max-w-[1280px]">
        {/* gap-px on a tinted wrapper = clean 1px dividers at every breakpoint */}
        <ul className="grid grid-cols-2 gap-px bg-[#C18A35]/25 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCell key={s.title} stat={s} index={i} />
          ))}
        </ul>

        {/* Contact row. Delete this block if you don't want it. */}
        <div className="flex flex-col items-stretch justify-between gap-5 border-t border-[#C18A35]/25 px-5 py-7 sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <p className="text-center text-sm text-[#F7F3ED]/75 sm:text-left sm:text-base">
            Planning a home in Noida? Talk to our design team before you decide.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#C18A35] px-6 text-sm font-semibold tracking-wide text-[#292622] transition-colors duration-300 hover:bg-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F3ED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
            >
              Book a free consultation
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[#F7F3ED]/40 px-5 text-sm font-semibold text-[#F7F3ED] transition-colors duration-300 hover:border-[#C18A35] hover:text-[#C18A35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            )}

            {PHONE && (
              <a
                href={`tel:${PHONE}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[#F7F3ED]/40 px-5 text-sm font-semibold text-[#F7F3ED] transition-colors duration-300 hover:border-[#C18A35] hover:text-[#C18A35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
              >
                <Phone size={16} />
                Call us
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}