import KitchenCostCalculator from "@/components/kitchenCalculator/KitchenCostCalculator";

export const metadata = {
  title: "Modular Kitchen Cost Calculator | Divine Interio",

  description:
    "Estimate your modular kitchen cost instantly with the Divine Interio Kitchen Cost Calculator. Get an approximate price based on kitchen size, layout, materials, finishes, and accessories for your dream kitchen.",

  keywords: [
    "Modular Kitchen Cost Calculator",
    "Kitchen Cost Calculator",
    "Modular Kitchen Price",
    "Kitchen Interior Cost",
    "Kitchen Design Cost",
    "Interior Designer in Noida",
    "Divine Interio",
  ],

  alternates: {
    canonical: "https://divineintrio.in/kitchen-calculator",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <KitchenCostCalculator />;
}
