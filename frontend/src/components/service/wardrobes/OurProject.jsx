"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

const projects = [
  { title: "Sliding Wardrobe", image: "/image/wardrobe_design9.webp" },
  { title: "Walk-in Closet", image: "/image/wardrobe_design17.webp" },
  { title: "Luxury Bedroom Wardrobe", image: "/image/wardrobe_design8.webp" },
  { title: "Glass Wardrobe", image: "/image/wardrobe_design.webp" },
  { title: "Modern White Wardrobe", image: "/image/wardrobe_design2.webp" },
];

// Apni routes yahan change kar lena
const ALL_PROJECTS_HREF = "/projects";
const CONTACT_HREF = "/contact";

export default function RecentProjects() {
  const [active, setActive] = useState(null); // index of open project or null
  const closeBtnRef = useRef(null);
  const lastTriggerRef = useRef(null);

  const isOpen = active !== null;

  const close = useCallback(() => {
    setActive(null);
    lastTriggerRef.current?.focus();
  }, []);

  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % projects.length)),
    []
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? i : (i - 1 + projects.length) % projects.length
      ),
    []
  );

  // Keyboard controls + scroll lock while lightbox is open
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, next, prev]);

  const openProject = (index, e) => {
    lastTriggerRef.current = e.currentTarget;
    setActive(index);
  };

  return (
    <section className="bg-[#F7F3ED] py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl text-[#3D1F0D] md:text-4xl">
              Our Recent Projects
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#3D1F0D]/70 md:text-base">
              Custom wardrobes we have built for real homes. Tap any project to
              see it larger.
            </p>
          </div>

          <Link
            href={ALL_PROJECTS_HREF}
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#B8851F]/40 px-5 py-2.5 text-sm font-medium text-[#B8851F] transition-colors hover:bg-[#B8851F] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
          >
            View All Projects
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>

        {/* Gallery: first project is featured, rest fill the grid */}
        <ul className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[210px] md:gap-4 lg:auto-rows-[240px] lg:grid-cols-4">
          {projects.map((project, index) => {
            const featured = index === 0;
            return (
              <li
                key={project.title}
                className={featured ? "col-span-2 row-span-2" : ""}
              >
                <button
                  type="button"
                  onClick={(e) => openProject(index, e)}
                  aria-label={`View ${project.title}`}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes={
                      featured
                        ? "(max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 1024px) 50vw, 25vw"
                    }
                    priority={featured}
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  />

                  {/* Title is always visible, so people know what they are looking at */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-[#3D1F0D]/85 via-[#3D1F0D]/40 to-transparent p-3 pt-12 md:p-4 md:pt-16">
                    <span
                      className={`font-serif leading-tight text-white ${
                        featured ? "text-lg md:text-2xl" : "text-sm md:text-base"
                      }`}
                    >
                      {project.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#3D1F0D] opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
                    >
                      <Expand size={14} />
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projects[active].title}, project ${active + 1} of ${projects.length}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D1F0D]/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F]"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous project"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] md:left-6"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next project"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] md:right-6"
          >
            <ChevronRight size={24} />
          </button>

          <figure
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-[#F7F3ED] md:h-[70vh]">
              <Image
                key={projects[active].image}
                src={projects[active].image}
                alt={projects[active].title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>

            <figcaption className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-serif text-xl text-white">
                  {projects[active].title}
                </p>
                <p className="text-sm text-white/60">
                  {active + 1} of {projects.length}
                </p>
              </div>

              <Link
                href={CONTACT_HREF}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#B8851F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a07419] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Get a similar design
                <ArrowRight size={16} />
              </Link>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}