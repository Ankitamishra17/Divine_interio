"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/*
  Palette
  Espresso #593719 | Warm Gold #dba343 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622  | White #FFFFFF

  Design idea: every service is a DOORWAY. Arch-shaped photo frames (a double gold
  outline, like an inset niche) sit on a charcoal wall, staggered like a gallery.
  The gold ruler under the heading echoes the measuring-ruler in the Divine logo.
*/

const services = [
  {
    title: "Living Room",
    description:
      "Transform your living room with luxury interior design solutions in Noida, Greater Noida, and Ghaziabad.",
    image: "/image/living_room6.webp",
    link: "/services/design-ideas/living-room-design",
  },
  {
    title: "Modular Kitchen",
    description:
      "Get stylish and functional kitchen interiors for homes in Noida, Greater Noida, and Ghaziabad.",
    image: "/image/kitchen_design5.webp",
    link: "/services/design-ideas/kitchen-design-ideas",
  },
  {
    title: "Bedroom Design",
    description:
      "Create a comfortable and luxurious bedroom with custom interior design solutions.",
    image: "/image/bedroom_design6.webp",
    link: "/services/design-ideas/bedroom-design",
  },
  {
    title: "Bathroom Design",
    description:
      "Modern bathroom interior designs featuring premium fittings, elegant layouts, and space-efficient solutions.",
    image: "/image/bathroom_design.webp",
    link: "/services/design-ideas/bathroom-design",
  },
  {
    title: "Architecture",
    description:
      "Professional architectural design for residential and commercial projects, with modern elevations and sustainable planning.",
    image: "/Home/architecture.avif",
    link: "/services/architecture",
  },
  {
    title: "Dining Room Design",
    description:
      "Elegant dining room interior designs that enhance comfort, functionality, and style.",
    image: "/image/dining_room5.webp",
    link: "/services/design-ideas/dining-room-design",
  },
  {
    title: "Office Design",
    description:
      "Modern office interior design solutions that improve productivity, comfort, and brand identity.",
    image: "/image/office_design8.webp",
    link: "/services/design-ideas/home-office-design",
  },
];

// Ruler tick marks (small tick every 12px, tall tick every 60px), drawn in pure CSS
const rulerStyle = {
  backgroundImage:
    "repeating-linear-gradient(90deg,#dba343 0 1px,transparent 1px 12px), repeating-linear-gradient(90deg,#dba343 0 1px,transparent 1px 60px)",
  backgroundSize: "100% 8px, 100% 18px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top left",
};

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  // One orchestrated moment: the doorways rise in, one after another, the first time you see them
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#292622] py-20 md:py-28">
      {/* warm glow, like light falling on a wall */}

      <div className="relative mx-auto max-w-[1680px] px-5 sm:px-8 xl:px-12">
        {/* ── Heading ── */}
        <div className="grid items-end gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <h2 className="font-heading text-[40px] font-medium leading-[1.05] text-[#F7F3ED] sm:text-6xl xl:text-7xl">
            A Design for
            <br />
            Every Room.
          </h2>
          <div className="lg:pb-2">
            <p className="max-w-md text-base leading-relaxed text-[#F7F3ED]/70 sm:text-lg">
              From concept to completion, we turn ordinary spaces into homes
              you'll love living in. Step into the one you need.
            </p>
            <Link
              href="/services/design-ideas"
              className="group/all mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#dba343] transition-colors hover:text-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dba343] focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
            >
              Browse all design ideas
              <ArrowRight size={16} className="transition-transform duration-300 group-hover/all:translate-x-1" />
            </Link>
          </div>
        </div>



        {/* ── Doorways ── */}
        <ul className="mx-auto mt-14 flex max-w-[1300px] flex-wrap justify-center gap-x-4 gap-y-12 sm:gap-y-16 lg:mt-20 lg:gap-x-6 lg:gap-y-20">
          {services.map((service, i) => (
            <li
              key={service.title}
              style={{ transitionDelay: inView ? `${i * 110}ms` : "0ms" }}
              className={`basis-[calc(50%-0.5rem)] transition-all duration-[900ms] ease-out motion-reduce:transition-none lg:basis-[calc(25%-1.125rem)] ${
                i % 2 === 1 ? "lg:mt-14" : ""
              } ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
            >
              <Link
                href={service.link}
                className="group block focus-visible:outline-none"
              >
                {/* outer arch = thin gold frame; inner arch = the photo */}
                <div className="rounded-t-[999px] border border-[#dba343]/35 p-1.5 transition-colors duration-500 group-hover:border-[#dba343] group-focus-visible:border-[#dba343] group-focus-visible:ring-2 group-focus-visible:ring-[#dba343] sm:p-2">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-[#593719]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      priority={i < 4}
                      sizes="(max-width:1024px) 46vw, 320px"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 motion-reduce:transition-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#292622]/50 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-20" />
                  </div>
                </div>

                <div className="mt-5 px-1 text-center">
                  <h3 className="font-heading text-xl text-[#F7F3ED] transition-colors duration-300 group-hover:text-[#dba343] sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mx-auto mt-2 line-clamp-2 hidden max-w-[260px] text-[13px] leading-relaxed text-[#F7F3ED]/65 sm:block">
                    {service.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#dba343]">
                    View designs
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Next step ── */}
        <div className="mt-20 flex flex-col items-center text-center md:mt-28">
          <p className="font-heading text-3xl text-[#F7F3ED] md:text-4xl">Not sure where to start?</p>
          <p className="mt-3 max-w-md text-[15px] text-[#F7F3ED]/65">
            Talk to a designer and get a plan for your space.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-sm bg-[#dba343] px-8 py-4 text-sm font-semibold tracking-wide text-[#292622] transition-colors duration-300 hover:bg-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F3ED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#292622]"
          >
            Book a free consultation
          </Link>
        </div>
      </div>
    </section>
  );
}