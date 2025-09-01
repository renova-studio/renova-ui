import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import Logo from "../assets/logo.svg?react";

import { useTransition } from "../context/TransitionContext";
import { debounce } from "lodash";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Import all project images
// Juniper project images
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

// Import logo for PhotoSphere loading
import renovaLogo from "../assets/renova-logo.png";

// Define view labels for thumbnails
const viewLabels = ["Daylight", "Golden Hour", "Nightfall", "Twilight"];

// Define types for variants
type VariantKey = "A" | "B";
type VariantImages = Record<VariantKey | "real", string[]>;
type VariantDescriptions = Record<VariantKey, string>;

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
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { startTransition } = useTransition();
  const [selectedVariant, setSelectedVariant] = useState<VariantKey>("A");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"gallery" | "360" | "real">(
    "gallery"
  );
  const viewerRef = useRef<any>(null);
  const sphereContainerRef = useRef<HTMLDivElement>(null);
  const [sphereHeight, setSphereHeight] = useState("70vh");
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate sphere height for 360 view
  useEffect(() => {
    if (viewMode === "360") {
      const updateHeight = () => {
        if (sphereContainerRef.current) {
          const windowHeight = window.innerHeight;
          const containerTop =
            sphereContainerRef.current.getBoundingClientRect().top;
          const availableHeight = windowHeight - containerTop - 40;
          setSphereHeight(`${availableHeight}px`);
        }
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);

      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, [viewMode]);

  // Import project variant images based on project ID
  const variants = React.useMemo<VariantImages | null>(() => {
    try {
      const projectVariants: Record<string, VariantImages> = {
        juniper: {
          A: [juniperA1, juniperA2, juniperA3, juniperA4],
          B: [juniperB1, juniperB2, juniperB3, juniperB4],
          real: [],
        },
        lucero: {
          A: [luceroA1, luceroA2, luceroA3, luceroA4],
          B: [luceroB1, luceroB2, luceroB3, luceroB4],
          real: [luceroReal],
        },
        mcknight: {
          A: [mcknightA1, mcknightA2, mcknightA3, mcknightA4],
          B: [mcknightB1, mcknightB2, mcknightB3, mcknightB4],
          real: [mcknightReal],
        },
        brunson: {
          A: [brunsonA1, brunsonA2, brunsonA3, brunsonA4],
          B: [brunsonB1, brunsonB2, brunsonB3, brunsonB4],
          real: [brunsonReal],
        },
      };
      return projectVariants[project.id];
    } catch (error) {
      console.error("Error loading project variants:", error);
      return null;
    }
  }, [project.id]);

  // Variant descriptions
  const variantDescriptions = React.useMemo<VariantDescriptions | null>(() => {
    const descriptions: Record<string, VariantDescriptions> = {
      juniper: {
        A: "This visualization highlights a light-filled kitchen anchored by a marble waterfall island with oak paneling. Soft beige cabinetry with gold hardware, glass-front displays, and a sculpted range hood create timeless elegance, while natural light enhances the photorealistic atmosphere.",
        B: "This visualization presents a warm, light-filled kitchen anchored by a marble waterfall island with fluted oak paneling. Natural wood cabinetry with gold hardware pairs elegantly with soft green tile backsplashes, while a sculpted range hood and glass-front displays bring balance and refined detail to the design.",
      },
      lucero: {
        A: "This immersive visualization features a light-filled kitchen with vaulted ceilings, exposed beams, and refined finishes. A marble-topped oak island pairs with cream cabinetry and gold hardware, while open shelving and a sculpted range hood add architectural charm—bringing the design to life with stunning realism.",
        B: "This visualization showcases a bold, elevated take on transitional design. Warm wood cabinetry pairs with striking black stone countertops and backsplash, creating a rich contrast against the natural light and vaulted ceilings. Gold fixtures and hardware add a touch of refinement, while the oak island anchors the space with texture and balance—highlighting Renova's ability to render design possibilities with clarity and depth.",
      },
      mcknight: {
        A: "This visualization features a vibrant blend of classic form and playful detail. White upper cabinetry contrasts with natural wood lowers, while a soft blue island adds a subtle pop of color. Brass fixtures, open shelving, and textured tile bring warmth and character, creating a space that feels fresh, functional, and full of personality—beautifully illustrating the versatility of Renova's design approach.",
        B: "This visualization pairs rich navy upper cabinetry with warm natural wood lowers for a striking yet balanced design. Light stone countertops and backsplash add softness, while brass fixtures and modern lighting elevate the space. Open shelving around the range provides both function and display, illustrating how thoughtful material contrasts can define a refined, livable kitchen.",
      },
      brunson: {
        A: "This visualization presents a sleek, minimalist kitchen with a timeless black-and-white palette. Crisp white cabinetry is contrasted by black hardware and matte black pendant lighting, while stone-look countertops and a full-height backsplash bring depth and texture. A large picture window floods the space with natural light, highlighting the refined simplicity of the design.",
        B: "This warm, modern kitchen blends clean lines with organic textures. Light wood cabinetry and matching island surfaces create a cohesive, inviting atmosphere, while matte black hardware and lighting fixtures add modern contrast. A large picture window brings in natural light, enhancing the soft, neutral palette and highlighting the balance of simplicity and style.",
      },
    };
    return descriptions[project.id] || null;
  }, [project.id]);

  // Handle viewer ready event
  const handleViewerReady = (instance: any) => {
    viewerRef.current = instance;
    setTimeout(() => {
      if (viewerRef.current) {
        viewerRef.current.resize();
      }
    }, 100);
  };

  // Handle variant button click
  const handleVariantClick = (variant: VariantKey) => {
    setSelectedVariant(variant);
    setSelectedImageIndex(0);
  };

  // Handle image click
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Get current image based on selected variant and index
  const getCurrentImage = () => {
    if (!variants || !variants[selectedVariant]) return null;
    return variants[selectedVariant][selectedImageIndex];
  };

  const handleGoBack = (event: React.MouseEvent) => {
    event.preventDefault();
    startTransition("out", () => {
      navigate("/");
    });
  };

  // Handle slider dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
  };

  const handleTouchStart = () => {
    isDragging.current = true;
  };

  const updateSliderPosition = (clientX: number) => {
    if (isDragging.current && sliderRef.current) {
      const container = sliderRef.current.getBoundingClientRect();
      const position = ((clientX - container.left) / container.width) * 100;
      const clampedPosition = Math.max(0, Math.min(100, position));
      setSliderPosition(clampedPosition);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Add and remove event listeners for slider
  useEffect(() => {
    if (viewMode === "real") {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [viewMode]);

  // Debounced scroll handler
  useEffect(() => {
    const handleScroll = debounce(() => {
      // Scroll handling logic
    }, 16);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, []);

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // Escape key handler for preview mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewMode) {
        setIsPreviewMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode]);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="py-8 px-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={handleGoBack}>
            <ArrowBackIcon className="text-primary text-2xl" />
            <span className="text-sm font-sans uppercase tracking-wider text-primary">Back</span>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
          <Logo fill="currentColor"
            className={`h-8 will-change-transform text-primary`}
          />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-16 pt-0">
        {/* Project Hero Section */}
        <section className="mb-24">
          <div className="">
            <div className="grid md:grid-cols-12 gap-16 items-start">
              {/* Left Column - Project Info */}
              <div className="col-span-4">
                <div className="mb-12">
                  <div className="text-sm font-sans uppercase tracking-wider text-neutral mb-4">
                    {project.number}
                  </div>
                  <h1 className="text-6xl md:text-7xl font-title text-primary leading-tight mb-8">
                    {project.title}
                  </h1>
                  {project.id === "mcknight" && (
                    <p className="text-base font-roboto text-neutral leading-relaxed mb-6">
                      Designed by{" "}
                      <a 
                        href="https://www.housesprucing.com/portfolio/mindy-mcknight-project" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-primary transition-colors duration-300"
                      >
                        House Sprucing <OpenInNewIcon className="inline-block text-sm" />
                      </a>
                    </p>
                  )}
                </div>

                {/* View Mode Selector */}
                <div className="mb-12">
                  <h2 className="text-2xl font-tiempos font-normal text-primary mb-6">View Mode</h2>
                  <div className="space-y-3">
                    {[
                      { key: "gallery", label: "Gallery View" },
                      { key: "360", label: "360° View" },
                      { key: "real", label: "Real Life View" }
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        className={`w-full text-left px-6 py-4 text-lg font-roboto transition-all duration-300 ${
                          viewMode === mode.key
                            ? "bg-primary text-white"
                            : "bg-white text-primary hover:bg-base-300"
                        }`}
                        onClick={() => setViewMode(mode.key as any)}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design Options (Gallery Mode Only) */}
                {viewMode === "gallery" && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-tiempos font-normal text-primary mb-6">Design Options</h2>
                    <div className="space-y-3">
                      {["A", "B"].map((variant) => (
                        <button
                          key={variant}
                          className={`w-full text-left px-6 py-4 text-lg font-roboto transition-all duration-300 ${
                            selectedVariant === variant
                              ? "bg-primary text-white"
                              : "bg-white text-primary hover:bg-base-300"
                          }`}
                          onClick={() => handleVariantClick(variant as VariantKey)}
                        >
                          Option {variant}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* About Section */}
                <div>
                  <h2 className="text-2xl font-tiempos font-normal text-primary mb-6">About</h2>
                  <p className="text-base font-roboto text-neutral leading-relaxed mb-6">
                    {viewMode === "gallery" &&
                    variantDescriptions &&
                    variantDescriptions[selectedVariant]
                      ? variantDescriptions[selectedVariant]
                      : project.description}
                  </p>
                  <p className="text-base font-roboto text-neutral leading-relaxed">
                    <span className="font-semibold text-primary">At Renova, customization is limitless.</span>
                    <br /><br />
                    From materials and finishes to lighting and layout, we tailor
                    every detail to your vision—bringing your unique style to life
                    with precision and realism.
                  </p>
                </div>
              </div>

              {/* Right Column - Visuals */}
              <div className="col-span-8">
                {viewMode === "gallery" ? (
                  <>
                    {/* Main Image */}
                    <div className="mb-8">
                      {getCurrentImage() && (
                        <div className="relative overflow-hidden bg-white shadow-lg">
                          <img
                            src={getCurrentImage() || ""}
                            alt={`${project.title} - Option ${selectedVariant} - ${
                              viewLabels[selectedImageIndex] || `View ${selectedImageIndex + 1}`
                            }`}
                            className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105 cursor-zoom-in"
                            onClick={togglePreviewMode}
                          />
                          
                          {/* Image Meta */}
                          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded">
                            <div className="text-sm font-sans text-primary">
                              Option {selectedVariant} • {viewLabels[selectedImageIndex] || `View ${selectedImageIndex + 1}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image Preview Carousel */}
                    {variants &&
                      variants[selectedVariant] &&
                      variants[selectedVariant].length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                          {variants[selectedVariant].map(
                            (image: string, index: number) => (
                              <div
                                key={index}
                                className="cursor-pointer group"
                                onClick={() => handleImageClick(index)}
                              >
                                <div className={`relative overflow-hidden bg-white shadow-md transition-all duration-300 ${
                                  selectedImageIndex === index ? "ring-2 ring-primary" : ""
                                }`}>
                                  <img
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-sans text-primary text-center">
                                    {viewLabels[index] || `View ${index + 1}`}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </>
                ) : viewMode === "360" ? (
                  /* 360 View */
                  <div
                    className="bg-white shadow-lg"
                    ref={sphereContainerRef}
                    style={{ height: sphereHeight }}
                  >
                    <ReactPhotoSphereViewer
                      src={project.image360}
                      height="100%"
                      width="100%"
                      container="div"
                      defaultZoomLvl={0}
                      loadingImg={renovaLogo}
                      onReady={handleViewerReady}
                      plugins={[]}
                      sphereCorrection={{ pan: 0, tilt: 0, roll: 0 }}
                      minFov={30}
                      maxFov={90}
                      moveSpeed={1}
                      zoomSpeed={1}
                    />
                  </div>
                ) : (
                  /* Real Life View - Image Comparison Slider */
                  <div className="bg-white shadow-lg">
                    <div className="comparison-slider-container relative" ref={sliderRef}>
                      {/* Rendered image (left side) */}
                      <img
                        src={variants?.A[0]}
                        alt="Rendered view"
                        className="w-full h-auto object-cover"
                        style={{
                          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                        }}
                      />

                      {/* Real photo (right side) */}
                      <img
                        src={variants?.real[0]}
                        alt="Real photo"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />

                      {/* Slider handle */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
                        style={{ left: `${sliderPosition}%` }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                      >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <div className="text-white text-xs">◀▶</div>
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded text-sm font-sans text-primary">
                          Rendered
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded text-sm font-sans text-primary">
                          Real
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Image Preview Modal */}
      {isPreviewMode && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={togglePreviewMode}
        >
          <button 
            className="absolute top-8 right-8 text-white text-4xl hover:text-gray-300 transition-colors duration-300"
            onClick={togglePreviewMode}
          >
            ×
          </button>
          <img
            src={getCurrentImage() || ""}
            alt={`${project.title} - Option ${selectedVariant} - ${
              viewLabels[selectedImageIndex] || `View ${selectedImageIndex + 1}`
            }`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
