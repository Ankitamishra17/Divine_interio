
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowUpRight, X, Compass } from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function LocationsClient({ locations = [] }) {
  const [search, setSearch] = useState("");

  const filteredLocations = locations.filter((location) =>
    [location.title, location.city, location.service]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  return (
    <main className="min-h-screen bg-[#F7F3ED] text-[#292622]">

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#292622] px-5 py-24 text-center sm:py-32">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#dba343]/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#dba343]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl">

          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#dba343]/40 bg-white/5 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#dba343]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#EBC882]">
              Our Presence
            </span>
          </div>

          <h1 className="font-heading text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Beautiful Spaces,
            <span className="mt-2 block text-[#dba343]">
              Across Every Location
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-8 text-[#E8DED0]/80 sm:text-lg">
            Discover thoughtfully designed interiors and premium home
            transformation services available in your city.
          </p>

          {/* SEARCH BAR */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="group relative flex items-center rounded-full border border-white/15 bg-white px-3 py-2 shadow-2xl transition-all duration-300 focus-within:border-[#dba343] focus-within:ring-4 focus-within:ring-[#dba343]/15">

              <Search
                size={21}
                className="ml-3 shrink-0 text-[#292622]/50 transition-colors group-focus-within:text-[#dba343]"
              />

              <input
                type="text"
                placeholder="Search city, location or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent px-4 py-3 font-body text-sm text-[#292622] outline-none placeholder:text-[#292622]/45"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#292622]/60 transition hover:bg-[#F7F3ED] hover:text-[#dba343]"
                >
                  <X size={18} />
                </button>
              )}

              <span className="hidden rounded-full bg-[#292622] px-5 py-3 text-xs font-semibold text-white sm:inline-flex">
                Search
              </span>
            </div>
          </div>

          <p className="mt-5 font-body text-xs tracking-wide text-[#E8DED0]/60">
            Find your city and explore our interior design expertise
          </p>
        </div>
      </section>

      {/* LOCATIONS SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">

        {/* Section heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#dba343]">
              <span className="h-px w-9 bg-[#dba343]" />
              Where We Work
            </p>

            <h2 className="font-heading text-3xl text-[#292622] sm:text-4xl lg:text-5xl">
              Explore Our Locations
            </h2>

            <p className="mt-4 max-w-xl font-body text-sm leading-7 text-[#292622]/65 sm:text-base">
              From modern apartments to luxurious homes, discover
              interior design solutions tailored to your location.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#292622]/10 bg-white px-5 py-3 text-sm font-medium text-[#292622]">
            <MapPin size={16} className="text-[#dba343]" />
            {filteredLocations.length}{" "}
            {filteredLocations.length === 1 ? "Location" : "Locations"}
          </div>
        </div>

        {/* LOCATION CARDS */}
        {filteredLocations.length === 0 ? (
          <div className="rounded-2xl border border-[#292622]/10 bg-white px-5 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F3ED] text-[#dba343]">
              <Compass size={30} />
            </div>

            <h3 className="mt-6 font-heading text-2xl text-[#292622]">
              No Locations Found
            </h3>

            <p className="mt-3 font-body text-sm text-[#292622]/60">
              We couldn't find any matching location. Try another keyword.
            </p>

            <button
              onClick={() => setSearch("")}
              className="mt-7 rounded-full bg-[#292622] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#dba343] hover:text-[#292622]"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredLocations.map((location) => (
              <Link
                key={location.id}
                href={`/locations/${location.slug}`}
                className="group overflow-hidden rounded-xl border border-[#292622]/10 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-[#dba343]/50 hover:shadow-2xl hover:shadow-[#292622]/10"
              >

                {/* Card Image */}
                <div className="relative h-64 overflow-hidden bg-[#E8DED0]">

                  <img
                    src={
                      location.heroImage
                        ? `${API}${location.heroImage}`
                        : "/placeholder.jpg"
                    }
                    alt={location.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#292622]/75 via-transparent to-transparent opacity-80" />

                  {/* Location label */}
                  <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/25 bg-[#292622]/70 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                    <MapPin size={13} className="text-[#EBC882]" />
                    {location.city}
                  </div>

                  {/* Arrow */}
                  <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#dba343] text-[#292622] transition-all duration-300 group-hover:rotate-45 group-hover:bg-white">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">

                  {location.service && (
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dba343]">
                      {location.service}
                    </p>
                  )}

                  <h3 className="font-heading text-xl leading-snug text-[#292622] transition-colors duration-300 group-hover:text-[#dba343]">
                    {location.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 font-body text-sm leading-7 text-[#292622]/60">
                    {location.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-[#292622]/10 pt-4">
                    <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-[#292622] transition-colors group-hover:text-[#dba343]">
                      Explore Location
                    </span>

                    <ArrowUpRight
                      size={18}
                      className="text-[#dba343] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
              </Link>
            ))}

          </div>
        )}
      </section>

     

    </main>
  );
}
