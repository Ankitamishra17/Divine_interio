
import { designIdeas } from "@/data/designIdeas";
import { notFound } from "next/navigation";
import DesignHero from "@/components/common/DesignHero";
import MoodBoard from "@/components/common/MoodBoard";
import DesignGallery from "@/components/common/DesignGallery";
import FAQ from "@/components/common/FAQ";
import CTASection from "@/components/common/CTASection";
import Details from "@/components/common/Details";

export function generateStaticParams() {
  return designIdeas.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const design = designIdeas.find((item) => item.slug === slug);

  if (!design) {
    return {
      title: "Interior Design Ideas | Divine Interio",
      description:
        "Discover inspiring home interior design ideas, elegant spaces, and modern design concepts with Divine Interio.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${design.title} | Divine Interio`,

    description: design.description,

    keywords: [
      design.title,
      "Divine Interio",
      "Interior Design",
      "Home Interior Design",
      "Modern Interior Design",
      "Luxury Interior Design",
      "Interior Design Ideas",
      "Residential Interior Design",
      "Interior Designers in Noida",
      "Interior Designers in Greater Noida",
      "Interior Designers in Delhi NCR",
    ],

    alternates: {
      canonical: `https://divineinterio.in/services/design-ideas/${slug}`,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },

    openGraph: {
      title: `${design.title} | Divine Interio`,
      description: design.description,
      url: `https://divineinterio.in/services/design-ideas/${slug}`,
      siteName: "Divine Interio",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  const design = designIdeas.find((item) => item.slug === slug);

  if (!design) {
    notFound();
  }

  const detailTypeMap = {
    "living-room-design": "livingRoom",
    "bedroom-design": "bedroom",
    "bathroom-design": "bathroom",
    "dining-room-design": "diningRoom",
    "home-office-design": "homeOffice",
    "kids-room-design": "kidsRoom",
    "mandir-design": "mandir",
    "balcony-terrace-design": "balconyTerrace",
    "kitchen-design-ideas": "modularKitchen",
  };

  return (
    <>
      <DesignHero data={design} />
      <DesignGallery data={design} />
      <MoodBoard data={design} />
      <Details type={detailTypeMap[slug]} />
      <FAQ data={design} />
      <CTASection data={design} />
    </>
  );
}
