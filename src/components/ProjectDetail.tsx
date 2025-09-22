import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg?react";
import { useTransition } from "../context/TransitionContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Import all project images
// Juniper project images
import juniperS1 from "../assets/projects/juniper-still (1).jpg"
import juniperS2 from "../assets/projects/juniper-still (2).jpg"
import juniperS3 from "../assets/projects/juniper-still (3).jpg"
import juniperA1 from "../assets/projects/juniper-a (1).jpg";
import juniperA2 from "../assets/projects/juniper-a (2).jpg";
import juniperA3 from "../assets/projects/juniper-a (3).jpg";
import juniperA4 from "../assets/projects/juniper-a (4).jpg";
import juniperB1 from "../assets/projects/juniper-b (1).jpg";
import juniperB2 from "../assets/projects/juniper-b (2).jpg";
import juniperB3 from "../assets/projects/juniper-b (3).jpg";
import juniperB4 from "../assets/projects/juniper-b (4).jpg";

// Lucero project images
import luceroA1 from "../assets/projects/lucero-a (1).png";
import luceroA2 from "../assets/projects/lucero-a (2).png";
import luceroA3 from "../assets/projects/lucero-a (3).png";
import luceroA4 from "../assets/projects/lucero-a (4).png";
import luceroB1 from "../assets/projects/lucero-b (1).png";
import luceroB2 from "../assets/projects/lucero-b (2).png";
import luceroB3 from "../assets/projects/lucero-b (3).png";
import luceroB4 from "../assets/projects/lucero-b (4).png";
import luceroReal from "../assets/projects/lucero-real.png";
import luceroS1 from "../assets/projects/lucero-still (1).png"
import luceroS2 from "../assets/projects/lucero-still (2).png"
import luceroS3 from "../assets/projects/lucero-still (3).png"

// McKnight project images
import mcknightA1 from "../assets/projects/mcknight-a (1).png";
import mcknightA2 from "../assets/projects/mcknight-a (2).png";
import mcknightA3 from "../assets/projects/mcknight-a (3).png";
import mcknightA4 from "../assets/projects/mcknight-a (4).png";
import mcknightB1 from "../assets/projects/mcknight-b (1).png";
import mcknightB2 from "../assets/projects/mcknight-b (2).png";
import mcknightB3 from "../assets/projects/mcknight-b (3).png";
import mcknightB4 from "../assets/projects/mcknight-b (4).png";
import mcknightReal from "../assets/projects/mcknight-real-warped.png";

// Brunson project images
import brunsonA1 from "../assets/projects/brunson-a (1).png";
import brunsonA2 from "../assets/projects/brunson-a (2).png";
import brunsonA3 from "../assets/projects/brunson-a (3).png";
import brunsonA4 from "../assets/projects/brunson-a (4).png";
import brunsonB1 from "../assets/projects/brunson-b (1).png";
import brunsonB2 from "../assets/projects/brunson-b (2).png";
import brunsonB3 from "../assets/projects/brunson-b (3).png";
import brunsonB4 from "../assets/projects/brunson-b (4).png";
import brunsonReal from "../assets/projects/brunson-real.jpg";

interface ProjectDetailProps {
  project: {
    id: string;
    number: string;
    title: string;
    image: string;
    image360: string;
    description: string;
  };
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const navigate = useNavigate();
  const { startTransition } = useTransition();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get all project images based on project ID
  const projectImages = React.useMemo(() => {
    const images: Record<string, { src: string; label: string }[]> = {
      juniper: [
        { src: juniperS2, label: "" },
        { src: juniperS1, label: "" },
        { src: juniperA1, label: "Option A - Daylight" },
        { src: juniperS3, label: "" },
        { src: juniperA2, label: "Option A - Forenoon" },
        { src: juniperA3, label: "Option A - Golden Hour" },
        { src: juniperA4, label: "Option A - Twilight" },
        { src: juniperB1, label: "Option B - Daylight" },
        { src: juniperB2, label: "Option B - Golden Hour" },
        { src: juniperB3, label: "Option B - Nightfall" },
        { src: juniperB4, label: "Option B - Twilight" },
      ],
      lucero: [
        { src: luceroS1, label: "" },
        { src: luceroS3, label: "" },
        { src: luceroA1, label: "Option A - Daylight" },
        { src: luceroS2, label: "" },
        { src: luceroA2, label: "Option A - Golden Hour" },
        { src: luceroA3, label: "Option A - Nightfall" },
        { src: luceroA4, label: "Option A - Twilight" },
        { src: luceroB1, label: "Option B - Daylight" },
        { src: luceroB2, label: "Option B - Golden Hour" },
        { src: luceroB3, label: "Option B - Nightfall" },
        { src: luceroB4, label: "Option B - Twilight" },
        { src: luceroReal, label: "Real Photo" },
      ],
      mcknight: [
        { src: mcknightA1, label: "Option A - Daylight" },
        { src: mcknightA2, label: "Option A - Golden Hour" },
        { src: mcknightA3, label: "Option A - Nightfall" },
        { src: mcknightA4, label: "Option A - Twilight" },
        { src: mcknightB1, label: "Option B - Daylight" },
        { src: mcknightB2, label: "Option B - Golden Hour" },
        { src: mcknightB3, label: "Option B - Nightfall" },
        { src: mcknightB4, label: "Option B - Twilight" },
        { src: mcknightReal, label: "Real Photo" },
      ],
      brunson: [
        { src: brunsonA1, label: "Option A - Daylight" },
        { src: brunsonA2, label: "Option A - Golden Hour" },
        { src: brunsonA3, label: "Option A - Nightfall" },
        { src: brunsonA4, label: "Option A - Twilight" },
        { src: brunsonB1, label: "Option B - Daylight" },
        { src: brunsonB2, label: "Option B - Golden Hour" },
        { src: brunsonB3, label: "Option B - Nightfall" },
        { src: brunsonB4, label: "Option B - Twilight" },
        { src: brunsonReal, label: "Real Photo" },
      ],
    };
    return images[project.id] || [];
  }, [project.id]);

  const openPreview = (imageSrc: string) => {
    setPreviewImage(imageSrc);
    setIsPreviewMode(true);
  };

  const closePreview = () => {
    setIsPreviewMode(false);
    setPreviewImage("");
  };

  const trackRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (idx: number) => {
    if (!trackRef.current) return;
    const len = projectImages.length;
    const next = (idx + len) % len;
    const el = slidesRef.current[next];
    if (!el) return;
    trackRef.current.scrollTo({ left: el.offsetLeft, behavior: "smooth" });
    setActiveIndex(next);
  };

  const onPrev = () => scrollToIndex(activeIndex - 1);
  const onNext = () => scrollToIndex(activeIndex + 1);

  // keep dots/arrow state in sync as user drags
  useEffect(() => {
    if (!trackRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { root: trackRef.current, threshold: 0.6 }
    );
    slidesRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [projectImages.length]);


  // Escape key handler for preview mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewMode) {
        closePreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode]);

  return (
    <div className="min-h-screen">
      <header className="z-50 p-2 lg:p-6">
        <div className="flex items-center justify-center">
          <nav className="absolute left-4 lg:left-8">
            <div className="flex items-center text-2xl md:text-3xl text-primary cursor-pointer">
              <ArrowBackIcon onClick={(e) => {
                e.preventDefault();
                startTransition("in", () => navigate("/"));
              }} sx={{ fontSize: 'inherit' }} />
            </div>
          </nav>
          <Logo fill="currentColor" className="h-8 text-primary self-center cursor-pointer" onClick={(e) => {
            e.preventDefault();
            startTransition("in", () => navigate("/"));
          }} />

        </div>
      </header>


      {/* Project Details */}
      <div className="mx-auto">
        <section className="h-[50vh] md:h-[75vh] lg:h-[65vh]">
          <div className="relative flex h-full items-center">
            {/* Prev */}
            {projectImages.length > 1 && (
              <button
                onClick={onPrev}
                className="absolute left-0 top-1/2 z-10 mx-4 -translate-y-1/2 rounded-full bg-white/90 p-2 text-primary shadow-lg transition-all duration-300 hover:bg-white md:p-3"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="text-2xl" />
              </button>
            )}

            {/* DaisyUI carousel (no anchors) */}
            <div
              ref={trackRef}
              className="carousel carousel-center w-full h-full gap-4 overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {projectImages.map((image, index) => (
                <div
                  key={index}
                  ref={(el: HTMLDivElement | null) => {
                    // IMPORTANT: braces => no implicit return value
                    slidesRef.current[index] = el;
                  }}
                  data-idx={index}
                  className="carousel-item w-full snap-start justify-center"
                  onClick={() => openPreview(image.src)}
                >
                  <div className="group relative h-full w-auto overflow-hidden bg-white">
                    <img
                      src={image.src}
                      alt={image.label}
                      className="block h-full w-auto min-w-0 object-contain"
                      loading={index === 0 ? undefined : "eager"}
                      decoding="async"
                    />

   

                    {/* Hover affordance */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/0 transition-all duration-300 group-hover:bg-primary/10">
                      <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-white text-lg font-sans">
                        Click to view
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next */}
            {projectImages.length > 1 && (
              <button
                onClick={onNext}
                className="absolute right-0 top-1/2 z-10 mx-4 -translate-y-1/2 rounded-full bg-white/90 p-2 text-primary shadow-lg transition-all duration-300 hover:bg-white md:p-3"
                aria-label="Next"
              >
                <ChevronRightIcon className="text-2xl" />
              </button>
            )}
          </div>

          {/* Optional dots */}
          {projectImages.length > 1 && (
            <div className="mt-3 flex justify-center gap-1.5">
              {projectImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition ${i === activeIndex ? "w-6 bg-neutral-900" : "w-2 bg-neutral-300 hover:bg-neutral-400"}`}
                />
              ))}
            </div>
          )}
        </section>
        <section className="container mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <div className="text-xs sm:text-sm font-sans uppercase tracking-wider text-neutral">
                {project.number}
              </div>
              <div className="text-4xl sm:text-5xl lg:text-7xl font-title text-primary leading-tight">
                {project.title}
              </div>
              {project.id === "mcknight" && (
                <p className="text-sm sm:text-base font-roboto text-neutral leading-relaxed mt-2">
                  Designed by{" "}
                  <a
                    href="https://www.housesprucing.com/portfolio/mindy-mcknight-project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-primary transition-colors duration-300"
                  >
                    House Sprucing{" "}
                    <OpenInNewIcon className="inline-block text-xs sm:text-sm" />
                  </a>
                </p>
              )}
            </div>

            <div>
              <h2 className="text-lg sm:text-xlfont-tiempos font-title text-primary mb-2">
                About
              </h2>
              <p className="text-sm sm:text-base lg:text-lg font-roboto text-neutral leading-relaxed">
                {project.description}
              </p>
              <p className="text-xs sm:text-sm lg:text-md font-roboto text-neutral leading-relaxed mt-4">
                <span className="font-semibold text-primary">
                  At Renova, customization is limitless.
                </span>
                <br />
                From materials and finishes to lighting and layout, we tailor
                every detail to your vision—bringing your unique style to life
                with precision and realism.
              </p>
            </div>
          </div>
        </section>
      </div>


      {/* Image Preview Modal */}
      {isPreviewMode && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={closePreview}
        >
          <button
            className="absolute top-8 right-8 text-white text-4xl hover:text-gray-300 transition-colors duration-300"
            onClick={closePreview}
          >
            ×
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}


    </div>
  );
};

export default ProjectDetail;
