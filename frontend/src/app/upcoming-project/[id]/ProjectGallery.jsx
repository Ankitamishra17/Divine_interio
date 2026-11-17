"use client";

// app/upcoming-project/[id]/ProjectGallery.jsx

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

const PLACEHOLDER = "/image/placeholder.webp";

const handleImageError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER;
};

export default function ProjectGallery({ title, heroUrl, galleryUrls }) {
  // Lightbox order: hero first, then gallery (skip a duplicate of the hero)
  const rest = galleryUrls.filter((u) => u !== heroUrl);
  const all = [heroUrl, ...rest];

  const [active, setActive] = useState(null); // index in `all`, or null
  const closeRef = useRef(null);
  const touchStartX = useRef(null);

  const isOpen = active !== null;

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % all.length)),
    [all.length],
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + all.length) % all.length)),
    [all.length],
  );

  // Keyboard + scroll lock + focus
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, next, prev]);

  // Preload the neighbouring photos so arrows feel instant
  useEffect(() => {
    if (!isOpen) return;
    [(active + 1) % all.length, (active - 1 + all.length) % all.length].forEach(
      (i) => {
        const img = new Image();
        img.src = all[i];
      },
    );
  }, [active, isOpen, all]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };

  return (
    <>
      {/* HERO */}
      <figure className="relative mt-10 overflow-hidden rounded-sm bg-[#E8DED0] md:mt-14">
        <button
          type="button"
          onClick={() => setActive(0)}
          aria-label={`Open ${title} photos`}
          className="group block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F3ED]"
        >
          <span className="block aspect-[4/3] md:aspect-[16/8]">
            <img
              src={heroUrl}
              alt={title}
              onError={handleImageError}
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActive(0)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-[#F7F3ED] px-4 py-2.5 text-sm font-semibold text-[#593719] shadow-sm transition-colors hover:bg-[#593719] hover:text-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35]"
        >
          <Maximize2 size={16} aria-hidden="true" />
          View all {all.length} photos
        </button>
      </figure>

      {/* GALLERY */}
      {rest.length > 0 && (
        <section className="mt-16 md:mt-24" aria-labelledby="gallery-heading">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2
              id="gallery-heading"
              className="font-heading text-3xl font-medium tracking-tight text-[#292622] md:text-4xl"
            >
              Inside the project
            </h2>
            <p className="text-sm text-[#292622]/60">{rest.length} photos</p>
          </div>

          {/* Masonry: keeps each photo's real proportions, no cropping */}
          <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4">
            {rest.map((url, i) => (
              <li key={`${url}-${i}`} className="mb-3 break-inside-avoid sm:mb-4">
                <button
                  type="button"
                  onClick={() => setActive(i + 1)}
                  aria-label={`Open photo ${i + 2} of ${all.length}`}
                  className="group relative block w-full cursor-zoom-in overflow-hidden rounded-sm bg-[#E8DED0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
                >
                  <img
                    src={url}
                    alt={`${title}, photo ${i + 2}`}
                    onError={handleImageError}
                    loading={i < 4 ? "eager" : "lazy"}
                    className="block h-auto min-h-[160px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-[#292622]/0 transition-colors duration-300 group-hover:bg-[#292622]/10" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* LIGHTBOX */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo viewer`}
          className="fixed inset-0 z-[9999] flex flex-col bg-[#1b1815]/95"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* top bar */}
          <div className="flex items-center justify-between px-4 py-4 text-[#F7F3ED] sm:px-8">
            <p className="text-sm tabular-nums">
              {active + 1} of {all.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close viewer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35]"
            >
              <X size={22} />
            </button>
          </div>

          {/* image area: clicking empty space closes */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            {all.length > 1 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-[#F7F3ED] transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] sm:left-6"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            <img
              key={all[active]}
              src={all[active]}
              alt={`${title}, photo ${active + 1}`}
              onError={handleImageError}
              className="max-h-full max-w-full select-none object-contain"
              draggable={false}
            />

            {all.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-[#F7F3ED] transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] sm:right-6"
              >
                <ChevronRight size={26} />
              </button>
            )}
          </div>

          {/* caption */}
          <p className="truncate px-4 py-4 text-center text-sm text-[#F7F3ED]/70 sm:px-8">
            {title}
          </p>
        </div>
      )}
    </>
  );
}