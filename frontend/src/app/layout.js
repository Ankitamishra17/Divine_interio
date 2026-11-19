import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";
import { Philosopher, Jost } from "next/font/google";

const heading = Philosopher({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-philosopher",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://divineinterio.in"),

  title: {
    default: "Divine Interio | Interior Designers in Noida & Greater Noida",
    template: "%s | Divine Interio",
  },

  description:
"Divine Interio designs elegant homes and offices with premium interiors, modular kitchens, wardrobes, and turnkey solutions across Delhi NCR.",
  keywords: [
    "Divine Interio",
    "Interior Designers in Noida",
    "Interior Designers in Greater Noida",
    "Best Interior Designers in Noida",
    "Home Interior Design",
    "Luxury Home Interior Design",
    "Modular Kitchen Design",
    "Custom Wardrobe Design",
    "Turnkey Interior Solutions",
    "Living Room Interior Design",
    "Bedroom Interior Design",
    "Residential Interior Design",
    "Commercial Interior Design",
    "Interior Designers in Delhi NCR",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Divine Interio | Premium Interior Designers in Noida & Delhi NCR",
    description:
      "Transform your spaces with Divine Interio. Discover premium home interiors, modular kitchens, custom wardrobes, and complete turnkey interior solutions across Noida and Delhi NCR.",
    url: "https://divineinterio.in",
    siteName: "Divine Interio",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Divine Interio | Premium Interior Designers",
    description:
      "Thoughtfully designed homes and commercial spaces by Divine Interio. Explore premium interior design and turnkey solutions across Delhi NCR.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col font-body">
        <LayoutWrapper>{children}</LayoutWrapper>

        {/* Google Ads Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17926113492"
          strategy="afterInteractive"
        />

        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17926113492');
          `}
        </Script>
      </body>
    </html>
  );
}
