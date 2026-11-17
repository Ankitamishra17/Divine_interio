"use client";

import { useEffect, useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature, mesh } from "topojson-client";
import { Navigation } from "lucide-react";
import worldData from "world-atlas/countries-110m.json";

const WIDTH = 960;
const HEIGHT = 500;

// Visible slice of the map. Smaller `h` = shorter map (crops Arctic / southern ocean).
// Keep y between 0–60 and h between ~330–500.
const VIEW = { y: 40, h: 370 };

// Greater Noida, Uttar Pradesh (change these to move the pin)
const LOCATION = { lng: 77.5, lat: 28.47 };
const LABEL = "We are here";
const PLACE = "Greater Noida";
const STUDIO = "Divine Interio";
const ADDRESS =
  "Shop-LGB 28, Galaxy Diamond Plaza, Sector 4, Greater Noida West, Greater Noida, Uttar Pradesh 201009";

const ZOOM = 4;
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${STUDIO}, ${ADDRESS}`,
)}`;

/* ───────── COLORS ─────────
   Change THEME to "dark" to switch. Edit any value to fine-tune. */
const THEME = "light";

const THEMES = {
  light: {
    card: "#FFFFFF",
    stageA: "#FDFBF7",
    stageB: "#F1E9DA",
    land: "#E7DAC2",
    landLine: "#C4B08C",
    borders: "#D3C3A4",
    grid: "rgba(138,95,23,0.12)",
    home: "rgba(200,151,43,0.45)",
    homeLine: "#A8752A",
    ink: "#2A1506",
    muted: "#6E6258",
    divider: "#E8DCC8",
    accent: "#dba343",
    accentHover: "#B8871F",
    onAccent: "#2A1506",
    labelBg: "#2A1506",
    labelInk: "#F7F2EB",
    labelSub: "#D9CCBA",
    chipBg: "rgba(255,255,255,0.92)",
    chipInk: "#2A1506",
    chipActiveBg: "#2A1506",
    chipActiveInk: "#F7F2EB",
    chipHover: "rgba(42,21,6,0.07)",
    pinGlow: "rgba(42,21,6,0.35)",
    shadow: "rgba(42,21,6,0.25)",
  },
  dark: {
    card: "#241208",
    stageA: "#33200F",
    stageB: "#241208",
    land: "#3F2A18",
    landLine: "#7A5C2E",
    borders: "#6B5028",
    grid: "rgba(226,182,84,0.08)",
    home: "rgba(200,151,43,0.4)",
    homeLine: "#E2B654",
    ink: "#F7F2EB",
    muted: "#D9CCBA",
    divider: "rgba(200,151,43,0.25)",
    accent: "#dba343",
    accentHover: "#E2B654",
    onAccent: "#2A1506",
    labelBg: "#FFFFFF",
    labelInk: "#2A1506",
    labelSub: "#6E6258",
    chipBg: "rgba(36,18,8,0.85)",
    chipInk: "#F7F2EB",
    chipActiveBg: "#dba343",
    chipActiveInk: "#2A1506",
    chipHover: "rgba(255,255,255,0.1)",
    pinGlow: "rgba(200,151,43,0.85)",
    shadow: "rgba(42,21,6,0.6)",
  },
};

const EASE =
  "transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.8,0.24,1)] motion-reduce:transition-none";

export default function WorldMapPin() {
  const [zoomed, setZoomed] = useState(false);
  const t = THEMES[THEME];

  // On small screens the world view is tiny, so start zoomed in there
  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setZoomed(true);
  }, []);

  const { landPath, indiaPath, bordersPath, gratPath, pin } = useMemo(() => {
    // Drop Antarctica (id "010") so the map fills the frame nicely
    const countries = feature(
      worldData,
      worldData.objects.countries,
    ).features.filter((f) => f.id !== "010");

    const collection = { type: "FeatureCollection", features: countries };
    const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);
    const [x, y] = projection([LOCATION.lng, LOCATION.lat]);
    const india = countries.find((f) => String(f.id) === "356");

    return {
      landPath: path(collection),
      indiaPath: india ? path(india) : "",
      bordersPath: path(
        mesh(worldData, worldData.objects.countries, (a, b) => a !== b),
      ),
      gratPath: path(geoGraticule10()),
      pin: { x: (x / WIDTH) * 100, y: ((y - VIEW.y) / VIEW.h) * 100 },
    };
  }, []);

  const mapTransform = zoomed
    ? `translate(${50 - pin.x}%, ${50 - pin.y}%) scale(${ZOOM})`
    : "translate(0%, 0%) scale(1)";

  const vars = {
    "--wm-card": t.card,
    "--wm-ink": t.ink,
    "--wm-muted": t.muted,
    "--wm-divider": t.divider,
    "--wm-accent": t.accent,
    "--wm-accent-hover": t.accentHover,
    "--wm-on-accent": t.onAccent,
    "--wm-label-bg": t.labelBg,
    "--wm-label-ink": t.labelInk,
    "--wm-label-sub": t.labelSub,
    "--wm-chip-bg": t.chipBg,
    "--wm-chip-ink": t.chipInk,
    "--wm-chip-active-bg": t.chipActiveBg,
    "--wm-chip-active-ink": t.chipActiveInk,
    "--wm-chip-hover": t.chipHover,
    "--wm-pin-glow": t.pinGlow,
    "--wm-shadow": t.shadow,
  };

  return (
    <div
      style={vars}
      className="overflow-hidden rounded-2xl border border-[color:var(--wm-divider)] bg-[color:var(--wm-card)] shadow-[0_24px_60px_-28px_var(--wm-shadow)]"
    >
      {/* Map stage */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${t.stageA} 0%, ${t.stageB} 80%)`,
        }}
      >
        <div
          className={`relative w-full ${EASE}`}
          style={{
            transform: mapTransform,
            transformOrigin: `${pin.x}% ${pin.y}%`,
          }}
        >
          <svg
            viewBox={`0 ${VIEW.y} ${WIDTH} ${VIEW.h}`}
            className="block h-auto w-full"
            role="img"
            aria-label={`World map. ${LABEL}: ${PLACE}, India`}
          >
            <path
              d={gratPath}
              style={{ fill: "none", stroke: t.grid }}
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={landPath}
              style={{ fill: t.land, stroke: t.landLine }}
              strokeWidth="0.8"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={bordersPath}
              style={{ fill: "none", stroke: t.borders }}
              strokeWidth="0.6"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {indiaPath && (
              <path
                d={indiaPath}
                style={{ fill: t.home, stroke: t.homeLine }}
                strokeWidth="1"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          {/* Pin layer. Counter-scaled so pin and label keep a constant size while zooming */}
          <div
            className="pointer-events-none absolute"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <div
              className={EASE}
              style={{
                transform: `scale(${zoomed ? 1 / ZOOM : 1})`,
                transformOrigin: "0 0",
              }}
            >
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${LABEL}: ${STUDIO}, ${PLACE}. Open directions in Google Maps`}
                className="group pointer-events-auto absolute left-0 top-0 block h-0 w-0 focus-visible:outline-none"
              >
                <span className="absolute left-0 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  <span className="absolute h-full w-full rounded-full bg-[color:var(--wm-accent)]/35 motion-safe:animate-ping" />
                  <span className="absolute h-5 w-5 rounded-full bg-[color:var(--wm-accent)]/30" />
                  <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-[color:var(--wm-accent)] shadow-[0_0_0_1px_var(--wm-pin-glow),0_2px_10px_var(--wm-pin-glow)] group-focus-visible:ring-2 group-focus-visible:ring-[color:var(--wm-ink)] group-focus-visible:ring-offset-2" />
                </span>

                <span className="absolute bottom-4 left-0 flex -translate-x-1/2 flex-col items-center">
                  <span className="whitespace-nowrap rounded-lg bg-[color:var(--wm-label-bg)] px-3 py-1.5 text-left shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5">
                    <span className="block text-xs font-semibold leading-tight text-[color:var(--wm-label-ink)]">
                      {LABEL}
                    </span>
                    <span className="block text-[11px] leading-tight text-[color:var(--wm-label-sub)]">
                      {PLACE}
                    </span>
                  </span>
                  <span className="-mt-1 h-2.5 w-2.5 rotate-45 bg-[color:var(--wm-label-bg)]" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* View toggle */}
        <div
          role="group"
          aria-label="Map view"
          className="absolute left-3 top-3 z-10 inline-flex rounded-lg bg-[color:var(--wm-chip-bg)] p-1 text-sm shadow-sm backdrop-blur sm:left-5 sm:top-5"
        >
          {[
            { label: "World", value: false },
            { label: PLACE, value: true },
          ].map(({ label, value }) => {
            const active = zoomed === value;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => setZoomed(value)}
                className={`rounded-md px-3 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--wm-accent)] ${
                  active
                    ? "bg-[color:var(--wm-chip-active-bg)] text-[color:var(--wm-chip-active-ink)]"
                    : "text-[color:var(--wm-chip-ink)] hover:bg-[color:var(--wm-chip-hover)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Address bar */}
      <div className="flex flex-col gap-4 border-t border-[color:var(--wm-divider)] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="min-w-0">
          <p className="font-[Cormorant_Garamond,serif] text-2xl font-light leading-tight text-[color:var(--wm-ink)]">
            {STUDIO}
          </p>
          <p className="mt-1 text-sm leading-6 text-[color:var(--wm-muted)]">
            {ADDRESS}
          </p>
        </div>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[color:var(--wm-accent)] px-5 py-3 text-base font-semibold text-[color:var(--wm-on-accent)] transition-colors hover:bg-[color:var(--wm-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--wm-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--wm-card)]"
        >
          <Navigation size={18} aria-hidden />
          Get directions
        </a>
      </div>
    </div>
  );
}