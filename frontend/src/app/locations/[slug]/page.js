import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocation, getLocations } from "@/lib/serverApi";

/*
  Palette
  Charcoal #292622 | Warm Gold #dba343 | Ivory #F7F3ED
  Beige    #E8DED0 | Espresso #593719  | White #FFFFFF


*/

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

const PHONE = "+919911066420";
const PHONE_DISPLAY = "+91 99110 66420";

const img = (path) => (path ? `${API}${path}` : "/placeholder.jpg");

// Generate Static Params
export async function generateStaticParams() {
  const res = await getLocations();
  return res.data.map((location) => ({ slug: location.slug }));
}

// SEO Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const { data: location } = await getLocation(slug);

    return {
      title: `${location.title} | Divine Interio`,
      description: location.description,
      keywords: [
        `${location.city} Interior Designer`,
        `${location.city} Home Interior`,
        location.service,
        "Divine Interior",
        "Interior Design",
      ],
      alternates: {
        canonical: `https://divineintrio.in/locations/${slug}`,
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return {
      title: "Location Not Found | Divine Interio",
      description: "The requested location could not be found.",
    };
  }
}

/* ───────── Static content ───────── */

const steps = [
  {
    n: "01",
    title: "Consultation",
    text: "We listen to your ideas, needs and budget.",
  },
  {
    n: "02",
    title: "Concept & 3D",
    text: "See your space designed before work begins.",
  },
  {
    n: "03",
    title: "Execution",
    text: "Skilled crews build and finish with care.",
  },
  {
    n: "04",
    title: "Handover",
    text: "A final walkthrough and a home you love.",
  },
];

/* ───────── Reveal wrapper (pure CSS, no client JS needed) ─────────
   load  → plays on page load (hero)
   else  → plays as the element scrolls into view (scroll-driven animation;
           browsers without support simply show the content normally) */
function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 32,
  scale = 1,
  load = false,
  className = "",
  as: Tag = "div",
}) {
  const style = { "--x": `${x}px`, "--y": `${y}px`, "--s": scale };
  if (load) style.animationDelay = `${delay}ms`;
  else style["--d"] = `${Math.min(delay / 25, 30)}%`;

  return (
    <Tag
      className={`${load ? "ls-in" : "ls-reveal"} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ───────── Motion keyframes (self-contained) ───────── */
function MotionStyles() {
  return (
    <style>{`
      @keyframes ls-in {
        from { opacity: 0; transform: translate3d(var(--x,0), var(--y,32px), 0) scale(var(--s,1)) }
        to   { opacity: 1; transform: none }
      }
      .ls-in { animation: ls-in .9s cubic-bezier(.22,1,.36,1) both; }

      @supports (animation-timeline: view()) {
        .ls-reveal {
          animation: ls-in linear both;
          animation-timeline: view();
          animation-range: entry var(--d,0%) entry calc(var(--d,0%) + 45%);
        }
      }

      @keyframes ls-kenburns { from { transform: scale(1.02) } to { transform: scale(1.12) } }
      @keyframes ls-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
      @keyframes ls-shimmer { from { background-position: 0% 50% } to { background-position: 200% 50% } }
      @keyframes ls-ping { 0% { transform: scale(1); opacity: .7 } 80%,100% { transform: scale(2.4); opacity: 0 } }
      @keyframes ls-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(8px) } }

      .ls-kenburns { animation: ls-kenburns 22s ease-in-out infinite alternate; }
      .ls-float    { animation: ls-float 6s ease-in-out infinite; }
      .ls-shimmer  { background-size: 200% auto; animation: ls-shimmer 6s linear infinite; }
      .ls-ping     { animation: ls-ping 2s cubic-bezier(0,0,.2,1) infinite; }
      .ls-bob      { animation: ls-bob 1.8s ease-in-out infinite; }

      @media (prefers-reduced-motion: reduce) {
        .ls-kenburns, .ls-float, .ls-shimmer, .ls-ping, .ls-bob,
        .ls-in, .ls-reveal { animation: none !important; }
      }
    `}</style>
  );
}

const goldText = {
  backgroundImage:
    "linear-gradient(90deg,#dba343 0%,#EBC882 25%,#dba343 50%,#EBC882 75%,#dba343 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export default async function LocationPage({ params }) {
  const { slug } = await params;

  let location;
  try {
    const res = await getLocation(slug);
    location = res.data;
  } catch {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "Divine Interio - Divine Interior",
    url: `https://divineintrio.in/locations/${slug}`,
    telephone: PHONE,
    areaServed: location.city,
    description: location.description,
  };

  return (
    <main className="overflow-x-clip bg-[#F7F3ED] text-[#292622]">
      <MotionStyles />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═════════ HERO (background image + charcoal gradient) ═════════ */}
      <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-[#292622] lg:min-h-[740px]">
        {/* Background image */}
        <img
          src={img(location.heroImage)}
          alt={location.title}
          className="ls-kenburns absolute inset-0 -z-20 h-full w-full object-cover"
        />

        {/* Charcoal gradient overlay */}
        <div
          className="absolute inset-0 -z-10 hidden lg:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(41,38,34,.97) 0%, rgba(41,38,34,.85) 40%, rgba(41,38,34,.28) 100%)",
          }}
        />
        <div
          className="absolute inset-0 -z-10 lg:hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(41,38,34,.82) 0%, rgba(41,38,34,.94) 100%)",
          }}
        />
        {/* soft fade at the bottom edge */}
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-40"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(41,38,34,.7), transparent)",
          }}
        />
        {/* gold glow */}
        <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#dba343]/15 blur-[120px]" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-2xl">
            <Reveal load delay={0} y={16}>
              <nav
                aria-label="Breadcrumb"
                className="mb-6 flex flex-wrap items-center gap-2 text-xs tracking-wide text-[#E8DED0]/80"
              >
                <Link href="/" className="transition hover:text-[#EBC882]">
                  Home
                </Link>
                <span>/</span>
                <Link
                  href="/locations"
                  className="transition hover:text-[#EBC882]"
                >
                  Locations
                </Link>
                <span>/</span>
                <span className="text-[#EBC882]">{location.city}</span>
              </nav>
            </Reveal>

            <Reveal load delay={100} y={20}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[#dba343]/60 bg-[#dba343]/15 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#EBC882] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="ls-ping absolute inline-flex h-full w-full rounded-full bg-[#dba343]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#dba343]" />
                </span>
                Now designing in {location.city}
              </span>
            </Reveal>

            <Reveal load delay={200} y={28}>
              <h1 className="mt-6 font-heading text-4xl leading-[1.1] text-white sm:text-5xl xl:text-6xl">
                {location.title}
              </h1>
              <p
                className="ls-shimmer mt-2 font-heading text-2xl sm:text-3xl xl:text-4xl"
                style={goldText}
              >
                in {location.city}
              </p>
            </Reveal>

            <Reveal load delay={320} y={24}>
              <div className="mt-6 flex gap-4">
                <span className="mt-1 h-16 w-0.5 shrink-0 rounded bg-[#dba343]" />
                <p className="max-w-xl text-base leading-relaxed text-[#E8DED0] sm:text-lg">
                  {location.description}
                </p>
              </div>
            </Reveal>
          </div>

          {/* floating glass card (desktop / tablet) */}
          <Reveal
            load
            delay={600}
            x={30}
            y={0}
            className="absolute bottom-10 right-5 hidden sm:block sm:right-8"
          >
            <div className="ls-float flex items-center gap-3 rounded-2xl border border-white/20 bg-[#292622]/50 px-5 py-4 shadow-2xl backdrop-blur-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dba343] text-[#292622]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l2.5 5.5L20 9.3l-4 4 1 5.7L12 16.3 7 19l1-5.7-4-4 5.5-.8z" />
                </svg>
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">
                  Free Consultation
                </p>
                <p className="text-xs text-[#E8DED0]">Book your visit today</p>
              </div>
            </div>
          </Reveal>

          {/* scroll cue */}
          <a
            href="#about"
            aria-label="Scroll down"
            className="ls-bob absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/70 transition hover:text-[#EBC882] lg:block"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </div>
      </section>

      {/* ═════════ ABOUT ═════════ */}
      <section
        id="about"
        className="relative mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 lg:py-32"
      >
        {/* decorative big letter */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-6 select-none font-heading text-[9rem] leading-none text-[#292622]/[0.04] sm:text-[14rem]"
        >
          {location.city?.[0]}
        </span>

        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Image */}
          <Reveal x={-40} y={0} className="lg:col-span-5">
            <div className="group relative mx-auto max-w-md lg:max-w-none">
              {/* offset frames */}
              <div className="absolute -bottom-4 -left-4 h-full w-full rounded-3xl border-2 border-[#dba343]/70 sm:-bottom-6 sm:-left-6" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-[#292622]/25">
                <img
                  src={img(location.aboutImage)}
                  alt={location.service}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgba(41,38,34,.55), transparent 45%)",
                  }}
                />
              </div>

              <div className="absolute -right-3 top-8 rounded-2xl bg-[#292622] px-5 py-3 text-white shadow-xl sm:-right-6">
                <p className="font-heading text-xl leading-none">Divine</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#dba343]">
                  Interior
                </p>
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <div className="lg:col-span-7">
            <Reveal delay={100}>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#dba343]">
                <span className="h-px w-10 bg-[#dba343]" />
                About Our Service
              </p>
            </Reveal>

            <Reveal delay={200}>
              <h2 className="mt-4 font-heading text-3xl leading-tight text-[#292622] sm:text-4xl lg:text-5xl">
                Our {location.service}
              </h2>
              <div className="mt-5 h-1 w-16 rounded bg-[#dba343]" />
            </Reveal>

            <Reveal delay={300}>
              <p className="mt-7 text-base leading-8 text-[#292622]/75 sm:text-lg sm:leading-9">
                Divine Interior specializes in premium{" "}
                <strong className="font-semibold text-[#292622]">
                  {location.service}
                </strong>{" "}
                in{" "}
                <strong className="font-semibold text-[#292622]">
                  {location.city}
                </strong>
                , {location.about}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═════════ PROCESS ═════════ */}
      <section className="relative isolate overflow-hidden bg-[#292622]">
        <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-[#dba343]/15 blur-[110px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#dba343]/10 blur-[110px]" />
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#F7F3ED 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#dba343]">
              How We Work
            </p>
            <h2 className="mt-3 font-heading text-3xl text-white sm:text-4xl lg:text-5xl">
              A simple, transparent process
            </h2>
            <div className="mx-auto mt-5 h-1 w-16 rounded bg-[#dba343]" />
          </Reveal>

          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.n}>
                <Reveal delay={i * 150} y={40} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition duration-500 hover:-translate-y-2 hover:border-[#dba343]/60 hover:bg-white/[0.07]">
                    <span className="font-heading text-6xl leading-none text-[#dba343]/25 transition duration-500 group-hover:text-[#dba343]">
                      {s.n}
                    </span>
                    <div className="mt-5 h-0.5 w-10 rounded bg-[#dba343] transition-all duration-500 group-hover:w-20" />
                    <h3 className="mt-5 font-heading text-xl text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#E8DED0]/75">
                      {s.text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═════════ CTA ═════════ */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <Reveal y={50} scale={0.97}>
          <div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#292622]/10 px-6 py-16 text-center shadow-xl shadow-[#292622]/10 sm:px-12 lg:py-24"
            style={{
              backgroundImage:
                "linear-gradient(135deg,#FFFFFF 0%,#F7F3ED 45%,#E8DED0 100%)",
            }}
          >
            {/* decorative circles */}
            <div className="ls-float pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#dba343]/40" />
            <div className="ls-float pointer-events-none absolute -right-8 -top-8 h-56 w-56 rounded-full border border-[#dba343]/25 [animation-delay:1.5s]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#dba343]/20 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#dba343]">
                Let&apos;s Talk
              </p>
              <h2 className="mx-auto mt-4 max-w-3xl font-heading text-3xl leading-tight text-[#292622] sm:text-4xl lg:text-5xl">
                Looking for Interior Designers in{" "}
                <span className="text-[#dba343]">{location.city}</span>?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[#292622]/70">
                Call today and transform your dream home with Divine Interior.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={`tel:${PHONE}`}
                  className="group relative w-full overflow-hidden rounded-full bg-[#292622] px-9 py-4 text-sm font-semibold text-white shadow-xl shadow-[#292622]/30 transition duration-300 hover:-translate-y-0.5 sm:w-auto"
                >
                  <span className="absolute inset-0 -translate-x-full bg-[#dba343] transition-transform duration-500 group-hover:translate-x-0" />
                  <span className="relative transition-colors duration-300 group-hover:text-[#292622]">
                    Call Now
                  </span>
                </a>
                <a
                  href={`https://wa.me/${PHONE.replace("+", "")}`}
                  className="w-full rounded-full border border-[#292622]/30 px-9 py-4 text-sm font-semibold text-[#292622] transition duration-300 hover:border-[#292622] hover:bg-[#292622] hover:text-white sm:w-auto"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
