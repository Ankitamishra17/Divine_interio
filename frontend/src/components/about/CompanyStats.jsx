
"use client";

import { motion, useInView, animate, useMotionValue } from "framer-motion";
import { Sofa, Award, Users, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  {
    id: 1,
    value: 200,
    suffix: "+",
    label: "Projects Completed",
    description: "Beautiful spaces brought to life",
    icon: Sofa,
  },
  {
    id: 2,
    value: 10,
    suffix: "+",
    label: "Years of Experience",
    description: "Expertise you can trust",
    icon: Award,
  },
  {
    id: 3,
    value: 500,
    suffix: "+",
    label: "Happy Clients",
    description: "Relationships built on trust",
    icon: Users,
  },
  {
    id: 4,
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    description: "Quality in every detail",
    icon: Star,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

function AnimatedCounter({ value, suffix }) {
  const ref = useRef(null);
  const count = useMotionValue(0);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [isInView, count, value]);

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = count.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });

    return () => unsubscribe();
  }, [count]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

export default function CompanyStats() {
  return (
    <section className="relative overflow-hidden bg-[#F7F3ED] px-6 py-16 sm:px-10 lg:py-20">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full border border-[#C18A35]/10" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full border border-[#C18A35]/10" />

      <div className="relative mx-auto max-w-[1440px]">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-[#C18A35]" />

            <span className="font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-[0.3em] text-[#C18A35]">
              Our Achievements
            </span>

            <span className="h-px w-10 bg-[#C18A35]" />
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-4xl text-[#593719] sm:text-5xl">
            Numbers That Reflect
            <span className="italic text-[#C18A35]">
              {" "}Our Journey
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-body)] text-sm leading-7 text-[#292622]/65 sm:text-base">
            Every number represents a space transformed,
            a dream fulfilled and a relationship built
            through thoughtful design.
          </p>
        </motion.div>

        {/* Statistics card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#C18A35]/15 bg-white/70 shadow-[0_12px_45px_rgba(89,55,25,0.06)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                className={`group relative flex flex-col items-center px-6 py-10 text-center transition-colors duration-300 hover:bg-[#E8DED0]/40 lg:py-12 ${
                  index !== stats.length - 1
                    ? "lg:border-r lg:border-[#C18A35]/20"
                    : ""
                } ${
                  index % 2 === 0
                    ? "sm:border-r sm:border-[#C18A35]/20 lg:border-r"
                    : "sm:border-r-0"
                } ${
                  index < 2
                    ? "border-b border-[#C18A35]/20 lg:border-b-0"
                    : ""
                }`}
              >
                {/* Icon */}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#C18A35]/25 bg-[#F7F3ED] transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-[#593719]">
                  <Icon
                    size={28}
                    strokeWidth={1.4}
                    className="text-[#C18A35] transition-colors duration-300 group-hover:text-[#E8DED0]"
                  />
                </div>

                {/* Animated number */}
                <h3 className="font-[family-name:var(--font-heading)] text-5xl font-normal text-[#593719] sm:text-6xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </h3>

                {/* Label */}
                <h4 className="mt-3 font-[family-name:var(--font-body)] text-base font-semibold text-[#292622]">
                  {stat.label}
                </h4>

                {/* Description */}
                <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-[#292622]/55">
                  {stat.description}
                </p>

                {/* Bottom accent */}
                <span className="mt-6 h-[2px] w-8 bg-[#C18A35] transition-all duration-500 group-hover:w-16" />
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
