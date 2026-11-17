"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Target, Eye, Check } from "lucide-react";

const items = [
  {
    id: "mission",
    tab: "Our Mission",
    title: "Designing spaces that inspire everyday living",
    description:
      "We transform ordinary spaces into beautiful, functional and meaningful environments. Creativity, thoughtful planning and quality craftsmanship come together in interiors that reflect every client's personality and lifestyle.",
    points: [
      "Creative ideas shaped around you",
      "Careful planning before we build",
      "Quality craftsmanship in every detail",
    ],
    image: "https://i.pinimg.com/736x/53/e3/18/53e3182f4e00d408e39661889f8e0313.jpg",
    icon: Target,
  },
  {
    id: "vision",
    tab: "Our Vision",
    title: "Creating timeless spaces for a better tomorrow",
    description:
      "We aim to become a trusted name in interior design by delivering innovative, elegant and personalized spaces, redefining modern living through thoughtful design and exceptional attention to detail.",
    points: [
      "Innovative, personalized design",
      "Sustainable material choices",
      "Exceptional attention to detail",
    ],
    image: "https://i.pinimg.com/1200x/e3/a5/ab/e3a5ab77b371d2540681fb914b5cf82d.jpg",
    icon: Eye,
  },
];

export default function OurMissionVision() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  const reduceMotion = useReducedMotion();

  const active = items[activeIndex];

  // Keyboard support for the tab list (WAI-ARIA tabs pattern)
  const handleKeyDown = (event) => {
    const last = items.length - 1;
    let next = null;

    if (event.key === "ArrowRight") next = activeIndex === last ? 0 : activeIndex + 1;
    if (event.key === "ArrowLeft") next = activeIndex === 0 ? last : activeIndex - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;

    if (next !== null) {
      event.preventDefault();
      setActiveIndex(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <section
      aria-labelledby="purpose-heading"
      className="relative overflow-hidden bg-[#E8DED0]/60 px-5 py-16 sm:px-10 lg:px-16 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
          <p className="mb-4 font-[family-name:var(--font-body)] text-sm font-semibold text-[#C18A35]">
            What drives us
          </p>

          <h2
            id="purpose-heading"
            className="font-[family-name:var(--font-heading)] text-4xl leading-tight text-[#593719] sm:text-5xl lg:text-6xl"
          >
            Our purpose, our promise
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-[family-name:var(--font-body)] text-base leading-8 text-[#292622]/70">
            Every design starts with a purpose and moves forward with a vision.
            These two ideas guide everything we create at Divine Interiors.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center lg:mb-10">
          <div
            role="tablist"
            aria-label="Mission and vision"
            onKeyDown={handleKeyDown}
            className="inline-flex w-full max-w-md rounded-full border border-[#593719]/10 bg-white/60 p-1.5 sm:w-auto"
          >
            {items.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;

              return (
                <button
                  key={item.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  role="tab"
                  type="button"
                  id={`tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${item.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 font-[family-name:var(--font-body)] text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C18A35] sm:flex-none sm:px-8 ${
                    isActive
                      ? "bg-[#593719] text-white shadow-sm"
                      : "text-[#593719]/70 hover:text-[#593719]"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                  {item.tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
        >
          {/* Images: all rendered and stacked, so switching never waits on a download */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#593719] lg:col-span-7 lg:aspect-[5/4]">
            {items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <Image
                  key={item.id}
                  src={item.image}
                  alt={`${item.tab} at Divine Interiors`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  aria-hidden={!isActive}
                  className={`object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
                    isActive ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                />
              );
            })}

            {/* Soft gradient only behind the caption chip */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#241409]/60 to-transparent" />

            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 py-2 pl-3 pr-4 text-[#593719] backdrop-blur-sm sm:bottom-6 sm:left-6">
              <active.icon size={16} strokeWidth={1.8} aria-hidden="true" />
              <span className="font-[family-name:var(--font-body)] text-sm font-semibold">
                {active.tab}
              </span>
            </div>
          </div>

          {/* Text panels: stacked in one grid cell so height never jumps between tabs */}
          <div className="grid lg:col-span-5">
            {items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={item.id}
                  role="tabpanel"
                  id={`panel-${item.id}`}
                  aria-labelledby={`tab-${item.id}`}
                  aria-hidden={!isActive}
                  tabIndex={isActive ? 0 : -1}
                  className={`col-start-1 row-start-1 transition-all duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C18A35] motion-reduce:transition-none ${
                    isActive
                      ? "visible translate-y-0 opacity-100"
                      : "invisible translate-y-3 opacity-0"
                  }`}
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-3xl leading-tight text-[#593719] sm:text-4xl">
                    {item.title}
                  </h3>

                  <p className="mt-5 font-[family-name:var(--font-body)] text-base leading-8 text-[#292622]/75">
                    {item.description}
                  </p>

                  <ul className="mt-7 space-y-3.5 border-t border-[#593719]/15 pt-7">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 font-[family-name:var(--font-body)] text-base text-[#292622]"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C18A35]/15 text-[#8A5F1F]">
                          <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}