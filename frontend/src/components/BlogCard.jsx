
import Link from "next/link";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/imageUrl";

export default function BlogCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white border border-[#E8DED0] overflow-hidden rounded-sm
      hover:border-[#C18A35]/60
      hover:shadow-[0_15px_40px_rgba(89,55,25,0.12)]
      hover:-translate-y-1 transition-all duration-500"
    >
      {/* Blog Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E8DED0]">

        <Image
          src={resolveImageUrl(post.coverImage)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-[#292622]/0 group-hover:bg-[#292622]/10 transition-all duration-500" />

        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-4 left-4 bg-[#F7F3ED] px-4 py-2">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#593719] font-semibold font-body">
              {post.category}
            </p>
          </div>
        )}
      </div>

      {/* Blog Content */}
      <div className="p-6 md:p-7">

        {/* Category + Read Time */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#C18A35] font-semibold font-body">
            Journal
          </span>

          {post.readTime && (
            <p className="text-[11px] text-[#292622]/45 font-body">
              {post.readTime}
            </p>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl md:text-2xl text-[#593719] mb-3 leading-snug group-hover:text-[#C18A35] transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-[#292622]/65 leading-relaxed line-clamp-3 font-body font-light">
            {post.excerpt}
          </p>
        )}

        {/* Read More */}
        <div className="mt-6 pt-4 border-t border-[#E8DED0]">
          <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-[#593719] font-semibold font-body group-hover:text-[#C18A35] transition-colors duration-300">
            Read Article
            <span className="transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </span>
        </div>

      </div>
    </Link>
  );
}
