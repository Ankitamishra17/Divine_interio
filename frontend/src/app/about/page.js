
import AboutHero from "@/components/about/About_Hero";
import CompanyStats from "@/components/about/CompanyStats";
import OurMissionVision from "@/components/about/OurMissionVision";
import OurStory from "@/components/about/OurStory";

export const metadata = {
  title: "About Divine Interiors | Luxury Interior Design Studio",
  description:
    "Discover Divine Interiors, a creative interior design studio crafting beautiful, functional and personalized residential and commercial spaces. Explore our story, design philosophy and commitment to quality.",
  keywords: [
    "About Divine Interiors",
    "Interior Design Studio",
    "Luxury Interior Design",
    "Residential Interior Design",
    "Commercial Interior Design",
    "Modular Kitchen",
    "Interior Designers",
  ],
  openGraph: {
    title: "About Divine Interiors | Crafting Beautiful Spaces",
    description:
      "Meet the team behind Divine Interiors and discover our passion for creating timeless, functional and personalized spaces.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurStory/>
      <CompanyStats/>
      <OurMissionVision/>
      
    </main>
  );
}
