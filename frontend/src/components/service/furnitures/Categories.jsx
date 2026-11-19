import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Kitchen",
    slug: "kitchen-design-ideas",
    count: 48,
    image:
      "https://i.pinimg.com/1200x/1f/31/83/1f31830af41a3563fb012b04247f1f96.jpg",
  },
  {
    title: "Dining",
    slug: "dining",
    count: 32,
    image:
      "https://i.pinimg.com/736x/8f/e0/c4/8fe0c48eb8990ebd784d10b29643bd84.jpg",
  },
  {
    title: "Bedroom",
    slug: "bedroom",
    count: 27,
    image:
      "https://i.pinimg.com/736x/50/2c/c4/502cc42d58e9702fb36e08c4fbb4f972.jpg",
  },
  {
    title: "Wardrobe",
    slug: "wardrobe",
    count: 19,
    image:
      "https://i.pinimg.com/736x/5e/8e/5b/5e8e5b37c381a5b62da7b3d9d6e65e63.jpg",
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
            <div key={item.slug} className="group block">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#E8DDD0]">
                <Image
                  src={item.image}
                  alt={`${item.title} furniture collection`}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                />
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

              {/* Hover underline */}
              <span className="mt-2 block h-px w-full origin-left scale-x-0 bg-[#B88A5A] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
