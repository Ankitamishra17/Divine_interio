"use client";

import Image from "next/image";
import { wardrobeTypes } from "@/data/wardrobeData";
import { ArrowRight, DoorClosed, Shirt } from "lucide-react";
import Link from "next/link";

const icons = [DoorClosed, DoorClosed, Shirt];

export default function HeroSection() {
  return (
    <section className="relative">
      {/* Hero Banner */}
      <div className="  relative h-[750px] overflow-hidden">
        <Image
          src="/banner/wardrobeHero.png"
          alt="Luxury Wardrobe"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[#1F0E04]/60" />

        <div className="absolute inset-0">
          <div className="container mx-auto flex h-full items-center justify-center px-4">
            <div className="max-w-2xl lg:-mt-56 text-center text-white">
              <span className="inline-block text-sm uppercase tracking-[3px] text-[#ffffff]">
                Designed Around You
              </span>

              <h1 className="mt-6 text-3xl font-serif leading-tight md:text-4xl lg:text-5xl">
                Wardrobes Crafted
                <br />
                Around Your Lifestyle
              </h1>

              <p className="mt-8 max-w-2xl 2xl text-sm text-white/80 leading-relaxed">
                From sleek sliding wardrobes to elegant hinged designs and
                luxurious walk-in closets, discover storage solutions that blend
                functionality with timeless aesthetics.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/portfolio">
                  <button className="rounded-md bg-[#B8851F] px-8 py-4 font-body text-white transition hover:opacity-90">
                    Explore Designs
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="rounded-md border border-[#B8851F] bg-white/10 px-8 py-4 font-body text-white backdrop-blur transition hover:bg-white/20">
                    Book Free Consultation
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
}
