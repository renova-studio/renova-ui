import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg?react";
import { useTransition } from "../context/TransitionContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ComputerIcon from "@mui/icons-material/Computer";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

// Import all project images
// Juniper project images
import juniperS1 from "../assets/projects/juniper-still (1).jpg";
import juniperS2 from "../assets/projects/juniper-still (2).jpg";
import juniperS3 from "../assets/projects/juniper-still (3).jpg";
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
import luceroS1 from "../assets/projects/lucero-still (1).png";
import luceroS2 from "../assets/projects/lucero-still (2).png";
import luceroS3 from "../assets/projects/lucero-still (3).png";

// McKnight project images
import mcknightA1 from "../assets/projects/mcknight-a (1).png";
import mcknightA2 from "../assets/projects/mcknight-a (2).png";
import mcknightA3 from "../assets/projects/mcknight-a (3).png";
import mcknightA4 from "../assets/projects/mcknight-a (4).png";
import mcknightB1 from "../assets/projects/mcknight-b (1).png";
import mcknightB2 from "../assets/projects/mcknight-b (2).png";
import mcknightB3 from "../assets/projects/mcknight-b (3).png";
import mcknightB4 from "../assets/projects/mcknight-b (4).png";
import mcknightReal from "../assets/projects/mcknight-real.png";

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
  const diffRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const renderedImageRef = useRef<HTMLDivElement | null>(null);
  const sliderHandleRef = useRef<HTMLDivElement | null>(null);

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

  // Get rendered vs real comparison data for projects that have real photos
  const comparisonData = React.useMemo(() => {
    const comparisons: Record<string, { rendered: string; real: string }> = {
      lucero: {
        rendered: luceroA1,
        real: luceroReal,
      },
      mcknight: {
        rendered: mcknightA1,
        real: mcknightReal,
      },
      brunson: {
        rendered: brunsonA1,
        real: brunsonReal,
      },
    };
    return comparisons[project.id] || null;
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

  // Keep dots/arrow state in sync as user drags
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
      if (e.key === "Escape" && isPreviewMode) {
        closePreview();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewMode]);

  // Custom slider handlers for mouse and touch - optimized for performance
  useEffect(() => {
    if (
      !comparisonData ||
      !diffRef.current ||
      !renderedImageRef.current ||
      !sliderHandleRef.current
    )
      return;

    const container = diffRef.current;
    const renderedImage = renderedImageRef.current;
    const sliderHandle = sliderHandleRef.current;

    let startX = 0;
    let startPosition = 50;
    let dragging = false;
    let rafId: number | null = null;
    let currentPosition = 50;

    // Direct DOM manipulation for smooth performance - no state updates during drag
    const updateSliderPosition = (percentage: number) => {
      currentPosition = Math.max(0, Math.min(100, percentage));
      const clipValue = 100 - currentPosition;
      renderedImage.style.clipPath = `inset(0 ${clipValue}% 0 0)`;
      sliderHandle.style.left = `${currentPosition}%`;
      // No state update - direct DOM manipulation only for performance
    };

    const handleMove = (clientX: number) => {
      if (!dragging) return;

      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const diffX = clientX - startX;
        const diffPercentage = (diffX / rect.width) * 100;
        const newPosition = startPosition + diffPercentage;
        updateSliderPosition(newPosition);
      });
    };

    const handleStart = (clientX: number) => {
      dragging = true;
      setIsDragging(true);
      startX = clientX;
      startPosition = currentPosition;
    };

    const handleEnd = () => {
      dragging = false;
      setIsDragging(false);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        e.preventDefault();
        handleMove(e.clientX);
      }
    };

    const handleMouseUp = () => {
      if (dragging) {
        handleEnd();
      }
    };

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (dragging && e.touches.length === 1) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      if (dragging) {
        handleEnd();
      }
    };

    // Click/tap to jump to position
    const handleClick = (e: MouseEvent) => {
      if (!dragging) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        updateSliderPosition(percentage);
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("click", handleClick);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    // Always add global events for dragging
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    // Initialize position
    updateSliderPosition(50);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [comparisonData]);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header with DaisyUI navbar pattern */}
      <header className="navbar bg-base-100 sticky top-0 z-50 shadow-sm min-h-0 py-2">
        <div className="navbar-start">
          <button
            className="btn btn-ghost btn-xs btn-circle"
            onClick={(e) => {
              e.preventDefault();
              startTransition("in", () => navigate("/"));
            }}
            aria-label="Back to home"
          >
            <ArrowBackIcon sx={{ fontSize: "1.25rem" }} />
          </button>
        </div>
        <div className="navbar-center">
          <Logo
            fill="currentColor"
            className="h-6 text-primary cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              startTransition("in", () => navigate("/"));
            }}
          />
        </div>
        <div className="navbar-end">{/* Empty for symmetry */}</div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto">
        {/* Image Carousel Section */}
        <section className="h-[50vh] md:h-[75vh] lg:h-[65vh] mb-8">
          <div className="relative flex h-full items-center">
            {/* Previous Button */}
            {projectImages.length > 1 && (
              <button
                onClick={onPrev}
                className="btn btn-circle btn-primary bg-primary/90 absolute left-4 z-10 shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeftIcon />
              </button>
            )}

            {/* Carousel */}
            <div
              ref={trackRef}
              className="carousel carousel-center w-full h-full gap-4 overflow-x-auto snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {projectImages.map((image, index) => (
                <div
                  key={index}
                  ref={(el: HTMLDivElement | null) => {
                    slidesRef.current[index] = el;
                  }}
                  data-idx={index}
                  className="carousel-item w-full snap-start justify-center"
                  onClick={() => openPreview(image.src)}
                >
                  <div className="card card-compact bg-base-200 rounded-none h-full w-auto group cursor-pointer">
                    <figure className="relative h-full w-auto overflow-hidden">
                      <img
                        src={image.src}
                        alt={
                          image.label || `${project.title} - Image ${index + 1}`
                        }
                        className="h-full w-auto object-contain "
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-sans">
                          Click to view
                        </span>
                      </div>
                    </figure>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button */}
            {projectImages.length > 1 && (
              <button
                onClick={onNext}
                className="btn btn-circle btn-primary bg-primary/80 absolute right-4 z-10 shadow-lg"
                aria-label="Next image"
              >
                <ChevronRightIcon />
              </button>
            )}
          </div>

          {/* Carousel Indicators */}
          {projectImages.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {projectImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeIndex
                      ? "w-8 h-2 bg-primary"
                      : "w-2 h-2 bg-base-300 hover:bg-base-content/30"
                  }`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Project Info Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Project Title */}
          <div className="mb-8 lg:mb-12">
            <div className="badge badge-outline badge-lg mb-4">
              {project.number}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-title text-primary leading-tight mb-4">
              {project.title}
            </h1>
            {project.id === "mcknight" && (
              <p className="text-sm sm:text-base text-base-content">
                Designed by{" "}
                <a
                  href="https://www.housesprucing.com/portfolio/mindy-mcknight-project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-accent"
                >
                  House Sprucing{" "}
                  <OpenInNewIcon className="inline-block text-xs" />
                </a>
              </p>
            )}
          </div>

          {/* About Card */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl font-title text-primary mb-6">
                About
              </h2>
              <p className="text-base sm:text-lg text-base-content leading-relaxed mb-6">
                {project.description}
              </p>
              <div className="divider my-6"></div>
              <div className="space-y-4">
                <p className="text-base sm:text-lg font-semibold text-primary">
                  At Renova, customization is limitless.
                </p>
                <p className="text-base sm:text-lg text-base-content leading-relaxed">
                  From materials and finishes to lighting and layout, we tailor
                  every detail to your vision, bringing your unique style to
                  life with precision and realism.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rendered vs Real Comparison Section */}
        {comparisonData && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 ">
            <div className="text-center mb-8 lg:mb-12">
              <div className="badge badge-outline badge-lg mb-4">
                COMPARISON
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-title text-primary mb-4">
                Vision to Reality
              </h2>
              <p className="text-base sm:text-lg text-base-content leading-relaxed max-w-2xl mx-auto">
                Experience the precision of our photorealistic visualizations
                alongside the completed project. Explore how our renderings
                translate seamlessly into reality.
              </p>
            </div>

            <div className="card bg-base-100 shadow-2xl h-fit">
              <div className="card-body p-0">
                <div
                  className="relative w-full bg-base-200 rounded-xl overflow-hidden cursor-col-resize select-none"
                  ref={diffRef}
                  style={{ aspectRatio: "16/9", touchAction: "none" }}
                >
                  {/* Real Life Image (Background) */}
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      alt="Real life photo"
                      src={comparisonData.real}
                      className="w-full h-full object-cover"
                      draggable="false"
                      style={{ userSelect: "none", pointerEvents: "none" }}
                    />
                  </div>

                  {/* Rendered Image (Clipped) */}
                  <div
                    ref={renderedImageRef}
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{ clipPath: "inset(0 50% 0 0)" }}
                  >
                    <img
                      alt="Rendered visualization"
                      src={comparisonData.rendered}
                      className="w-full h-full object-cover"
                      draggable="false"
                      style={{ userSelect: "none", pointerEvents: "none" }}
                    />
                  </div>

                  {/* Slider Handle */}
                  <div
                    ref={sliderHandleRef}
                    className="absolute top-0 bottom-0 w-1 bg-white z-20 transition-opacity"
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    {/* Slider Handle Circle */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-base-100"
                      style={{ touchAction: "none" }}
                    >
                      <div className="border-primary/50 border-2 rounded-full w-5 h-9"></div>
                    </div>
                  </div>

                  {/* Labels with icons */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="badge badge-lg badge-primary gap-2 shadow-lg lg:text-base text-xs">
                      <ComputerIcon className="w-1 h-1 md:w-4 md:h-4 " />
                      Rendered
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <div className="badge badge-lg badge-secondary gap-2 shadow-lg lg:text-base text-xs">
                      <CameraAltIcon className="w-1 h-1 md:w-4 md:h-4" />
                      Real
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body bg-base-200/50 px-3 py-2 sm:px-4 sm:py-3">
                <p className="text-xs sm:text-sm text-base-content/70 text-center">
                  <kbd className="kbd kbd-xs sm:kbd-sm">Drag</kbd> the slider to
                  compare the images
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Image Preview Modal - Using DaisyUI Modal */}
      {isPreviewMode && (
        <dialog className="modal modal-open" open={isPreviewMode}>
          <div className="modal-box max-w-7xl p-0 bg-transparent shadow-none relative">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto bottom-1 md:top-0 md:right-4 text-white bg-white/20 z-10"
                onClick={closePreview}
                aria-label="Close preview"
              >
                ✕
              </button>
            </form>
            <div className="flex items-center justify-center min-h-[90vh]">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                onClick={closePreview}
              />
            </div>
          </div>
          <form
            method="dialog"
            className="modal-backdrop bg-black/80"
            onClick={closePreview}
          >
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ProjectDetail;
