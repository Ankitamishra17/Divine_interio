"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/*
  Palette: Espresso #593719 | Warm Gold #dba343 | Ivory #F7F3ED | Soft Beige #E8DED0 | Charcoal #292622 | White

  New layout: pick a service on the left, the photo on the right changes with it.
  - Only one service is open at a time, so the section stays short and easy to scan.
  - Works with tap, click and the Up / Down arrow keys. Nothing changes on hover or on a timer.
  - All photos are loaded once and fade into each other, so switching never flashes.
  - On phones the photo sits on top and the list follows.
  - Change `href` per service when you have pages for them (all go to /contact for now).
*/

const howWeHelp = [
  {
    id: "01",
    tag: "Residential",
    title: "Luxury Residential Design",
    description:
      "Custom-designed homes that blend elegance, functionality, and comfort while reflecting your unique lifestyle.",
    image: "/image/office_design.webp",
    href: "/contact",
  },
  {
    id: "02",
    tag: "Commercial",
    title: "Commercial Architecture",
    description:
      "Innovative office spaces, retail environments, and business facilities designed to enhance productivity and brand identity.",
    image: "https://images.pexels.com/photos/13073718/pexels-photo-13073718.jpeg",
    href: "/contact",
  },
  {
    id: "03",
    tag: "Planning",
    title: "Master Planning",
    description:
      "Strategic planning solutions that create sustainable communities, public spaces, and future-ready developments.",
    image: "/image/living_room5.webp",
    href: "/contact",
  },
];

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-inset";

export default function HowWeHelp() {
  const [active, setActive] = useState(0);
  const btnRefs = useRef([]);
  const current = howWeHelp[active];

  const onKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const n = (active + (e.key === "ArrowDown" ? 1 : -1) + howWeHelp.length) % howWeHelp.length;
    setActive(n);
    btnRefs.current[n]?.focus();
  };

  return (
    <section className="overflow-hidden bg-white py-16 md:py-20 lg:py-24" aria-labelledby="how-we-help-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Photo (first on phones) */}
          <div className="relative mx-auto w-full max-w-[560px] lg:sticky lg:top-28 lg:order-2 lg:max-w-none">
            <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[100px] border border-[#dba343]/60 lg:rounded-t-[180px]" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-[100px] bg-[#E8DED0] shadow-[0_30px_70px_-40px_rgba(89,55,25,0.5)] sm:aspect-[5/4] lg:aspect-[4/4.6] lg:rounded-t-[180px]">
              {howWeHelp.map((item, i) => (
                <Image
                  key={item.id}
                  src={item.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 50vw, 90vw"
                  className={`object-cover transition-opacity duration-700 motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`}
                />
              ))}
              <span className="font-body absolute bottom-5 left-5 rounded-sm bg-[#dba343] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#292622]">
                {current.tag}
              </span>
              <span className="font-heading absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm tabular-nums text-[#593719] shadow-sm" aria-hidden="true">
                {current.id} / {String(howWeHelp.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Words + list */}
          <div className="lg:order-1">
            <p className="font-body mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#dba343]">Our Expertise</p>
            <h2 id="how-we-help-heading" className="font-heading text-3xl leading-[1.12] text-[#292622] sm:text-4xl lg:text-5xl">
              Architecture with <span className="text-[#593719]">purpose</span>, designed for you
            </h2>
            <div className="mt-6 h-px w-16 bg-[#dba343]" aria-hidden="true" />

            <div className="mt-8 border-t border-[#E8DED0]" onKeyDown={onKeyDown}>
              {howWeHelp.map((item, i) => {
                const open = i === active;
                return (
                  <div key={item.id} className={`border-b border-[#E8DED0] transition-colors duration-500 motion-reduce:transition-none ${open ? "bg-[#F7F3ED]" : ""}`}>
                    <h3>
                      <button
                        ref={(el) => (btnRefs.current[i] = el)}
                        type="button"
                        id={`hwh-tab-${i}`}
                        aria-expanded={open}
                        aria-controls={`hwh-panel-${i}`}
                        onClick={() => setActive(i)}
                        className={`relative flex min-h-[76px] w-full items-center gap-5 px-4 py-5 text-left sm:px-6 ${ring}`}
                      >
                        <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] bg-[#dba343] transition-opacity duration-500 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`} />
                        <span className={`font-heading text-2xl tabular-nums transition-colors duration-300 ${open ? "text-[#dba343]" : "text-[#292622]/35"}`} aria-hidden="true">
                          {item.id}
                        </span>
                        <span className={`font-heading text-[22px] leading-snug transition-colors duration-300 sm:text-2xl ${open ? "text-[#593719]" : "text-[#292622]"}`}>
                          {item.title}
                        </span>
                        <span aria-hidden="true" className={`ml-auto text-xl text-[#593719] transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-45" : ""}`}>
                          +
                        </span>
                      </button>
                    </h3>

                    <div
                      id={`hwh-panel-${i}`}
                      role="region"
                      aria-labelledby={`hwh-tab-${i}`}
                      inert={!open}
                      className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 pb-7 pl-[4.25rem] sm:px-6 sm:pb-8 sm:pl-[5.25rem]">
                          <p className="font-body max-w-md text-[15px] font-light leading-7 text-[#292622]/75">{item.description}</p>
                          <Link
                            href={item.href}
                            className="font-body group mt-5 inline-flex min-h-11 items-center gap-3 rounded-sm text-xs font-semibold uppercase tracking-[0.22em] text-[#593719] transition-colors hover:text-[#dba343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
                          >
                            Discuss this project
                            <span className="block h-px w-8 bg-current transition-all duration-300 group-hover:w-12 motion-reduce:transition-none" aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}