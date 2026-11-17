import Link from "next/link";
import { Palette, Zap, Home, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Palette,
    marker: "Day 1",
    title: "End-to-end interior solutions",
    description:
      "Everything from design planning to execution is handled by one dedicated team, so coordination stays seamless and quality stays high.",
  },
  {
    icon: Zap,
    marker: "Clear milestones",
    title: "Delivered on a clear timeline",
    description:
      "Fast-track project management with efficient workflows, so your project is delivered on time without cutting corners.",
  },
  {
    icon: Home,
    marker: "Day 45",
    title: "Move-in ready homes",
    description:
      "Your home is delivered fully furnished and functional, with every detail completed, so you can move in without any hassle.",
  },
];

export default function TurnkeyBenefits() {
  return (
    <section className="bg-[#F7F3ED] py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <h2 className="font-serif text-3xl leading-tight text-[#593719] sm:text-4xl lg:text-5xl">
            Design to handover in 45 days
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#292622]/75">
            One team owns the project from the first plan to the final
            handover, so you move straight into a finished home.
          </p>
        </div>

        {/* Timeline */}
        <ol className="mx-auto grid max-w-7xl md:grid-cols-3">
          {steps.map(({ icon: Icon, marker, title, description }, index) => {
            const isLast = index === steps.length - 1;

            return (
              <li
                key={title}
                className="relative flex gap-5 pb-12 last:pb-0 md:flex-col md:items-center md:gap-0 md:px-6 md:pb-0 md:text-center"
              >
                {/* Connector */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-8 top-16 -ml-px h-[calc(100%-4rem)] border-l-2 border-dashed border-[#dba343]/60 md:left-1/2 md:top-8 md:ml-0 md:h-0 md:w-full md:border-l-0 md:border-t-2"
                  />
                )}

                {/* Node */}
                <span
                  className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full ring-8 ring-[#F7F3ED] ${
                    isLast
                      ? "bg-[#dba343] text-[#292622]"
                      : "bg-[#593719] text-[#dba343]"
                  }`}
                >
                  <Icon size={26} strokeWidth={1.5} />
                </span>

                {/* Content */}
                <div className="md:mt-6">
                  <span className="inline-block rounded-full border border-[#E8DED0] bg-white px-3 py-1 text-xs font-medium text-[#593719]">
                    {marker}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl leading-snug text-[#593719]">
                    {title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[#292622]/75">
                    {description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* CTA */}
        <div className="mt-14 flex justify-center lg:mt-20">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-[#593719] px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-[#292622] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dba343]"
          >
            Book free consultation
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}