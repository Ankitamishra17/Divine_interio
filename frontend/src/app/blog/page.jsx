
import { getBlogs } from "@/lib/serverApi";
import BlogCard from "@/components/BlogCard";
import GridPagination from "@/components/GridPagination";
import Link from "next/link";

export const metadata = {
  title: "Journal — Studio",
  description: "Discover interior design inspiration, ideas, materials and stories.",
};

export default async function BlogPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam, 10) || 1;

  const { data: posts, pagination } = await getBlogs({
    page,
    limit: 9,
  });

  return (
    <main className="min-h-screen bg-[#F7F3ED] text-[#292622]">

      {/* Hero Section */}
      <section className="relative h-[420px] md:h-[520px] w-full overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/image/banner.webp')" }}
        />

        <div className="absolute inset-0 bg-[#292622]/75" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">

          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-px bg-[#C18A35]" />

            <p className="text-[11px] md:text-xs tracking-[0.4em] uppercase text-[#C18A35] font-semibold font-body">
              Our Journal
            </p>

            <span className="w-9 h-px bg-[#C18A35]" />
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-normal text-white mb-5">
            The <span className="text-[#C18A35]">Journal</span>
          </h1>

          <span className="w-16 h-px bg-[#C18A35] mb-6" />

          <p className="text-[#F7F3ED]/80 max-w-xl mx-auto font-body font-light leading-relaxed mb-7">
            Notes on design, materials, and process from the studio.
            Discover inspiration for creating timeless spaces.
          </p>

          <div className="flex items-center gap-3 text-sm font-body">
            <Link
              href="/"
              className="text-white/80 hover:text-[#C18A35] transition-colors"
            >
              Home
            </Link>

            <span className="text-white/40">/</span>

            <span className="text-[#C18A35]">Journal</span>
          </div>
        </div>
      </section>

      {/* Journal Introduction */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pt-20 pb-12 text-center">

        <p className="text-[10px] tracking-[0.4em] uppercase text-[#C18A35] font-semibold mb-5 font-body">
          Stories & Inspiration
        </p>

        <h2 className="font-heading text-4xl md:text-5xl font-normal text-[#593719] mb-5">
          Ideas That Inspire Living
        </h2>

        <span className="block w-14 h-px bg-[#C18A35] mx-auto mb-6" />

        <p className="text-[#292622]/65 max-w-xl mx-auto font-body font-light leading-relaxed">
          Explore our latest thoughts on interior design, creative
          spaces, materials, and the art of beautiful living.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pb-24">

        {posts.length === 0 ? (
          <div className="text-center py-24 bg-[#E8DED0]/40 rounded-2xl">
            <p className="font-heading text-2xl text-[#593719] mb-3">
              No Stories Yet
            </p>

            <p className="text-[#292622]/60 font-body text-sm">
              Our latest journal entries will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <GridPagination
            basePath="/blog"
            pagination={pagination}
          />
        </div>

      </section>

      {/* Bottom CTA */}
      <section className="bg-[#593719] py-16 px-6 text-center">

        <p className="text-[#C18A35] uppercase tracking-[0.35em] text-[10px] font-semibold font-body mb-4">
          Let's Create Something Beautiful
        </p>

        <h2 className="font-heading text-3xl md:text-4xl text-white mb-5">
          Inspired by What You See?
        </h2>

        <p className="text-white/70 font-body font-light max-w-lg mx-auto mb-8">
          Let's bring your dream space to life with thoughtful design
          and timeless elegance.
        </p>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-[#C18A35] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#E8DED0] hover:text-[#593719] transition-all duration-300"
        >
          Get In Touch
        </Link>

      </section>

    </main>
  );
}
