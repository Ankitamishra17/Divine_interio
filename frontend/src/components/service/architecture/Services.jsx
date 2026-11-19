"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/*
  Palette: Espresso #593719 | Warm Gold #dba343 | Ivory #F7F3ED | Soft Beige #E8DED0 | Charcoal #292622 | White

  Clean editorial layout: the heading and one clear button stay on the left (sticky on desktop),
  and the four services are a simple numbered list on the right, each with a small photo.
  - Every row is one link to /contact. Hover and keyboard focus highlight the whole row.
  - Same size photos, same spacing: nothing overlaps, nothing gets cropped oddly.
  - On phones each row is: small photo, then title and text. Nothing depends on hover.
  - Remote images (pinimg.com) must be allowed in next.config.js under images.remotePatterns.
*/

const services = [
  {
    title: "Architecture & Planning",
    desc: "Strategic planning and architectural solutions that balance aesthetics, functionality, and sustainability.",
    image:
      "https://i.pinimg.com/736x/49/38/7a/49387af31bb13a81d9b8bf20b2383457.jpg",
  },
  {
    title: "Elevation Design",
    desc: "Modern and elegant elevation concepts that enhance the visual identity of your property.",
    image:
      "https://i.pinimg.com/1200x/ff/8e/ae/ff8eaee8da94da4342c043ab97ae32ad.jpg",
  },
  {
    title: "Residential Design",
    desc: "Personalized residential spaces crafted for comfort, luxury, and everyday living.",
    image:
      "https://i.pinimg.com/1200x/7e/e2/56/7ee2569fb6fe306ecaad1d18c78ea362.jpg",
  },
  {
    title: "Civil Work",
    desc: "Reliable construction and structural solutions delivered with precision and quality.",
    image:
      "https://i.pinimg.com/1200x/81/3f/6e/813f6e1bbb93fe895884c2a711606220.jpg",
  },
];

export default function ArchitectureServices() {
  return (
    <section
      className="bg-[#F7F3ED] py-16 md:py-24"
      aria-labelledby="arch-services-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20 lg:px-8">
        {/* Left: heading and one clear action */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.4em] text-[#dba343]">
            What We Build
          </p>
          <h2
            id="arch-services-heading"
            className="font-heading mt-5 text-4xl leading-[1.08] text-[#292622] sm:text-5xl"
          >
            Architecture Services
          </h2>
          <div className="mt-6 h-px w-16 bg-[#dba343]" aria-hidden="true" />
          <p className="font-body mt-6 max-w-sm text-base font-light leading-8 text-[#292622]/75">
            We create exceptional spaces through innovative design, meticulous
            planning, and flawless execution.
          </p>
          <Link
            href="/contact"
            className="font-body group mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-sm bg-[#593719] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F3ED] transition-colors duration-300 hover:bg-[#dba343] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
          >
            Book Consultation
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>

        {/* Right: the list */}
        <ul className="border-t border-[#E8DED0]">
          {services.map((s, i) => (
            <li key={s.title} className="border-b border-[#E8DED0]">
              <Link
                href="/contact"
                aria-label={`${s.title}: get a quote`}
                className="group flex items-center gap-4 rounded-sm px-2 py-6 transition-colors duration-300 hover:bg-white focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#dba343] sm:gap-6 sm:px-4 sm:py-7"
              >
                {/* Photo */}
                <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-[#E8DED0] sm:h-28 sm:w-36 lg:h-32 lg:w-48">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 192px, (min-width: 640px) 144px, 96px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none"
                  />
                </span>

                {/* Words */}
                <span className="min-w-0 flex-1">
                  <span
                    className="font-heading block text-sm tabular-nums text-[#dba343]"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading mt-1 block text-[22px] leading-tight text-[#292622] transition-colors duration-300 group-hover:text-[#593719] sm:text-2xl lg:text-[28px]">
                    {s.title}
                  </span>
                  <span className="font-body mt-2 block max-w-md text-sm font-light leading-7 text-[#292622]/70">
                    {s.desc}
                  </span>
                </span>

                {/* Arrow */}
                <span
                  aria-hidden="true"
                  className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#dba343]/60 text-[#593719] transition-colors duration-300 group-hover:bg-[#dba343] group-hover:text-[#292622] sm:flex"
                >
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
