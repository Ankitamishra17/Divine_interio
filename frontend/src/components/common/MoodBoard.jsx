"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

// Converts "/image/living_room2.webp" -> "Living Room 2"
function titleFromSrc(src = "") {
  const filename = src.split("/").pop() || "";
  const nameOnly = filename.replace(/\.[^/.]+$/, "");
  const withSpaces = nameOnly
    .replace(/[_-]+/g, " ")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2");

  return withSpaces
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Bento pattern: har 8 images ka block 4 columns x 4 rows poora bharta hai
// (mobile par 2 columns mein bhi same spans kaam karte hain)
const SPANS = [
  "col-span-2 row-span-2", // 0 - bada
  "", // 1
  "", // 2
  "col-span-2", // 3 - wide
  "row-span-2", // 4 - tall
  "", // 5
  "", // 6
  "col-span-2 row-span-2", // 7 - bada
];
const LARGE = new Set([0, 7]);

export default function DesignGallery({ data }) {
  const heading = data?.heading || "Explore Our Design Collections";
  const description =
    data?.description ||
    "Discover stunning interior designs that blend elegance with functionality.";
  const buttonText = data?.buttonText || "Explore";
  const buttonLink = data?.buttonLink || "/portfolio";
  const hoverSubtitle = data?.subtitle;

  // Plain string URLs aur { src, title, description } objects, dono support
  const items = useMemo(
    () =>
      (data?.moodboard || [])
        .map((image) => {
          const isObject = typeof image === "object" && image !== null;
          const src = isObject ? image.src : image;
          return {
            src,
            title: isObject ? image.title : titleFromSrc(image),
            subtitle: isObject ? image.description : hoverSubtitle,
          };
        })
        .filter((i) => i.src),
    [data?.moodboard, hoverSubtitle]
  );

  const [active, setActive] = useState(null);
  const triggerRef = useRef(null);
  const count = items.length;

  const close = () => {
    setActive(null);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % count);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + count) % count);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, count]);

  if (!count) return null;

  const navBtn =
    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F]";

  return (
    <section className="overflow-hidden bg-[#292622] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl leading-tight text-white md:text-4xl lg:text-5xl">
              {heading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#ddd8ce] md:text-base">
              {description}
            </p>
          </div>

          <Link
            href={buttonLink}
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-[#B8851F] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#dba343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3D1F0D]"
          >
            {buttonText}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>

        {/* Bento gallery */}
        <ul className="grid auto-rows-[170px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[210px] md:grid-cols-4 md:gap-4 lg:auto-rows-[240px]">
          {items.map((item, index) => {
            const pos = index % SPANS.length;
            const large = LARGE.has(pos);

            return (
              <li key={`${item.src}-${index}`} className={SPANS[pos]}>
                <button
                  type="button"
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget;
                    setActive(index);
                  }}
                  aria-label={`View ${item.title || "design"} larger`}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl bg-[#2c1608] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3D1F0D]"
                >
                  <Image
                    src={item.src}
                    alt={item.title || "Design"}
                    fill
                    sizes={
                      large
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 50vw, 25vw"
                    }
                    priority={index < 4}
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  />

                  {/* Title hamesha visible (mobile par bhi); subtitle desktop hover par */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-14 md:p-4 md:pt-16">
                    <div className="min-w-0">
                      {item.title && (
                        <h3
                          className={`font-serif leading-snug text-white ${
                            large ? "text-base md:text-xl" : "text-sm md:text-base"
                          }`}
                        >
                          {item.title}
                        </h3>
                      )}
                      {item.subtitle && (
                        <p className="hidden max-h-0 overflow-hidden text-xs leading-relaxed text-[#ddd8ce] opacity-0 transition-all duration-500 group-hover:mt-1 group-hover:max-h-10 group-hover:opacity-100 lg:line-clamp-2 lg:block motion-reduce:transition-none">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#3D1F0D] lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100"
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
      {active !== null && items[active] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[active].title || "Design"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f0f05]/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            autoFocus
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F]"
          >
            <X size={22} />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((a) => (a - 1 + count) % count);
                }}
                aria-label="Previous image"
                className={`${navBtn} left-2 md:left-6`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((a) => (a + 1) % count);
                }}
                aria-label="Next image"
                className={`${navBtn} right-2 md:right-6`}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <figure
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[65vh] w-full overflow-hidden rounded-2xl md:h-[72vh]">
              <Image
                key={items[active].src}
                src={items[active].src}
                alt={items[active].title || "Design"}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-xl text-white">
                  {items[active].title}
                </p>
                {items[active].subtitle && (
                  <p className="mt-1 max-w-xl text-sm text-[#ddd8ce]">
                    {items[active].subtitle}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-sm text-white/60">
                {active + 1} / {count}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}