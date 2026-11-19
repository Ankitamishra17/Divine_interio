"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Keyboard } from "swiper/modules";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-coverflow";

const AUTOPLAY_DELAY = 4500; // ms per step (was 2500: too fast to read)

const processSteps = [
  {
    title: "Consultation",
    image: "https://i.pinimg.com/736x/1c/51/88/1c51884992ce16d56b6b197e75ff6cdb.jpg",
    description:
      "Discuss requirements, lifestyle, budget, and design vision with our experts.",
  },
  {
    title: "Design",
    image: "https://i.pinimg.com/736x/f0/36/ce/f036ce056f5cb8d33a5b24662d042191.jpg",
    description:
      "Space planning, layouts, mood boards, and concept development.",
  },
  {
    title: "3D Visualization",
    image: "https://i.pinimg.com/736x/4a/e6/1d/4ae61d607e0b16e6143ccd6eff0fc9fb.jpg",
    description:
      "Photorealistic 3D renders to visualize your future home before execution.",
  },
  {
    title: "Material Selection",
    image: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    description:
      "Choose laminates, finishes, fabrics, lighting, and décor elements.",
  },
  {
    title: "Manufacturing",
    image: "https://i.pinimg.com/736x/d1/a2/9b/d1a29b71535e5cc92b0ec69a604bad63.jpg",
    description: "Precision manufacturing of furniture and modular components.",
  },
  {
    title: "Execution",
    image: "https://i.pinimg.com/736x/44/c1/99/44c1996c95cf99183d1faaea31d0c716.jpg",
    description:
      "On-site installation and execution managed by experienced professionals.",
  },
  {
    title: "Quality Check",
    image: "https://i.pinimg.com/1200x/5e/98/83/5e98838146d4dca3049331ce5b997716.jpg",
    description:
      "Multiple quality inspections ensure flawless finishing and durability.",
  },
  {
    title: "Handover",
    image: "https://i.pinimg.com/1200x/14/f2/22/14f222f5187751ce31fefc65deee6536.jpg",
    description:
      "Final walkthrough and delivery of your fully completed dream home.",
  },
];

const total = processSteps.length;
const pad = (n) => String(n).padStart(2, "0");

const START_INDEX = Math.floor(total / 2);

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dba343]";

export default function TurnkeyProcess() {
  const [swiper, setSwiper] = useState(null);
  const [active, setActive] = useState(START_INDEX);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);

  const rootRef = useRef(null);
  const chipsRef = useRef(null);
  const barRef = useRef(null);

  // Start paused for people who prefer reduced motion
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
    }
  }, []);

  // Only auto-play while the section is on screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Start / stop auto-play (user toggle + visibility)
  useEffect(() => {
    if (!swiper || !swiper.autoplay) return;
    if (playing && inView) swiper.autoplay.start();
    else swiper.autoplay.stop();
    if (!playing && barRef.current) barRef.current.style.transform = "scaleX(1)";
  }, [swiper, playing, inView]);

  // Keep the active pill centred in the mobile scroller (without moving the page)
  useEffect(() => {
    const box = chipsRef.current;
    const chip = box?.children[active];
    if (!box || !chip) return;
    box.scrollTo({
      left: chip.offsetLeft - box.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Our turnkey process"
      className="overflow-hidden bg-[#F7F3ED] py-20 lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-heading text-3xl leading-tight text-[#593719] sm:text-4xl lg:text-5xl">
            From concept to handover
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#292622]/75">
            Eight steps, one team. Follow your project from the first
            conversation to the day you get the keys.
          </p>
        </div>

        {/* Step tracker */}
        <div
          ref={chipsRef}
          role="group"
          aria-label="Jump to a step"
          className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {processSteps.map((step, index) => {
            const isActive = active === index;
            const isDone = index < active;
            return (
              <button
                key={step.title}
                type="button"
                aria-current={isActive ? "step" : undefined}
                onClick={() => swiper?.slideToLoop(index)}
                className={`flex shrink-0 items-center gap-2 rounded-full border py-2 pl-2 pr-4 text-sm transition-all duration-300 motion-reduce:transition-none ${focusRing} ${
                  isActive
                    ? "border-[#593719] bg-[#593719] text-white shadow-md"
                    : isDone
                    ? "border-[#dba343]/50 bg-white text-[#593719] hover:border-[#dba343]"
                    : "border-[#E8DED0] bg-white text-[#593719]/75 hover:border-[#dba343]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#dba343] text-[#292622]"
                      : isDone
                      ? "bg-[#dba343]/25 text-[#593719]"
                      : "bg-[#F7F3ED] text-[#593719]/70"
                  }`}
                >
                  {index + 1}
                </span>
                {step.title}
              </button>
            );
          })}
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Soft fade on both edges so side cards melt into the background */}
    
          <Swiper
            modules={[Autoplay, EffectCoverflow, Keyboard]}
            effect="coverflow"
            centeredSlides
            slidesPerView="auto"
            initialSlide={START_INDEX}
            loop
            speed={900}
            grabCursor
            simulateTouch
            keyboard={{ enabled: true }}
            slideToClickedSlide
            loopAdditionalSlides={2}
            onSwiper={setSwiper}
            onSlideChange={(s) => setActive(s.realIndex)}
            onAutoplayTimeLeft={(_s, _time, progress) => {
              if (barRef.current)
                barRef.current.style.transform = `scaleX(${1 - progress})`;
            }}
            autoplay={{
              delay: AUTOPLAY_DELAY,
              disableOnInteraction: false,
              pauseOnMouseEnter: true, // hover pauses, leaving resumes
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 2,
              scale: 0.9,
              slideShadows: false,
            }}
            className="!overflow-visible py-8"
          >
            {processSteps.map((step, index) => (
              <SwiperSlide
                key={step.title}
                className="!h-auto !w-[290px] opacity-50 transition-opacity duration-500 sm:!w-[370px] md:!w-[420px] [&.swiper-slide-active]:opacity-100 [&:not(.swiper-slide-active)]:cursor-pointer"
              >
                <article className="h-full rounded-3xl border border-[#E8DED0] bg-white p-2 shadow-[0_14px_30px_rgba(89,55,25,0.08)] transition-shadow duration-500 [.swiper-slide-active_&]:shadow-[0_28px_60px_rgba(89,55,25,0.2)]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E8DED0]">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      priority={index === START_INDEX}
                      sizes="(min-width: 768px) 420px, 300px"
                      draggable={false}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#292622]/55 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#dba343] font-heading text-base text-[#292622] shadow-md">
                      {index + 1}
                    </span>
                    <span className="absolute bottom-4 right-4 rounded-full bg-[#292622]/55 px-3 py-1 text-xs text-white backdrop-blur-sm">
                      Step {index + 1} of {total}
                    </span>
                  </div>

                  <div className="px-4 pb-5 pt-5">
                    <h3 className="font-heading text-xl text-[#593719] sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#292622]/75 sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-4 sm:gap-5">
          <button
            type="button"
            aria-label="Previous step"
            onClick={() => swiper?.slidePrev()}
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-[#E8DED0] bg-white text-[#593719] transition-colors hover:border-[#dba343] hover:bg-[#dba343] ${focusRing}`}
          >
            <ArrowLeft size={18} />
          </button>

          {/* Counter + timer bar */}
          <div className="flex w-28 flex-col items-center gap-2">
            <span
              className="text-sm tabular-nums text-[#593719]"
              aria-live={playing ? "off" : "polite"}
            >
              {pad(active + 1)} / {pad(total)}
            </span>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#E8DED0]">
              <div
                ref={barRef}
                className="h-full origin-left rounded-full bg-[#dba343]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>

          <button
            type="button"
            aria-label="Next step"
            onClick={() => swiper?.slideNext()}
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-[#E8DED0] bg-white text-[#593719] transition-colors hover:border-[#dba343] hover:bg-[#dba343] ${focusRing}`}
          >
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            aria-label={playing ? "Pause auto-play" : "Play auto-play"}
            aria-pressed={playing}
            onClick={() => setPlaying((v) => !v)}
            className={`ml-1 flex h-12 w-12 items-center justify-center rounded-full bg-[#593719] text-white transition-colors hover:bg-[#292622] ${focusRing}`}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>
    </section>
  );
}