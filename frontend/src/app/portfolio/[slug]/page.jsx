import { notFound } from "next/navigation";
import { getProject } from "@/lib/serverApi";
import ProjectDetail from "@/components/ProjectDetail";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const { data: project } = await getProject(slug);

    return {
      title: `${project.name} | Divine Interio`,
      description: project.description,

      keywords: [
        project.name,
        "Interior Design Portfolio",
        "Home Interior",
        "Divine Interio",
        "Interior Designer",
      ],

      alternates: {
        canonical: `https://divineintrio.in/portfolio/${slug}`,
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: "Portfolio | Divine Interio",
      description:
        "Explore our portfolio of premium interior design and home decor projects by Divine Interio.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  let project;
  try {
    const res = await getProject(slug);
    project = res.data;
  } catch {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
