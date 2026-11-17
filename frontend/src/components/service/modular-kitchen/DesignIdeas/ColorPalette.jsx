"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const colors = [
  { name: "Classic White", color: "#F8F8F8", description: "Bright, spacious and timeless" },
  { name: "Warm Beige", color: "#D8C3A5", description: "Elegant and cozy interiors" },
  { name: "Olive Green", color: "#7A8450", description: "Natural and sophisticated" },
  { name: "Charcoal Grey", color: "#4A4A4A", description: "Modern and luxurious" },
  { name: "Navy Blue", color: "#23395B", description: "Bold and premium appeal" },
  { name: "Walnut Brown", color: "#6B4423", description: "Rich wooden aesthetics" },
];

function isDark(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8851F]";

/* One cabinet door or drawer front, drawn in SVG */
function Front({ x, y, w, h, color, handle }) {
  const dark = isDark(color);
  const panelStroke = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.10)";
  const handleFill = dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.35)";

  let handleRect = null;
  if (handle === "bottom") {
    handleRect = <rect x={x + w / 2 - 3} y={y + h - 34} width="6" height="22" rx="3" fill={handleFill} />;
  } else if (handle === "top") {
    handleRect = <rect x={x + w / 2 - 3} y={y + 12} width="6" height="22" rx="3" fill={handleFill} />;
  } else if (handle === "drawer") {
    handleRect = <rect x={x + w / 2 - 32} y={y + h / 2 - 3} width="64" height="6" rx="3" fill={handleFill} />;
  }

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="4"
        stroke="rgba(0,0,0,0.14)"
        strokeWidth="1"
        style={{ fill: color, transition: "fill 500ms ease" }}
      />
      <rect
        x={x + 10}
        y={y + 10}
        width={w - 20}
        height={h - 20}
        rx="2"
        fill="none"
        stroke={panelStroke}
        strokeWidth="1.5"
      />
      {handleRect}
    </g>
  );
}

function KitchenPreview({ color, name }) {
  return (
    <svg
      viewBox="0 0 800 540"
      role="img"
      aria-label={`Kitchen preview with ${name} cabinets`}
      className="block h-auto w-full"
    >
      <defs>
        <pattern id="tiles" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 0H40M0 20H40M0 0V20M20 20V40" stroke="rgba(0,0,0,0.07)" strokeWidth="1" fill="none" />
        </pattern>
        <linearGradient id="wallGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4EADB" />
          <stop offset="1" stopColor="#E9DAC6" />
        </linearGradient>
      </defs>

      {/* Wall + floor */}
      <rect width="800" height="500" fill="url(#wallGlow)" />
      <rect y="500" width="800" height="40" fill="#C9B391" />
      <path d="M0 520H800" stroke="rgba(0,0,0,0.08)" />

      {/* Backsplash */}
      <rect x="30" y="230" width="740" height="110" fill="#F7F3EC" />
      <rect x="30" y="230" width="740" height="110" fill="url(#tiles)" />

      {/* Hood */}
      <rect x="378" y="30" width="44" height="100" fill="#B9BEC3" />
      <polygon points="335,195 465,195 432,128 368,128" fill="#9EA4AA" />
      <rect x="335" y="195" width="130" height="6" rx="3" fill="#80868C" />

      {/* Upper cabinets */}
      <Front x={40} y={40} w={130} h={190} color={color} handle="bottom" />
      <Front x={176} y={40} w={130} h={190} color={color} handle="bottom" />
      <Front x={494} y={40} w={130} h={190} color={color} handle="bottom" />
      <Front x={630} y={40} w={130} h={190} color={color} handle="bottom" />

      {/* Under-cabinet light */}
      <rect x="40" y="230" width="266" height="5" rx="2" fill="#FFD98A" opacity="0.75" />
      <rect x="494" y="230" width="266" height="5" rx="2" fill="#FFD98A" opacity="0.75" />

      {/* Countertop */}
      <rect x="30" y="340" width="740" height="22" rx="3" fill="#EAE4DA" />
      <rect x="30" y="358" width="740" height="4" fill="#CFC7BA" />

      {/* Hob */}
      <rect x="352" y="335" width="96" height="6" rx="3" fill="#1F1F1F" />

      {/* Sink + tap */}
      <rect x="86" y="336" width="96" height="6" rx="3" fill="#9EA4AA" />
      <path d="M134 336V306q0-12 14-12h8" stroke="#9EA4AA" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Decor */}
      <rect x="650" y="312" width="32" height="28" rx="5" fill="#dba343" />
      <circle cx="666" cy="298" r="15" fill="#7A8450" />
      <circle cx="680" cy="290" r="10" fill="#8E9A60" />
      <rect x="700" y="318" width="22" height="22" rx="4" fill="#FFFFFF" stroke="rgba(0,0,0,0.12)" />

      {/* Lower cabinets */}
      <Front x={40} y={362} w={130} h={122} color={color} handle="top" />
      <Front x={176} y={362} w={130} h={122} color={color} handle="top" />
      <Front x={312} y={362} w={176} h={38} color={color} handle="drawer" />
      <Front x={312} y={404} w={176} h={38} color={color} handle="drawer" />
      <Front x={312} y={446} w={176} h={38} color={color} handle="drawer" />
      <Front x={494} y={362} w={130} h={122} color={color} handle="top" />
      <Front x={630} y={362} w={130} h={122} color={color} handle="top" />

      {/* Plinth */}
      <rect x="30" y="484" width="740" height="16" fill="#2A1408" opacity="0.85" />
    </svg>
  );
}

export default function ColorPalette() {
  const [active, setActive] = useState(1);
  const current = colors[active];

  return (
    <section
      aria-labelledby="palette-heading"
      className="bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[3px] text-[#8A6416]">
            <span aria-hidden="true" className="h-px w-10 bg-[#dba343]" />
            Color Inspiration
            <span aria-hidden="true" className="h-px w-10 bg-[#dba343]" />
          </p>
          <h2
            id="palette-heading"
            className="mt-4 font-heading text-4xl leading-[1.1] text-[#3D1F0D] md:text-5xl"
          >
            Kitchen Color Palette
            <span className="text-[#B8851F]">.</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-stone-600">
            Pick a shade to see how it looks on your cabinets. Trending
            combinations that suit your lifestyle and interiors.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Preview */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Gold offset frame */}
              <div
                aria-hidden="true"
                className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-[2rem] border-2 border-[#dba343]/50 sm:block"
              />

              <div className="relative overflow-hidden rounded-[2rem] bg-[#F7F3ED] shadow-2xl shadow-[#3D1F0D]/20">
                <KitchenPreview color={current.color} name={current.name} />

                {/* Floating caption */}
                <div
                  aria-live="polite"
                  className="absolute bottom-3 left-3 right-3 flex items-center gap-4 rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur sm:bottom-5 sm:left-5 sm:right-auto sm:min-w-[320px] sm:p-4"
                >
                  <span
                    aria-hidden="true"
                    className="h-12 w-12 shrink-0 rounded-full border-2 border-white shadow-md ring-1 ring-black/10 transition-colors duration-500 motion-reduce:transition-none"
                    style={{ backgroundColor: current.color }}
                  />
                  <div className="min-w-0">
                    <p className="font-heading text-lg leading-tight text-[#3D1F0D] sm:text-xl">
                      {current.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-stone-600 sm:text-sm">
                      {current.description}
                    </p>
                  </div>
                  <span className="ml-auto hidden font-mono text-xs uppercase text-stone-400 sm:block">
                    {current.color}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Swatch picker */}
          <div className="lg:col-span-5">
            <h3 className="mb-5 font-heading text-2xl text-[#3D1F0D]">
              Trending kitchen shades
            </h3>

            <ul className="grid grid-cols-2 gap-3 sm:gap-4">
              {colors.map((item, i) => {
                const isActive = i === active;
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      aria-pressed={isActive}
                      className={`group relative flex w-full flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${focusRing} ${
                        isActive
                          ? "border-[#B8851F] bg-[#FBF7F2] shadow-lg shadow-[#3D1F0D]/10"
                          : "border-stone-200 bg-white hover:-translate-y-1 hover:border-[#dba343]/60 hover:shadow-md"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white shadow-md ring-1 ring-black/10"
                        style={{ backgroundColor: item.color }}
                      >
                        {isActive && (
                          <Check
                            size={18}
                            className={isDark(item.color) ? "text-white" : "text-[#3D1F0D]"}
                          />
                        )}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[#3D1F0D]">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-stone-500">
                          {item.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}