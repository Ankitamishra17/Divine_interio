"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ChevronRight, Phone, MessageCircle } from "lucide-react";

/*
  Palette
  Espresso #593719 | Warm Gold #dba343 | Ivory #F7F3ED | Beige #E8DED0 | Charcoal #292622 | White #FFFFFF

  Layout: full-bleed photo, headline anchored low on the left, and a working strip along the bottom
  edge: what you do, where you work, the studio (with live open / closed status) and a one-tap way
  to call or WhatsApp. On phones the photo stays visible in the top half and the text sits below it.
*/

// Tied directly to the next/font variables set in layout.js (--font-philosopher, --font-jost)
const HEADING = "font-[family-name:var(--font-philosopher)]";
const BODY = "font-[family-name:var(--font-jost)]";

const PHONE_DISPLAY = "+91 9911066420";
const PHONE_TEL = "tel:+919911066420";
const WHATSAPP_URL = "https://wa.me/919911066420";
const ADDRESS_SHORT = "Galaxy Diamond Plaza, Greater Noida West";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Shop-LGB 28, Galaxy Diamond Plaza, Sector 4, Greater Noida West, Greater Noida, Uttar Pradesh 201009",
)}`;

/* Studio hours in Indian time, so it is right for visitors anywhere */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour").value) % 24;
  return hour >= 10 && hour < 19;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]";
const link = `rounded-sm text-[#F7F3ED] underline decoration-[#dba343] decoration-2 underline-offset-4 transition-colors hover:text-[#dba343] ${ring}`;

export default function AboutHero() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setOpen(isOpenNow());
    const t = setInterval(() => setOpen(isOpenNow()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      aria-labelledby="about-hero-heading"
      className={`relative isolate flex min-h-[700px] flex-col overflow-hidden bg-[#292622] md:min-h-[760px] ${BODY}`}
    >
      {/* Photo */}
      <motion.div
        initial={reduce ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src="/banner/about_banner.png"
          alt="Elegant luxury living room interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
      </motion.div>

      {/* Veils: from below on phones so the photo shows above the text, from the left on larger screens */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#292622] via-[#292622]/80 via-45% to-[#292622]/10 md:bg-gradient-to-r md:from-[#292622]/90 md:via-[#292622]/60 md:to-[#292622]/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 hidden h-56 bg-gradient-to-t from-[#292622]/85 to-transparent md:block"
      />

      {/* Content */}
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 items-end px-5 pb-12 sm:px-8 md:pb-35 xl:px-12">
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="visible"
          className="max-w-[720px]"
        >
          <motion.nav
            variants={fadeUp}
            aria-label="Breadcrumb"
            className="mb-7 md:mb-9 "
          >
            <ol className="flex items-center gap-2 text-sm text-[#F7F3ED]/80">
              <li>
                <Link
                  href="/"
                  className={`rounded-sm transition-colors hover:text-[#dba343] ${ring}`}
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={15} className="text-[#dba343]" />
              </li>
              <li aria-current="page" className="text-[#F7F3ED]">
                About us
              </li>
            </ol>
          </motion.nav>

          <motion.h1
            id="about-hero-heading"
            variants={fadeUp}
            className={`${HEADING} text-[clamp(2.75rem,5.2vw,5.8rem)] font-normal leading-[1.12] tracking-[-0.02em] text-[#F7F3ED]`}
          >
            Crafting Spaces that feel Like Home
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[540px] text-base font-light leading-[1.8] text-[#F7F3ED]/90 md:text-lg"
          >
            Divine Interio is a team of designers, architects and execution
            experts creating functional, stylish and personal interiors for
            modern living.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5"
          >
            <a
              href="#our-story"
              className={`group inline-flex min-h-14 items-center justify-center gap-3 rounded-sm bg-[#dba343] px-8 text-[15px] font-semibold tracking-wide text-[#292622] transition-colors duration-300 hover:bg-[#F7F3ED] ${ring}`}
            >
              Our story
              <ArrowDown
                size={18}
                className="transition-transform duration-300 group-hover:translate-y-1 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </a>

            <Link
              href="/portfolio"
              className={`inline-flex min-h-11 items-center ${link} text-[15px] font-semibold`}
            >
              Explore our work
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Working strip */}
      <div className="border-t border-[#F7F3ED]/20 bg-[#292622]/70 backdrop-blur-sm">
        <dl className="mx-auto grid max-w-[1280px] gap-6 px-5 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-0 xl:px-12">
          <div className="lg:pr-8">
            <dt className="text-sm text-[#F7F3ED]/60">What we do</dt>
            <dd className="mt-1 text-[15px] leading-snug text-[#F7F3ED]">
              Interiors, modular kitchens and turnkey homes
            </dd>
          </div>

          <div className="lg:border-l lg:border-[#F7F3ED]/15 lg:px-8">
            <dt className="text-sm text-[#F7F3ED]/60">Where we work</dt>
            <dd className="mt-1 text-[15px] leading-snug text-[#F7F3ED]">
              Noida, Greater Noida, Ghaziabad and Delhi NCR
            </dd>
          </div>

          <div className="lg:border-l lg:border-[#F7F3ED]/15 lg:px-8">
            <dt className="text-sm text-[#F7F3ED]/60">Visit the studio</dt>
            <dd className="mt-1 text-[15px] leading-snug">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                {ADDRESS_SHORT}
              </a>
              <span
                className="mt-2 flex items-center gap-2 text-sm text-[#F7F3ED]/75"
                role="status"
              >
                <span
                  className="relative flex h-2 w-2 shrink-0"
                  aria-hidden="true"
                >
                  {open && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#dba343] opacity-60 motion-reduce:animate-none" />
                  )}
                  <span
                    className={`relative h-2 w-2 rounded-full ${open ? "bg-[#dba343]" : "bg-[#F7F3ED]/40"}`}
                  />
                </span>
                {open === null
                  ? "Open daily, 10 AM to 7 PM"
                  : open
                    ? "Open now, until 7 PM"
                    : "Closed now. Opens 10 AM"}
              </span>
            </dd>
          </div>

          <div className="lg:border-l lg:border-[#F7F3ED]/15 lg:pl-8">
            <dt className="text-sm text-[#F7F3ED]/60">Talk to us</dt>
            <dd className="mt-1 flex flex-col gap-2 text-[15px] leading-snug">
              <a
                href={PHONE_TEL}
                className={`inline-flex min-h-6 items-center gap-2 ${link}`}
              >
                <Phone
                  size={15}
                  className="text-[#dba343]"
                  aria-hidden="true"
                />
                {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-6 items-center gap-2 ${link}`}
              >
                <MessageCircle
                  size={15}
                  className="text-[#dba343]"
                  aria-hidden="true"
                />
                WhatsApp us
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
