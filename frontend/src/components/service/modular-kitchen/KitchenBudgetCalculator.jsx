"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const cards = [
  {
    id: "luxury",
    title: "Luxury",
    price: "₹ 3 Lakhs",
    image: "/image/kitchen_design11.webp",
    rotate: -10,
    left: "0%",
    top: 90,
    bg: "bg-zinc-800",
    text: "text-white",
  },
  {
    id: "premium",
    title: "Premium",
    price: "₹ 2 Lakhs",
    image: "/image/kitchen_design6.webp",
    rotate: -2,
    left: "27%",
    top: 20,
    bg: "bg-[#b08d74]",
    text: "text-white",
  },
  {
    id: "economy",
    title: "Economy",
    price: "₹ 1 Lakh",
    image: "/image/kitchen_design2.webp",
    rotate: 10,
    left: "54%",
    top: 100,
    bg: "bg-[#d7d1c8]",
    text: "text-zinc-700",
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8851F]";

function PriceSticker({ price, className = "" }) {
  return (
    <span
      className={`absolute z-10 rounded-full bg-[#E2B54F] px-3 py-1 text-xs font-bold text-[#3D1F0D] shadow-md ${className}`}
    >
      from {price}
    </span>
  );
}

export default function KitchenBudgetCalculator() {
  const [active, setActive] = useState(1);
  const [hovered, setHovered] = useState(null);
  const current = cards[active];

  return (
    <section
      aria-labelledby="budget-heading"
      className="px-4 py-12 sm:px-6 md:py-16 lg:py-20"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[24px] bg-[#F7F3ED] md:rounded-[32px] lg:rounded-[40px]">
   

        <div className="relative grid items-center gap-12 p-6 md:p-10 lg:grid-cols-2 lg:gap-10 lg:p-14">
          {/* Left side cards */}
          <div
            role="radiogroup"
            aria-label="Kitchen package"
            className="relative"
          >
            {/* Mobile + tablet: swipeable row of tilted cards */}
            <div className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-6 pt-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:hidden">
              {cards.map((card, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={card.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setActive(i)}
                    style={{
                      transform: `rotate(${isActive ? 0 : i === 1 ? -2 : i === 0 ? -4 : 4}deg) translateY(${
                        isActive ? -8 : 0
                      }px)`,
                    }}
                    className={`relative w-[70%] shrink-0 snap-center overflow-hidden rounded-[24px] text-left shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none sm:w-auto ${card.bg} ${focusRing} ${
                      isActive ? "ring-4 ring-[#E2B54F]" : ""
                    }`}
                  >
                    <PriceSticker price={card.price} className="right-3 top-3 rotate-6" />
                    <span className="relative block h-[180px] sm:h-[200px]">
                      <Image
                        src={card.image}
                        alt={`${card.title} kitchen`}
                        fill
                        sizes="(min-width: 640px) 33vw, 70vw"
                        className="object-cover"
                      />
                    </span>
                    <span className={`block p-4 ${card.text}`}>
                      <span className="block font-heading text-xl md:text-2xl">
                        {card.title}
                      </span>
                      <span className="mt-1 block text-xs md:text-sm">
                        Cost starting from {card.price}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desktop: fanned stack, hover lifts, click brings to front */}
            <div className="relative hidden h-[520px] lg:block">
              {/* Dashed ring behind the cards */}
      
              {cards.map((card, i) => {
                const isActive = i === active;
                const isHovered = i === hovered;
                const angle = isActive ? 0 : isHovered ? card.rotate / 2 : card.rotate;
                const lift = isActive ? -28 : isHovered ? -14 : 0;
                const scale = isActive ? 1.06 : 1;

                return (
                  <button
                    key={card.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    style={{
                      left: card.left,
                      top: card.top,
                      zIndex: isActive ? 30 : isHovered ? 20 : 10 - Math.abs(i - 1),
                      transform: `rotate(${angle}deg) translateY(${lift}px) scale(${scale})`,
                    }}
                    className={`absolute w-[46%] max-w-[270px] overflow-hidden rounded-[30px] text-left shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${card.bg} ${focusRing} ${
                      isActive ? "ring-4 ring-[#E2B54F]" : ""
                    }`}
                  >
                    <PriceSticker price={card.price} className="right-4 top-4 rotate-6" />
                    <span className="relative block h-[200px] xl:h-[230px]">
                      <Image
                        src={card.image}
                        alt={`${card.title} kitchen`}
                        fill
                        sizes="270px"
                        className="object-cover"
                      />
                    </span>
                    <span className={`block p-5 ${card.text}`}>
                      <span className="block font-heading text-3xl">
                        {card.title}
                      </span>
                      <span className="mt-1 block text-sm">
                        Cost starting from {card.price}
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* Hint */}
              <p className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm text-zinc-600">
                <Sparkles size={16} aria-hidden="true" className="text-[#B8851F]" />
                Tap a card to pick your package
              </p>
            </div>
          </div>

          {/* Right side content */}
          <div className="text-center lg:text-left">
            <h2
              id="budget-heading"
              className="font-heading text-4xl leading-tight text-zinc-900 md:text-[56px] lg:text-5xl xl:text-6xl"
            >
              Kitchen Budget
              <br />
              Calculator
            </h2>

            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-zinc-700 md:mt-6 md:text-lg lg:mx-0">
              We&rsquo;ve got a modular kitchen solution for every style, need
              and budget.
            </p>

            <p
              aria-live="polite"
              className="mt-5 inline-flex -rotate-2 items-center gap-2 rounded-full bg-[#E2B54F] px-4 py-2 text-sm font-semibold text-[#3D1F0D] shadow-md"
            >
              <Sparkles size={16} aria-hidden="true" />
              {current.title} · from {current.price}
            </p>

            <div>
              <Link
                href={`/kitchen-calculator?package=${current.id}`}
                className={`group mt-8 inline-flex items-center gap-3 rounded-md bg-white px-5 py-3 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:mt-10 md:gap-4 md:px-8 md:py-4 ${focusRing}`}
              >
                <span className="text-base font-medium md:text-xl">
                  Calculate Now
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 transition-all group-hover:bg-black group-hover:text-white md:h-12 md:w-12">
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}