"use client";
import Image from "next/image";

import { wardrobeAccessories, wardrobeFeatures } from "@/data/wardrobeData";

export default function WardrobeAccessories() {
  return (
    <section className="bg-[#F7F3ED] py-16">
      <div className="container mx-auto px-4">
        {/* Premium Accessories */}
        <div className="rounded-3xl bg-white border border-[#e8dfd5] p-8">
          <h2 className="text-center text-3xl font-serif text-[#3D1F0D] mb-8">
            Premium Accessories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {wardrobeAccessories.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-[#ece4da] p-5 text-center hover:shadow-md transition"
              >
                <div className="mb-3 flex justify-center">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={50}
                    height={50}
                  />
                </div>

                <h3 className="text-sm font-medium text-[#3D1F0D]">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose */}
        <div className="mt-6 rounded-3xl bg-white border border-[#e8dfd5] p-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-center">
            <div>
              <h2 className="text-3xl font-serif text-[#3D1F0D]">
                Why Choose
                <br />
                Our Wardrobes?
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {wardrobeFeatures.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#B8851F]/30 text-[#B8851F]">
                    ✓
                  </div>

                  <p className="text-[10px] font-medium text-[#3D1F0D]">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

