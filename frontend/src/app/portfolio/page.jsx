
import Link from "next/link";
import { getProjects } from "@/lib/serverApi";
import ProjectCard from "@/components/ProjectCard";
import GridPagination from "@/components/GridPagination";

export const metadata = {
  title: "Portfolio — Studio",
  description: "Explore our luxury interior design projects.",
};

export default async function PortfolioPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam, 10) || 1;

  const { data: projects, pagination } = await getProjects({
    page,
    limit: 12,
  });

  return (
    <main className="min-h-screen bg-[#F7F3ED] text-[#292622]">

      {/* Hero Section */}
      <section className="relative h-[420px] md:h-[520px] w-full overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/banner/9.png')" }}
        />

        <div className="absolute inset-0 bg-[#292622]/75" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">

          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-px bg-[#dba343]" />

            <p className="text-[11px] md:text-xs tracking-[0.4em] uppercase text-[#dba343] font-semibold">
              Luxury Interior Studio
            </p>

            <span className="w-9 h-px bg-[#dba343]" />
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-normal text-[#FFFFFF] mb-5">
            Our <span className="text-[#dba343]">Portfolio</span>
          </h1>

          <span className="w-16 h-px bg-[#dba343] mb-6" />

          <p className="text-[#F7F3ED]/80 max-w-xl mx-auto font-body font-light leading-relaxed mb-7">
            Explore our finest work — spaces designed with purpose,
            crafted with passion, and built to inspire.
          </p>

          <div className="flex items-center gap-3 text-sm font-body">
            <Link
              href="/"
              className="text-white/80 hover:text-[#dba343] transition-colors"
            >
              Home
            </Link>

            <span className="text-white/40">/</span>

            <span className="text-[#dba343]">Portfolio</span>
          </div>
        </div>
      </section>

      {/* Section Heading */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 pt-20 pb-12 text-center">

        <p className="text-[10px] tracking-[0.4em] uppercase text-[#dba343] font-semibold mb-5 font-body">
          Our Work
        </p>

        <h2 className="font-heading text-4xl md:text-5xl font-normal text-[#593719] mb-5">
          Selected Projects
        </h2>

        <span className="block w-14 h-px bg-[#dba343] mx-auto mb-6" />

        <p className="text-[#292622]/65 max-w-xl mx-auto font-body font-light leading-relaxed">
          A collection of interiors we've designed and built,
          room by room.
        </p>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pb-24">

        {projects.length === 0 ? (
          <p className="text-center text-[#593719]/60 py-20 font-body">
            No projects published yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <GridPagination
          basePath="/portfolio"
          pagination={pagination}
        />

      </section>
    </main>
  );
}
