"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/*
  Palette
  Ivory #F7F3ED | Charcoal #292622 | Warm Gold #C18A35 | Espresso #593719 | Beige #E8DED0

  Layout: PHOTO MOSAIC. Four projects in four different sizes: one big, two medium, one wide.
  Each photo carries its caption on a small ivory label (always readable, never over a
  busy part of the photo). With fewer than 4 projects it falls back to an even grid.
  Optional fields: project.category and project.location.
*/

const IMAGE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

const PLACEHOLDER = "/image/placeholder.webp";
const EASE = [0.22, 1, 0.36, 1];

// Mosaic tile shapes (4 projects). Phones: 2 columns. Desktop: 12-column grid, 3 rows.
const MOSAIC = [
  "col-span-2 aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto",
  "col-span-1 aspect-[4/5] lg:col-span-5 lg:aspect-auto",
  "col-span-1 aspect-[4/5] lg:col-span-5 lg:aspect-auto",
  "col-span-2 aspect-[16/9] lg:col-span-12 lg:aspect-auto",
];
// Fewer than 4 projects: simple even tiles
const EVEN = "col-span-1 aspect-[4/5] lg:col-span-4 lg:aspect-[4/3]";

function ProjectImage({ src, alt, sizes, priority }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const url = !failed && src ? (src.startsWith("http") ? src : `${IMAGE_URL}${src}`) : PLACEHOLDER;

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`object-cover transition-[transform,opacity] duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

function Tile({ project, index, shape, big, reduce }) {
  return (
    <motion.li
      className={`relative ${shape}`}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: Math.min(index, 3) * 0.1, ease: EASE }}
    >
      <Link
        href={`/portfolio/${project.slug}`}
        aria-label={`View project: ${project.name}`}
        className="group absolute inset-0 block overflow-hidden rounded-sm bg-[#E8DED0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
      >
        <ProjectImage
          src={project.image}
          alt={project.name}
          priority={index === 0}
          sizes={big ? "(max-width:1024px) 100vw, 58vw" : "(max-width:1024px) 50vw, 42vw"}
        />

        {/* arrow, top right */}
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3ED] text-[#292622] shadow-sm transition-all duration-300 group-hover:bg-[#C18A35] sm:right-4 sm:top-4 sm:h-11 sm:w-11"
        >
          <ArrowUpRight size={18} />
        </span>

        {/* caption label: always readable */}
        <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] bg-[#F7F3ED] px-4 py-3 transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:bottom-4 sm:left-4 sm:max-w-[min(420px,calc(100%-2rem))] sm:px-5 sm:py-4">
          <h3 className="line-clamp-2 font-heading text-base leading-tight text-[#292622] sm:text-xl lg:text-2xl">
            {project.name}
          </h3>
          {(project.category || project.location) && (
            <p className="mt-1 hidden line-clamp-1 text-[13px] text-[#292622]/60 sm:block">
              {[project.category, project.location].filter(Boolean).join(", ")}
            </p>
          )}
          <span className="mt-2 block h-[3px] w-8 bg-[#C18A35] transition-all duration-500 group-hover:w-14" aria-hidden="true" />
        </div>
      </Link>
    </motion.li>
  );
}

export default function Portfolio({ portfolio, limit = 4 }) {
  const reduce = useReducedMotion();

  // Nothing to show: say so, and give people somewhere to go
  if (!portfolio || portfolio.length === 0) {
    return (
      <section className="bg-[#F7F3ED] px-5 py-24 text-center sm:px-8">
        <h2 className="font-heading text-3xl font-medium text-[#292622] sm:text-4xl">
          Our portfolio is being updated
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#292622]/70">
          New projects are on the way. Talk to our design team to see recent work.
        </p>
        <Link
          href="/contact"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-sm bg-[#593719] px-7 text-sm font-semibold tracking-wide text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
        >
          Talk to our design team
        </Link>
      </section>
    );
  }

  const total = portfolio.length;
  const shown = portfolio.slice(0, Math.min(limit, 4));
  const useMosaic = shown.length === 4;
  const hasMore = total > shown.length;

  return (
    <section
      className="overflow-hidden bg-[#F7F3ED] px-5 py-20 sm:px-8 md:py-28 lg:px-14"
      aria-labelledby="portfolio-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <motion.div
          className="grid items-end gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h2
            id="portfolio-heading"
            className="font-heading text-[40px] font-medium leading-[1.05] text-[#292622] sm:text-6xl xl:text-[64px]"
          >
            Transforming spaces into legacies
          </h2>
          <p className="max-w-md text-base leading-relaxed text-[#292622]/70 sm:text-lg lg:pb-2">
            Each project blends timeless elegance with contemporary sophistication,
            creating interiors that tell your story.
          </p>
        </motion.div>

        {/* Mosaic */}
        <ul
          aria-label="Featured projects"
          className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-12 lg:gap-5 lg:[grid-template-rows:repeat(2,minmax(0,300px))_minmax(0,340px)]"
        >
          {shown.map((project, i) => (
            <Tile
              key={project.id ?? project.slug}
              project={project}
              index={i}
              shape={useMosaic ? MOSAIC[i] : EVEN}
              big={useMosaic && i === 0}
              reduce={reduce}
            />
          ))}
        </ul>

        {/* Next step */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="text-sm text-[#292622]/65">
            {hasMore
              ? `Showing ${shown.length} of ${total} projects`
              : `${total} ${total === 1 ? "project" : "projects"}`}
          </p>

          <Link
            href="/portfolio"
            className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#593719] px-8 text-[15px] font-semibold tracking-wide text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED] sm:w-auto"
          >
            {hasMore ? `View all ${total} projects` : "Explore full portfolio"}
            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}