"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const kitchenIdeas = [
  {
    title: "Modern Kitchens",
    description: "Clean lines & minimal aesthetics",
    image: "https://i.pinimg.com/1200x/47/25/a6/4725a66addba4620106fb85e05c64ec7.jpg",
  },
  {
    title: "Contemporary Kitchens",
    description: "Elegant & functional designs",
    image: "https://i.pinimg.com/1200x/85/ff/bf/85ffbfc6fe8222aced4072e245ace658.jpg",
  },
  {
    title: "Luxury Kitchens",
    description: "Premium finishes & high-end fittings",
    image: "https://i.pinimg.com/736x/d3/e2/54/d3e254782962c42b40e38837583ccce7.jpg",
  },
  {
    title: "Classic Kitchens",
    description: "Timeless designs that never age",
    image: "https://i.pinimg.com/1200x/e0/47/f5/e047f5ccc1647d5e3175963bc28c9718.jpg",
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8851F]";

export default function DesignIdeas() {
  const [active, setActive] = useState(0);
  const current = kitchenIdeas[active];

  return (
    <section
      aria-labelledby="ideas-heading"
      className="bg-[#FBF7F2] py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Image stage */}
          <div className="relative lg:order-2 lg:col-span-7">
            {/* Gold offset frame */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 hidden h-full w-full rounded-[2rem] border-2 border-[#dba343]/50 sm:block"
            />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-stone-200 shadow-2xl shadow-[#3D1F0D]/20 sm:aspect-[5/4] lg:h-[620px] lg:aspect-auto">
              {kitchenIdeas.map((item, i) => (
                <Image
                  key={item.title}
                  src={item.image}
                  alt={i === active ? item.title : ""}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className={`object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
                    i === active
                      ? "scale-100 opacity-100"
                      : "scale-110 opacity-0"
                  }`}
                />
              ))}

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
              />

              {/* Floating caption */}
              <Link
                href="/portfolio"
                className={`group absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur sm:bottom-6 sm:left-6 sm:right-auto sm:min-w-[340px] sm:p-5 ${focusRing}`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6416]">
                    0{active + 1} / 0{kitchenIdeas.length}
                  </p>
                  <p className="mt-1 font-heading text-xl text-[#3D1F0D]">
                    {current.title}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B8851F] text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#3D1F0D]"
                >
                  <ArrowUpRight size={20} />
                </span>
              </Link>
            </div>
          </div>

          {/* Text + list */}
          <div className="lg:order-1 lg:col-span-5">
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#8A6416]">
              <span aria-hidden="true" className="h-px w-10 bg-[#dba343]" />
              Inspiration gallery
            </p>
            <h2
              id="ideas-heading"
              className="mt-4 font-heading text-4xl leading-[1.1] text-[#3D1F0D] sm:text-5xl"
            >
              Kitchen design ideas
              <span className="text-[#B8851F]">.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-stone-600">
              Four styles to start from. Whatever you choose, we tailor it to
              your space and the way you cook.
            </p>

            <ul className="mt-8 border-t border-[#3D1F0D]/10">
              {kitchenIdeas.map((item, i) => {
                const isActive = i === active;
                return (
                  <li key={item.title} className="border-b border-[#3D1F0D]/10">
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={isActive}
                      className={`group relative flex w-full items-center gap-5 py-5 text-left transition-all duration-300 ${focusRing}`}
                    >
                      {/* Active indicator */}
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-0 h-full w-0.5 bg-[#B8851F] transition-transform duration-300 origin-top ${
                          isActive ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                      <span
                        aria-hidden="true"
                        className={`pl-4 font-heading text-lg transition-colors duration-300 ${
                          isActive ? "text-[#B8851F]" : "text-stone-400"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`block font-heading text-xl transition-colors duration-300 sm:text-2xl ${
                            isActive ? "text-[#3D1F0D]" : "text-stone-500"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`grid transition-all duration-500 motion-reduce:transition-none ${
                            isActive
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <span className="overflow-hidden text-[15px] leading-6 text-stone-600">
                            <span className="block pt-1">
                              {item.description}
                            </span>
                          </span>
                        </span>
                      </span>
                      <ArrowRight
                        size={20}
                        aria-hidden="true"
                        className={`mr-2 transition-all duration-300 ${
                          isActive
                            ? "translate-x-0 text-[#B8851F] opacity-100"
                            : "-translate-x-2 opacity-0"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/portfolio"
              className={`group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#3D1F0D] px-8 text-[15px] font-semibold text-[#F7F3ED] transition-colors duration-300 hover:bg-[#B8851F] hover:text-white ${focusRing}`}
            >
              View full portfolio
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}