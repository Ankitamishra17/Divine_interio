"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    id: "living-spaces",
    title: "Living Spaces",
    image: "https://i.pinimg.com/736x/52/f5/00/52f5000a8a5e8cc730b35ce03d1d0da5.jpg",
    description:
      "Curated living rooms blending comfort with timeless elegance, tailored to your lifestyle.",
  },
  {
    id: "bedroom-sanctuaries",
    title: "Bedroom Sanctuaries",
    image: "https://i.pinimg.com/736x/9e/7a/82/9e7a82f7b2d7a0ef42aab80ed3b3f6f1.jpg",
    description:
      "Restful retreats designed with layered textures, ambient lighting, and bespoke furniture.",
  },
  {
    id: "kitchen-dining",
    title: "Kitchen & Dining",
    image: "https://i.pinimg.com/736x/03/83/64/0383642cb9c0e709af48731ae5db5eae.jpg",
    description:
      "Functional yet stunning culinary spaces that become the heart of your home.",
  },
  {
    id: "bespoke-furniture",
    title: "Bespoke Furniture",
    image: "https://i.pinimg.com/1200x/08/02/31/080231f4afe9c3a5a9c1d816f2c5ecd2.jpg",
    description:
      "Custom-crafted pieces designed exclusively for your space and sensibilities.",
  },
  {
    id: "lighting-design",
    title: "Lighting Design",
    image: "https://i.pinimg.com/736x/02/07/e5/0207e5f95f5b6999eca4dc0d1dcef47c.jpg",
    description:
      "Atmospheric lighting schemes that sculpt mood and highlight architectural features.",
  },
  {
    id: "material-sourcing",
    title: "Material Sourcing",
    image: "https://i.pinimg.com/1200x/3e/fb/07/3efb07677ff52b372a986025c35102e9.jpg",
    description:
      "Premium materials sourced globally to elevate every surface in your home.",
  },
  {
    id: "space-planning",
    title: "Space Planning",
    image: "https://i.pinimg.com/736x/11/9c/11/119c11759d0ca6b5f0c57724d7f24cf0.jpg",
    description:
      "Intelligent layouts that optimize flow and functionality without sacrificing style.",
  },
  {
    id: "color-consultation",
    title: "Color Consultation",
    image: "https://i.pinimg.com/736x/68/b2/7f/68b27fc0c58cd0cb8ca558b6b57f301d.jpg",
    description:
      "Harmonious palettes that reflect your personality and enhance your space.",
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dba343]";

const arrowBtn = `flex h-12 w-12 items-center justify-center rounded-full border border-[#593719]/30 text-[#593719] transition-colors duration-300 hover:bg-[#593719] hover:text-white disabled:pointer-events-none disabled:opacity-30 ${focusRing}`;

export default function Services() {
  const scrollerRef = useRef(null);
  const [state, setState] = useState({
    canPrev: false,
    canNext: true,
    thumb: 30, // progress thumb width, %
    left: 0, // progress thumb offset, %
  });

  // Keep arrows and the progress bar in sync with the scroll position
  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setState({
      canPrev: scrollLeft > 4,
      canNext: scrollLeft < scrollWidth - clientWidth - 4,
      thumb: Math.min(100, (clientWidth / scrollWidth) * 100),
      left: (scrollLeft / scrollWidth) * 100,
    });
  }, []);

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  // Scroll by exactly one card, using the real distance between two cards
  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("li");
    const stepSize =
      cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : el.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * stepSize, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      aria-labelledby="services-heading"
      className="overflow-hidden bg-stone-50 py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with scroll controls */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#8A6416]">What we offer</p>
            <h2
              id="services-heading"
              className="mt-4 font-heading text-4xl leading-tight text-stone-950 sm:text-5xl lg:text-6xl"
            >
              Our design services
            </h2>
            <p className="mt-5 text-base leading-8 text-stone-600">
              From the first layout to the final light fitting, every service is
              tailored to your space and the way you live.
            </p>
          </div>

          <div className="hidden gap-3 sm:flex">
            <button
              type="button"
              aria-label="Previous services"
              onClick={() => scrollByCard(-1)}
              disabled={!state.canPrev}
              className={arrowBtn}
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next services"
              onClick={() => scrollByCard(1)}
              disabled={!state.canNext}
              className={arrowBtn}
            >
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scroller: swipe on touch, arrows or keyboard on desktop.
            Negative margins let the cards run to the screen edge so the next one peeks in. */}
        <div
          ref={scrollerRef}
          onScroll={update}
          role="region"
          aria-label="Design services, scrollable"
          tabIndex={0}
          className={`-mx-4 snap-x snap-mandatory overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8 [&::-webkit-scrollbar]:hidden motion-safe:scroll-smooth ${focusRing}`}
        >
          <ul className="flex gap-4 sm:gap-5">
            {services.map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}

            {/* Final card: the next step, so the row ends with an action */}
            <li className="flex aspect-[3/4] w-[78%] shrink-0 snap-start flex-col justify-between rounded-2xl bg-[#593719] p-6 text-white sm:w-[44%] lg:w-[31%] xl:w-[24%]">
              <span aria-hidden="true" className="block h-0.5 w-8 bg-[#dba343]" />
              <div>
                <p className="font-heading text-3xl leading-snug">
                  Not sure which service you need?
                </p>
                <p className="mt-3 text-[15px] leading-7 text-white/80">
                  Tell us about your space and we&rsquo;ll suggest where to
                  start. The first consultation is free.
                </p>
                <Link
                  href="/contact"
                  className={`group mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#dba343] px-7 text-[15px] font-semibold text-stone-950 transition-colors duration-300 hover:bg-white ${focusRing}`}
                >
                  Book a free consultation
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Link>
              </div>
            </li>
          </ul>
        </div>

        {/* Progress */}
        <div
          aria-hidden="true"
          className="relative mt-6 h-0.5 w-full overflow-hidden rounded-full bg-stone-200"
        >
          <span
            className="absolute top-0 h-full rounded-full bg-[#593719] transition-[left,width] duration-200 motion-reduce:transition-none"
            style={{ width: `${state.thumb}%`, left: `${state.left}%` }}
          />
        </div>
      </div>
    </section>
  );
}