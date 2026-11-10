"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

/*
  Palette
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF
*/

const AUTOPLAY_DELAY = 5000;

const categories = [
  {
    title: "Living Room",
    tab: "Living Room",
    image: "/image/living_room8.webp",
    href: "/services/design-ideas/living-room-design",
    desc: "Where luxury meets lifestyle.",
  },
  {
    title: "Modular Kitchen",
    tab: "Kitchen",
    image: "/image/9.webp",
    href: "/kitchen-design",
    desc: "Crafted for modern homes.",
  },
  {
    title: "Modular Wardrobes",
    tab: "Wardrobes",
    image: "/image/8.webp",
    href: "/services/wardrobes",
    desc: "Style meets smart storage.",
  },
];

// Staggered text entrance, one orchestrated moment per slide change
const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
const textItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const progressRef = useRef(null); // the active tab's progress bar

  const activeSlide = categories[activeIndex];

  return (
    <main className="overflow-x-hidden">
      <MotionConfig reducedMotion="user">
        {/* Height = viewport minus the sticky navbar */}
        <section className="relative h-[calc(100svh-72px)] min-h-[560px] lg:h-[calc(100svh-80px)] bg-[#292622]">
          {/* ── SLIDES ── */}
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={900}
            loop
            autoplay={{
              delay: AUTOPLAY_DELAY,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={(s) => (swiperRef.current = s)}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            onAutoplayTimeLeft={(_, __, percentage) => {
              // keep the tab progress line perfectly in sync with autoplay
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${1 - percentage})`;
              }
            }}
            className="h-full w-full"
          >
            {categories.map((slide, index) => (
              <SwiperSlide key={slide.title} className="group !h-full">
                <div className="relative h-full w-full overflow-hidden">
                  {/* slow zoom-out on the active slide */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover scale-110 transition-transform duration-[7000ms] ease-out group-[.swiper-slide-active]:scale-100 motion-reduce:transition-none motion-reduce:scale-100"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ── OVERLAYS: side gradient for the text, bottom gradient for the tabs ── */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#292622]/85 via-[#292622]/45 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t from-[#292622]/85 to-transparent" />

          {/* ── CONTENT (left aligned) ── */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
            <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 xl:px-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  variants={textContainer}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="max-w-2xl pb-16 sm:pb-12"
                >
                  <motion.span
                    variants={textItem}
                    className="mb-5 block h-[3px] w-14 bg-[#C18A35]"
                    aria-hidden="true"
                  />

                  <motion.h1
                    variants={textItem}
                    className="font-heading text-[40px] font-medium leading-[1.05] text-white sm:text-6xl lg:text-7xl"
                  >
                    {activeSlide.title}
                  </motion.h1>

                  <motion.p
                    variants={textItem}
                    className="mt-5 max-w-md text-base leading-relaxed text-[#F7F3ED]/90 sm:text-lg"
                  >
                    {activeSlide.desc}
                  </motion.p>

                  <motion.div
                    variants={textItem}
                    className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
                  >
                    <Link
                      href={activeSlide.href}
                      className="group/cta inline-flex items-center gap-2.5 rounded-sm bg-[#C18A35] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#292622] transition-colors duration-300 hover:bg-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
                    >
                      Explore {activeSlide.title}
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover/cta:translate-x-1"
                      />
                    </Link>

                    <Link
                      href="/contact"
                      className="inline-flex items-center rounded-sm border border-white/50 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors duration-300 hover:border-[#C18A35] hover:text-[#C18A35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
                    >
                      Talk to a designer
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── CATEGORY TABS with autoplay progress ── */}
          <div className="absolute inset-x-0 bottom-0 z-20">
            <div className="mx-auto w-full max-w-[1680px] px-5 pb-6 sm:px-8 sm:pb-8 xl:px-12">
              <div role="tablist" aria-label="Featured categories" className="grid max-w-3xl grid-cols-3 gap-3 sm:gap-6">
                {categories.map((c, i) => {
                  const active = i === activeIndex;
                  return (
                    <button
                      key={c.title}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={`Show ${c.title}`}
                      onClick={() => swiperRef.current?.slideToLoop(i)}
                      className="group/tab text-left focus-visible:outline-none"
                    >
                      <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/30 group-focus-visible/tab:ring-2 group-focus-visible/tab:ring-white">
                        {active && (
                          <span
                            ref={progressRef}
                            className="absolute inset-0 origin-left bg-[#C18A35]"
                            style={{ transform: "scaleX(0)" }}
                          />
                        )}
                      </span>
                      <span
                        className={`mt-3 block truncate text-[12px] font-medium tracking-wide transition-colors duration-300 sm:text-sm ${
                          active ? "text-white" : "text-white/60 group-hover/tab:text-white"
                        }`}
                      >
                        {c.tab}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </MotionConfig>
    </main>
  );
}