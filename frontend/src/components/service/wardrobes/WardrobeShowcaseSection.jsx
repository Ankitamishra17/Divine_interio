"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react";
import { wardrobeData } from "@/data/wardrobeData";

// Apni route yahan change kar lena
const CONTACT_HREF = "/contact";

function buildPreviews(item) {
  return [
    { src: item.image, label: item.title, thumbLabel: "Main" },
    ...(item.sectionType === "variations"
      ? (item.variations ?? []).map((v) => ({
          src: v.image,
          label: v.title,
          thumbLabel: v.title,
        }))
      : []),
    ...(item.sectionType === "gallery"
      ? (item.gallery ?? []).map((g, i) => ({
          src: g.image,
          label: `${item.title} – view ${i + 1}`,
          thumbLabel: `View ${i + 1}`,
        }))
      : []),
  ];
}

function WardrobeCard({ item, index }) {
  const previews = buildPreviews(item);
  const total = previews.length;
  const hasPreviews = total > 1;
  const reversed = index % 2 === 1;

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef(null);
  const expandBtnRef = useRef(null);
  const thumbRefs = useRef([]);

  const go = useCallback(
    (n) => setActive(((n % total) + total) % total),
    [total]
  );

  

  // Lightbox: 
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setLightbox(false);
        expandBtnRef.current?.focus();
      }
      if (hasPreviews && e.key === "ArrowRight") setActive((a) => (a + 1) % total);
      if (hasPreviews && e.key === "ArrowLeft") setActive((a) => (a - 1 + total) % total);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, hasPreviews, total]);

  const onTouchEnd = (e) => {
    if (touchX.current === null || !hasPreviews) return;
    const diff = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(diff) > 45) go(active + (diff < 0 ? 1 : -1));
    touchX.current = null;
  };

  const selectorTitle =
    item.sectionType === "variations" ? "Design Variations" : "Luxury Gallery";

  const arrowBtn =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#3D1F0D] shadow-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] lg:opacity-0 lg:group-hover/viewer:opacity-100 lg:focus-visible:opacity-100";

  return (
    <article
      id={`wardrobe-${item.id}`}
      className="scroll-mt-24 overflow-hidden rounded-[28px] border border-[#e8dfd5] bg-white shadow-[0_1px_0_rgba(61,31,13,0.04)]"
    >
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Content */}
        <div
          className={`flex flex-col p-6 sm:p-8 lg:justify-center lg:p-12 ${
            reversed ? "lg:order-2" : ""
          }`}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F3ED] text-sm font-medium text-[#B8851F]">
            {item.id}
          </span>

          <h2 className="mt-4 font-serif text-3xl leading-tight text-[#3D1F0D] md:text-4xl">
            {item.title}
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-gray-600 md:text-base md:leading-8">
            {item.description}
          </p>

          {item.features?.length > 0 && (
            <ul className="mt-7 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {item.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-[#3D1F0D]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B8851F]/10">
                    <Check size={12} className="text-[#B8851F]" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-10">
            <Link
              href={`${CONTACT_HREF}?design=${encodeURIComponent(item.title)}`}
              className="group inline-flex items-center gap-2 rounded-full bg-[#3D1F0D] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B8851F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] focus-visible:ring-offset-2"
            >
              Enquire about this design
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>

        {/* Visual side */}
        <div
          className={`flex flex-col gap-4 bg-[#FBF6F0] p-4 sm:p-6 ${
            reversed ? "lg:order-1" : ""
          }`}
        >
          {/* Viewer */}
          <div
            className="group/viewer relative min-h-[300px] flex-1 overflow-hidden rounded-2xl bg-[#F7F3ED] sm:min-h-[360px] lg:min-h-[340px]"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={onTouchEnd}
          >
            {/* Saari images stacked, sirf active visible: smooth crossfade */}
            {previews.map((p, i) => (
              <Image
                key={`${p.src}-${i}`}
                src={p.src}
                alt={p.label}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority={index === 0 && i === 0}
                aria-hidden={i !== active}
                className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Expand */}
            <button
              ref={expandBtnRef}
              type="button"
              onClick={() => setLightbox(true)}
              aria-label={`View ${previews[active].label} full screen`}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#3D1F0D] shadow-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F]"
            >
              <Expand size={16} />
            </button>

            {hasPreviews && (
              <>
                <button
                  type="button"
                  onClick={() => go(active - 1)}
                  aria-label="Previous image"
                  className={`${arrowBtn} left-3`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1)}
                  aria-label="Next image"
                  className={`${arrowBtn} right-3`}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#3D1F0D]/80 to-transparent p-4 pt-14">
              <p
                className="font-serif text-base text-white md:text-lg"
                aria-live="polite"
              >
                {previews[active].label}
              </p>
              {hasPreviews && (
                <span className="rounded-full bg-black/30 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                  {active + 1} / {total}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {hasPreviews && (
            <div>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold text-[#3D1F0D]">
                  {selectorTitle}
                </h3>
                <span className="text-xs text-gray-500">
                  Tap or swipe to preview
                </span>
              </div>

              <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 py-1 pb-2">
                {previews.map((p, i) => {
                  const selected = i === active;
                  return (
                    <button
                      key={`${p.src}-${i}`}
                      ref={(el) => (thumbRefs.current[i] = el)}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={selected}
                      aria-label={`Preview ${p.label}`}
                      className="group w-24 shrink-0 snap-start text-left focus-visible:outline-none sm:w-28"
                    >
                      <span
                        className={`relative block h-16 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-[#FBF6F0] transition sm:h-20 ${
                          selected
                            ? "ring-[#B8851F]"
                            : "ring-transparent group-hover:ring-[#B8851F]/40 group-focus-visible:ring-[#B8851F]/70"
                        }`}
                      >
                        <Image
                          src={p.src}
                          alt=""
                          fill
                          sizes="112px"
                          className={`object-cover transition-opacity ${
                            selected
                              ? "opacity-100"
                              : "opacity-70 group-hover:opacity-100"
                          }`}
                        />
                      </span>
                      <span
                        className={`mt-2 block truncate text-center text-xs ${
                          selected
                            ? "font-medium text-[#3D1F0D]"
                            : "text-gray-600"
                        }`}
                      >
                        {p.thumbLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Accessories */}
          {item.sectionType === "accessories" &&
            item.accessories?.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[#3D1F0D]">
                  Interior Accessories
                </h3>

                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {item.accessories.map((acc, i) => (
                    <li
                      key={i}
                      className="flex flex-col items-center gap-2 rounded-xl border border-[#e8dfd5] bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-[#B8851F]/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <Image
                        src={acc.icon}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                      />
                      <span className="text-xs leading-snug text-[#3D1F0D]">
                        {acc.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={previews[active].label}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D1F0D]/90 p-4 backdrop-blur-sm"
          onClick={() => {
            setLightbox(false);
            expandBtnRef.current?.focus();
          }}
        >
          <button
            type="button"
            autoFocus
            onClick={() => {
              setLightbox(false);
              expandBtnRef.current?.focus();
            }}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F]"
          >
            <X size={22} />
          </button>

          {hasPreviews && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(active - 1);
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] md:left-6"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(active + 1);
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] md:right-6"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <figure
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[65vh] w-full overflow-hidden rounded-2xl bg-[#F7F3ED] md:h-[72vh]">
              <Image
                key={previews[active].src}
                src={previews[active].src}
                alt={previews[active].label}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-3">
              <p className="font-serif text-xl text-white">
                {previews[active].label}
              </p>
              {hasPreviews && (
                <span className="text-sm text-white/60">
                  {active + 1} / {total}
                </span>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </article>
  );
}

export default function WardrobeShowcase() {


  return (
    <section className="bg-[#F7F3ED] py-10 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Intro + quick jump */}
        <div className="mb-8 lg:mb-12">
          <h2 className="font-serif text-3xl text-[#3D1F0D] md:text-5xl">
            Our Wardrobe Collection
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#3D1F0D]/70 md:text-base">
            Pick a style to explore its variations, accessories and finishes.
          </p>

          <nav
            aria-label="Wardrobe styles"
            className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {wardrobeData.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => (item.id)}
                className="shrink-0 rounded-full border border-[#B8851F]/40 bg-white/60 px-4 py-2 text-sm text-[#3D1F0D] transition-colors hover:bg-[#B8851F] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3ED]"
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-8 lg:space-y-10">
          {wardrobeData.map((item, index) => (
            <WardrobeCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}