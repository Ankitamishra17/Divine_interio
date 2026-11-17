"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const kitchenTypes = [
  { title: "Straight Kitchen", subtitle: "Sleek and space-efficient", image: "/Straight-shape.png" },
  { title: "L-Shaped Kitchen", subtitle: "Smart corners, easy workflow", image: "/L-shape.png" },
  { title: "U-Shaped Kitchen", subtitle: "Maximum storage and counters", image: "/image/u-kitchenDesign.webp" },
  { title: "Island Kitchen", subtitle: "A centrepiece for open homes", image: "/image/island_kitchen.avif" },
];

const fade = (i) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: i * 0.1 },
});

/* ---------- 1. CARD: white card, round number badge on the image edge ---------- */
function CardDesign() {
  return (
    <div className="-mt-24 grid grid-cols-2 gap-4 md:-mt-32 lg:grid-cols-4 lg:gap-6">
      {kitchenTypes.map((item, i) => (
        <motion.div key={item.title} {...fade(i)}>
          <Link
            href="/portfolio"
            className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-[#3D1F0D]/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="relative h-44 overflow-hidden sm:h-56">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="relative flex flex-1 flex-col items-center px-4 pb-6 pt-10 text-center">
              <span className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#B8851F] font-serif text-lg text-white ring-4 ring-white">
                0{i + 1}
              </span>
              <h3 className="font-serif text-lg text-[#3D1F0D] sm:text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.subtitle}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#B8851F]">
                Explore
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- 2. STRIP: one floating white bar with round thumbnails ---------- */
function StripDesign() {
  return (
    <motion.div
      {...fade(0)}
      className="-mt-14 overflow-hidden rounded-2xl bg-white shadow-xl shadow-[#3D1F0D]/15 md:-mt-16 "
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kitchenTypes.map((item) => (
          <Link
            key={item.title}
            href="/portfolio"
            className="group flex items-center gap-4 border-b border-[#3D1F0D]/10 p-5 transition-colors hover:bg-[#F7F3ED] lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-[#C8972B]/60">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="64px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-lg leading-tight text-[#3D1F0D]">{item.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{item.subtitle}</p>
            </div>
            <ArrowUpRight
              size={20}
              className="shrink-0 text-[#B8851F] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- 3. STAGGER: arch-shaped images, alternate cards sit lower ---------- */
function StaggerDesign() {
  return (
    <div className="-mt-20 grid grid-cols-2 gap-x-4 gap-y-10  lg:grid-cols-4 lg:gap-x-6 pt-18">
      {kitchenTypes.map((item, i) => (
        <div key={item.title} className={i % 2 ? "lg:mt-14" : ""}>
          <motion.div {...fade(i)}>
            <Link href="/portfolio" className="group block text-center">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[200px] rounded-b-2xl border-4 border-white shadow-xl shadow-[#3D1F0D]/20">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <span className="mt-5 block font-serif text-sm text-[#B8851F]">0{i + 1}</span>
              <h3 className="mt-1 font-serif text-lg text-[#3D1F0D] sm:text-xl">{item.title}</h3>
              <p className="mx-auto mt-1 max-w-[220px] text-sm text-gray-500">{item.subtitle}</p>
              <div className="mx-auto mt-3 h-[2px] w-8 bg-[#C8972B] transition-all duration-300 group-hover:w-16" />
            </Link>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ---------- 4. REVEAL: full image, gold panel slides over on hover ---------- */
function RevealDesign() {
  return (
    <div className="-mt-16 grid grid-cols-2 gap-3 md:-mt-28 lg:grid-cols-4 lg:gap-5">
      {kitchenTypes.map((item, i) => (
        <motion.div key={item.title} {...fade(i)}>
          <Link
            href="/portfolio"
            className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-xl shadow-[#3D1F0D]/20"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Default label */}
            <div className="absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 group-hover:opacity-0 sm:p-5">
              <span className="font-serif text-sm text-[#C8972B]">0{i + 1}</span>
              <h3 className="font-serif text-lg leading-tight text-white sm:text-xl">{item.title}</h3>
            </div>

            {/* Hover panel */}
            <div className="absolute inset-0 flex translate-y-full flex-col items-center justify-center bg-[#B8851F]/95 p-6 text-center text-white transition-transform duration-500 group-hover:translate-y-0">
              <h3 className="font-serif text-xl sm:text-2xl">{item.title}</h3>
              <div className="my-3 h-px w-10 bg-white/70" />
              <p className="text-sm leading-relaxed text-white/90">{item.subtitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2 text-sm">
                View Designs <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

const designs = {
  card: CardDesign,
  strip: StripDesign,
  stagger: StaggerDesign,
  reveal: RevealDesign,
};

export default function KitchenCards({ variant = "card" }) {
  const Design = designs[variant] || CardDesign;
  return (
<div className="relative z-20 pb-5 md:pb-2">
          <div className="container mx-auto px-4">
        <Design />
      </div>
    </div>
  );
}