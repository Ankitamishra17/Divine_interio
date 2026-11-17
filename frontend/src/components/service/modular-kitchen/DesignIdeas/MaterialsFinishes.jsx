"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

// NOTE: durability, upkeep and bestFor are sample values. Edit them to match your products.
const materials = [
  {
    title: "Acrylic Finish Kitchen",
    short: "Acrylic",
    description:
      "High-gloss premium finish with a seamless modern appearance and luxurious shine.",
    image: "/kitchen/Acrylic.avif",
    durability: 4,
    upkeep: "Wipe clean",
    bestFor: "Modern, bright spaces",
  },
  {
    title: "Laminate Finish Kitchen",
    short: "Laminate",
    description:
      "Durable, stylish and available in hundreds of colors, textures and patterns.",
    image: "/kitchen/Laminate.avif",
    durability: 4,
    upkeep: "Very low",
    bestFor: "Busy family kitchens",
  },
  {
    title: "PU Finish Kitchen",
    short: "PU",
    description:
      "Smooth painted finish offering elegance, durability and timeless beauty.",
    image: "/image/kitchen_design6.webp",
    durability: 5,
    upkeep: "Low",
    bestFor: "Premium, custom looks",
  },
  {
    title: "Wood Veneer Kitchen",
    short: "Veneer",
    description:
      "Natural wood grains that bring warmth and sophistication to interiors.",
    image: "/kitchen/Veneer.avif",
    durability: 4,
    upkeep: "Moderate",
    bestFor: "Warm, natural interiors",
  },
  {
    title: "Glass Finish Kitchen",
    short: "Glass",
    description:
      "Reflective modern surfaces perfect for contemporary luxury spaces.",
    image: "/image/kitchen_design7.webp",
    durability: 5,
    upkeep: "Wipe clean",
    bestFor: "Contemporary luxury",
  },
  {
    title: "Membrane Finish Kitchen",
    short: "Membrane",
    description:
      "Flexible and stylish finish with seamless edges and rich aesthetics.",
    image: "/kitchen/Membrane.avif",
    durability: 3,
    upkeep: "Low",
    bestFor: "Budget-friendly style",
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8972B]";

function Dots({ value }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${
            n <= value ? "bg-[#C8972B]" : "bg-white/20"
          }`}
        />
      ))}
    </span>
  );
}

function Details({ item }) {
  return (
    <>
      <span aria-hidden="true" className="mb-3 block h-0.5 w-8 bg-[#C8972B]" />
      <h3 className="font-heading text-xl leading-snug text-white sm:text-2xl">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-white/75">{item.description}</p>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-white/15 pt-4">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C8972B]">
            Durability
          </dt>
          <dd className="mt-1.5">
            <Dots value={item.durability} />
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C8972B]">
            Upkeep
          </dt>
          <dd className="mt-1.5 text-[13px] font-medium text-white">
            {item.upkeep}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C8972B]">
            Best for
          </dt>
          <dd className="mt-1.5 text-[13px] font-medium leading-4 text-white">
            {item.bestFor}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href="/portfolio"
          className={`group inline-flex min-h-10 items-center gap-2 rounded-full bg-[#B8851F] px-5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-[#3D1F0D] ${focusRing}`}
        >
          See {item.short} kitchens
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
        <Link
          href="/contact"
          className={`text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline ${focusRing}`}
        >
          Book free consultation
        </Link>
      </div>
    </>
  );
}

export default function MaterialsFinishes() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const current = materials[active];

  const go = (i, focus = false) => {
    const next = (i + materials.length) % materials.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      go(materials.length - 1, true);
    }
  };

  return (
    <section
      aria-labelledby="materials-heading"
      className="relative overflow-hidden bg-[#292622] py-16 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#C8972B]">
              <span aria-hidden="true" className="h-px w-10 bg-[#C8972B]" />
              Premium Collection
            </p>
            <h2
              id="materials-heading"
              className="mt-4 font-heading text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl"
            >
              Materials &amp; finishes
              <span className="text-[#C8972B]">.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-8 text-white/70">
            Explore luxury materials crafted to elevate your kitchen, wardrobe
            and furniture interiors. Pick a finish to see the details.
          </p>
        </div>

        {/* Stage */}
        <div
          role="tabpanel"
          id="finish-panel"
          aria-labelledby={`finish-tab-${active}`}
        >
          <div className="relative h-60 overflow-hidden rounded-3xl bg-stone-800 shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:h-72 lg:h-[420px]">
            {materials.map((item, i) => (
              <Image
                key={item.title}
                src={item.image}
                alt={i === active ? item.title : ""}
                fill
                priority={i === 0}
                sizes="(min-width: 1280px) 1200px, 100vw"
                className={`object-cover transition-all duration-1000 ease-out motion-reduce:transition-none ${
                  i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
                }`}
              />
            ))}

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 lg:bg-gradient-to-r lg:from-black/60 lg:via-black/10 lg:to-transparent"
            />

            {/* Counter */}
            <span
              aria-hidden="true"
              className="absolute left-5 top-5 rounded-full bg-black/30 px-3.5 py-1.5 font-heading text-sm tracking-widest text-white backdrop-blur-md sm:left-6 sm:top-6"
            >
              0{active + 1} / 0{materials.length}
            </span>

            {/* Prev / next */}
            <div className="absolute right-5 top-5 flex gap-2 sm:right-6 sm:top-6">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous finish"
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#3D1F0D] transition-colors duration-300 hover:bg-[#B8851F] hover:text-white ${focusRing}`}
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next finish"
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#3D1F0D] transition-colors duration-300 hover:bg-[#B8851F] hover:text-white ${focusRing}`}
              >
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Desktop: glass panel on the image */}
            <div
              aria-live="polite"
              className="absolute bottom-5 left-5 hidden w-full max-w-[340px] rounded-2xl border border-white/15 bg-[#2A1408]/65 p-5 shadow-2xl backdrop-blur-xl lg:block"
            >
              <Details item={current} />
            </div>
          </div>

          {/* Mobile + tablet: details below the image */}
          <div
            aria-live="polite"
            className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 lg:hidden"
          >
            <Details item={current} />
          </div>
        </div>

        {/* Thumbnail rail */}
        <div
          role="tablist"
          aria-label="Kitchen finishes"
          onKeyDown={onKeyDown}
          className="-mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0"
        >
          {materials.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.title}
                ref={(el) => (tabRefs.current[i] = el)}
                id={`finish-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls="finish-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                className={`group w-36 shrink-0 snap-start text-left transition-opacity duration-300 lg:w-auto ${focusRing} ${
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                <span
                  className={`relative block h-24 overflow-hidden rounded-2xl bg-stone-800 ring-2 transition-all duration-300 lg:h-28 ${
                    isActive ? "ring-[#C8972B]" : "ring-transparent"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 180px, 144px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
                  />
                </span>
                <span className="mt-3 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`font-heading text-sm ${
                      isActive ? "text-[#C8972B]" : "text-white/40"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span className="font-heading text-base text-white">
                    {item.short}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-2 block h-0.5 bg-[#C8972B] transition-all duration-500 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}