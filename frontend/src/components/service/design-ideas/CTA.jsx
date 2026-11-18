import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "250+", label: "Projects" },
  { value: "15+", label: "Years" },
  { value: "40+", label: "Awards" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3B352]";

export default function CTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-[#F8F6F1] py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl bg-[#292622] sm:rounded-3xl lg:grid-cols-12">
          {/* Content: first on every screen size, so the action is never pushed below an image */}
          <div className="px-6 py-12 sm:px-10 md:py-14 lg:col-span-7 lg:px-16 lg:py-20">
            <p className="text-sm font-semibold text-[#292622]">
              Begin your journey
            </p>

            <h2
              id="cta-heading"
              className="mt-4 font-heading text-4xl leading-tight text-[#F8F6F1] sm:text-5xl lg:text-[56px]"
            >
              Ready to transform your space?
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#F8F6F1]/75">
              Schedule a complimentary consultation and let&rsquo;s begin
              crafting an interior that reflects your lifestyle, personality,
              and aspirations.
            </p>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className={`group inline-flex min-h-14 text-nowrap items-center justify-center gap-3 rounded-full bg-[#dba343] px-8 text-base font-semibold text-[#1E0F06] transition-colors duration-300 hover:bg-[#E3B352] ${focusRing}`}
              >
                Book a free consultation
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>

              <Link
                href="/portfolio"
                className={`inline-flex min-h-14 items-center justify-center rounded-full border border-[#F8F6F1]/35 px-8 text-base font-semibold text-[#F8F6F1] transition-colors duration-300 hover:bg-[#F8F6F1]/10 ${focusRing}`}
              >
                View portfolio
              </Link>
            </div>

            {/* Proof, kept below the actions so it supports them instead of competing */}
            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-[#F8F6F1]/15 pt-8 sm:max-w-md">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse gap-1">
                  <dt className="text-sm text-[#F8F6F1]/65">{stat.label}</dt>
                  <dd className="font-heading text-3xl text-[#E3B352] sm:text-4xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/3] lg:col-span-5 lg:aspect-auto lg:min-h-[560px]">
            <Image
              src="/image/office_design6.webp"
              alt="Office interior designed by Divine Interiors"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />

            <span className="absolute bottom-4 left-4 rounded-full bg-[#F8F6F1]/90 px-4 py-2 text-sm font-semibold text-[#2B1A0D] backdrop-blur-sm sm:bottom-6 sm:left-6">
              Since 2008
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}