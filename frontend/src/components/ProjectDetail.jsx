"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Images } from "lucide-react";
import { resolveImageUrl } from "../lib/imageUrl";

/* ─────────────────────────────────────────────
   Lightbox
───────────────────────────────────────────── */
function Lightbox({ images, current, onClose, onPrev, onNext, onSelect }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="font-body fixed inset-0 z-[100] bg-[#292622]/95 flex items-center justify-center backdrop-blur-lg px-2 sm:px-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-8 md:right-8 text-[#FFFFFF]/60 hover:text-[#dba343] transition-colors z-10"
        aria-label="Close"
        whileHover={{ scale: 1.1, rotate: 90 }}
      >
        <svg
          width="24"
          height="24"
          className="sm:w-7 sm:h-7"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            d="M8 8L24 24M24 8L8 24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>

      <div className="font-body absolute top-4 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 text-[#FFFFFF]/50 text-[9px] sm:text-[10px] md:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase font-light">
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(images.length).padStart(2, "0")}
      </div>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-1 sm:left-2 md:left-8 text-[#FFFFFF]/50 hover:text-[#dba343] transition-colors"
        aria-label="Previous image"
        whileHover={{ scale: 1.15, x: -4 }}
      >
        <svg
          width="24"
          height="24"
          className="sm:w-8 sm:h-8 md:w-[34px] md:h-[34px]"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M25 8L13 20L25 32"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>

      <div
        className="relative w-full max-w-5xl mx-10 sm:mx-14 md:mx-24"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="relative aspect-[4/3] md:aspect-[16/9]"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={images[current]}
              alt={`Gallery image ${current + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-1 sm:right-2 md:right-8 text-[#FFFFFF]/50 hover:text-[#dba343] transition-colors"
        aria-label="Next image"
        whileHover={{ scale: 1.15, x: 4 }}
      >
        <svg
          width="24"
          height="24"
          className="sm:w-8 sm:h-8 md:w-[34px] md:h-[34px]"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M15 8L27 20L15 32"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>

      <div className="hidden sm:flex absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 gap-1.5 sm:gap-2 max-w-[85vw] md:max-w-lg overflow-x-auto px-4">
        {images.map((img, i) => (
          <motion.button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(i);
            }}
            className={`relative flex-shrink-0 w-12 h-9 sm:w-14 sm:h-10 overflow-hidden transition-all duration-300 border rounded-[2px] ${
              i === current
                ? "ring-1 ring-[#dba343] opacity-100 border-[#dba343]"
                : "opacity-30 hover:opacity-70 border-[#FFFFFF]/20"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function ProjectDetail({ project }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const rawImages = project.gallery?.length ? project.gallery : [project.image];
  const allImages = rawImages.map(resolveImageUrl).filter(Boolean);
  const ctaImage = allImages[2] || allImages[0];

  const openLightbox = (i) => {
    setActiveIndex(i);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = useCallback(
    () => setActiveIndex((p) => (p - 1 + allImages.length) % allImages.length),
    [allImages.length],
  );
  const nextImage = useCallback(
    () => setActiveIndex((p) => (p + 1) % allImages.length),
    [allImages.length],
  );

  const specs = [
    { label: "Location", value: project.location },
    { label: "Size", value: project.area || project.bhk },
    { label: "Style", value: project.style || "Contemporary" },
    { label: "Year", value: project.year || "2024" },
    { label: "Duration", value: project.duration || "4 months" },
  ].filter((s) => s.value);

  return (
    <>
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={allImages}
            current={activeIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
            onSelect={setActiveIndex}
          />
        )}
      </AnimatePresence>

      <main className="font-body text-[#292622] min-h-screen bg-[#F7F3ED] overflow-x-clip">
        {/* ══ Hero ══ */}

        {/* ═════════════════════ HERO SECTION ═════════════════════ */}
        <section className="relative h-[62vh] sm:h-[74vh] md:h-[86vh] min-h-[480px] md:min-h-[620px] overflow-hidden isolate">
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {project.image && (
              <Image
                src={resolveImageUrl(project.image)}
                alt={project.name}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            )}
          </motion.div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 z-[1] bg-black/40" />

          {/* Left Gradient - Text Visibility */}
          <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#171411]/90 via-[#171411]/55 to-transparent" />

          {/* Bottom Gradient */}
          <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[#171411]/85 via-[#171411]/15 to-[#171411]/20" />

          {/* ═════════════════ BREADCRUMB ═════════════════ */}
          <motion.nav
            className="font-body absolute top-6 sm:top-8 md:top-10 left-5 sm:left-8 md:left-16 right-5 sm:right-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white font-semibold z-10"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="text-white/90 hover:text-[#D9A441] transition-colors"
            >
              Home
            </Link>

            <span className="text-white/50">/</span>

            <Link
              href="/portfolio"
              className="text-white/90 hover:text-[#D9A441] transition-colors"
            >
              Portfolio
            </Link>

            <span className="text-white/50">/</span>

            <span className="text-[#E3AC4B] font-bold truncate max-w-[160px] sm:max-w-none">
              {project.name}
            </span>
          </motion.nav>

          {/* ═════════════════ TITLE CONTENT ═════════════════ */}
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-16 pb-12 sm:pb-16 md:pb-24">
              <div className="max-w-4xl">
                {/* Project Category */}
                <motion.div
                  className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <span className="w-9 sm:w-12 h-[2px] bg-[#D9A441]" />

                  <p className="font-body text-[#E5B453] text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-bold drop-shadow-md">
                    {project.type
                      ? `${project.type} Project`
                      : "Interior Project"}
                  </p>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.08] tracking-tight mb-5 sm:mb-6 text-white break-words drop-shadow-[0_4px_15px_rgba(0,0,0,0.85)]"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                >
                  {project.name}
                </motion.h1>

                {/* Location Details */}
                <motion.p
                  className="font-body flex items-center gap-3 text-white text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  <MapPin size={17} className="text-[#E5B453] shrink-0" />

                  <span>
                    {project.location}
                    {project.bhk ? `  ·  ${project.bhk}` : ""}
                  </span>
                </motion.p>

                {/* Small Gold Divider */}
                <div className="mt-6 sm:mt-8 w-20 h-[2px] bg-gradient-to-r from-[#D9A441] to-transparent" />
              </div>

             
            </div>
          </div>
        </section>

        {/* ══ Floating Spec Card ══ */}
        <section className="relative px-3 xs:px-4 sm:px-8 md:px-16">
          <motion.div
            className="relative z-10 -mt-10 xs:-mt-12 md:-mt-16 max-w-6xl mx-auto bg-[#FFFFFF] border border-[#E8DED0] border-t-[3px] border-t-[#dba343] rounded-sm shadow-[0_20px_60px_-15px_rgba(41,38,34,0.25)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 divide-y divide-x divide-[#E8DED0] md:divide-y-0">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-1 sm:gap-1.5 px-3 xs:px-4 sm:px-5 md:px-6 py-4 xs:py-5 sm:py-6 md:py-8"
                >
                  <span className="font-body text-[8px] xs:text-[9px] md:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#dba343] font-medium">
                    {s.label}
                  </span>
                  <span className="font-heading text-[#593719] text-sm xs:text-base md:text-lg font-normal break-words">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ══ Description + Highlights ══ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16 pt-12 xs:pt-16 sm:pt-20 md:pt-28 pb-12 xs:pb-16 sm:pb-20 md:pb-24 grid md:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-14 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="w-6 sm:w-8 h-px bg-[#dba343]" />
              <p className="font-body text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#dba343] font-medium">
                About This Project
              </p>
            </div>
            <p className="font-body text-[#292622]/75 leading-[1.8] sm:leading-[1.9] text-sm sm:text-base md:text-lg font-light">
              {project.description}
            </p>
          </motion.div>

          {project.highlights?.length > 0 && (
            <motion.div
              className="bg-[#FFFFFF] border border-[#E8DED0] border-l-[3px] border-l-[#dba343] rounded-sm p-5 xs:p-6 sm:p-7 md:p-9 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7">
                <span className="w-6 sm:w-8 h-px bg-[#dba343]" />
                <p className="font-body text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#dba343] font-medium">
                  Project Highlights
                </p>
              </div>
              <ul className="space-y-4 sm:space-y-5">
                {project.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    className="font-body flex items-start gap-3 sm:gap-4 text-[#292622]/70 text-sm leading-relaxed font-light"
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#dba343]" />
                    <span>{h}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </section>

        {/* ══ Gallery ══ */}
        {allImages.length > 1 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16 pb-12 xs:pb-16 sm:pb-20 md:pb-28">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
              <span className="w-6 sm:w-8 h-px bg-[#dba343]" />
              <motion.p
                className="font-body text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#dba343] font-medium"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Photo Gallery
              </motion.p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[110px] xs:auto-rows-[130px] sm:auto-rows-[180px] md:auto-rows-[200px] gap-2 xs:gap-3 md:gap-4">
              {allImages.map((img, i) => {
                const isFeature = i === 0;
                return (
                  <motion.button
                    key={i}
                    onClick={() => openLightbox(i)}
                    className={`relative overflow-hidden group rounded-[2px] ${
                      isFeature
                        ? "col-span-2 row-span-2"
                        : "col-span-1 row-span-1"
                    }`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Image
                      src={img}
                      alt={`${project.name} — photo ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes={
                        isFeature
                          ? "(max-width: 480px) 100vw, 60vw"
                          : "(max-width: 480px) 50vw, 25vw"
                      }
                    />
                    <div className="absolute inset-0 bg-[#292622]/0 group-hover:bg-[#593719]/40 transition-all duration-500 flex items-center justify-center">
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-[#FFFFFF]/70 rounded-full p-2 sm:p-3 bg-[#FFFFFF]/5 backdrop-blur-sm"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                      >
                        <svg
                          width="16"
                          height="16"
                          className="sm:w-[18px] sm:h-[18px]"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M8 3H3v5M17 8V3h-5M12 17h5v-5M3 12v5h5"
                            stroke="white"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              onClick={() => openLightbox(0)}
              className="font-body mt-6 sm:mt-8 flex items-center gap-2.5 sm:gap-3 text-[#593719]/60 hover:text-[#dba343] text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-colors font-light"
              whileHover={{ x: 8 }}
            >
              <span>View All {allImages.length} Photos</span>
              <span className="w-8 sm:w-10 h-px bg-current" />
            </motion.button>
          </section>
        )}

        {/* ══ Client Quote ══ */}
        {project.clientQuote && (
          <section className="border-y border-[#E8DED0] bg-[#E8DED0]/40">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-16 py-14 xs:py-16 sm:py-20 md:py-28 text-center">
              <motion.div
                className="font-heading text-[#dba343]/30 text-[64px] xs:text-[80px] sm:text-[100px] md:text-[140px] leading-none mb-2 -mt-4 xs:-mt-6 sm:-mt-8 md:-mt-12 select-none"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                "
              </motion.div>
              <motion.blockquote
                className="font-heading text-lg xs:text-xl sm:text-2xl md:text-3xl font-normal text-[#593719] leading-relaxed -mt-6 xs:-mt-8 sm:-mt-10 md:-mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                {project.clientQuote.text}
              </motion.blockquote>
              <motion.div
                className="mt-7 sm:mt-9 flex items-center justify-center gap-3 sm:gap-5 md:gap-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <span className="w-8 sm:w-10 md:w-12 h-px bg-gradient-to-r from-[#dba343] to-transparent" />
                <div className="text-center">
                  <p className="font-body text-[#593719] text-xs sm:text-sm font-medium tracking-wider">
                    {project.clientQuote.author}
                  </p>
                  {project.clientQuote.title && (
                    <p className="font-body text-[#292622]/50 text-[10px] sm:text-[11px] tracking-widest uppercase mt-1 sm:mt-1.5 font-light">
                      {project.clientQuote.title}
                    </p>
                  )}
                </div>
                <span className="w-8 sm:w-10 md:w-12 h-px bg-gradient-to-l from-[#dba343] to-transparent" />
              </motion.div>
            </div>
          </section>
        )}

        {/* ══ CTA — full-bleed image ══ */}
        <section className="relative w-full min-h-[420px] xs:min-h-[460px] sm:min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.06 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            {ctaImage ? (
              <Image
                src={ctaImage}
                alt={`${project.name} — inquire`}
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[#593719]/20" />
            )}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#292622]/95 via-[#292622]/75 to-[#292622]/45" />

          <div className="relative z-10 w-full px-4 xs:px-6 sm:px-10 md:px-16 py-14 xs:py-16 sm:py-20 md:py-0 text-center">
            <motion.p
              className="font-body text-[#dba343] text-[10px] sm:text-[11px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-5 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Start Your Project
            </motion.p>
            <motion.h2
              className="font-heading text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-normal text-[#FFFFFF] mb-4 sm:mb-6 max-w-3xl mx-auto leading-[1.1] sm:leading-[1.08]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Love What You See?
              <br />
              <span className="text-[#dba343]">Let's Create Yours.</span>
            </motion.h2>
            <motion.p
              className="font-body text-[#FFFFFF]/75 max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed text-xs sm:text-sm font-light"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Share your vision with us and we'll craft an interior that's
              uniquely yours — blending luxury, comfort, and timeless design.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/contact" className="w-full sm:w-auto">
                <motion.div
                  className="font-body inline-flex items-center justify-center rounded-md gap-3 bg-[#dba343] text-[#292622] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 active:scale-95 shadow-lg shadow-black/20 hover:bg-[#FFFFFF] hover:shadow-[0_0_40px_rgba(193,138,53,0.45)] w-full sm:w-auto"
                  whileHover={{ y: -2 }}
                >
                  Book Consultation
                </motion.div>
              </Link>
              <Link
                href="/portfolio"
                className="font-body text-[#FFFFFF]/75 hover:text-[#dba343] text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-colors inline-flex items-center gap-2 font-light group"
              >
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform shrink-0"
                >
                  <path
                    d="M10 3L5 8l5 5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
                Back to Portfolio
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
