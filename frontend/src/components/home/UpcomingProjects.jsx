"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/*
  Palette
  Espresso #593719 | Warm Gold #dba343 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622 | White #FFFFFF

  Row of cards. Every project (up to 4) is visible at once, so there is nothing to
  swipe or click through. The grid adapts to the count:
    1 project  -> one wide landscape card (your data now)
    2 projects -> two cards
    3 projects -> three tall cards
    4 projects -> four tall cards
  Phones: cards stack in one column (two across on small tablets).
*/

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");
const PLACEHOLDER = "/image/placeholder.webp";

// Swap to the placeholder once; stops an endless error loop if the placeholder is missing too
const handleImageError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER;
};

// Full class names (not built dynamically) so Tailwind keeps them
const LAYOUTS = {
  1: { grid: "grid-cols-1", ratio: "aspect-[4/3] md:aspect-[16/8]" },
  2: { grid: "grid-cols-1 md:grid-cols-2", ratio: "aspect-[4/3]" },
  3: {
    grid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    ratio: "aspect-[4/3] lg:aspect-[4/5]",
  },
  4: {
    grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    ratio: "aspect-[4/3] lg:aspect-[3/4]",
  },
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const layout = LAYOUTS[items.length] || LAYOUTS[4];

  const Header = (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
      <div>
        <h2 className="font-heading text-4xl font-medium leading-[1.1] tracking-tight text-[#292622] md:text-5xl xl:text-[56px]">
          New Trending Designs
        </h2>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#292622]/70">
          Explore our latest interior design projects, where creativity meets elegance and
          every detail is thoughtfully crafted to perfection.
        </p>
      </div>

      <Link
        href="/portfolio"
        className="group/all inline-flex flex-shrink-0 items-center gap-2.5 self-start text-[15px] font-semibold text-[#593719] transition-colors hover:text-[#dba343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F3ED] md:self-auto"
      >
        <span className="border-b-2 border-[#dba343] pb-1">See all projects</span>
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover/all:translate-x-1"
        />
      </Link>
    </div>
  );

  /* Loading: skeleton cards */
  if (loading) {
    return (
      <section
        className="bg-[#F7F3ED] py-16 md:py-24 lg:py-28"
        aria-busy="true"
        aria-label="Loading designs"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 xl:px-12">
          {Header}
          <div className={`mt-12 grid gap-6 md:mt-14 lg:gap-8 ${LAYOUTS[3].grid}`}>
            {[0, 1, 2].map((n) => (
              <div key={n}>
                <div className={`animate-pulse rounded-sm bg-[#E8DED0] ${LAYOUTS[3].ratio}`} />
                <div className="mt-5 h-6 w-2/3 animate-pulse rounded-sm bg-[#E8DED0]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="bg-[#F7F3ED] py-16 selection:bg-[#593719] selection:text-[#F7F3ED] md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 xl:px-12">
        {Header}

        <ul className={`mt-12 grid gap-x-6 gap-y-12 md:mt-14 lg:gap-x-8 ${layout.grid}`}>
          {items.map((project, i) => (
            <li key={project.id}>
              <Link
                href={`/upcoming-project/${project.id}`}
                aria-label={`View ${project.title}`}
                className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F3ED]"
              >
                {/* photo */}
                <span className={`relative block overflow-hidden rounded-sm bg-[#E8DED0] ${layout.ratio}`}>
                  <img
                    src={getImageUrl(project.image)}
                    alt={project.alt || project.title || "Interior design project"}
                    loading={i === 0 ? "eager" : "lazy"}
                    onError={handleImageError}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
                  />
                </span>

                {/* caption */}
                <span className="mt-5 flex items-center justify-between gap-4">
                  <span className="min-w-0">
                    <span className="block text-sm text-[#292622]/55">Latest design</span>
                    <span className="mt-1 block truncate font-heading text-2xl font-medium leading-tight text-[#292622] decoration-[#dba343] decoration-2 underline-offset-[6px] transition-colors group-hover:text-[#593719] group-hover:underline">
                      {project.title}
                    </span>
                  </span>

                  <span
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#593719]/25 text-[#593719] transition-colors duration-300 group-hover:border-[#593719] group-hover:bg-[#593719] group-hover:text-[#F7F3ED]"
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={18} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}