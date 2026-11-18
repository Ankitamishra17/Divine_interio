
import { getBlogs } from "@/lib/serverApi";
import BlogCard from "@/components/BlogCard";
import GridPagination from "@/components/GridPagination";
import Link from "next/link";

export const metadata = {
  title: "Journal — Studio",
  description:
    "Discover interior design inspiration, ideas, materials and stories.",
};

export default async function BlogPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam, 10) || 1);

  const { data: posts, pagination } = await getBlogs({
    page,
    limit: 9,
  });

  return (
    <main className="min-h-screen bg-[#F7F3ED] text-[#292622]">

      {/* Premium Hero Section */}
      <section className="relative w-full min-h-[560px] h-[75vh] max-h-[820px] overflow-hidden bg-[#292622]">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/banner/blog.png')",
            backgroundPosition: "center center",
          }}
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/65" />


        {/* Hero Content */}
        <div className="relative z-10 flex min-h-[560px] h-full flex-col items-center justify-center px-6 py-24 text-center">

          <div className="flex items-center gap-4 mb-7">
            <span className="w-10 md:w-14 h-px bg-[#D6A34B]" />

            <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#E0B665] font-semibold">
              The Art of Beautiful Living
            </p>

            <span className="w-10 md:w-14 h-px bg-[#D6A34B]" />
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[90px] leading-[1.1] font-normal text-white mb-7">
            The{" "}
            <span className="text-[#D6A34B] ">
              Journal
            </span>
          </h1>

          <span className="w-16 h-px bg-[#D6A34B] mb-7" />

          <p className="text-white/85 max-w-lg text-sm md:text-base font-light leading-8 mb-9">
            A collection of thoughts, inspirations and stories
            exploring the beauty of thoughtful interiors,
            timeless materials and meaningful spaces.
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center gap-4 text-xs tracking-widest uppercase">
            <Link
              href="/"
              className="text-white/70 hover:text-[#D6A34B] transition-colors"
            >
              Home
            </Link>

            <span className="text-[#D6A34B]">/</span>

            <span className="text-[#D6A34B]">
              Journal
            </span>
          </div>

        </div>

       

      </section>

      {/* Journal Introduction */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pt-20 md:pt-28 pb-14">

        <div className="max-w-3xl mx-auto text-center">

          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-7 h-px bg-[#D6A34B]" />

            <p className="text-[10px] tracking-[0.4em] uppercase text-[#B8873B] font-semibold">
              Stories & Inspiration
            </p>

            <span className="w-7 h-px bg-[#D6A34B]" />
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-tight font-normal text-[#593719] mb-6">
            Ideas That Inspire Living
          </h2>

          <span className="block w-14 h-px bg-[#D6A34B] mx-auto mb-7" />

          <p className="text-[#292622]/65 max-w-2xl mx-auto font-light text-sm md:text-base leading-8">
            Discover a world of thoughtful interiors, creative
            expressions and timeless design. Explore ideas,
            materials and stories that bring beautiful spaces
            to life.
          </p>

        </div>

      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pb-24">

        {/* Grid Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#D9CFC1] pb-5 mb-9">

          <div>
            <p className="font-heading text-xl md:text-2xl text-[#593719]">
              Latest Stories
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#292622]/50 mt-2">
              Explore our journal
            </p>
          </div>

          <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8873B]">
            {pagination?.totalItems ?? posts.length} Stories
          </span>

        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="mt-16 pt-8 border-t border-[#D9CFC1]">
            <GridPagination
              basePath="/blog"
              pagination={pagination}
            />
          </div>
        )}

      </section>

    </main>
  );
}
