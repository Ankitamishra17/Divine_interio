"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, MapPin, Clock, MessageCircle, ArrowDown } from "lucide-react";

const PHONE_DISPLAY = "+91 9911066420";
const PHONE_TEL = "tel:+919911066420";
const WHATSAPP_URL = "https://wa.me/919911066420";

// Add id="contact-form" to your form section so this button scrolls to it
const FORM_ANCHOR = "#contact-form";

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F0E04]";

const facts = [
  {
    icon: Phone,
    label: "Call us",
    value: PHONE_DISPLAY,
    href: PHONE_TEL,
  },
  {
    icon: MapPin,
    label: "Where we work",
    value: "Noida & Delhi NCR",
  },
  {
    icon: Clock,
    label: "Studio hours",
    value: "10 AM to 7 PM",
  },
];

export default function ContactHeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="relative isolate overflow-hidden bg-[#1F0E04]"
    >
      {/* Background image: next/image so it loads early and at the right size */}
      <Image
        src="/banner/14.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />

      {/* Darker at the bottom where the text sits, lighter at the top so the photo still shows */}
   <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#292622] via-[#292622]/80 via-45% to-[#292622]/10 md:bg-gradient-to-r md:from-[#292622]/90 md:via-[#292622]/60 md:to-[#292622]/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 hidden h-56 bg-gradient-to-t from-[#292622]/85 to-transparent md:block"
      />

      <div className="mx-auto flex min-h-[34rem] w-full max-w-[1200px] flex-col justify-between px-5 pb-8 pt-5 sm:min-h-[36rem] sm:px-8 md:pt-20 lg:min-h-[70svh] lg:px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-white/70">
            <li>
              <Link
                href="/"
                className={`rounded-sm transition-colors hover:text-[#dba343] ${ring}`}
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#E3B352]">
              Contact
            </li>
          </ol>
        </nav>

        {/* Main content: one reveal, left aligned */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-3 max-w-3xl"
        >
          <h1
            id="contact-hero-heading"
            className="font-heading text-[38px] font-medium leading-[1.08] text-white sm:text-5xl lg:text-[64px]"
          >
            Let&rsquo;s create your dream space
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-white/80 md:text-lg">
            Whether you&rsquo;re planning a complete home transformation or
            looking for expert interior guidance, tell us about your space and
            we&rsquo;ll take it from there.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={FORM_ANCHOR}
              className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#dba343] px-7 text-[15px] font-semibold text-[#1F0E04] transition-colors duration-300 hover:bg-[#E3B352] ${ring}`}
            >
              Send an enquiry
              <ArrowDown
                size={17}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none"
              />
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-white/40 px-7 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-white/10 ${ring}`}
            >
              <MessageCircle size={17} aria-hidden="true" />
              Chat on WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </motion.div>

        {/* Quick facts */}
        <ul className="mt-14 grid gap-5 border-t border-white/20 pt-6 sm:grid-cols-3 sm:gap-8">
          {/* {facts.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#dba343]/60 text-[#E3B352]"
              >
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-sm text-white/65">{label}</p>
                {href ? (
                  <a
                    href={href}
                    className={`rounded-sm text-base font-medium text-white underline decoration-[#dba343] decoration-1 underline-offset-4 transition-colors hover:text-[#E3B352] ${ring}`}
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-base font-medium text-white">{value}</p>
                )}
              </div>
            </li>
          ))} */}
        </ul>
      </div>
    </section>
  );
}