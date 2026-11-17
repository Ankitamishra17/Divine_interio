"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/*
  Palette
  Ivory #F7F3ED | Charcoal #292622 | Warm Gold #C18A35 | Espresso #593719 | Beige #E8DED0

  New layout: STICKY INTRO + STAGGERED GALLERY.
  - Left: the heading, short text and the "view all" button stay pinned while you scroll
    through the projects (desktop). The button is always in reach.
  - Right: two columns of tall photos. The second column sits lower, so the photos zigzag
    like pictures hung on a gallery wall instead of a rigid grid.
  - Captions sit under each photo (name, then category and location), never on top of it,
    so they are always easy to read. Small screens show one column, in order.
  - Same props and data as before: { portfolio, limit }, project.name / slug / image,
    optional project.category and project.location. Shows up to 6 projects.
*/

const IMAGE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

const PLACEHOLDER = "/image/placeholder.webp";
const EASE = [0.22, 1, 0.36, 1];

const subline = (p) => [p.category, p.location].filter(Boolean).join(", ");

function ProjectImage({ src, alt, sizes, priority }) {
  const [failed, setFailed] = useState(false);

  // Full URL from the API, or the placeholder if there is no image / it failed to load
  let url = PLACEHOLDER;
  if (!failed && src) {
    url = src.startsWith("http") ? src : `${IMAGE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
  }
  const remote = url !== PLACEHOLDER;

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      // Images come from your API server, so skip Next's image optimizer for them.
      // (No next.config.js "images.remotePatterns" setup needed.)
      unoptimized={remote}
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
    />
  );
}

function Card({ project, index }) {
  return (
    <li className={index % 2 === 1 ? "sm:translate-y-16" : ""}>
      <Link
        href={`/portfolio/${project.slug}`}
        className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F3ED]"
      >
        <span className="relative block aspect-[4/5] overflow-hidden rounded-sm bg-[#E8DED0]">
          <ProjectImage
            src={project.image}
            alt={project.name}
            priority={index < 2}
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 34vw"
          />
          <span
            aria-hidden="true"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F3ED] text-[#292622] shadow-sm transition-colors duration-300 group-hover:bg-[#C18A35]"
          >
            <ArrowUpRight size={19} />
          </span>
        </span>

        <span className="mt-5 block font-heading text-2xl leading-tight text-[#292622] xl:text-[28px]">
          {project.name}
        </span>
        {subline(project) && (
          <span className="mt-1.5 block text-sm text-[#292622]/65">{subline(project)}</span>
        )}
        <span
          aria-hidden="true"
          className="mt-4 block h-[3px] w-8 bg-[#C18A35] transition-all duration-500 group-hover:w-16"
        />
      </Link>
    </li>
  );
}

export default function Portfolio({ portfolio, limit = 2 }) {
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
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-sm bg-[#593719] px-7 text-sm font-semibold text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
        >
          Talk to our design team
        </Link>
      </section>
    );
  }

  const total = portfolio.length;
  const shown = portfolio.slice(0, Math.min(limit, 6));
  const hasMore = total > shown.length;

  return (
    <section
      className="overflow-hidden bg-[#F7F3ED] px-5 py-20 sm:px-8 md:py-28 lg:px-14"
      aria-labelledby="portfolio-heading"
    >
      <motion.div
        className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[4fr_8fr] lg:gap-20"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* Sticky intro */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2
            id="portfolio-heading"
            className="font-heading text-[40px] font-medium leading-[1.05] text-[#292622] sm:text-6xl lg:text-5xl xl:text-[56px]"
          >
            Transforming spaces into legacies
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#292622]/70 sm:text-lg">
            Each project blends timeless elegance with contemporary sophistication, creating
            interiors that tell your story.
          </p>

          <div className="mt-8 hidden lg:block">
            <Link
              href="/portfolio"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-sm bg-[#593719] px-8 text-[15px] font-semibold text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
            >
              {hasMore ? `View all ${total} projects` : "Explore full portfolio"}
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            {hasMore && (
              <p className="mt-3 text-sm text-[#292622]/65">
                Showing {shown.length} of {total}
              </p>
            )}
          </div>
        </div>

        {/* Staggered gallery */}
        <div>
          <ul
            aria-label="Featured projects"
            className="grid gap-x-6 gap-y-12 sm:grid-cols-2 sm:pb-16 xl:gap-x-8"
          >
            {shown.map((project, i) => (
              <Card key={project.id ?? project.slug ?? i} project={project} index={i} />
            ))}
          </ul>

          {/* Phones and tablets: button after the gallery */}
          <div className="mt-12 lg:hidden">
            <Link
              href="/portfolio"
              className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#593719] px-8 text-[15px] font-semibold text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED] sm:w-auto"
            >
              {hasMore ? `View all ${total} projects` : "Explore full portfolio"}
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            {hasMore && (
              <p className="mt-3 text-sm text-[#292622]/65">
                Showing {shown.length} of {total}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}