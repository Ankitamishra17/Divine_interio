"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Phone, MessageCircle, Clock } from "lucide-react";

/*
  "Swatch" board in charcoal only. Every review is a tile in a different shade of charcoal
  or off-white, like a mood board of finishes. No brown and no gold anywhere.
  - One big featured quote , a gold rating tile, then reviews at two heights.
  - Short reviews show in full. Taller tiles clip with a fade and open in the reading sheet.
    The "Read full review" link shows only when the text really is cut off, and the whole tile is tappable.
  - 6 reviews first, then "Show all". Single column on phones.
  The original text in `testimonials` is never changed; tidying is display-only.
*/

const testimonials = [
  {
    name: "Sanya Dua",
    review: `This was our second project with Divine Interio. Took care of all our requirements and delivered the project meeting all the aspects despite some unforeseen hurdles. Onsite team executed the task quite efficiently. They adhered to the agreed timeline and budget without compromising on quality. The coordination with various contractors and suppliers was handled efficiently, making the entire process stress-free for me.

Final Outcome: The end result was breathtaking. The transformation of my space has not only enhanced its visual appeal but also its functionality. The design reflects my personality, and every room has its unique charm, thanks to the thoughtful touches by Divine Interio.

Conclusion: I wholeheartedly recommend Divine Interio to anyone looking to transform their space. Their commitment to excellence, combined with their skill in interior design, makes them a top choice for any design project. Thank you, Divine Interio, for making my home a beautiful reflection of me.`,
  },
  {
    name: "Saksham Sharma",
    review: `Why Choosing This Construction Team Was the Best Decision We Ever Made
​When embarking on a major construction project, the mixture of excitement and anxiety is almost palpable. A building isn’t just a collection of concrete, steel, and glass; it is a manifestation of a vision, a significant financial investment, and the backdrop for future memories or business milestones. Finding a contractor who respects that reality is rare. Finding one that elevates the entire process into a seamless, masterfully executed experience is nothing short of extraordinary.
​That is exactly what we found with this exceptional construction team. From our very first consultation to the final walkthrough, they did not just build a structure—they built a standard for what elite craftsmanship and professional integrity should look like.

They listened intently to our ideas, seamlessly collaborating with our architects. Instead of shutting down ambitious design concepts, their engineers found creative, cost-effective solutions to bring them to life.

I really appreciate the hardwork and making some people dream cum true on their budget

Thank you team divine keep up the good work.`,
  },

  {
    name: "Jyoti Yadav",
    review: `They have made our home very beautiful and elegant they have given us the handover on time as per commitment, I do recommend please take their service they are excellent, thankyou so much Divine Interio for this best experience. Truly Appreciable!!!!!!!!!!!!!!`,
  },
  { name: "ritu arya", review: `AMAZING WORK , GOOD SERVICE` },
  { name: "Bhavya Vinayak", review: `Excellent and quality work done` },
  { name: "dedha king", review: `Thanks for the great handover on time 😊` },
  { name: "Kartik Dua", review: `Changed our way of living.. economical yet stylish` },
  { name: "Suresh Kumar", review: `They are hard working and providing good quality in work .` },
  {
    name: "Usama Shakeel",
    review: `Creative people. They cooperate well with customers.
Satisfactory.`,
  },
  { name: "Sanil Chawla", review: `Innovative work with fair prices, best deal anyone can get.` },
  { name: "prateek kapoor", review: `Divine interio team is really great at work. I loved the interiors done by them for my residence.` },
  {
    name: "Anant Maheshwari",
    review: `Where do i even begin with how Incredible Divine Interio? Just got my home interior designed by them and they made it so amazing.`,
  },
  {
    name: "Ambrish Dhawan",
    review: `I love the experience to be associated with this company the Guys are just awesome. And the way they deliver services that is unique professional and time bound.`,
  },
  {
    name: "Stuti Arya",
    review: `Amazing work done by Divine Interio.! Co-operative Staff and they do fulfill all the commitments on time.! What they show in Graphics they will give u as the same.!
So happy with the work and will appreciate the team efforts.!👏`,
  },
];

const EASE = [0.22, 1, 0.36, 1];
const PHONE_DISPLAY = "+91 9911066420";
const PHONE_TEL = "+919911066420";
const WHATSAPP = "919911066420";

const titleCase = (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const firstSentence = (s) => {
  const m = s.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : s).trim();
};

/* Display-only tidying: the source text above stays as written */
const tidy = (s) => {
  let t = s.replace(/[\u200b\u200c\u200d\ufeff]/g, "").trim();
  if (/[A-Z]/.test(t) && t === t.toUpperCase()) {
    t = t.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, a, b) => a + b.toUpperCase());
  }
  return t.replace(/\s+([,.!?])/g, "$1").replace(/([!?.])\1{2,}/g, "$1");
};
const paragraphs = (s) => s.split(/\n+/).map(tidy).filter(Boolean);

/* Prepare once: lead line (shown large) + the rest */
const prepared = testimonials.map((t) => {
  const paras = paragraphs(t.review);
  const words = paras.join(" ").split(/\s+/).length;
  const first = paras[0] || "";
  const lead = firstSentence(first);
  const hasLead = lead.length <= 150;
  return {
    name: t.name,
    words,
    short: words <= 22,
    long: words > 60,
    paras,
    lead: hasLead ? lead : null,
    restFirst: hasLead ? first.slice(lead.length).trim() : first,
    restParas: paras.slice(1),
    full: paras.join(" "),
  };
});

/* Open / closed in Indian time, so it is right for visitors anywhere */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour").value) % 24;
  return hour >= 10 && hour < 19;
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292622] focus-visible:ring-offset-2";
const ringWall = `${ring} focus-visible:ring-offset-[#292622]`;
const ringIvory = `${ring} focus-visible:ring-offset-[#F5F5F4]`;
const ringLight = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F4] focus-visible:ring-offset-2";
const ringBeige = `${ring} focus-visible:ring-offset-[#E7E6E4]`;

const Stars = ({ className = "text-sm", color = "text-[#292622]" }) => (
  <span className={`tracking-[0.15em] ${color} ${className}`} role="img" aria-label="5 out of 5 stars">
    <span aria-hidden="true">★★★★★</span>
  </span>
);

const Avatar = ({ name, size = "h-10 w-10 text-lg", tone = "bg-[#292622] text-[#F5F5F4]" }) => (
  <span
    className={`flex shrink-0 items-center justify-center rounded-full font-heading font-normal ${tone} ${size}`}
    aria-hidden="true"
  >
    {name.trim().charAt(0).toUpperCase()}
  </span>
);




const FEATURED = prepared.find((p) => p.name === "Kartik Dua") || prepared[0];
const others = prepared.filter((p) => p !== FEATURED);
const shorts = others.filter((p) => p.short);
const talls = others.filter((p) => !p.short);

/* Order: short, tall, short, repeating, so every row of three has one big tile */
const REST = (() => {
  const out = [];
  let s = 0;
  let t = 0;
  while (s < shorts.length || t < talls.length) {
    if (s < shorts.length) out.push(shorts[s++]);
    if (t < talls.length) out.push(talls[t++]);
    if (s < shorts.length) out.push(shorts[s++]);
  }
  return out;
})();
const ALL = [FEATURED, ...REST]; // reading-sheet order
const INITIAL = 6;

const TONES = {
  ivory: {
    bg: "bg-[#FAFAF9]",
    text: "text-[#292622]",
    sub: "text-[#292622]/75",
    line: "border-[#292622]/15",
    star: "text-[#292622]",
    mark: "text-[#292622]/30",
    avatar: "bg-[#292622] text-[#F5F5F4]",
    link: "text-[#292622] decoration-[#292622]/50 hover:decoration-[#292622]",
    ring: ringIvory,
  },
  charcoal: {
    bg: "bg-[#292622]",
    text: "text-[#F5F5F4]",
    sub: "text-[#F5F5F4]/75",
    line: "border-[#F5F5F4]/20",
    star: "text-[#F5F5F4]",
    mark: "text-[#F5F5F4]/40",
    avatar: "bg-[#F5F5F4] text-[#292622]",
    link: "text-[#F5F5F4] decoration-[#F5F5F4]/50 hover:decoration-[#F5F5F4]",
    ring: `${ringLight} focus-visible:ring-offset-[#292622]`,
  },
  espresso: {
 bg: "bg-[#292622]",
    text: "text-[#F5F5F4]",
    sub: "text-[#F5F5F4]/75",
    line: "border-[#F5F5F4]/20",
    star: "text-[#F5F5F4]",
    mark: "text-[#F5F5F4]/40",
    avatar: "bg-[#F5F5F4] text-[#292622]",
    link: "text-[#F5F5F4] decoration-[#F5F5F4]/50 hover:decoration-[#F5F5F4]",
    ring: `${ringLight} focus-visible:ring-offset-[#292622]`,
  },
};
/* (the "espresso" tone key is just the deepest charcoal, kept so the featured tile call is unchanged) */
const CYCLE = ["ivory", "charcoal", "ivory", "charcoal", "ivory", "charcoal"];

const MASK = {
  WebkitMaskImage: "linear-gradient(to bottom,#000 72%,transparent)",
  maskImage: "linear-gradient(to bottom,#000 72%,transparent)",
};

/* One tile. Measures its own text so the link only shows when text is really cut off. */
function Tile({ t, index, tone, onOpen, featured = false }) {
  const k = TONES[tone];
  const bodyRef = useRef(null);
  const [clipped, setClipped] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const check = () => setClipped(el.scrollHeight > el.clientHeight + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <li
      data-i={index}
      className={`relative flex flex-col rounded-sm p-7 sm:p-8 ${k.bg} ${k.text} ${featured ? "min-h-[18rem] justify-between" : "h-full"} ${clipped ? "cursor-pointer" : ""}`}
    >
      <span aria-hidden="true" className={`block h-7 select-none font-heading text-[56px] leading-[0.8] ${k.mark}`}>
        “
      </span>

      <div
        ref={bodyRef}
        className={featured ? "mt-4" : "mt-4 max-h-[13rem] flex-1 overflow-hidden"}
        style={clipped && !featured ? MASK : undefined}
      >
        {featured ? (
          <p className="font-heading text-[32px] font-normal leading-[1.15] sm:text-5xl lg:text-6xl">{t.full}</p>
        ) : t.short ? (
          <p className="font-heading text-[30px] font-normal leading-[1.25]">{t.full}</p>
        ) : (
          <>
            {t.lead && <p className="font-heading text-[22px] font-normal leading-[1.3]">{t.lead}</p>}
            <div className={`space-y-3 text-[15px] leading-[1.75] ${k.sub} ${t.lead ? "mt-3" : ""}`}>
              {t.restFirst && <p>{t.restFirst}</p>}
              {t.restParas.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={`mt-5 flex items-center justify-between gap-3 border-t pt-5 ${k.line}`}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={t.name} size="h-10 w-10 text-lg" tone={k.avatar} />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium">{titleCase(t.name)}</p>
            <Stars className="text-[12px]" color={k.star} />
          </div>
        </div>
        {clipped && !featured && (
          <button
            type="button"
            onClick={(e) => onOpen(index, e.currentTarget)}
            aria-label={`Read full review by ${titleCase(t.name)}`}
            className={`inline-flex min-h-11 shrink-0 items-center text-sm font-semibold underline decoration-2 underline-offset-[6px] transition-colors after:absolute after:inset-0 after:content-[''] ${k.link} ${k.ring}`}
          >
            Read full review
          </button>
        )}
      </div>
    </li>
  );
}

export default function Testimonials() {
  const reduce = useReducedMotion();
  const total = ALL.length;

  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const opener = useRef(null);
  const touchX = useRef(null);

  const [reading, setReading] = useState(null);
  const [open, setOpen] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setOpen(isOpenNow());
    const t = setInterval(() => setOpen(isOpenNow()), 60000);
    return () => clearInterval(t);
  }, []);

  const shown = expanded ? REST : REST.slice(0, INITIAL);

  const toggle = () => {
    if (expanded) sectionRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setExpanded((v) => !v);
  };

  const openReview = (i, el) => {
    opener.current = el || opener.current;
    setReading(i);
  };
  const closeReview = () => {
    const last = reading;
    setReading(null);
    requestAnimationFrame(() => {
      const li = listRef.current?.querySelector(`[data-i="${last}"]`);
      if (li) {
        li.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
        (li.querySelector("button") || opener.current)?.focus?.({ preventScroll: true });
      } else {
        opener.current?.focus?.();
      }
    });
  };
  const step = (d) => setReading((r) => (r + d + total) % total);

  const isOpen = reading !== null;
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);
  useEffect(() => {
    if (reading !== null) dialogRef.current?.querySelector("[data-scroll]")?.scrollTo({ top: 0 });
  }, [reading]);

  const onDialogKey = (e) => {
    if (e.key === "Escape") return closeReview();
    if (e.key === "ArrowRight") return step(1);
    if (e.key === "ArrowLeft") return step(-1);
    if (e.key === "Tab") {
      const f = dialogRef.current.querySelectorAll("button, a[href]");
      const a = f[0];
      const z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    }
  };
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 70) step(dx < 0 ? 1 : -1);
  };

  const r = reading !== null ? ALL[reading] : null;
  const iconBtn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#292622]/40 text-[#292622] transition-colors duration-300 hover:bg-[#292622] hover:text-[#F5F5F4]";

  return (
    <section ref={sectionRef} className="scroll-mt-4 bg-[#fff] py-16 md:py-20 lg:py-28" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <h2
          id="testimonials-heading"
          className="max-w-5xl text-balance font-heading text-4xl font-normal leading-[1.1] tracking-wide text-[#292622] sm:text-5xl lg:text-6xl"
        >
          Loved by homeowners across NCR
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-[2fr_1fr] lg:mt-14">
          <ul className="contents">
            <Tile t={FEATURED} index={0} tone="espresso" featured onOpen={openReview} />
          </ul>
          <div className="flex min-h-[15rem] flex-col justify-between rounded-sm bg-[#3A3632] p-7 text-[#F5F5F4] sm:p-8">
            <Stars className="text-xl" color="text-[#F5F5F4]" />
            <div>
              <p className="font-heading text-[80px] font-normal leading-none">5.0</p>
              <p className="mt-3 text-[15px] font-medium">from {total} client reviews</p>
            </div>
          </div>
        </div>

        <ul ref={listRef} id="review-grid" className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((t, i) => (
            <Tile key={t.name} t={t} index={ALL.indexOf(t)} tone={CYCLE[i % CYCLE.length]} onOpen={openReview} />
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={expanded}
            aria-controls="review-grid"
            className={`inline-flex min-h-12 w-full items-center justify-center rounded-sm border border-[#292622] px-8 text-[15px] font-semibold text-[#292622] transition-colors duration-300 hover:bg-[#292622] hover:text-[#F5F5F4] sm:w-auto ${ringBeige}`}
          >
            {expanded ? "Show fewer reviews" : `Show all ${total} reviews`}
          </button>
        </div>

        {/* Contact: slim row */}
        <div className="mt-16 flex flex-col gap-6 border-t border-[#292622]/25 pt-10 md:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-heading text-2xl font-normal leading-[1.2] tracking-wide text-[#292622] sm:text-3xl">
              Looking for interior designers in Noida?
            </h3>
            <p className="mt-3 flex items-center gap-2.5 text-sm text-[#292622]/75" role="status">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                {open && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#292622] opacity-50 motion-reduce:animate-none" />
                )}
                <span className={`relative h-2 w-2 rounded-full ${open ? "bg-[#292622]" : "bg-[#292622]/40"}`} />
              </span>
              <Clock size={15} className="shrink-0 text-[#292622]" aria-hidden="true" />
              {open === null
                ? "Free consultation. Open every day, 10 AM to 7 PM"
                : open
                ? "Free consultation. Open now, until 7 PM"
                : "Free consultation. Closed now, open every day 10 AM to 7 PM"}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${PHONE_TEL}`}
              className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-sm bg-[#292622] px-6 text-[15px] font-semibold text-[#F5F5F4] transition-colors duration-300 hover:bg-[#3A3632] ${ringBeige}`}
            >
              <Phone size={17} aria-hidden="true" />
              Call {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-sm border border-[#292622]/50 px-6 text-[15px] font-semibold text-[#292622] transition-colors duration-300 hover:border-[#292622] hover:bg-[#292622] hover:text-[#F5F5F4] ${ringBeige}`}
            >
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      {/* Reading sheet */}
      <AnimatePresence>
        {r && (
          <motion.div
            key="overlay"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#292622]/90 sm:items-center sm:p-6"
            onMouseDown={(e) => e.target === e.currentTarget && closeReview()}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`Review by ${titleCase(r.name)}`}
              onKeyDown={onDialogKey}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative flex max-h-[92dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-sm bg-[#F5F5F4] text-[#292622] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:rounded-sm"
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#292622]" />

              <div className="flex items-center gap-4 border-b border-[#292622]/15 px-6 pb-5 pt-8 sm:px-10">
                <Avatar name={r.name} size="h-12 w-12 text-xl" />
                <div className="min-w-0">
                  <p className="truncate text-base font-medium">{titleCase(r.name)}</p>
                  <Stars />
                </div>
                <button ref={closeRef} type="button" onClick={closeReview} aria-label="Close review" className={`ml-auto shrink-0 ${iconBtn} ${ringIvory}`}>
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div data-scroll onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="flex-1 overflow-y-auto overscroll-contain px-6 py-8 sm:px-10">
                {r.lead && <p className="font-heading text-[26px] font-normal leading-[1.25] sm:text-[32px]">{r.lead}</p>}
                <div className={`max-w-[62ch] space-y-5 text-base leading-[1.85] text-[#292622]/85 sm:text-[17px] ${r.lead ? "mt-7" : ""}`}>
                  {r.restFirst && <p>{r.restFirst}</p>}
                  {r.restParas.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-[#292622]/15 px-6 py-4 sm:px-10">
                <div className="flex items-center gap-3">
                  <button type="button" aria-label="Previous review" onClick={() => step(-1)} className={`${iconBtn} ${ringIvory}`}>
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <button type="button" aria-label="Next review" onClick={() => step(1)} className={`${iconBtn} ${ringIvory}`}>
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                  <p className="text-sm tabular-nums text-[#292622]/60" aria-live="polite">
                    {reading + 1} of {total}
                  </p>
                </div>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-sm bg-[#292622] px-4 text-sm font-semibold text-[#F5F5F4] transition-colors hover:bg-[#3A3632] hover:text-[#F5F5F4] sm:px-5 ${ringIvory}`}
                >
                  <Phone size={15} aria-hidden="true" />
                  <span className="sm:hidden">Call us</span>
                  <span className="hidden sm:inline">Book a free consultation</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}