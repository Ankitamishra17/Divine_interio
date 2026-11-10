"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/*
  Palette
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF

  Design idea: the quote card is a DOORWAY (same arch + gold frame as the ServicesSection),
  standing on the floor of the banner. Everything else stays quiet so the card is the one
  thing that draws the eye.

  UX changes:
  - Video only plays while the banner is on screen (saves battery and data on phones)
    and stays paused for people who have reduced motion turned on.
  - Darker Charcoal overlay, so the text is readable on any frame of the video.
  - Button text is 15px sentence case (was 11px uppercase). The button is 56px tall.
  - A second, quieter option ("Book a free consultation") for visitors who aren't ready for the calculator.
  - Gentler entrance animation that respects reduced motion.
*/

const EASE = [0.22, 1, 0.36, 1];

export default function CTABanner() {
  const reduce = useReducedMotion();
  const videoRef = useRef(null);

  // Play only while visible; never autoplay for reduced-motion users
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="overflow-hidden bg-[#F7F3ED] px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-sm bg-[#292622]">
          {/* Video background (decorative) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/bg_video.mp4" type="video/mp4" />
          </video>

          {/* Overlays: Charcoal for contrast, a little Espresso warmth on the right */}
          <div className="absolute inset-0 bg-[#292622]/55" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#292622]/90 via-[#292622]/50 to-[#593719]/40"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 grid grid-cols-1 gap-10 pt-12 sm:pt-14 lg:min-h-[500px] lg:grid-cols-[1fr_auto] lg:gap-6 lg:pt-0">
            {/* Left: message */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 lg:py-16"
            >
              <h2 className="max-w-xl font-[Cormorant_Garamond,serif] text-[34px] font-medium leading-[1.08] text-[#F7F3ED] sm:text-[44px] lg:text-[56px]">
                Calculate your dream home interior cost
              </h2>

              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#F7F3ED]/80 sm:text-base">
                Get an instant estimate for your luxury interior project. Plan your home
                with elegant, modern and premium interiors tailored to your vision.
              </p>
            </motion.div>

            {/* Right: the doorway */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="mx-auto w-full max-w-[380px] px-6 sm:px-0 lg:mr-14 lg:self-end"
            >
              {/* outer arch = thin gold frame, open at the bottom like a doorway */}
              <div className="rounded-t-[999px] border border-b-0 border-[#C18A35]/60 p-2 pb-0">
                <div className="flex flex-col items-center rounded-t-[999px] bg-[#F7F3ED] px-6 pb-9 pt-20 text-center sm:px-9 sm:pt-24">
                  <h3 className="font-[Cormorant_Garamond,serif] text-2xl font-medium text-[#292622] sm:text-3xl">
                    Get your instant quote
                  </h3>

                  <Link
                    href="/cost-calculator"
                    className="group mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#593719] px-6 text-[15px] font-semibold tracking-wide text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
                  >
                    Calculate now
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/contact"
                    className="mt-4 text-sm font-medium text-[#593719] underline decoration-[#C18A35] decoration-1 underline-offset-4 transition-colors hover:text-[#C18A35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
                  >
                    Prefer to talk? Book a free consultation
                  </Link>

                  <p className="mt-6 border-t border-[#E8DED0] pt-5 text-[13px] leading-relaxed text-[#292622]/70">
                    Luxury projects delivered across Noida, Greater Noida and Ghaziabad
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}