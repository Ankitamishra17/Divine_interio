"use client";

import { useState } from "react";
import Image from "next/image";

const tabs = [
  "All Rooms",
  "Living Room",
  "Bedroom",
  "Dining Room",
  "Home Office",
];

const images = [
  { category: "Living Room", image: "/image/living_room2.webp" },
  { category: "Home Office", image: "/image/office_design4.webp" },
  { category: "Bedroom", image: "/image/bedroom_design2.webp" },
  { category: "Living Room", image: "/image/living_room1.webp" },
  { category: "Bedroom", image: "/image/bedroom_design3.webp" },
  { category: "Dining Room", image: "/image/dining_room2.webp" },
  { category: "Bedroom", image: "/image/bedroom_design6.webp" },
  { category: "Dining Room", image: "/image/dining_room3.webp" },
  { category: "Living Room", image: "/image/living_room5.webp" },
  { category: "Home Office", image: "/image/office_design5.webp" },
  { category: "Dining Room", image: "/image/dining_room5.webp" },
  { category: "Living Room", image: "/image/living_room13.webp" },
  { category: "Bedroom", image: "/image/bedroom_design7.webp" },
  { category: "Home Office", image: "/image/office_design6.webp" },
  { category: "Dining Room", image: "/image/dining_room6.webp" },
  { category: "Home Office", image: "/image/office_design8.webp" },
];

const countFor = (tab) =>
  tab === "All Rooms"
    ? images.length
    : images.filter((item) => item.category === tab).length;

export default function InspirationGallery() {
  const [activeTab, setActiveTab] = useState("All Rooms");

  const filteredImages =
    activeTab === "All Rooms"
      ? images
      : images.filter((item) => item.category === activeTab);

  return (
    <section className="bg-[#F8F4EE] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="font-serif text-3xl text-[#3D1F0D] sm:text-4xl md:text-5xl">
            Furniture in real spaces
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#6B5646]">
            See how our pieces look at home, then filter by the room you are
            planning.
          </p>
        </div>

        {/* Tabs */}
        <div
          role="group"
          aria-label="Filter by room"
          className="mb-12 flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] motion-reduce:transition-none ${
                  active
                    ? "border-[#3D1F0D] bg-[#3D1F0D] text-white shadow-md"
                    : "border-[#E5D6C5] bg-white text-[#3D1F0D] hover:border-[#B88A5A]"
                }`}
              >
                {tab}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#F8F4EE] text-[#6B5646]"
                  }`}
                >
                  {countFor(tab)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Equal cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {filteredImages.map((item) => (
            <figure
              key={item.image}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#E8DDD0] bg-[#E8DDD0] shadow-[0_2px_12px_rgba(61,31,13,0.06)] transition-shadow duration-500 hover:shadow-[0_18px_40px_rgba(61,31,13,0.2)] motion-reduce:transition-none"
            >
              <Image
                src={item.image}
                alt={`${item.category} furniture styled in a real home`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1408]/75 via-transparent to-transparent transition-opacity duration-500 group-hover:from-[#2A1408]/90" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />

              {/* Label */}
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-medium text-[#3D1F0D] backdrop-blur">
                {item.category}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}