"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/*
  Palette
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF

  Layout: clean SPLIT. Text on the left, one photo on the right (a soft beige block sits
  behind it for depth). Compact, no heavy frame. Works with 1 project (your data now)
  and up to 4 (arrows, dots, swipe, arrow keys).
*/

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");
const PLACEHOLDER = "/image/placeholder.webp";

// Swap to the placeholder once; stops an endless error loop if the placeholder is missing too
const handleImageError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER;
};

const arrowBtn =
  "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#593719]/30 text-[#593719] transition-colors hover:bg-[#593719] hover:text-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const touchX = useRef(null);

  useEffect(() => {
    const fetchUpcomingProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/upcoming-projects/latest`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setProjects(data.projects || []);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching upcoming projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingProjects();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER;
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  const items = projects.slice(0, 4);
  const count = items.length;
  const multiple = count > 1;
  const current = items[active];
  const go = (dir) => setActive((a) => (a + dir + count) % count);

  const Head = (
    <div>
      <h2 className="font-heading text-4xl font-medium leading-[1.1] text-[#292622] md:text-5xl xl:text-6xl">
        New trending designs
      </h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-[#292622]/70">
        Fresh ideas for your next project, picked from our latest work.
      </p>
    </div>
  );

  /* Loading: skeleton in the same split layout */
  if (loading) {
    return (
      <section className="bg-[#F7F3ED] py-16 md:py-24" aria-busy="true" aria-label="Loading design">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 xl:px-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-5">{Head}</div>
            <div className="aspect-[4/3] animate-pulse rounded-sm bg-[#E8DED0] lg:col-span-7" />
          </div>
        </div>
      </section>
    );
  }

  if (!current) return null;

  return (
    <section
      className="bg-[#F7F3ED] py-16 selection:bg-[#593719] selection:text-[#F7F3ED] md:py-24"
      onKeyDown={(e) => {
        if (!multiple) return;
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 xl:px-12">
        {/* Phones: heading, photo, details. Desktop: text left, photo right. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-10">
          {/* heading */}
          <div className="lg:col-span-5 lg:row-start-1 lg:self-end">{Head}</div>

          {/* photo */}
          <div className="relative lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            {/* soft beige block behind the photo, for depth */}
            <span
              className="absolute -bottom-4 -left-4 hidden h-3/4 w-3/4 bg-[#E8DED0] sm:block lg:-bottom-6 lg:-left-6"
              aria-hidden="true"
            />
            <Link
              href={`/upcoming-project/${current.id}`}
              aria-label={`View ${current.title}`}
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (!multiple || touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
                touchX.current = null;
              }}
              className="group relative block aspect-[4/3] overflow-hidden rounded-sm bg-[#E8DED0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
            >
              {items.map((project, i) => (
                <img
                  key={project.id}
                  src={getImageUrl(project.image)}
                  alt={i === active ? project.alt || project.title || "Interior design project" : ""}
                  aria-hidden={i !== active}
                  loading={i === 0 ? "eager" : "lazy"}
                  onError={handleImageError}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out motion-reduce:transition-none group-hover:scale-[1.04] ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </Link>
          </div>

          {/* project details + actions */}
          <div className="lg:col-span-5 lg:row-start-2 lg:self-start">
            <span className="mb-5 block h-[3px] w-12 bg-[#C18A35]" aria-hidden="true" />
            <p className="text-sm text-[#292622]/60">Latest design</p>
            <h3 className="mt-1 font-heading text-2xl leading-tight text-[#292622] sm:text-3xl">
              {current.title}
            </h3>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href={`/upcoming-project/${current.id}`}
                className="inline-flex h-12 items-center gap-2 rounded-sm bg-[#593719] px-7 text-sm font-semibold tracking-wide text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
              >
                View design
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/portfolio"
                className="text-sm font-semibold text-[#593719] underline decoration-[#C18A35] decoration-2 underline-offset-4 transition-colors hover:text-[#C18A35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35]"
              >
                See all projects
              </Link>
            </div>

            {multiple && (
              <div className="mt-8 flex items-center gap-4">
                <button type="button" onClick={() => go(-1)} aria-label="Previous design" className={arrowBtn}>
                  <ArrowLeft size={18} />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next design" className={arrowBtn}>
                  <ArrowRight size={18} />
                </button>
                <div className="ml-2 flex items-center gap-2" role="group" aria-label="Choose a design">
                  {items.map((project, i) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show ${project.title}`}
                      aria-pressed={i === active}
                      className="flex h-6 items-center focus-visible:outline-none"
                    >
                      <span
                        className={`block h-[3px] rounded-full transition-all duration-300 ${
                          i === active ? "w-10 bg-[#C18A35]" : "w-5 bg-[#593719]/25 hover:bg-[#593719]/50"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}