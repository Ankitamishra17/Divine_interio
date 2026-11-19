import { wardrobeDetails } from "@/data/wardrobeData";

export default function Details() {
  const data = wardrobeDetails;

  return (
    <section className="bg-[#F7F3ED] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-5 lg:grid lg:grid-cols-[380px_1fr] lg:gap-14 lg:items-start">
        {/* Left: sticky intro panel */}
        <aside className="lg:sticky lg:top-24 mb-12 lg:mb-0">
          <div className="rounded-3xl bg-[#292622] p-8 md:p-10 text-white">
            <h1 className="font-heading text-3xl md:text-4xl leading-tight">
              {data.title}
            </h1>
            <p className="mt-5 leading-7 text-white/75">{data.intro}</p>

            {data.sections.length > 1 && (
              <nav
                aria-label="Sections"
                className="mt-8 pt-6 border-t border-white/15"
              >
                <ul className="space-y-1">
                  {data.sections.map((s, i) => (
                    <li key={i}>
                      <a
                        href={`#section-${i}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A64B]"
                      >
                        {s.heading}
                        <span aria-hidden="true" className="text-[#E0A64B]">
                          &rarr;
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </aside>

        {/* Right: content */}
        <div className="space-y-14">
          {data.sections.map((section, index) => (
            <div key={index} id={`section-${index}`} className="scroll-mt-24">
              <h2 className="font-heading text-2xl md:text-3xl text-[#3D1F0D] mb-6">
                {section.heading}
              </h2>

              {section.content?.length > 0 && (
                <div className="space-y-3">
                  {section.content.map((item, i) => (
                    <details
                      key={i}
                      open={index === 0 && i === 0}
                      className="group rounded-2xl bg-white ring-1 ring-[#3D1F0D]/10 transition open:shadow-md"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A2B] [&::-webkit-details-marker]:hidden">
                        <h3 className="font-heading text-lg md:text-xl text-[#3D1F0D]">
                          {item.title}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3D1F0D]/[0.07] text-xl leading-none text-[#3D1F0D] transition-transform group-open:rotate-45 group-open:bg-[#C98A2B] group-open:text-white"
                        >
                          +
                        </span>
                      </summary>
                      <p className="px-6 pb-6 -mt-1 leading-7 text-gray-600">
                        {item.description}
                      </p>
                    </details>
                  ))}
                </div>
              )}

              {section.text && (
                <p
                  className={`rounded-2xl border-l-4 border-[#C98A2B] bg-[#C98A2B]/10 px-6 py-5 text-lg leading-8 text-[#3D1F0D] ${
                    section.content?.length > 0 ? "mt-6" : ""
                  }`}
                >
                  {section.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}