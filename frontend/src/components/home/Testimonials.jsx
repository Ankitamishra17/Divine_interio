"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Phone, MessageCircle, Clock } from "lucide-react";

/*
  One review at a time, big.
  - Full-width charcoal section (no side panel). One large review in the heading font, left aligned.
  - Move with arrows, swipe, the left/right arrow keys, or the row of client initials underneath.
  - The review slides in from the direction you are going. Reduced-motion users get a plain fade.
  - Long reviews are cut off after a few lines and open in the reading sheet. The link only shows when text is really cut off.
  - No autoplay: nothing moves while someone is reading.
  - Same palette: charcoal #292622, espresso #593719, gold #C18A35, ivory #F7F3ED.
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
    name: "Aakanksha Singh",
    review: `I recently chose Living Space Decor for my home interior project, and I am genuinely impressed with the quality of their work. From the very first meeting, the team listened carefully to my ideas, understood my requirements, and suggested practical solutions that perfectly suited my home and budget. They were professional, polite, and always willing to answer my questions throughout the project.

The planning and execution were handled with great attention to detail. Every stage of the work was completed systematically, and the team ensured that the final outcome matched the design discussed during the consultation. The quality of materials, finishing, and craftsmanship was excellent, making every room look elegant and well organised. Their commitment to quality was visible in every detail, and they never compromised on workmanship.

One thing I appreciated the most was their transparency and timely communication. They kept me informed about the progress, respected the agreed timeline, and completed the work without unnecessary delays. The entire experience was smooth, stress-free, and enjoyable.

Now that the project is complete, my home looks modern, stylish, and much more functional than before. Friends and family have appreciated the beautiful interiors, and I am delighted with the transformation. Living Space Decor truly exceeded my expectations with their professionalism, creativity, and dedication. I would confidently recommend them to anyone looking for reliable home interior services. If you are planning to renovate or design your home, you can choose this company without a second thought because they genuinely care about delivering quality and customer satisfaction.`,
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

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2";
const ringWall = `${ring} focus-visible:ring-offset-[#292622]`;
const ringIvory = `${ring} focus-visible:ring-offset-[#F7F3ED]`;

const Stars = ({ className = "text-sm", color = "text-[#C18A35]" }) => (
  <span className={`tracking-[0.15em] ${color} ${className}`} role="img" aria-label="5 out of 5 stars">
    <span aria-hidden="true">★★★★★</span>
  </span>
);

const Avatar = ({ name, size = "h-10 w-10 text-lg", tone = "bg-[#593719] text-[#F7F3ED]" }) => (
  <span
    className={`flex shrink-0 items-center justify-center rounded-full font-heading font-normal ${tone} ${size}`}
    aria-hidden="true"
  >
    {name.trim().charAt(0).toUpperCase()}
  </span>
);



/* Order: long, short, short, long... so the slider never feels samey */
const ITEMS = (() => {
  const longs = prepared.filter((p) => p.long);
  const rest = prepared.filter((p) => !p.long);
  const out = [];
  let l = 0;
  let s = 0;
  while (l < longs.length || s < rest.length) {
    if (l < longs.length) out.push(longs[l++]);
    for (let k = 0; k < 2 && s < rest.length; k++) out.push(rest[s++]);
  }
  return out;
})();

/* What the big stage shows for each review */
const STAGE = ITEMS.map((t) => {
  const big = t.lead || t.paras[0] || "";
  const small = t.lead ? [t.restFirst, ...t.restParas].filter(Boolean).join(" ") : t.paras.slice(1).join(" ");
  return { big, small, short: t.short };
});

const pad = (n) => String(n).padStart(2, "0");

export default function Testimonials() {
  const reduce = useReducedMotion();
  const total = ITEMS.length;

  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const opener = useRef(null);
  const stripRef = useRef(null);
  const bigRef = useRef(null);
  const smallRef = useRef(null);
  const swipeX = useRef(null);

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [clipped, setClipped] = useState(false);
  const [reading, setReading] = useState(null); // index into ITEMS, or null
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setOpen(isOpenNow());
    const t = setInterval(() => setOpen(isOpenNow()), 60000);
    return () => clearInterval(t);
  }, []);

  const go = useCallback(
    (to, d) => {
      setDir(d ?? (to >= index ? 1 : -1));
      setIndex(((to % total) + total) % total);
    },
    [index, total]
  );
  const next = () => go(index + 1, 1);
  const prev = () => go(index - 1, -1);

  /* Keep the active initial centred in the strip (scrolls the strip only, not the page) */
  useEffect(() => {
    const box = stripRef.current;
    const btn = box?.querySelector(`[data-i="${index}"]`);
    if (!box || !btn) return;
    box.scrollTo({ left: btn.offsetLeft - box.clientWidth / 2 + btn.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  }, [index, reduce]);

  /* Does this review really get cut off? Check after it has been drawn. */
  useEffect(() => {
    const check = () => {
      const a = bigRef.current;
      const b = smallRef.current;
      setClipped(Boolean((a && a.scrollHeight > a.clientHeight + 2) || (b && b.scrollHeight > b.clientHeight + 2)));
    };
    const id = requestAnimationFrame(check);
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", check);
    };
  }, [index]);

  const onStageKey = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };
  const onSwipeStart = (e) => {
    swipeX.current = e.touches[0].clientX;
  };
  const onSwipeEnd = (e) => {
    if (swipeX.current === null) return;
    const dx = e.changedTouches[0].clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  };

  /* Reading sheet */
  const openReview = (el) => {
    opener.current = el;
    setReading(index);
  };
  const closeReview = () => {
    const last = reading;
    setReading(null);
    if (last !== null && last !== index) setIndex(last);
    requestAnimationFrame(() => opener.current?.focus?.({ preventScroll: true }));
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

  const t = ITEMS[index];
  const st = STAGE[index];
  const r = reading !== null ? ITEMS[reading] : null;

  const iconBtn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#593719]/40 text-[#593719] transition-colors duration-300 hover:bg-[#593719] hover:text-[#F7F3ED]";
  const arrowBtn = `flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#F7F3ED]/35 text-[#F7F3ED] transition-colors duration-300 hover:border-[#C18A35] hover:text-[#C18A35] ${ringWall}`;

  const slideVariants = {
    enter: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 48 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -48 }),
  };

  return (
    <section className="bg-[#292622] py-16 md:py-20 lg:py-28" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        {/* Heading + rating */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2
            id="testimonials-heading"
            className="max-w-3xl font-heading text-4xl font-normal leading-[1.1] tracking-wide text-[#F7F3ED] sm:text-5xl lg:text-6xl"
          >
            Loved by homeowners across NCR
          </h2>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[#F7F3ED]/75">
            <span className="font-heading text-2xl text-[#F7F3ED]">5.0</span>
            <Stars className="text-base" />
            <span>from {total} client reviews</span>
          </p>
        </div>

        {/* Stage */}
        <div
          className="mt-12 lg:mt-16"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client reviews"
          tabIndex={0}
          onKeyDown={onStageKey}
          onTouchStart={onSwipeStart}
          onTouchEnd={onSwipeEnd}
        >
          <div className="relative min-h-[23rem] overflow-hidden sm:min-h-[22rem] lg:min-h-[24rem]">
            <span aria-hidden="true" className="pointer-events-none absolute -top-4 left-0 select-none font-heading text-[140px] leading-none text-[#C18A35] sm:text-[200px]">
              “
            </span>

            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={index}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0.2 : 0.38, ease: EASE }}
                className="relative max-w-4xl pt-24 sm:pt-32"
                aria-live="polite"
              >
                <p
                  ref={bigRef}
                  className={`font-heading font-normal leading-[1.2] text-[#F7F3ED] ${
                    st.short
                      ? "text-[34px] sm:text-5xl lg:text-6xl"
                      : "line-clamp-4 text-[26px] sm:text-4xl lg:text-[44px]"
                  }`}
                >
                  {st.big}
                </p>
                {st.small && (
                  <p ref={smallRef} className="mt-6 line-clamp-3 max-w-[62ch] text-base leading-[1.8] text-[#F7F3ED]/70 sm:text-[17px]">
                    {st.small}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Author + controls */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-5 border-t border-[#F7F3ED]/15 pt-8">
            <div className="flex items-center gap-4">
              <Avatar name={t.name} size="h-12 w-12 text-xl" tone="bg-[#C18A35] text-[#292622]" />
              <div>
                <p className="text-base font-medium text-[#F7F3ED]">{titleCase(t.name)}</p>
                <Stars className="text-[13px]" />
              </div>
              {clipped && (
                <button
                  type="button"
                  onClick={(e) => openReview(e.currentTarget)}
                  className={`ml-2 inline-flex min-h-11 items-center text-sm font-semibold text-[#C18A35] underline decoration-[#C18A35]/60 decoration-2 underline-offset-[6px] transition-colors hover:text-[#F7F3ED] ${ringWall}`}
                >
                  Read full review
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm tabular-nums text-[#F7F3ED]/70">
                {pad(index + 1)} <span className="text-[#F7F3ED]/40">/ {pad(total)}</span>
              </p>
              <button type="button" aria-label="Previous review" onClick={prev} className={arrowBtn}>
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" aria-label="Next review" onClick={next} className={arrowBtn}>
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Jump to any client */}
          <div
            ref={stripRef}
            className="relative -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 py-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {ITEMS.map((x, i) => {
              const active = i === index;
              return (
                <button
                  key={`${x.name}-${i}`}
                  type="button"
                  data-i={i}
                  onClick={() => go(i)}
                  aria-label={`Review ${i + 1} of ${total}, ${titleCase(x.name)}`}
                  aria-current={active ? "true" : undefined}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-heading text-lg transition-colors duration-300 ${
                    active
                      ? "border-[#C18A35] bg-[#C18A35] text-[#292622]"
                      : "border-[#F7F3ED]/25 text-[#F7F3ED]/75 hover:border-[#C18A35] hover:text-[#C18A35]"
                  } ${ringWall}`}
                >
                  {x.name.trim().charAt(0).toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact: slim row */}
        <div className="mt-16 flex flex-col gap-6 border-t border-[#F7F3ED]/15 pt-10 md:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-heading text-2xl font-normal leading-[1.2] tracking-wide text-[#F7F3ED] sm:text-3xl">
              Looking for interior designers in Noida?
            </h3>
            <p className="mt-3 flex items-center gap-2.5 text-sm text-[#F7F3ED]/75" role="status">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                {open && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C18A35] opacity-60 motion-reduce:animate-none" />
                )}
                <span className={`relative h-2 w-2 rounded-full ${open ? "bg-[#C18A35]" : "bg-[#F7F3ED]/40"}`} />
              </span>
              <Clock size={15} className="shrink-0 text-[#C18A35]" aria-hidden="true" />
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
              className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-sm bg-[#C18A35] px-6 text-[15px] font-semibold text-[#292622] transition-colors duration-300 hover:bg-[#F7F3ED] ${ringWall}`}
            >
              <Phone size={17} aria-hidden="true" />
              Call {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-sm border border-[#F7F3ED]/50 px-6 text-[15px] font-semibold text-[#F7F3ED] transition-colors duration-300 hover:border-[#C18A35] hover:text-[#C18A35] ${ringWall}`}
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
              className="relative flex max-h-[92dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-sm bg-[#F7F3ED] text-[#292622] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:rounded-sm"
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#C18A35]" />

              <div className="flex items-center gap-4 border-b border-[#593719]/15 px-6 pb-5 pt-8 sm:px-10">
                <Avatar name={r.name} size="h-12 w-12 text-xl" />
                <div className="min-w-0">
                  <p className="truncate text-base font-medium">{titleCase(r.name)}</p>
                  <Stars />
                </div>
                <button ref={closeRef} type="button" onClick={closeReview} aria-label="Close review" className={`ml-auto shrink-0 ${iconBtn} ${ringIvory}`}>
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div data-scroll className="flex-1 overflow-y-auto overscroll-contain px-6 py-8 sm:px-10">
                {r.lead && <p className="font-heading text-[26px] font-normal leading-[1.25] sm:text-[32px]">{r.lead}</p>}
                <div className={`max-w-[62ch] space-y-5 text-base leading-[1.85] text-[#292622]/85 sm:text-[17px] ${r.lead ? "mt-7" : ""}`}>
                  {r.restFirst && <p>{r.restFirst}</p>}
                  {r.restParas.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-[#593719]/15 px-6 py-4 sm:px-10">
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
                  className={`inline-flex min-h-11 items-center gap-2 rounded-sm bg-[#593719] px-4 text-sm font-semibold text-[#F7F3ED] transition-colors hover:bg-[#C18A35] hover:text-[#292622] sm:px-5 ${ringIvory}`}
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