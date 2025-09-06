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
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

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

  const handleGoBack = (event: React.MouseEvent) => {
    event.preventDefault();
    startTransition("out", () => {
      // send an instruction for Home to scroll to "portfolio"
      navigate("/", { state: { scrollTo: "portfolio" } });
    });
  };
  const openPreview = (imageSrc: string) => {
    setPreviewImage(imageSrc);
    setIsPreviewMode(true);
  };

  const closePreview = () => {
    setIsPreviewMode(false);
    setPreviewImage("");
  };

  const animIdRef = useRef<number | null>(null);

  const cancelAnim = () => {
    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    animIdRef.current = null;
  };

  // Temporarily disable scroll-snap during animation so the browser doesn't "grab" the scroll
  const animateScrollTo = (target: number, duration = 600) => {
    const sc = scrollContainerRef.current;
    if (!sc) return;

    cancelAnim();

    const start = sc.scrollLeft;
    const delta = target - start;
    if (Math.abs(delta) < 0.5) {
      sc.scrollLeft = target;
      return;
    }

    // Save & disable snap just for the tween
    const originalSnap = sc.style.scrollSnapType;
    sc.style.scrollSnapType = 'none';

    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const t0 = performance.now();

    const step = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = easeInOutQuad(p);
      sc.scrollLeft = start + delta * eased;

      if (p < 1) {
        animIdRef.current = requestAnimationFrame(step);
      } else {
        // restore snap after animation ends (use proximity/mandatory in your CSS)
        sc.style.scrollSnapType = originalSnap;
        animIdRef.current = null;
      }
    };

    animIdRef.current = requestAnimationFrame(step);
  };

  const leftOf = (el: HTMLElement, sc: HTMLElement) => {
    const er = el.getBoundingClientRect();
    const sr = sc.getBoundingClientRect();
    return er.left - sr.left + sc.scrollLeft;
  };

  const getItems = () =>
    Array.from(scrollContainerRef.current?.children ?? []) as HTMLElement[];

  // First item whose left edge is strictly to the right of current viewport left
  const nextIndex = (sc: HTMLElement, items: HTMLElement[]) => {
    const x = sc.scrollLeft + 1; // small epsilon
    for (let i = 0; i < items.length; i++) {
      if (leftOf(items[i], sc) > x) return i;
    }
    return items.length - 1;
  };

  // Last item whose left edge is strictly to the left of current viewport left
  const prevIndex = (sc: HTMLElement, items: HTMLElement[]) => {
    const x = sc.scrollLeft - 1;
    let idx = 0;
    for (let i = 0; i < items.length; i++) {
      if (leftOf(items[i], sc) < x) idx = i;
      else break;
    }
    return idx;
  };

  /**
   * Scroll to index with an option to allow a no-op if already at that item.
   * This prevents the "first item + click left jumps forward" bug.
   */
  const scrollToIdx = (idx: number, allowNoop = true, duration = 600) => {
    const sc = scrollContainerRef.current;
    if (!sc) return;
    const items = getItems();
    if (!items.length) return;

    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    const target = leftOf(items[clamped], sc);
    const diff = Math.abs(target - sc.scrollLeft);

    if (diff < 1 && allowNoop) {
      // already aligned; do nothing
      return;
    }
    animateScrollTo(target, duration);
  };

  const scrollRight = () => {
    const sc = scrollContainerRef.current;
    if (!sc) return;
    const items = getItems();
    if (!items.length) return;

    const idx = nextIndex(sc, items);
    // when moving right, if we're already perfectly on that idx, advance one more (if possible)
    const alignedTarget = leftOf(items[idx], sc);
    const alreadyAligned = Math.abs(alignedTarget - sc.scrollLeft) < 1;
    const finalIdx = alreadyAligned ? Math.min(idx + 1, items.length - 1) : idx;

    scrollToIdx(finalIdx, /*allowNoop*/ false, 600);
  };

  const scrollLeft = () => {
    const sc = scrollContainerRef.current;
    if (!sc) return;
    const items = getItems();
    if (!items.length) return;

    const idx = prevIndex(sc, items);
    // when moving left, if we're already at the first item, no-op
    const isFirst = idx === 0 && Math.abs(leftOf(items[0], sc) - sc.scrollLeft) < 1;
    if (isFirst) return;

    scrollToIdx(idx, /*allowNoop*/ true, 600);
  };
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
          <div className="relative flex items-center h-full">
            <button
              onClick={scrollLeft}
              className="absolute top-1/2 transform -translate-y-1/2 z-10 mx-4 bg-white/90 hover:bg-white text-primary p-2 md:p-3 rounded-full shadow-lg transition-all duration-300"
            >
              <ChevronLeftIcon className="text-2xl" />
            </button>
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide w-full h-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {projectImages.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 cursor-pointer group h-full"
                  onClick={() => openPreview(image.src)}
                >
                  <div className="relative overflow-hidden bg-white shadow-lg h-full">
                    <img
                      src={image.src}
                      alt={image.label}
                      className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Image Label Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                      <div className="text-sm font-sans text-white">
                        {image.label}
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-sans">
                        Click to view
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Navigation Arrows */}


            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 mx-4 bg-white/90 hover:bg-white text-primary p-2 md:p-3 rounded-full shadow-lg transition-all duration-300"
            >
              <ChevronRightIcon className="text-2xl" />
            </button>
          </div>
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
