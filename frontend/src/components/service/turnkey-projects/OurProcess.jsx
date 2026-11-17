import {
  PencilRuler,
  Package,
  Factory,
  Hammer,
  ShieldCheck,
  KeyRound,
  UsersRound,
  Wallet,
  Home,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const processSteps = [
  {
    icon: PencilRuler,
    title: "Design",
    text: "Layouts, 3D views and finishes agreed with you.",
  },
  {
    icon: Package,
    title: "Material procurement",
    text: "All materials sourced and checked before work starts.",
  },
  {
    icon: Factory,
    title: "Manufacturing",
    text: "Furniture and fittings made to your approved designs.",
  },
  {
    icon: Hammer,
    title: "Site execution",
    text: "Our own team installs everything at your home.",
  },
  {
    icon: ShieldCheck,
    title: "Quality checks",
    text: "Every room inspected before it is shown to you.",
  },
  {
    icon: KeyRound,
    title: "Final handover",
    text: "You receive a finished, move-in-ready home.",
  },
];

const benefits = [
  {
    icon: UsersRound,
    title: "One team, start to finish",
    text: "No juggling multiple vendors or contractors.",
  },
  {
    icon: Wallet,
    title: "One point of contact",
    text: "Planning, design and execution all handled together.",
  },
  {
    icon: Home,
    title: "Move-in ready",
    text: "Your home arrives fully finished.",
  },
];

export default function TurnkeyOverview() {
  return (
    <section className="bg-[#F7F3ED] py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          {/* Left: content */}
          <div className="lg:sticky lg:top-24">
            <h2 className="font-serif text-3xl leading-tight text-[#3D1F0D] sm:text-4xl lg:text-5xl">
              What is a turnkey project?
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5C4A3C]">
              A turnkey interior project is a complete solution where a single
              team manages everything from planning and design to execution and
              final handover. You receive a fully finished, move-in-ready home
              without coordinating multiple vendors or contractors.
            </p>

            <ul className="mt-10 space-y-3">
              {benefits.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-[#E8D5BC] bg-white p-4 shadow-[0_2px_12px_rgba(61,31,13,0.06)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dba343]/12 text-[#dba343]">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="font-semibold text-[#3D1F0D]">{title}</p>
                    <p className="mt-0.5 text-sm text-[#5C4A3C]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[#3D1F0D] px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-[#dba343] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dba343]"
            >
              Book free consultation
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>

          {/* Right: process timeline */}
          <div className="rounded-3xl border border-[#E8D5BC] bg-white p-6 shadow-[0_18px_40px_rgba(61,31,13,0.1)] sm:p-10">
            <h3 className="font-serif text-2xl text-[#3D1F0D]">
              How your project moves
            </h3>
            <p className="mt-1 text-sm text-[#5C4A3C]">
              Six steps, all handled by one team.
            </p>

            <ol className="mt-8">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === processSteps.length - 1;

                return (
                  <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                    {/* Connector line */}
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute left-6 top-12 -ml-px h-[calc(100%-3rem)] border-l-2 border-dashed border-[#dba343]/50"
                      />
                    )}

                    {/* Icon */}
                    <span
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                        isLast
                          ? "bg-[#dba343] text-white shadow-md"
                          : "border border-[#dba343]/40 bg-[#FBF5EA] text-[#dba343]"
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.6} />
                    </span>

                    {/* Text */}
                    <div className="pt-1">
                      <h4 className="font-semibold text-[#3D1F0D]">
                        <span className="mr-2 text-sm font-medium text-[#dba343]">
                          {index + 1}.
                        </span>
                        {step.title}
                      </h4>
                      <p className="mt-0.5 text-sm leading-relaxed text-[#5C4A3C]">
                        {step.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}