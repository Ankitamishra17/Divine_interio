// import HeroSection from "@/components/home/HeroSection";
// import Services from "@/components/home/Services";
// import Portfolio from "@/components/home/Portfolio";
// import Testimonials from "@/components/home/Testimonials";
// import TrustStrip from "@/components/home/TrustStrip";
// import CTASection from "@/components/home/CTASection";
// import WhyChoose from "@/components/home/WhyChoose";
// import UpcomingProjects from "@/components/home/UpcomingProjects";
// import { getProjects } from "@/lib/serverApi";
// import Contact from "@/components/home/Contact";

// export default async function Home() {

//   const { data: projects } = await getProjects({
//     page: 1,
//     limit: 5,
//   });
//   return (
//     <>
//       <HeroSection />
  
//       <UpcomingProjects/>
//        <Portfolio portfolio={projects} />
//            <Services />
//       <WhyChoose />
//       <TrustStrip />
//       <CTASection />
//       <Testimonials />
//       <Contact/>
//     </>
//   );
// }


export default async function Home() {
  const { data: projects } = await getProjects({
    page: 1,
    limit: 5,
  });

  return (
    <>
      <h1>Divine Interior Website</h1>
    </>
  );
}