"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Pause, Phone, Play } from "lucide-react";

/*
  Palette: Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED | Soft Beige #E8DED0 | Charcoal #292622 | White

  What's better
  - Words come first on phones (the action is what matters), the video follows. On desktop: words left, video right.
  - The video has a Pause / Play button, and starts paused if the visitor has "reduce motion" turned on.
    (Moving video that can't be stopped is hard for some people and drains phone batteries.)
  - Stats sit in one clean row with a divider; one big primary button, plus Call and WhatsApp for people who'd rather talk.
  - The video is framed in the site's arch shape on a white card; no dark overlays anywhere.
*/

const PHONE_DISPLAY = "+91 88266 06869";
const PHONE_TEL = "tel:+918826606869";
const WHATSAPP_URL = "https://wa.me/918826606869";

const STATS = [
  { value: "20+", label: "Projects" },
  { value: "10", label: "Years" },
  { value: "45", label: "Day Delivery" },
];

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function CTA() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  // Respect "reduce motion": start paused
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <section className="bg-[#F7F3ED] py-12 md:py-16 lg:py-24" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-sm border border-[#E8DED0] bg-white shadow-[0_30px_70px_-40px_rgba(89,55,25,0.45)]">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[3px] bg-[#C18A35]" />

          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            {/* Words */}
            <div className="px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-20 xl:px-20">
              <p className="font-body flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#C18A35]">
                <span className="h-px w-10 bg-[#C18A35]" aria-hidden="true" />
                Start Your Project
              </p>

              <h2 id="cta-heading" className="font-heading mt-6 text-4xl leading-[1.06] text-[#292622] sm:text-5xl xl:text-6xl">
                Let&rsquo;s build
                <span className="block">
                  something <span className="text-[#C18A35]">iconic</span>
                </span>
              </h2>

              <p className="font-body mt-6 max-w-md text-base font-light leading-8 text-[#292622]/75">
                Every great structure begins with a conversation. Let&rsquo;s talk about your vision and what&rsquo;s possible.
              </p>

              {/* Stats */}
              <dl className="mt-9 grid max-w-md grid-cols-3 divide-x divide-[#E8DED0] border-y border-[#E8DED0]">
                {STATS.map((s, i) => (
                  <div key={s.label} className={`flex flex-col-reverse py-5 ${i === 0 ? "pr-3 sm:pr-5" : "px-3 sm:px-5"}`}>
                    <dt className="font-body mt-1.5 text-[11px] uppercase tracking-[0.2em] text-[#292622]/65">{s.label}</dt>
                    <dd className="font-heading text-3xl text-[#593719] sm:text-4xl">{s.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Actions */}
              <div className="mt-9">
                <Link
                  href="/contact"
                  className={`font-body group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#593719] px-8 text-xs font-medium uppercase tracking-[0.18em] text-[#F7F3ED] transition-colors duration-300 hover:bg-[#C18A35] hover:text-[#292622] sm:w-auto ${ring}`}
                >
                  Book Free Consultation
                  <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>

                <p className="font-body mt-6 text-sm text-[#292622]/65">Prefer to talk?</p>
                <div className="mt-1 flex flex-wrap gap-x-6">
                  <a href={PHONE_TEL} className={`font-body inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-[#593719] underline decoration-[#C18A35] decoration-2 underline-offset-4 transition-colors hover:text-[#C18A35] ${ring}`}>
                    <Phone size={16} aria-hidden="true" />
                    {PHONE_DISPLAY}
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`font-body inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-[#593719] underline decoration-[#C18A35] decoration-2 underline-offset-4 transition-colors hover:text-[#C18A35] ${ring}`}>
                    <MessageCircle size={16} aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Video in an arch */}
            <div className="flex items-end justify-center bg-[#F7F3ED] px-6 pb-0 pt-2 sm:px-10 lg:px-12 lg:pt-14">
              <div className="relative mb-10 aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-t-full bg-[#E8DED0] shadow-[0_24px_60px_-34px_rgba(89,55,25,0.5)] sm:mb-14 lg:mb-14 lg:max-w-none">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label="Architecture project showreel"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src="/architecture_video.mp4" type="video/mp4" />
                </video>

                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? "Pause video" : "Play video"}
                  className="absolute bottom-5 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white/95 text-[#593719] shadow-md transition-colors duration-300 hover:bg-[#593719] hover:text-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2"
                >
                  {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" className="translate-x-px" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}