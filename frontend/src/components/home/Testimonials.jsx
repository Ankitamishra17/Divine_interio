"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Phone, MessageCircle, Clock } from "lucide-react";

/*
  Palette (unchanged)
  Charcoal #292622 (wall) | Espresso #593719 (contact panel) | Warm Gold #C18A35 (accents)
  Ivory #F7F3ED (featured card, reading window) | Beige #E8DED0

  New layout: list + featured review.
  - Desktop: a vertical list of client names on the left, one large ivory review on the right.
    Pick a name (or use the arrows) and the review changes. A gold line marks the selected name.
  - Phones: the names become a swipeable strip above the review.
  - Read: "Read full review" opens the same ivory reading sheet. Esc closes, arrows step through reviews.
  - Act: contact panel below, with live open/closed status.
*/

const testimonials = [
  {
    name: "Rohan Singh",
    review: `We recently got our home interiors done by Living Space Decor and had a really good experience with their team. From the initial discussion, they listened carefully to what we wanted and suggested designs that suited our space, style, and budget.

The team helped us plan each area properly, including the kitchen, wardrobes, and other spaces. We especially liked the attention given to small details and how the final design made our home look more organised and spacious.

The work was completed professionally, and the team kept us updated during the project. Whenever we had questions or wanted to make changes, they were approachable and explained things clearly. The quality of the materials and finishing was also good.

Overall, we are happy with how our home turned out. Living Space Decor did a great job of creating a modern and practical interior that works well for our family. We would recommend them to anyone looking for reliable home interior designers and interior design services.`,
  },
  {
    name: "Aditi Kaptiyal",
    review: `I had a wonderful experience with Living Space Decor, and I am extremely happy with the final outcome of my home interior project. From the very beginning, the team was professional, friendly, and genuinely interested in understanding my ideas and requirements. They patiently listened to my preferences and provided practical suggestions that enhanced the overall design while keeping everything functional and elegant. Their experience and attention to detail gave me complete confidence throughout the project.

The planning process was smooth and well organised. Every area of my home was thoughtfully designed to maximise space and create a comfortable, modern living environment. The quality of materials, finishing, and craftsmanship was excellent, and every detail reflected their commitment to delivering high standards. The team worked efficiently and ensured that each stage of the project was completed with precision and care.

What impressed me the most was their transparency, communication, and dedication to customer satisfaction. They kept me informed about the progress, completed the work within the promised timeline, and handled every request with patience and professionalism. There were no unnecessary delays, and the entire experience was stress-free.

The final result has completely transformed my home into a stylish, functional, and welcoming space that my family truly enjoys. Friends and relatives have appreciated the beautiful interiors and excellent finish whenever they visit. I highly recommend Living Space Decor to anyone looking for reliable and experienced home interior professionals. Their creativity, quality workmanship, and customer-first approach make them a trusted choice, and I would happily choose their services again for future projects.`,
  },
  {
    name: "Aakanksha Singh",
    review: `I recently chose Living Space Decor for my home interior project, and I am genuinely impressed with the quality of their work. From the very first meeting, the team listened carefully to my ideas, understood my requirements, and suggested practical solutions that perfectly suited my home and budget. They were professional, polite, and always willing to answer my questions throughout the project.

The planning and execution were handled with great attention to detail. Every stage of the work was completed systematically, and the team ensured that the final outcome matched the design discussed during the consultation. The quality of materials, finishing, and craftsmanship was excellent, making every room look elegant and well organised. Their commitment to quality was visible in every detail, and they never compromised on workmanship.

One thing I appreciated the most was their transparency and timely communication. They kept me informed about the progress, respected the agreed timeline, and completed the work without unnecessary delays. The entire experience was smooth, stress-free, and enjoyable.

Now that the project is complete, my home looks modern, stylish, and much more functional than before. Friends and family have appreciated the beautiful interiors, and I am delighted with the transformation. Living Space Decor truly exceeded my expectations with their professionalism, creativity, and dedication. I would confidently recommend them to anyone looking for reliable home interior services. If you are planning to renovate or design your home, you can choose this company without a second thought because they genuinely care about delivering quality and customer satisfaction.`,
  },
  {
    name: "SHOURYA",
    review: `I recently got my home interiors completed by Living Space Decor, and I am extremely happy with the overall experience. From the beginning, the team was professional, organised, and committed to delivering quality work. They carefully understood my requirements and provided creative ideas that perfectly matched my expectations while making the best use of the available space.

The entire project was completed in a systematic manner, and every detail was executed with precision. The finishing quality, material selection, and overall craftsmanship were excellent. Every area of my home now looks modern, elegant, and well planned. It is clear that the team pays close attention to detail and focuses on delivering high-quality results.

What impressed me the most was their punctuality and commitment to deadlines. They completed the project on time and kept me informed throughout every stage of the process. Their communication was clear, and they responded to all my queries with patience and professionalism. There were no surprises during the project, and everything was completed exactly as promised. The final outcome has completely transformed my home into a beautiful and comfortable living space. I appreciate the team's dedication, creativity, and customer-first approach. If anyone is looking for reliable interior designers who deliver excellent quality, modern designs, and timely service, I would highly recommend Living Space Decor. It was truly a wonderful experience, and I would happily choose them again for future projects.`,
  },
  {
    name: "Dipanshu Rawat",
    review: `My experience with Living Space Decor has been excellent from start to finish. I hired them for my home interior project after hearing positive feedback, and they completely lived up to my expectations. The team was professional, experienced, and always ready to provide useful suggestions that improved both the appearance and functionality of my home.

From the planning stage to the final execution, every step was handled with care and professionalism. They understood my preferences, respected my budget, and created a design that perfectly suited my lifestyle. The finishing quality, craftsmanship, and attention to detail were outstanding. Every room now looks elegant, organised, and thoughtfully designed.

Another aspect that impressed me was their commitment to completing the project on schedule. They maintained excellent communication throughout the work, provided regular updates, and ensured that everything progressed smoothly. The installation and finishing work were completed neatly without compromising on quality.`,
  },
  {
    name: "Aman Haldar",
    review: `I recently completed my home interior project with Living Space Decor, and the overall experience was excellent. From the initial consultation to the final handover, the team was professional, supportive, and highly experienced. They carefully listened to my ideas, understood my requirements, and suggested practical design solutions that perfectly suited my home. Every discussion was handled with patience, and they ensured that my preferences were included throughout the project.

The work was completed with impressive attention to detail and high-quality craftsmanship. Every area of my home was planned efficiently, making the space feel more organised, functional, and elegant. The materials, finishing, and installation quality exceeded my expectations, and every stage of the project reflected their commitment to excellence.

What impressed me the most was their professionalism and timely execution. The team maintained clear communication, provided regular updates, and completed the project within the promised timeline. They handled every request with care and ensured that the final result matched exactly what was discussed.

Now that the project is complete, my home looks modern, comfortable, and beautifully designed. Friends and family have appreciated the transformation, and I am extremely satisfied with the outcome. I highly recommend Living Space Decor to anyone looking for reliable home interior services. Their dedication, quality workmanship, and customer-focused approach truly make them a trusted choice. I would happily work with them again for future projects and confidently recommend them to anyone planning to renovate or design their home interiors.`,
  },
  {
    name: "Deepak Bainsla",
    review: `Living Space Decor transformed my home into a beautiful and functional living space, and I couldn't be happier with the results. From the beginning, the team demonstrated professionalism, creativity, and a clear understanding of my expectations. They carefully planned every area of the house and provided practical suggestions that enhanced both the appearance and usability of the space.

The execution was smooth, and every detail was completed with precision and care. The finishing quality, craftsmanship, and overall design exceeded my expectations. Every room now feels more spacious, organised, and elegant. The team maintained high standards throughout the project and ensured that every aspect of the work reflected quality and attention to detail.

One of the things I appreciated most was their commitment to completing the project on time. They kept me informed about the progress, responded promptly to my questions, and maintained complete transparency throughout the entire process. Their dedication and customer service made the experience completely stress-free.

The final outcome has received many compliments from friends and family, and I am delighted with the transformation. Living Space Decor truly delivers exceptional home interior solutions with excellent craftsmanship and reliable service. I highly recommend them to anyone looking for professional interior designers who focus on quality, timely delivery, and customer satisfaction. Without a doubt, they are one of the best interior design companies in Noida, and I would gladly choose them again for future home improvement projects.`,
  },
  {
    name: "Grisha Bhardwaj",
    review: `I had a wonderful experience with Living Space Decor while planning my home interiors. From the first consultation, the team was friendly, knowledgeable, and genuinely interested in understanding my requirements. They carefully explained different design options, materials, and finishes, helping me make informed decisions without any pressure.

What impressed me most was the wide range of modern designs and thoughtful ideas they offered. Every recommendation was practical and tailored to my preferences, making the entire planning process enjoyable. The team maintained excellent communication throughout the project and ensured that every detail was executed with care and precision.

The quality of workmanship and finishing was outstanding. Every corner of my home now looks elegant, organised, and beautifully designed. The materials used were of high quality, and the installation was completed professionally without compromising on standards. The project was delivered within the agreed timeline, making the experience smooth and hassle-free.

The overall value for money was excellent, considering the quality of work and level of service provided. The team remained approachable throughout the project and handled every request with professionalism and patience. I am extremely happy with the final outcome, and my family loves the transformation. I highly recommend Living Space Decor to anyone looking for stylish, practical, and high-quality home interiors. Their creativity, attention to detail, and customer-first approach make them a reliable choice for anyone planning to redesign or renovate their home.`,
  },
  {
    name: "Vanz",
    review: `Working with Living Space Decor was an amazing experience from beginning to end. The team was professional, organised, and committed to delivering high-quality home interiors that perfectly matched my expectations. They took the time to understand my ideas, budget, and lifestyle before creating a design that was both functional and visually appealing.

Throughout the project, the team maintained excellent communication and kept me informed about every stage of the work. They completed each task with great attention to detail and ensured that the quality of workmanship remained consistently high. The finishing, materials, and overall execution exceeded my expectations, giving my home a fresh, modern, and elegant appearance.

One of the biggest advantages of working with them was their punctuality and dedication. The project was completed within the promised timeline, and every small request was handled with patience and professionalism. Their customer service made the entire process smooth and enjoyable without unnecessary stress.

The final result completely transformed my home into a comfortable and stylish living space that my family truly enjoys. I have received many compliments from visitors, and I am extremely satisfied with the quality of work delivered. I highly recommend Living Space Decor to anyone looking for reliable, experienced, and creative interior designers. Their commitment to quality, customer satisfaction, and timely delivery makes them an excellent choice for any home interior project. It was truly an amazing experience and definitely worth choosing their services.`,
  },
  {
    name: "Mohmd Shehwaz",
    review: `I recently completed my home interior project with Living Space Decor, and I am extremely satisfied with the entire experience. From the initial consultation to the final handover, the team demonstrated professionalism, creativity, and a strong commitment to quality. They carefully understood my requirements and suggested practical design ideas that perfectly suited my home and lifestyle. Every detail was planned thoughtfully, ensuring that each space was both functional and visually appealing.

The quality of workmanship was outstanding. Every room was finished with great attention to detail, and the materials used reflected their high standards. The entire project was completed neatly and efficiently, giving my home a modern, elegant, and well-organised look. Throughout the process, the team maintained clear communication and kept me updated on the progress. They completed the work within the promised timeline and handled every request with patience and professionalism.

What impressed me the most was their dedication to customer satisfaction. They paid attention to even the smallest details and ensured that the final result matched my expectations perfectly. My family and friends have appreciated the beautiful transformation, and I continue to receive compliments whenever someone visits my home.

I highly recommend Living Space Decor to anyone looking for reliable and experienced home interior professionals. Their excellent craftsmanship, timely execution, and customer-first approach truly make them stand out. In every aspect of their work, they maintain high standards of quality and professionalism. I would happily choose them again for future interior projects and confidently recommend their services to others.`,
  },
  {
    name: "Paras Pandey",
    review: `Living Space Decor has completely transformed my home, and I am delighted with the final outcome. From the first meeting, the team was friendly, professional, and focused on understanding my ideas and requirements. They suggested practical solutions that enhanced both the appearance and functionality of every room while ensuring that the design suited my lifestyle and budget.

The project was executed with excellent planning and attention to detail. Every stage of the work reflected their dedication and experience. The quality of materials, finishing, and craftsmanship exceeded my expectations, and every corner of my home now looks elegant, organised, and modern. The team worked efficiently, maintained cleanliness during the project, and ensured that everything was completed according to the agreed timeline.

One of the things I appreciated most was their transparency and commitment to customer satisfaction. They kept me informed throughout the project, responded quickly to my questions, and handled every request with professionalism. Their dedication made the entire experience smooth, enjoyable, and completely stress-free.

Now my home feels brighter, more comfortable, and beautifully designed. My family and friends have appreciated the transformation and often compliment the interiors whenever they visit. I highly recommend Living Space Decor to anyone planning a home interior project. Their professionalism, creativity, and high-quality workmanship make them a trusted choice. I am extremely happy with the results and would gladly recommend them to anyone looking for reliable and experienced interior designers who truly care about delivering exceptional work.`,
  },
  {
    name: "SHIVAM MISHRA",
    review: `I had an excellent experience with Living Space Decor for my home interior project. From the beginning, the team impressed me with their professionalism, creativity, and attention to detail. They carefully listened to my requirements, understood my vision, and provided practical suggestions that improved both the functionality and appearance of my home. Their planning process was organised, and they ensured that every design decision matched my expectations.

The execution of the project was smooth and well managed. Every room was completed with outstanding craftsmanship and premium-quality finishing. The materials used were durable, and the final result gave my home a stylish, modern, and elegant look. The team maintained excellent communication throughout the project and regularly updated me on the progress. They respected the agreed timeline and completed the work without unnecessary delays.

What I appreciated most was their commitment to delivering quality and ensuring complete customer satisfaction. They handled every small detail with care and professionalism, making the entire experience stress-free. It is clear that they take pride in their work and genuinely focus on delivering the best possible results.

I highly recommend Living Space Decor to anyone looking for professional home interior services. Their experienced team, excellent workmanship, timely delivery, and customer-focused approach make them one of the best choices for interior projects. I am completely satisfied with the transformation of my home and would happily work with them again for any future interior design or renovation requirements.`,
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
const readMinutes = (s) => Math.max(1, Math.round(s.trim().split(/\s+/).length / 200));

/* Open / closed in Indian time, so it is right for visitors anywhere */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour").value) % 24;
  return hour >= 10 && hour < 19;
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-2";
const ringWall = `${ring} focus-visible:ring-offset-[#292622]`;
const ringIvory = `${ring} focus-visible:ring-offset-[#F7F3ED]`;
const ringEspresso = `${ring} focus-visible:ring-offset-[#593719]`;

const Stars = ({ className = "text-sm" }) => (
  <span className={`tracking-[0.15em] text-[#C18A35] ${className}`} role="img" aria-label="5 out of 5 stars">
    <span aria-hidden="true">★★★★★</span>
  </span>
);

const Avatar = ({ name, size = "h-10 w-10 text-lg", tone = "bg-[#593719] text-[#F7F3ED]" }) => (
  <span
    className={`flex shrink-0 items-center justify-center rounded-full font-heading font-normal ${tone} ${size}`}
    aria-hidden="true"
  >
    {name.charAt(0).toUpperCase()}
  </span>
);

export default function Testimonials() {
  const reduce = useReducedMotion();
  const total = testimonials.length;

  const listRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const opener = useRef(null);

  const [sel, setSel] = useState(0); // review shown in the featured card
  const [reading, setReading] = useState(null); // index of the open review, or null
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setOpen(isOpenNow());
    const t = setInterval(() => setOpen(isOpenNow()), 60000);
    return () => clearInterval(t);
  }, []);

  /* Keep the selected name in view inside the list (scrolls the list only, never the page) */
  useEffect(() => {
    const list = listRef.current;
    const btn = list?.children[sel]?.firstElementChild;
    if (!list || !btn) return;
    const li = list.children[sel];
    list.scrollTo({
      left: li.offsetLeft - (list.clientWidth - li.clientWidth) / 2,
      top: li.offsetTop - (list.clientHeight - li.clientHeight) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [sel, reduce]);

  const go = (d) => setSel((s) => (s + d + total) % total);

  /* Reading sheet */
  const openReview = (i, el) => {
    opener.current = el || opener.current;
    setReading(i);
  };
  const closeReview = () => {
    if (reading !== null) setSel(reading);
    setReading(null);
    opener.current?.focus?.();
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
      // keep focus inside the sheet
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

  const r = reading !== null ? testimonials[reading] : null;
  const paras = r ? r.review.split("\n\n") : [];

  const cur = testimonials[sel];
  const curLead = firstSentence(cur.review);
  const curRest = cur.review.split("\n\n")[0].slice(curLead.length).trim();

  return (
    <section className="bg-[#292622] py-16 md:py-20 lg:py-28" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <div>
          <h2
            id="testimonials-heading"
            className="max-w-2xl font-heading text-4xl font-normal leading-[1.12] tracking-wide text-[#F7F3ED] sm:text-5xl lg:text-6xl"
          >
            Loved by homeowners across NCR
          </h2>
          <p className="mt-5 flex items-center gap-3 text-[15px] text-[#F7F3ED]/70">
            <Stars />
            Rated 5 out of 5 by {total} clients
          </p>
        </div>

        {/* List + featured review */}
        <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          {/* Names */}
          <ul
            ref={listRef}
            aria-label="Choose a client review"
            className="relative -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:order-1 lg:col-span-4 lg:mx-0 lg:max-h-[600px] lg:flex-col lg:gap-0 lg:overflow-y-auto lg:overflow-x-hidden lg:border-b lg:border-[#F7F3ED]/15 lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t, i) => {
              const active = i === sel;
              return (
                <li key={t.name} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSel(i)}
                    className={`group relative flex w-[210px] items-center gap-3 overflow-hidden rounded-sm border px-4 py-3.5 text-left transition-colors duration-300 lg:w-full lg:rounded-none lg:border-0 lg:border-t lg:border-[#F7F3ED]/15 lg:px-6 lg:py-5 ${
                      active
                        ? "border-[#C18A35]/70 bg-[#F7F3ED]/[0.07]"
                        : "border-[#F7F3ED]/15 hover:bg-[#F7F3ED]/[0.04]"
                    } ${ringWall}`}
                  >
                    {/* gold line: along the bottom on phones, down the left edge on desktop */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 hidden h-[3px] bg-[#C18A35] lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:block lg:h-auto lg:w-[3px] origin-top transition-transform duration-500 ease-out motion-reduce:transition-none ${
                        active ? "scale-y-100" : "scale-y-0"
                      }`}
                    />
                    <Avatar
                      name={t.name}
                      size="h-10 w-10 text-lg"
                      tone={active ? "bg-[#C18A35] text-[#292622]" : "bg-[#F7F3ED]/10 text-[#F7F3ED]"}
                    />
                    <span className="min-w-0">
                      <span
                        className={`block truncate text-[15px] font-medium transition-colors duration-300 ${
                          active ? "text-[#F7F3ED]" : "text-[#F7F3ED]/65 group-hover:text-[#F7F3ED]"
                        }`}
                      >
                        {titleCase(t.name)}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-[#F7F3ED]/50">{readMinutes(t.review)} min read</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Featured review */}
          <div className="relative flex min-h-[460px] flex-col overflow-hidden rounded-sm bg-[#F7F3ED] p-7 text-[#292622] sm:p-10 lg:order-2 lg:col-span-8 lg:min-h-[600px] lg:p-14">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#C18A35]" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-8 top-2 select-none font-heading text-[160px] leading-none text-[#C18A35]/25 sm:text-[200px]"
            >
              ”
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={sel}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="relative flex flex-1 flex-col"
              >
                <Stars />
                <p className="mt-6 max-w-[26ch] font-heading text-[28px] font-normal leading-[1.25] sm:text-[34px] lg:text-[40px]">
                  {curLead}
                </p>
                {curRest && (
                  <p className="mt-6 line-clamp-5 max-w-[62ch] text-base leading-[1.8] text-[#292622]/75 sm:text-[17px]">
                    {curRest}
                  </p>
                )}

                <div className="mt-auto pt-10">
                  <div className="flex items-center gap-3 border-t border-[#593719]/20 pt-6">
                    <Avatar name={cur.name} size="h-12 w-12 text-xl" />
                    <p className="min-w-0 truncate text-base font-medium">{titleCase(cur.name)}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* controls (outside the swap so they never flicker) */}
            <div className="relative mt-5 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={(e) => openReview(sel, e.currentTarget)}
                aria-label={`Read full review by ${titleCase(cur.name)}`}
                className={`inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-[#593719] underline decoration-[#C18A35] decoration-2 underline-offset-[6px] transition-colors hover:text-[#C18A35] ${ringIvory}`}
              >
                Read full review
                <span className="font-normal text-[#292622]/55 no-underline">{readMinutes(cur.review)} min read</span>
              </button>

              <div className="flex items-center gap-3">
                <p className="text-sm tabular-nums text-[#292622]/60" aria-live="polite">
                  {sel + 1} of {total}
                </p>
                {[
                  { label: "Previous review", dir: -1, Icon: ChevronLeft },
                  { label: "Next review", dir: 1, Icon: ChevronRight },
                ].map(({ label, dir, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    onClick={() => go(dir)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#593719]/40 text-[#593719] transition-colors duration-300 hover:bg-[#593719] hover:text-[#F7F3ED] ${ringIvory}`}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact panel */}
        <div className="mt-16 grid gap-8 rounded-sm bg-[#593719] px-6 py-9 sm:px-10 sm:py-11 md:mt-20 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14">
          <div>
            <h3 className="max-w-xl font-heading text-3xl font-normal leading-[1.2] tracking-wide text-[#F7F3ED] sm:text-4xl">
              Looking for interior designers in Noida?
            </h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#F7F3ED]/80">
              Book a free consultation and we will plan your home with you, room by room.
            </p>
            <p className="mt-6 flex items-center gap-2.5 text-sm text-[#F7F3ED]/80" role="status">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                {open && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C18A35] opacity-60 motion-reduce:animate-none" />
                )}
                <span className={`relative h-2 w-2 rounded-full ${open ? "bg-[#C18A35]" : "bg-[#F7F3ED]/40"}`} />
              </span>
              <Clock size={15} className="text-[#C18A35]" aria-hidden="true" />
              {open === null
                ? "Open every day, 10 AM to 7 PM"
                : open
                ? "Open now, until 7 PM"
                : "Closed now. Open every day, 10 AM to 7 PM"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <a
              href={`tel:${PHONE_TEL}`}
              className={`inline-flex min-h-14 items-center justify-center gap-2.5 rounded-sm bg-[#C18A35] px-7 text-[15px] font-semibold text-[#292622] transition-colors duration-300 hover:bg-[#F7F3ED] ${ringEspresso}`}
            >
              <Phone size={17} aria-hidden="true" />
              Call {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-14 items-center justify-center gap-2.5 rounded-sm border border-[#F7F3ED]/50 px-7 text-[15px] font-semibold text-[#F7F3ED] transition-colors duration-300 hover:border-[#C18A35] hover:text-[#C18A35] ${ringEspresso}`}
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

              {/* Header */}
              <div className="flex items-center gap-4 border-b border-[#593719]/15 px-6 pb-5 pt-8 sm:px-10">
                <Avatar name={r.name} size="h-12 w-12 text-xl" />
                <div className="min-w-0">
                  <p className="truncate text-base font-medium">{titleCase(r.name)}</p>
                  <Stars />
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeReview}
                  aria-label="Close review"
                  className={`ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#593719]/40 text-[#593719] transition-colors hover:bg-[#593719] hover:text-[#F7F3ED] ${ringIvory}`}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Review text, one comfortable column */}
              <div data-scroll className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
                <p className="font-heading text-[26px] font-normal leading-[1.25] sm:text-[32px]">{firstSentence(paras[0])}</p>
                <div className="mt-7 max-w-[62ch] space-y-5 text-base leading-[1.85] text-[#292622]/85 sm:text-[17px]">
                  {paras[0].slice(firstSentence(paras[0]).length).trim() && (
                    <p>{paras[0].slice(firstSentence(paras[0]).length).trim()}</p>
                  )}
                  {paras.slice(1).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-4 border-t border-[#593719]/15 px-6 py-4 sm:px-10">
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous review"
                    onClick={() => step(-1)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#593719]/40 text-[#593719] transition-colors hover:bg-[#593719] hover:text-[#F7F3ED] ${ringIvory}`}
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next review"
                    onClick={() => step(1)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#593719]/40 text-[#593719] transition-colors hover:bg-[#593719] hover:text-[#F7F3ED] ${ringIvory}`}
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
                <p className="text-sm tabular-nums text-[#292622]/60" aria-live="polite">
                  {reading + 1} of {total}
                </p>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className={`hidden min-h-11 items-center gap-2 rounded-sm bg-[#593719] px-5 text-sm font-semibold text-[#F7F3ED] transition-colors hover:bg-[#C18A35] hover:text-[#292622] sm:inline-flex ${ringIvory}`}
                >
                  <Phone size={15} aria-hidden="true" />
                  Book a free consultation
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}