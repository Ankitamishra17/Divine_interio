"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  User,
  CalendarDays,
  Clock,
  ArrowLeft,
  ArrowRight,
  Link2,
  Check,
  MessageCircle,
} from "lucide-react";
import { resolveImageUrl } from "@/lib/imageUrl";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Backend may return tags/gallery as a proper array, or (if the DB column
// isn't a native JSON type) as a raw string — handle both safely.
function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed
        : value.split(",").map((v) => v.trim());
    } catch {
      return value.split(",").map((v) => v.trim());
    }
  }
  return [];
}

/* ─────────────────────────────────────────────
   Section eyebrow
───────────────────────────────────────────── */
function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="w-6 sm:w-8 h-px bg-[#C18A35]" />
      <p className="font-body text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#C18A35] font-medium">
        {children}
      </p>
    </div>
  );
}

export default function BlogDetail({ post }) {
  const paragraphs = (post.content || "").split(/\n{2,}/).filter(Boolean);
  const tags = toArray(post.tags);
  const gallery = toArray(post.gallery);

  const [copied, setCopied] = useState(false);

  /* Reading progress */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  /* Hero background parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(heroProgress, [0, 1], ["0%", "8%"]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${post.title} ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const hasMeta = post.author || post.publishedAt || post.readTime;

  return (
    <main className="font-body text-[#292622] min-h-screen bg-[#F7F3ED] overflow-x-clip">
      {/* Reading progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-[#C18A35]"
        style={{ scaleX }}
      />

      {/* ══ Hero — cover image as background ══ */}
      <header
        ref={heroRef}
        className={`relative flex items-end overflow-hidden bg-gradient-to-b from-[#292622] to-[#593719] ${
          post.coverImage
            ? "min-h-[72vh] sm:min-h-[80vh] md:min-h-[88vh]"
            : "min-h-[60vh] sm:min-h-[64vh]"
        }`}
      >
        {/* Background image */}
        {post.coverImage && (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-x-0 -inset-y-[10%]"
              style={{ y: imageY }}
            >
              <Image
                src={resolveImageUrl(post.coverImage)}
                alt={post.title}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#292622]/95 via-[#292622]/55 to-[#292622]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#292622]/70 via-[#292622]/20 to-transparent" />

        {/* Decorative glows (visible mostly when there is no image) */}
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[#C18A35]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#C18A35]/10 blur-3xl" />

        {/* Gold hairline at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C18A35]/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-32 sm:pt-36 md:pt-44 pb-12 sm:pb-16 md:pb-20">
          <div className="max-w-7xl">
            {/* Breadcrumb */}
            <motion.nav
              className="font-body flex items-center gap-2.5 text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#FFFFFF]/70"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="hover:text-[#C18A35] transition-colors">
                Home
              </Link>
              <span className="text-[#C18A35]">/</span>
              <Link
                href="/blog"
                className="hover:text-[#C18A35] transition-colors"
              >
                Journal
              </Link>
            </motion.nav>

            {/* Category */}
            {post.category && (
              <motion.div
                className="mt-8 sm:mt-10 flex items-center gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <span className="w-8 sm:w-10 h-px bg-[#C18A35]" />
                <span className="font-body text-[10px] sm:text-[11px] md:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium text-[#C18A35]">
                  {post.category}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              className="font-heading mt-5 sm:mt-6 text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.06] text-[#FFFFFF] break-words"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            {post.excerpt && (
              <motion.p
                className="font-body mt-5 sm:mt-7 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed font-light text-[#FFFFFF]/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* Meta */}
            {hasMeta && (
              <motion.div
                className="font-body mt-8 sm:mt-10 pt-6 border-t border-[#FFFFFF]/20 flex flex-wrap items-center gap-x-5 sm:gap-x-8 gap-y-3 text-[11px] sm:text-xs tracking-[0.15em] uppercase text-[#FFFFFF]/75"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {post.author && (
                  <span className="inline-flex items-center gap-2">
                    <User size={14} className="text-[#C18A35]" />
                    {post.author}
                  </span>
                )}
                {post.publishedAt && (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} className="text-[#C18A35]" />
                    {formatDate(post.publishedAt)}
                  </span>
                )}
                {post.readTime && (
                  <span className="inline-flex items-center gap-2">
                    <Clock size={14} className="text-[#C18A35]" />
                    {post.readTime}
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* ══ Body: sidebar + article ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 grid lg:grid-cols-[180px_minmax(0,1fr)] gap-8 lg:gap-16">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-row flex-wrap items-center justify-between gap-4 border-y border-[#E8DED0] py-4 lg:flex-col lg:items-start lg:justify-start lg:gap-8 lg:border-y-0 lg:border-t lg:py-0 lg:pt-6">
            <Link
              href="/blog"
              className="font-body group inline-flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-medium text-[#593719]/70 transition-colors hover:text-[#C18A35]"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />
              Journal
            </Link>

            <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-3">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#C18A35] font-medium">
                Share
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  aria-label="Copy link"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DED0] bg-[#FFFFFF] text-[#593719] transition-all duration-300 hover:border-[#C18A35] hover:bg-[#C18A35] hover:text-[#FFFFFF]"
                >
                  {copied ? <Check size={16} /> : <Link2 size={16} />}
                </button>
                <button
                  onClick={handleWhatsApp}
                  aria-label="Share on WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DED0] bg-[#FFFFFF] text-[#593719] transition-all duration-300 hover:border-[#C18A35] hover:bg-[#C18A35] hover:text-[#FFFFFF]"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
              {copied && (
                <span className="font-body text-[11px] text-[#C18A35]">
                  Link copied
                </span>
              )}
            </div>
          </div>
        </aside>

        {/* Article */}
        <article className="max-w-2xl w-full">
          <div className="space-y-5 sm:space-y-7">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                className={`font-body text-[15px] sm:text-base md:text-[17px] leading-[1.85] sm:leading-[1.95] text-[#292622]/80 font-light ${
                  i === 0
                    ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-heading first-letter:text-5xl sm:first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-[#C18A35]"
                    : ""
                }`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* End ornament */}
          {paragraphs.length > 0 && (
            <motion.div
              className="mt-12 sm:mt-16 flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C18A35]" />
              <span className="h-2 w-2 rotate-45 bg-[#C18A35]" />
              <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C18A35]" />
            </motion.div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <motion.div
              className="mt-10 sm:mt-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="font-body mb-4 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#292622]/50 font-medium">
                Tagged
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-body text-[10px] sm:text-[11px] tracking-widest uppercase px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#E8DED0] bg-[#FFFFFF] text-[#593719] font-medium transition-colors hover:border-[#C18A35] hover:text-[#C18A35]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Author */}
          {post.author && (
            <motion.div
              className="mt-10 sm:mt-12 flex items-center gap-4 sm:gap-5 rounded-sm border border-[#E8DED0] border-l-[3px] border-l-[#C18A35] bg-[#FFFFFF] p-5 sm:p-6 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="font-heading flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#593719] text-lg sm:text-xl text-[#C18A35]">
                {post.author.trim().charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[#C18A35] font-medium">
                  Written by
                </p>
                <p className="font-heading mt-1 text-lg sm:text-xl text-[#593719]">
                  {post.author}
                </p>
              </div>
            </motion.div>
          )}
        </article>
      </section>

      {/* ══ Gallery (optional) ══ */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-14 sm:pb-20 md:pb-24">
          <motion.div
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Eyebrow>Gallery</Eyebrow>
            <h2 className="font-heading mt-4 text-3xl sm:text-4xl md:text-5xl font-normal text-[#593719]">
              From the Story
            </h2>
          </motion.div>

          <div className="grid grid-flow-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[220px] sm:auto-rows-[230px] lg:auto-rows-[240px] gap-3 sm:gap-4">
            {gallery.map((img, i) => {
              const isFeature = i === 0;
              return (
                <motion.div
                  key={i}
                  className={`relative overflow-hidden group rounded-sm bg-[#E8DED0] ${
                    isFeature ? "sm:col-span-2 lg:row-span-2" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={resolveImageUrl(img)}
                    alt={`${post.title} — image ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes={
                      isFeature
                        ? "(max-width: 640px) 100vw, 66vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#292622]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══ Closing CTA ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-16 sm:pb-24">
        <motion.div
          className="relative overflow-hidden rounded-sm bg-[#593719] px-6 sm:px-12 py-12 sm:py-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#C18A35]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#C18A35]/15 blur-3xl" />

          <div className="relative">
            <p className="font-body text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#C18A35] font-medium mb-4">
              Continue Exploring
            </p>
            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-normal text-[#FFFFFF] leading-[1.15] max-w-xl mx-auto">
              Have a Space in Mind?
              <span className="block  text-[#C18A35]">
                Let&apos;s Talk Design.
              </span>
            </h2>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              <Link href="/contact" className="w-full sm:w-auto">
                <motion.div
                  className="font-body inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-md bg-[#C18A35] px-8 py-4 text-xs sm:text-sm tracking-[0.2em] uppercase font-medium text-[#292622] transition-colors duration-300 hover:bg-[#FFFFFF] active:scale-95"
                  whileHover={{ y: -2 }}
                >
                  Book Consultation
                  <ArrowRight size={16} />
                </motion.div>
              </Link>

              <Link
                href="/blog"
                className="font-body group inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.25em] uppercase font-light text-[#FFFFFF]/75 transition-colors hover:text-[#C18A35]"
              >
                <ArrowLeft
                  size={15}
                  className="transition-transform group-hover:-translate-x-1"
                />
                Back to Journal
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}