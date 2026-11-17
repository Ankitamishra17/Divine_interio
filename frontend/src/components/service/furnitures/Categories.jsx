import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Sofa",
    slug: "sofa",
    count: 48,
    image:
      "https://i.pinimg.com/1200x/ba/ec/d5/baecd59c765562016d8f793a3cdf98b9.jpg",
  },
  {
    title: "Dining",
    slug: "dining",
    count: 32,
    image:
      "https://i.pinimg.com/736x/4b/0d/b4/4b0db4c1ffe80956662e6bfb7720d45a.jpg",
  },
  {
    title: "Bedroom",
    slug: "bedroom",
    count: 27,
    image: "/image/bedroom_interior_design.webp",
  },
  {
    title: "Wardrobe",
    slug: "wardrobe",
    count: 19,
    image: "/image/wardrobe_design8.webp",
  },
];

export default function CategorySection() {
  return (
    <section className="bg-[#F8F4EE] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="font-heading text-3xl text-[#3D1F0D] sm:text-4xl md:text-5xl">
            Shop by room
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#6B5646]">
            Furniture made to last, grouped by the space you are styling.
          </p>
        </div>

        {/* Equal cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#E8DDD0]">
                <Image
                  src={item.image}
                  alt={`${item.title} furniture collection`}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                />

                {/* Arrow badge */}
                <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#3D1F0D] shadow-md backdrop-blur transition-colors duration-300 group-hover:bg-[#B88A5A] group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0 motion-reduce:transition-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M4 12h16m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              {/* Text */}
              <div className="flex items-baseline justify-between px-1 pt-4">
                <h3 className="font-heading text-xl text-[#3D1F0D] sm:text-2xl">
                  {item.title}
                </h3>
                <span className="text-sm text-[#6B5646]">
                  {item.count} products
                </span>
              </div>
              <span className="mt-2 block h-px w-full origin-left scale-x-0 bg-[#B88A5A] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}