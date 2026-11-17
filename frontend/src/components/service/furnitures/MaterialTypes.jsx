import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const materials = [
  {
    title: "Solid Wood",
    slug: "solid-wood",
    image: "https://i.pinimg.com/736x/80/11/7b/80117b2e3e9d00ff4609707a061eca87.jpg",
  },
  {
    title: "Engineered Wood",
    slug: "engineered-wood",
    image: "https://i.pinimg.com/736x/dd/20/7f/dd207f7bc0341d2971ffedd2818c0f1f.jpg",
  },
  {
    title: "Marble Finish",
    slug: "marble-finish",
    image: "https://i.pinimg.com/1200x/3d/ad/c8/3dadc895282042a8c36f529c464a23e6.jpg",
  },
  {
    title: "Metal Frame",
    slug: "metal-frame",
    image: "https://i.pinimg.com/736x/a1/7d/ec/a17dec52c0d1b564edc6347244cfc0c6.jpg",
  },
  {
    title: "Leather Upholstery",
    slug: "leather-upholstery",
    image: "https://i.pinimg.com/1200x/6e/4b/71/6e4b71808ad221b0ff1feb90042649bc.jpg",
  },
  {
    title: "Fabric Upholstery",
    slug: "fabric-upholstery",
    image: "https://i.pinimg.com/736x/1e/d3/a9/1ed3a9b808f6feacca284cf3c1b69d5d.jpg",
  },
];

export default function MaterialCollection() {
  return (
    <section className="bg-[#F8F4EE] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl leading-tight text-[#3D1F0D] sm:text-4xl md:text-5xl">
              Built from materials that last
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#6B5646]">
              Every piece starts with carefully chosen wood, metal and fabric,
              picked for durability and a finish that ages well.
            </p>
          </div>

          <Link
            href="/materials"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#3D1F0D] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]"
          >
            Explore materials
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>

        {/* Equal cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
          {materials.map((item) => (
            <Link
              key={item.slug}
              href={`/materials/${item.slug}`}
              className="group block rounded-3xl border border-[#E8DDD0] bg-white p-2 shadow-[0_2px_12px_rgba(61,31,13,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#B88A5A] hover:shadow-[0_18px_40px_rgba(61,31,13,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#E8DDD0]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1408]/85 via-[#2A1408]/20 to-transparent transition-opacity duration-500 group-hover:from-[#2A1408]/90" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />

                {/* Label */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <h3 className="font-serif text-lg leading-snug text-white">
                    {item.title}
                  </h3>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition-colors duration-300 group-hover:border-[#B88A5A] group-hover:bg-[#B88A5A]">
                    <ArrowRight size={15} className="-rotate-45 transition-transform duration-300 group-hover:rotate-0 motion-reduce:transition-none" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}