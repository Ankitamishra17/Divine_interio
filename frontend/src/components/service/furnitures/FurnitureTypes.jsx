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
  {
    category: "Living Room",
    image:
      "https://i.pinimg.com/736x/5c/98/2f/5c982ffcc085ab35f082a6094a6f90b4.jpg",
  },
  {
    category: "Home Office",
    image:
      "https://i.pinimg.com/736x/3a/5d/7a/3a5d7a332b5eccd0280f60369fa2ed4a.jpg",
  },
  {
    category: "Bedroom",
    image:
      "https://i.pinimg.com/736x/8f/e4/c9/8fe4c9dd8569c3e0adf031b3a1d0f581.jpg",
  },
  {
    category: "Living Room",
    image:
      "https://i.pinimg.com/736x/0b/06/92/0b0692a09d3c876a08d88acf8fb6fa50.jpg",
  },
  {
    category: "Bedroom",
    image:
      "https://i.pinimg.com/1200x/39/19/8b/39198bfcec8f0adfc8f1418be0b966f3.jpg",
  },
  {
    category: "Dining Room",
    image:
      "https://i.pinimg.com/736x/69/9e/3a/699e3acf385b6fb619e27540e6e655b7.jpg",
  },
  {
    category: "Bedroom",
    image:
      "https://i.pinimg.com/736x/9a/f6/f8/9af6f8bf5b017be0942ca5d053dad53a.jpg",
  },
  {
    category: "Dining Room",
    image:
      "https://i.pinimg.com/736x/82/60/e1/8260e15d7d48e93f3ceabcc8441f7b56.jpg",
  },
  {
    category: "Living Room",
    image:
      "https://i.pinimg.com/736x/71/c6/27/71c627fb354d3d37fb4d0704fb22a355.jpg",
  },
  {
    category: "Home Office",
    image:
      "https://i.pinimg.com/1200x/f8/45/d5/f845d54de2fc57ab1b7b4378fe33cec9.jpg",
  },
  {
    category: "Dining Room",
    image:
      "https://i.pinimg.com/736x/4c/a0/9b/4ca09b4005768cdf704173b31d96eaed.jpg",
  },
  {
    category: "Living Room",
    image:
      "https://i.pinimg.com/736x/9d/e6/71/9de671c35fbde8986bba8ef0f327b83f.jpg",
  },
  {
    category: "Bedroom",
    image:
      "https://i.pinimg.com/736x/e0/6a/4f/e06a4f66dd7d8b8a70d67d04d32c3cdf.jpg",
  },
  {
    category: "Home Office",
    image:
      "https://i.pinimg.com/1200x/e1/cd/91/e1cd91295b0a9952032b802f8d2bd79b.jpg",
  },
  {
    category: "Dining Room",
    image:
      "https://i.pinimg.com/736x/91/fa/30/91fa30fe97938900e82992fed66561ec.jpg",
  },
  {
    category: "Home Office",
    image:
      "https://i.pinimg.com/736x/72/cc/de/72ccde625726011d9c652dee8c235b2d.jpg",
  },
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
