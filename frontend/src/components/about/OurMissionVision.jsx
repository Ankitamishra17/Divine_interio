
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Eye, ArrowUpRight } from "lucide-react";

const items = [
  {
    id: "mission",
    label: "OUR MISSION",
    title: "Designing Spaces That Inspire Everyday Living",
    description:
      "Our mission is to transform ordinary spaces into beautiful, functional and meaningful environments. We combine creativity, thoughtful planning and quality craftsmanship to create interiors that reflect every client's personality and lifestyle.",
    image: "/images/our-mission.jpg",
    icon: Target,
    number: "01",
  },
  {
    id: "vision",
    label: "OUR VISION",
    title: "Creating Timeless Spaces for a Better Tomorrow",
    description:
      "Our vision is to become a trusted name in interior design by delivering innovative, elegant and personalized spaces. We aspire to redefine modern living through thoughtful design, sustainable choices and exceptional attention to detail.",
    image: "/images/our-vision.jpg",
    icon: Eye,
    number: "02",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function OurMissionVision() {
  return (
    <section className="relative overflow-hidden bg-[#E8DED0]/60 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

      <div className="mx-auto max-w-[1440px]">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[#C18A35]" />
            <span className="font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-[0.3em] text-[#C18A35]">
              What Drives Us
            </span>
            <span className="h-px w-10 bg-[#C18A35]" />
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-4xl leading-tight text-[#593719] sm:text-5xl lg:text-6xl">
            Our Purpose,
            <span className="italic text-[#C18A35]">
              {" "}Our Promise
            </span>
          </h2>

          <p className="mt-5 font-[family-name:var(--font-body)] text-base leading-8 text-[#292622]/65">
            Every design begins with a purpose and moves
            forward with a vision. These principles guide
            everything we create at Divine Interiors.
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-7 lg:grid-cols-2"
        >
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.id}
                variants={cardVariants}
                className="group relative isolate min-h-[470px] overflow-hidden rounded-2xl bg-[#593719] sm:min-h-[520px]"
              >
                {/* Background image */}
                <Image
                  src={item.image}
                  alt={`${item.label} - Divine Interiors`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 -z-0 bg-gradient-to-t from-[#241409]/95 via-[#3D2415]/65 to-[#3D2415]/15" />

                {/* Card Content */}
                <div className="relative z-10 flex min-h-[470px] flex-col justify-between p-7 sm:min-h-[520px] sm:p-10 lg:p-12">

                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E9BD76]/60 bg-[#593719]/40 text-[#E9BD76] backdrop-blur-sm">
                      <Icon size={26} strokeWidth={1.4} />
                    </div>

                    <span className="font-[family-name:var(--font-heading)] text-5xl text-white/30">
                      {item.number}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="max-w-[510px]">

                    <p className="mb-4 font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.3em] text-[#E9BD76]">
                      {item.label}
                    </p>

                    <h3 className="font-[family-name:var(--font-heading)] text-3xl leading-tight text-white sm:text-4xl lg:text-[42px]">
                      {item.title}
                    </h3>

                    <p className="mt-5 max-w-[480px] font-[family-name:var(--font-body)] text-sm leading-7 text-white/80 sm:text-base">
                      {item.description}
                    </p>

                    <div className="mt-7 h-px w-full bg-white/20" />

                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.18em] text-white/65">
                        Divine Interiors
                      </span>

                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E9BD76]/60 text-[#E9BD76] transition-all duration-300 group-hover:bg-[#C18A35] group-hover:text-[#292622]">
                        <ArrowUpRight size={20} />
                      </span>
                    </div>

                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
