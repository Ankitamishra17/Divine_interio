"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";

const projects = [
  {
    title: "Luxury Villa",
    category: "Residential",
    image: "/Design/luxury_villa.jpg",
  },
  {
    title: "Master Bedroom",
    category: "Bedroom",
    image: "/image/bedroom_design3.webp",
  },
  {
    title: "Living Lounge",
    category: "Interior",
    image: "/image/living_room10.webp",
  },
  {
    title: "Modern Kitchen",
    category: "Kitchen",
    image: "/image/kitchen_design7.webp",
  },
  {
    title: "Office Space",
    category: "Commercial",
    image: "/image/office_design11.webp",
  },
  {
    title: "Dining Area",
    category: "Luxury",
    image: "/image/dining_room2.webp",
  },
];

const total = projects.length;
const pad = (n) => String(n).padStart(2, "0");

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8972B]";

// Shortest distance between two positions in a looping list
const loopDistance = (a, b) =>
  Math.min((a - b + total) % total, (b - a + total) % total);

export default function ProjectGallery() {
  const [selected, setSelected] = useState(0); // project shown on the stage
  const [viewerOpen, setViewerOpen] = useState(false);
  const dialogRef = useRef(null);
  const swipeStart = useRef(null);

  const current = projects[selected];

  const step = (d) => setSelected((s) => (s + d + total) % total);

  // Open / close the native <dialog> (focus trap, Esc and focus return come built in)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (viewerOpen && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!viewerOpen && dialog.open) {
      dialog.close();
    }
  }, [viewerOpen]);

  // Always release the scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onDialogKeyDown = (e) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  const onPointerDown = (e) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (swipeStart.current == null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  return (
    <section className="bg-[#F7F3ED] py-16 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-10 max-w-2xl lg:mb-14">
          <p className="font-body text-sm font-semibold text-[#8A6416]">
            Our portfolio
          </p>

          <h2 className="mt-4 font-heading text-4xl text-[#3D1F0D] md:text-5xl lg:text-6xl">
            Featured projects
          </h2>

          <p className="mt-5 font-body leading-8 text-[#6B5A4A]">
            Choose a project to preview it, then open it full screen. Bespoke
            interiors, luxury residences and turnkey transformations.
          </p>
        </div>

        {/* Showcase: big stage + project list */}
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
          {/* Stage */}
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`View ${current.title} full screen`}
            onClick={() => setViewerOpen(true)}
            className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#E8D5C0] text-left sm:rounded-[28px] lg:col-span-8 lg:aspect-auto lg:min-h-[580px] ${focusRing}`}
          >
            {/* All images stay mounted and cross-fade, so switching projects is instant */}
            {projects.map((project, i) => (
              <Image
                key={project.image}
                src={project.image}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className={`object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
                  i === selected ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
              />
            ))}

            {/* Scrim only where the text sits */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1E0F06]/85 to-transparent" />

            {/* Full-screen hint */}
            <span
              aria-hidden="true"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-[#1E0F06]/40 text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-[#C8972B] group-hover:bg-[#C8972B] group-hover:text-[#3D1F0D] sm:right-6 sm:top-6"
            >
              <Maximize2 size={18} />
            </span>

            {/* Caption */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <span className="text-sm text-[#EBC27A]">{current.category}</span>
              <p className="mt-1 font-heading text-3xl leading-tight text-white sm:text-5xl">
                {current.title}
              </p>
            </div>
          </button>

          {/* Announces the change to screen reader users */}
          <p className="sr-only" aria-live="polite">
            Showing {current.title}, {current.category}
          </p>

          {/* Project list */}
          <ol className="flex flex-col divide-y divide-[#3D1F0D]/15 border-y border-[#3D1F0D]/15 lg:col-span-4">
            {projects.map((project, i) => {
              const isActive = i === selected;

              return (
                <li key={project.title} className="lg:flex-1">
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setSelected(i)}
                    className={`group relative flex h-full min-h-16 w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-300 motion-reduce:transition-none sm:px-5 ${
                      isActive ? "bg-white/70" : "hover:bg-white/40"
                    } ${focusRing}`}
                  >
                    {/* Gold bar marks the selected project */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-[#C8972B] transition-transform duration-300 motion-reduce:transition-none ${
                        isActive ? "scale-y-100" : "scale-y-0"
                      }`}
                    />

                    <span
                      aria-hidden="true"
                      className="w-7 font-body text-sm tabular-nums text-[#8A6416]"
                    >
                      {pad(i + 1)}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-heading text-xl leading-tight transition-colors duration-300 sm:text-2xl ${
                          isActive
                            ? "text-[#3D1F0D]"
                            : "text-[#3D1F0D]/70 group-hover:text-[#3D1F0D]"
                        }`}
                      >
                        {project.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-[#6B5A4A]">
                        {project.category}
                      </span>
                    </span>

                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                      className={`shrink-0 text-[#8A6416] transition-all duration-300 motion-reduce:transition-none ${
                        isActive
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Next step after browsing */}
        <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between lg:mt-16">
          <p className="font-heading text-2xl text-[#3D1F0D] sm:text-3xl">
            Have a space in mind?
          </p>
          <Link
            href="/contact"
            className={`group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#3D1F0D] px-8 text-[15px] font-semibold text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C8972B] hover:text-[#3D1F0D] ${focusRing}`}
          >
            Start your project
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>

      {/* Full-screen viewer */}
      <dialog
        ref={dialogRef}
        aria-label={`${current.title} gallery`}
        onClose={() => {
          setViewerOpen(false);
          document.body.style.overflow = "";
        }}
        onKeyDown={onDialogKeyDown}
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-[#F7F3ED] backdrop:bg-[#1E0F06]/92 backdrop:backdrop-blur-sm"
      >
        {viewerOpen && (
          <div
            className="flex h-full flex-col gap-4 p-4 sm:p-8"
            onClick={(e) => e.target === e.currentTarget && setViewerOpen(false)}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <span
                className="text-sm tabular-nums text-[#F7F3ED]/80"
                aria-live="polite"
              >
                {pad(selected + 1)} / {pad(total)}
              </span>
              <button
                type="button"
                aria-label="Close viewer"
                onClick={() => setViewerOpen(false)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/25 transition-colors hover:bg-[#C8972B] hover:text-[#3D1F0D] ${focusRing}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Image + arrows. Current image and its neighbours stay mounted and cross-fade. */}
            <div
              className="relative min-h-0 flex-1 touch-pan-y select-none"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onClick={(e) => e.target === e.currentTarget && setViewerOpen(false)}
            >
              {projects.map((project, i) => {
                if (loopDistance(i, selected) > 1) return null;
                const isActive = i === selected;

                return (
                  <Image
                    key={project.image}
                    src={project.image}
                    alt={
                      isActive
                        ? `${project.title}, ${project.category.toLowerCase()} interior by Divine Interiors`
                        : ""
                    }
                    aria-hidden={!isActive}
                    fill
                    loading="eager"
                    sizes="100vw"
                    draggable={false}
                    className={`pointer-events-none object-contain transition-opacity duration-300 motion-reduce:transition-none ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                );
              })}

              <button
                type="button"
                aria-label="Previous project"
                onClick={() => step(-1)}
                className={`absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#1E0F06]/50 backdrop-blur-sm transition-colors hover:bg-[#C8972B] hover:text-[#3D1F0D] ${focusRing}`}
              >
                <ArrowLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="Next project"
                onClick={() => step(1)}
                className={`absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#1E0F06]/50 backdrop-blur-sm transition-colors hover:bg-[#C8972B] hover:text-[#3D1F0D] ${focusRing}`}
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Caption */}
            <div className="text-center">
              <span className="text-sm text-[#EBC27A]">{current.category}</span>
              <p className="mt-1 font-heading text-2xl sm:text-3xl">
                {current.title}
              </p>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}