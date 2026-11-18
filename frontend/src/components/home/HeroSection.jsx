"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

/*
  Palette
  Espresso #593719 | Warm Gold #dba343 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF

  
*/

const AUTOPLAY_DELAY = 5000;

const categories = [
  {
    title: "Living Room",
    tab: "Living Room",
    image: "/images/living_banner.png",
    href: "/services/design-ideas/living-room-design",
    desc: "Where luxury meets lifestyle.",
  },
  {
    title: "Modular Kitchen",
    tab: "Kitchen",
    image: "/images/kitchen_banner.png",
    href: "/kitchen-design",
    desc: "Crafted for modern homes.",
  },
  {
    title: "Modular Wardrobes",
    tab: "Wardrobes",
    image: "/images/wardrobe_banner.png",
    href: "/services/wardrobes",
    desc: "Style meets smart storage.",
  },
];

const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
const textItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const arrowBtn =
  "hidden h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-[#292622]/25 text-white backdrop-blur-sm transition-colors duration-300 hover:border-[#dba343] hover:bg-[#dba343] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622] md:flex";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const progressRef = useRef(null);

  const activeSlide = categories[activeIndex];

  return (
    <main className="overflow-x-hidden">
      <MotionConfig reducedMotion="user">
        <section className="relative h-[calc(100svh-72px)] min-h-[600px] bg-[#292622] lg:h-[calc(100svh-80px)]">
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
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${1 - percentage})`;
              }
            }}
            className="h-full w-full"
          >
            {categories.map((slide, index) => (
              <SwiperSlide key={slide.title} className="group !h-full">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover scale-110 transition-transform duration-[7000ms] ease-out group-[.swiper-slide-active]:scale-100 motion-reduce:scale-100 motion-reduce:transition-none"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* even dim + vignette: keeps centered text readable on any photo */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[#292622]/40" />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(41,38,34,0.55)_100%)]" />



          {/* ── CENTERED MESSAGE ── */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 pb-20 text-center -mt-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={textContainer}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex max-w-3xl flex-col items-center"
              >
                <motion.span
                  variants={textItem}
                  className="mb-6 block h-[3px] w-14 bg-[#dba343]"
                  aria-hidden="true"
                />

                <motion.h1
                  variants={textItem}
                  className="font-heading text-[44px] font-medium leading-[1.04] tracking-[-0.02em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-7xl xl:text-[84px]"
                >
                  {activeSlide.title}
                </motion.h1>

                <motion.p
                  variants={textItem}
                  className="mt-5 max-w-md text-[17px] leading-relaxed text-[#F7F3ED]/90 sm:text-xl"
                >
                  {activeSlide.desc}
                </motion.p>

                <motion.div
                  variants={textItem}
                  className="pointer-events-auto mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
                >
                  <Link
                    href={activeSlide.href}
                    className="group/cta inline-flex items-center text-nowrap gap-3 rounded-sm bg-[#593719] px-8 py-4 text-[15px] font-semibold text-[#fff] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
                  >
                    Explore {activeSlide.title}
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover/cta:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-sm border border-white/60 px-8 py-4 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
                  >
                    Talk to a designer
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── SIDE ARROWS (tablet and up) ── */}
          <div className="absolute inset-y-0 left-4 z-20 flex items-center md:left-10 lg:left-14">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
              className={arrowBtn}
            >
              <ChevronLeft size={22} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 z-20 flex items-center md:right-10 lg:right-14">
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
              className={arrowBtn}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* ── PROGRESS ROW (centered) ── */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-8 sm:pb-12 ">
            <div
              role="tablist"
              aria-label="Featured categories"
              className="mx-auto grid max-w-xl grid-cols-3 gap-4 rounded-full border border-white/20 bg-[#292622]/40 px-6 py-3.5 backdrop-blur-md sm:gap-8 sm:px-10 -mt-32 "
            >
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
                    className="group/tab text-center focus-visible:outline-none"
                  >
                    <span
                      className={`block truncate pb-2 text-sm font-medium transition-colors duration-300 sm:text-base ${
                        active
                          ? "text-white"
                          : "text-white/60 group-hover/tab:text-white"
                      }`}
                    >
                      {c.tab}
                    </span>
                    <span className="relative block h-[2px] w-full overflow-hidden bg-white/30 group-focus-visible/tab:ring-2 group-focus-visible/tab:ring-white group-focus-visible/tab:ring-offset-4 group-focus-visible/tab:ring-offset-[#292622]">
                      {active && (
                        <span
                          ref={progressRef}
                          className="absolute inset-0 origin-left bg-[#dba343]"
                          style={{ transform: "scaleX(0)" }}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </MotionConfig>
    </main>
  );
}