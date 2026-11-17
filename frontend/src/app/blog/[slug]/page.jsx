import { notFound } from "next/navigation";
import { getBlog } from "@/lib/serverApi";
import BlogDetail from "@/components/BlogDetail";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const { data: post } = await getBlog(slug);

    return {
      title: `${post.title} | Divine Interio`,
      description: post.excerpt,

      keywords: post.tags || [
        "Interior Designer in Greater Noida",
        "Interior Designer",
        "Home Interior",
        "Divine Interio",
        "Modular Kitchen",
      ],

      alternates: {
        canonical: `https://livingspacedecor.in/blog/${slug}`,
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: "Blog | Divine Interio",
      description: "Interior designer blogs by Divine Interio.",
    };
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  let post;
  try {
    const res = await getBlog(slug);
    post = res.data;
  } catch {
    notFound();
  }

  return <BlogDetail post={post} />;
}
