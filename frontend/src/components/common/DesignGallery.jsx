"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

// Apni route yahan change kar lena
const CONTACT_HREF = "/contact";

export default function DesignGallery({ data }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);
  const triggerRef = useRef(null);

  const images = [
    { src: data.leftImage, label: data.title },
    { src: data.rightImage, label: `${data.title} – detail` },
  ];

  const open = (i, e) => {
    triggerRef.current = e.currentTarget;
    setActive(i);
  };
  const close = () => {
    setActive(null);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setActive((a) => (a + 1) % images.length);
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // whileInView: page load par jo screen mein hai woh turant dikhta hai
  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.7, delay, ease: "easeOut" },
  });

  const archBtn =
    "group relative block h-full w-full overflow-hidden rounded-t-[999px] rounded-b-2xl bg-[#e8dfd5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F5EBE0]";

  return (
    <section className="bg-[#F5EBE0] py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 items-center gap-x-4 gap-y-10 lg:grid-cols-[1fr_minmax(0,1.05fr)_1fr] lg:gap-x-12">
          {/* Center content: mobile par sabse upar */}
          <motion.div
            {...reveal(0.05)}
            className="order-1 col-span-2 text-center lg:order-2 lg:col-span-1"
          >

            <h2 className="mt-6 font-serif text-3xl leading-tight tracking-tight text-[#3D1F0D] md:text-4xl lg:text-5xl">
              {data.galleryTitle}
            </h2>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-[#3D1F0D]/70 md:text-base md:leading-8">
              {data.galleryDescription}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`${CONTACT_HREF}?design=${encodeURIComponent(data.title ?? "")}`}
                className="group/cta inline-flex items-center gap-2 rounded-full bg-[#3D1F0D] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B8851F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EBE0]"
              >
                Enquire about this design
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover/cta:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </div>

          </motion.div>

          {/* Left arch image */}
          <motion.div
            {...reveal(0.15)}
            className="order-2 h-[300px] sm:h-[420px] lg:order-1 lg:h-[540px]"
          >
            <button
              type="button"
              onClick={(e) => open(0, e)}
              aria-label={`View ${images[0].label} larger`}
              className={archBtn}
            >
              <Image
                src={images[0].src}
                alt={images[0].label}
                fill
                priority
                sizes="(max-width: 1024px) 50vw, 30vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
              />
              {/* Inner frame */}
              <span className="pointer-events-none absolute inset-3 rounded-t-[999px] rounded-b-xl border border-white/60" />
            </button>
          </motion.div>

          {/* Right arch image */}
          <motion.div
            {...reveal(0.25)}
            className="order-3 h-[300px] sm:h-[420px] lg:h-[540px]"
          >
            <button
              type="button"
              onClick={(e) => open(1, e)}
              aria-label={`View ${images[1].label} larger`}
              className={archBtn}
            >
              <Image
                src={images[1].src}
                alt={images[1].label}
                fill
                sizes="(max-width: 1024px) 50vw, 30vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
              />
              <span className="pointer-events-none absolute inset-3 rounded-t-[999px] rounded-b-xl border border-white/60" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[active].label}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D1F0D]/90 p-4 backdrop-blur-sm"
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

          {[
            { dir: -1, label: "Previous image", Icon: ChevronLeft, pos: "left-2 md:left-6" },
            { dir: 1, label: "Next image", Icon: ChevronRight, pos: "right-2 md:right-6" },
          ].map(({ dir, label, Icon, pos }) => (
            <button
              key={label}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActive((a) => (a + dir + images.length) % images.length);
              }}
              aria-label={label}
              className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8851F] ${pos}`}
            >
              <Icon size={24} />
            </button>
          ))}

          <figure className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-[65vh] w-full overflow-hidden rounded-2xl bg-[#F5EBE0] md:h-[72vh]">
              <Image
                key={images[active].src}
                src={images[active].src}
                alt={images[active].label}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-3">
              <p className="font-serif text-xl text-white">{images[active].label}</p>
              <span className="text-sm text-white/60">
                {active + 1} / {images.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}