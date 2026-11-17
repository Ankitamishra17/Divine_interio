// import Link from "next/link";
// import { notFound } from "next/navigation";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const BACKEND_URL = API_URL?.replace(/\/api\/?$/, "");

// export default async function UpcomingProjectDetails({ params }) {
//   const { id } = await params;

//   let project = null;

//   // =========================================================
//   // FETCH PROJECT
//   // =========================================================

//   try {
//     const response = await fetch(`${API_URL}/upcoming-projects/${id}`, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       notFound();
//     }

//     const data = await response.json();

//     console.log("Upcoming Project Details:", data);

//     project = data.project || data.data || data.upcomingProject || null;
//   } catch (error) {
//     console.error("Error fetching upcoming project:", error);

//     notFound();
//   }

//   // =========================================================
//   // PROJECT NOT FOUND
//   // =========================================================

//   if (!project) {
//     notFound();
//   }

//   // =========================================================
//   // MAIN IMAGE URL
//   // =========================================================

//   const imageUrl = project.image
//     ? project.image.startsWith("http")
//       ? project.image
//       : `${BACKEND_URL}${project.image}`
//     : "/image/placeholder.webp";

//   // =========================================================
//   // GALLERY NORMALIZATION
//   // =========================================================

//   let gallery = [];

//   if (Array.isArray(project.gallery)) {
//     gallery = project.gallery;
//   } else if (typeof project.gallery === "string") {
//     try {
//       gallery = JSON.parse(project.gallery || "[]");
//     } catch (error) {
//       console.error("Invalid gallery JSON:", error);

//       gallery = [];
//     }
//   }

//   // Make sure gallery is actually an array
//   if (!Array.isArray(gallery)) {
//     gallery = [];
//   }

//   // =========================================================
//   // GALLERY IMAGE URL
//   // =========================================================

//   const getGalleryImageUrl = (imagePath) => {
//     if (!imagePath) {
//       return "/image/placeholder.webp";
//     }

//     if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
//       return imagePath;
//     }

//     return `${BACKEND_URL}${imagePath}`;
//   };

//   return (
//     <main className="min-h-screen bg-[##F7F3ED] pt-28 pb-20 px-6 sm:px-10 lg:px-16">
//       <div className="mx-auto max-w-7xl">
//         {/* =====================================================
//             BACK TO HOME
//         ===================================================== */}

//         <Link
//           href="/"
//           className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#3D1F0D] transition hover:text-[#C8972B] sm:text-sm"
//         >
//           ← Back to Home
//         </Link>

//         {/* =====================================================
//             MAIN PROJECT SECTION
//         ===================================================== */}

//         <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
//           {/* ===================================================
//               MAIN IMAGE
//           =================================================== */}

//           <div className="relative overflow-hidden bg-[#E8DCCF]">
//             <img
//               src={imageUrl}
//               alt={project.alt || project.title || "Upcoming interior project"}
//               className="h-[400px] w-full object-cover sm:h-[550px] lg:h-[650px]"
//             />

//             {/* GOLD TOP LINE */}

//             <div className="absolute inset-x-0 top-0 h-[3px] bg-[#C8972B]" />
//           </div>

//           {/* ===================================================
//               PROJECT CONTENT
//           =================================================== */}

//           <div>
//             {/* LABEL */}

//             <p className="mb-4 mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8972B] lg:mt-0">
//               <span className="h-px w-8 bg-[#C8972B]" />
//               Upcoming Project
//             </p>

//             {/* TITLE */}

//             <h1 className="mb-6 font-marcellus text-4xl leading-tight tracking-wide text-[#3D1F0D] sm:text-5xl lg:text-6xl">
//               {project.title}
//             </h1>

//             {/* GOLD LINE */}

//             <div className="mb-6 h-px w-16 bg-[#C8972B]" />

//             {/* DESCRIPTION */}

//             {project.description ? (
//               <p className="mb-8 text-base font-light leading-relaxed text-[#5F554E] sm:text-lg">
//                 {project.description}
//               </p>
//             ) : project.alt ? (
//               <p className="mb-8 text-base font-light leading-relaxed text-[#5F554E] sm:text-lg">
//                 {project.alt}
//               </p>
//             ) : (
//               <p className="mb-8 text-base font-light leading-relaxed text-[#5F554E] sm:text-lg">
//                 Explore our upcoming interior design project, thoughtfully
//                 planned with modern design, quality materials, and attention to
//                 every detail.
//               </p>
//             )}

//             {/* =================================================
//                 PROJECT INFO
//             ================================================= */}

//             <div className="border-t border-[#3D1F0D]/10 pt-6">
//               <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#C8972B]">
//                 Living Space Decor
//               </p>

//               <p className="text-sm leading-relaxed text-[#6B6B6B]">
//                 Designed with elegance, functionality and attention to detail.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* =====================================================
//             GALLERY SECTION
//         ===================================================== */}

//         {gallery.length > 0 && (
//           <section className="mt-20 border-t border-[#3D1F0D]/10 pt-12 sm:mt-24">
//             {/* GALLERY HEADER */}

//             <div className="mb-8">
//               <p className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8972B]">
//                 <span className="h-px w-8 bg-[#C8972B]" />
//                Upcoming Project Gallery
//               </p>

//               <h2 className="font-marcellus text-3xl tracking-wide text-[#3D1F0D] sm:text-4xl">
//                 Interior Design Details
//               </h2>

//               <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6B6B6B] sm:text-base">
//                 Explore more details of this upcoming interior design project
//                 through the project gallery.
//               </p>
//             </div>

//             {/* =================================================
//                 GALLERY GRID
//             ================================================= */}

//             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//               {gallery.map((image, index) => {
//                 const galleryUrl = getGalleryImageUrl(image);

//                 return (
//                   <div
//                     key={`${image}-${index}`}
//                     className="group relative overflow-hidden bg-[#E8DCCF]"
//                   >
//                     <img
//                       src={galleryUrl}
//                       alt={`${project.title || "Upcoming interior project"} - detail image ${
//                         index + 1
//                       }`}
//                       className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[350px] lg:h-[400px]"
//                       loading="lazy"
//                     />

//                     {/* TOP GOLD LINE */}

//                     <div className="absolute inset-x-0 top-0 h-[2px] bg-[#C8972B] opacity-0 transition duration-300 group-hover:opacity-100" />

//                     {/* IMAGE NUMBER */}

//                     <div className="absolute bottom-3 left-3 rounded-md bg-[#3D1F0D]/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white">
//                       {String(index + 1).padStart(2, "0")}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         )}

//         {/* =====================================================
//             BOTTOM CTA
//         ===================================================== */}

//         <section className="mt-20 border-t border-[#3D1F0D]/10 pt-12 text-center sm:mt-24">
//           <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8972B]">
//             Living Space Decor
//           </p>

//           <h2 className="font-marcellus text-3xl tracking-wide text-[#3D1F0D] sm:text-4xl">
//             Creating Beautiful Spaces
//           </h2>

//           <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#6B6B6B] sm:text-base">
//             From concept to completion, we create thoughtfully designed
//             interiors that combine elegance, functionality, and timeless style.
//           </p>

//           <Link
//             href="/contact"
//             className="mt-7 inline-flex items-center justify-center rounded-md bg-[#3D1F0D] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#542b15]"
//           >
//             Get in Touch
//           </Link>
//         </section>
//       </div>
//     </main>
//   );
// }

// New Design Feature

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ProjectGallery from "./ProjectGallery";

/*
  Palette (same as the home section)
  Espresso #593719 | Warm Gold #C18A35 | Ivory #F7F3ED
  Beige #E8DED0    | Charcoal #292622
*/

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");
const PLACEHOLDER = "/image/placeholder.webp";

const getImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${BACKEND_URL}${imagePath}`;
};

const normalizeGallery = (gallery) => {
  if (Array.isArray(gallery)) return gallery;
  if (typeof gallery === "string") {
    try {
      const parsed = JSON.parse(gallery || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default async function UpcomingProjectDetails({ params }) {
  const { id } = await params;

  // ---------- main project (notFound stays outside try/catch) ----------
  let project = null;

  try {
    const response = await fetch(`${API_URL}/upcoming-projects/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      project = data.project || data.data || data.upcomingProject || null;
    } else {
      console.error(`Project API responded ${response.status} for id "${id}"`);
    }
  } catch (error) {
    console.error("Error fetching upcoming project:", error);
  }

  if (!project) notFound();

  // ---------- other designs (optional, fails silently) ----------
  let others = [];

  try {
    const response = await fetch(`${API_URL}/upcoming-projects/latest`, {
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      others = (data.projects || [])
        .filter((p) => String(p.id) !== String(id))
        .slice(0, 3);
    }
  } catch (error) {
    console.error("Error fetching other projects:", error);
  }

  const heroUrl = getImageUrl(project.image);
  const galleryUrls = normalizeGallery(project.gallery).map(getImageUrl);
  const photoCount = new Set([heroUrl, ...galleryUrls]).size;

  return (
    <main className="bg-[#F7F3ED] selection:bg-[#593719] selection:text-[#F7F3ED]">
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-28 sm:px-8 md:pb-28 xl:px-12">
        {/* Back link */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#593719] transition-colors hover:text-[#C18A35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F3ED]"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          Back to home
        </Link>

        {/* Title block: title left, description right */}
        <header className="mt-8 grid gap-6 md:mt-10 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-16">
          <h1 className="font-heading text-4xl font-medium leading-[1.1] tracking-tight text-[#292622] md:text-5xl xl:text-[60px]">
            {project.title}
          </h1>

          <div className="md:pb-2">
            {project.description && (
              <p className="max-w-md text-[17px] leading-relaxed text-[#292622]/70">
                {project.description}
              </p>
            )}
            <p
              className={`text-sm text-[#292622]/55 ${
                project.description ? "mt-5" : ""
              }`}
            >
              {photoCount} {photoCount === 1 ? "photo" : "photos"}
            </p>
          </div>
        </header>

        {/* Hero + masonry gallery + lightbox (client component) */}
        <ProjectGallery
          title={project.title}
          heroUrl={heroUrl}
          galleryUrls={galleryUrls}
        />

        {/* More designs */}
        {others.length > 0 && (
          <section className="mt-20 border-t border-[#593719]/15 pt-14 md:mt-28">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h2 className="font-heading text-3xl font-medium tracking-tight text-[#292622] md:text-4xl">
                More designs
              </h2>
              <Link
                href="/portfolio"
                className="text-[15px] font-semibold text-[#593719] transition-colors hover:text-[#C18A35]"
              >
                See all projects
              </Link>
            </div>

            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/upcoming-project/${p.id}`}
                    aria-label={`View ${p.title}`}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C18A35] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F3ED]"
                  >
                    <span className="block aspect-[4/3] overflow-hidden rounded-sm bg-[#E8DED0]">
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.alt || p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
                      />
                    </span>
                    <span className="mt-4 flex items-center justify-between gap-4">
                      <span className="truncate font-heading text-xl font-medium text-[#292622] decoration-[#C18A35] decoration-2 underline-offset-[6px] group-hover:text-[#593719] group-hover:underline">
                        {p.title}
                      </span>
                      <ArrowUpRight
                        size={18}
                        className="flex-shrink-0 text-[#593719]"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Contact band */}
        <section className="mt-20 rounded-sm bg-[#593719] px-6 py-12 text-[#F7F3ED] md:mt-28 md:px-14 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-medium leading-tight md:text-4xl">
                Like what you see?
              </h2>
              <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-[#F7F3ED]/75">
                Tell us about your space and we will get back to you with ideas
                and next steps.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex flex-shrink-0 items-center justify-center self-start rounded-sm bg-[#C18A35] px-7 py-3.5 text-[15px] font-semibold text-[#292622] transition-colors hover:bg-[#F7F3ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F3ED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#593719] md:self-auto"
            >
              Talk to our team
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}