import ContactHeroSection from "@/components/contact/ContactHeroSection";
import ContactForm from "@/components/contact/ContactForm";
import GoogleMap from "@/components/contact/GoogleMap";
import FAQSection from "@/components/contact/FAQSection";

export const metadata = {
  title: "Contact Us | Divine Interio - Interior Designers in Noida",

  description:
    "Contact Divine Interio for expert interior design services in Noida, Greater Noida, and Ghaziabad. Book a free consultation today.",
  keywords: [
    "Contact Divine Interio",
    "Interior Designer Contact",
    "Interior Designer in Noida",
    "Interior Designer in Greater Noida",
    "Modular Kitchen Designer",
    "Wardrobe Design",
    "Divine Interio",
  ],

  alternates: {
    canonical: "https://divineintrio.in/contact",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactForm />
      {/* <GoogleMap /> */}
      <FAQSection />
    </>
  );
}
