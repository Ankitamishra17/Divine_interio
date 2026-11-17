"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

/*
  Palette
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF

  New layout: a stacked "film still + quote slip".
  - A wide cinematic video panel carries the headline at its bottom-left.
  - A white quote slip overlaps the bottom edge of the video. It is the single
    interactive moment: pick your home size, then go straight to the calculator
    with that choice already made (one tap fewer than before).
  - Video plays only while visible and never for reduced-motion users.
  - One entrance reveal for the slip, nothing else animates on its own.

  Calculator side: read `home` from the query string, e.g. /cost-calculator?home=3bhk
*/

const EASE = [0.22, 1, 0.36, 1];

const HOME_SIZES = [
  { id: "2bhk", label: "2 BHK" },
  { id: "3bhk", label: "3 BHK" },
  { id: "4bhk", label: "4 BHK" },
  { id: "villa", label: "Villa" },
];

export default function CTABanner() {
  const reduce = useReducedMotion();
  const videoRef = useRef(null);
  const [home, setHome] = useState("3bhk");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#F7F3ED] px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        {/* Video panel */}
        <div className="relative isolate overflow-hidden rounded-sm bg-[#292622]">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>

          {/* Bottom-heavy scrim keeps the headline readable on any frame */}
     

   <div className="relative flex min-h-[420px] flex-col items-end justify-end px-6 pb-28 pt-24 text-right sm:min-h-[480px] sm:px-10 sm:pb-32 lg:min-h-[540px] lg:px-14 lg:pb-36">



</div>
        </div>

        {/* Quote slip, overlapping the video */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative z-10 -mt-16 px-3 sm:-mt-20 sm:px-8 lg:-mt-24 lg:px-14"
        >
          <div className="rounded-sm border-t-2 border-[#C18A35] bg-white p-6 shadow-[0_24px_60px_-20px_rgba(41,38,34,0.45)] sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10 lg:p-10">
            {/* Choose home size */}
            <div role="radiogroup" aria-labelledby="home-size-label">
              <p
                id="home-size-label"
                className="font-[Cormorant_Garamond,serif] text-2xl font-medium text-[#292622] sm:text-[28px]"
              >
                Start with your home size
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {HOME_SIZES.map((size) => {
                  const active = home === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setHome(size.id)}
                      className={`min-h-12 rounded-sm border px-4 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 ${
                        active
                          ? "border-[#593719] bg-[#593719] text-[#F7F3ED]"
                          : "border-[#E8DED0] bg-[#F7F3ED] text-[#292622] hover:border-[#C18A35]"
                      }`}
                    >
                      {size.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 lg:mt-0 lg:w-[300px]">
              <Link
                href={`/cost-calculator?home=${home}`}
                className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#C18A35] px-6 text-[15px] font-semibold text-[#292622] transition-colors duration-300 hover:bg-[#593719] hover:text-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#593719] focus-visible:ring-offset-2"
              >
                Calculate my estimate
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/contact"
                className="text-center text-sm font-medium text-[#593719] underline decoration-[#C18A35] underline-offset-4 transition-colors hover:text-[#C18A35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2"
              >
                Prefer to talk? Book a free consultation
              </Link>
            </div>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-[13px] text-[#292622]/70">
            <MapPin size={14} className="shrink-0 text-[#C18A35]" aria-hidden="true" />
            Luxury projects delivered across Noida, Greater Noida and Ghaziabad
          </p>
        </motion.div>
      </div>
    </section>
  );
}