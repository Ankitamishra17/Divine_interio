"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function CalculatorHero() {
  return (
    <section className="font-body relative overflow-hidden bg-[#F7F3ED] py-20 lg:py-28">
      {/* Soft decorative glow */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#C18A35]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[360px] w-[360px] rounded-full bg-[#593719]/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="font-body mb-6 inline-flex items-center gap-2 rounded-full border border-[#C18A35]/40 bg-[#C18A35]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#593719]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C18A35]" />
              Free Wardrobe Cost Calculator
            </span>

            <h1 className="font-heading mb-6 text-4xl font-bold leading-[1.1] text-[#593719] md:text-6xl">
              Design Your Dream
              <span className="block italic text-[#C18A35]">Wardrobe</span>
            </h1>

            <p className="font-body mb-10 max-w-xl text-lg leading-relaxed text-[#292622]/70">
              Get an instant estimate for your custom wardrobe. Choose your
              wardrobe type, size, finishes, and accessories in just a few
              simple steps.
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                { value: "500+", label: "Projects Delivered" },
                { value: "10 Year", label: "Warranty" },
                { value: "Free", label: "Design Consultation" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#E8DED0] border-l-[3px] border-l-[#C18A35] bg-[#FFFFFF] px-5 py-4 shadow-sm"
                >
                  <h4 className="font-heading text-xl font-bold text-[#593719]">
                    {stat.value}
                  </h4>
                  <p className="font-body text-sm text-[#292622]/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            {/* Offset frame */}
            <div className="absolute -right-4 -top-4 hidden h-full w-full rounded-[32px] border border-[#C18A35]/50 md:block" />

            <div className="relative h-[500px] overflow-hidden rounded-[32px] shadow-2xl">
              <Image
                src="/images/wardrobe-hero.jpg"
                alt="Luxury Wardrobe"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#292622]/40 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-[#E8DED0] bg-[#FFFFFF] px-6 py-4 shadow-xl md:-left-6">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-[#C18A35]">
                Instant Estimate
              </p>
              <p className="font-heading mt-1 text-lg font-bold text-[#593719]">
                In 6 simple steps
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}