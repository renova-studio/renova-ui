import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import Logo from "./Logo";
import "../styles/ProjectDetail.css";
import { useTransition } from "../context/TransitionContext";
import { Divider } from "@mui/material";
import ExitToAppSharpIcon from "@mui/icons-material/ExitToAppSharp";
import { debounce } from "lodash";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
  const [sliderPosition, setSliderPosition] = useState(50); // Default to middle (50%)
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  // Add this useEffect at the top of other useEffects
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate the appropriate height for the sphere container
  useEffect(() => {
    if (viewMode === "360") {
      const updateHeight = () => {
        if (sphereContainerRef.current) {
          const windowHeight = window.innerHeight;
          const containerTop =
            sphereContainerRef.current.getBoundingClientRect().top;
          const availableHeight = windowHeight - containerTop - 40; // 40px for margin
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
      // This is a simplified version - in reality, you'd import these dynamically
      const projectVariants: Record<string, VariantImages> = {
        lucero: {
          A: [
            require(`../assets/projects/lucero-a (1).png`),
            require(`../assets/projects/lucero-a (2).png`),
            require(`../assets/projects/lucero-a (3).png`),
            require(`../assets/projects/lucero-a (4).png`),
          ],
          B: [
            require(`../assets/projects/lucero-b (1).png`),
            require(`../assets/projects/lucero-b (2).png`),
            require(`../assets/projects/lucero-b (3).png`),
            require(`../assets/projects/lucero-b (4).png`),
          ],
          real: [require("../assets/projects/lucero-b (1).png")],
        },
        mcknight: {
          A: [
            require(`../assets/projects/mcknight-a (1).png`),
            require(`../assets/projects/mcknight-a (2).png`),
            require(`../assets/projects/mcknight-a (3).png`),
          ],
          B: [
            require(`../assets/projects/mcknight-b (1).png`),
            require(`../assets/projects/mcknight-b (2).png`),
            require(`../assets/projects/mcknight-b (3).png`),
          ],
          real: [require("../assets/projects/mcknight-real-warped.png")],
        },
        brunson: {
          A: [
            require(`../assets/projects/brunson-a (1).png`),
            require(`../assets/projects/brunson-a (2).png`),
            require(`../assets/projects/brunson-a (3).png`),
          ],
          B: [
            require(`../assets/projects/brunson-b (1).png`),
            require(`../assets/projects/brunson-b (2).png`),
            require(`../assets/projects/brunson-b (3).png`),
          ],
          real: [require("../assets/brunson-real.jpg")],
        },
      };
      return projectVariants[project.id];
    } catch (error) {
      console.error("Error loading project variants:", error);
      return null;
    }
  }, [project.id]);

  // Add this inside the component
  const variantDescriptions = React.useMemo<VariantDescriptions | null>(() => {
    // This would ideally come from your project data
    const descriptions: Record<string, VariantDescriptions> = {
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

    // Force resize after viewer is ready
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

    // Start the exit transition
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
      // Clamp position between 0 and 100
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

  // Add and remove event listeners
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

  useEffect(() => {
    const handleScroll = debounce(() => {
      // Your scroll handling logic
    }, 16); // Approximately 60fps

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, []);

  return (
    <div className="minimal-detail-view">
      {/* Separate back button outside the header */}
      <div className="back-button" onClick={handleGoBack}>
        <ExitToAppSharpIcon sx={{ transform: "scaleX(-1) scale(1.5)" }} />
      </div>

      <header
        className="minimal-header"
        style={{
          position: "fixed",
        }}
      >
        <div className="company-logo-container" style={{ cursor: "pointer" }}>
          <Logo className="header-logo" style={{ filter: "invert(0)" }} />
          <Divider
            sx={{
              padding: "0 0.25rem",
              opacity: 1,
              borderRightWidth: "2px",
              borderColor: "black",
              marginTop: "0",
              marginBottom: "0",
              marginRight: "0.25rem",
            }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <span className="company-name-text">renova</span>
        </div>
      </header>

      {/* Main content */}
      <div className="detail-content">
        {/* Left column - Project info */}
        <div className="detail-info">
          {/* Project title moved to top of content */}
          <div className="project-meta">
            <div className="project-number">[{project.number}]</div>
            <h1 className="project-title">{project.title}</h1>
            {project.id == "mcknight" && <p className="project-hero-description" style={{ fontSize: '0.9rem', marginTop: '0rem' }}>Designed by <a href="https://www.housesprucing.com/portfolio/mindy-mcknight-project" target="_blank" rel="noopener noreferrer">House Sprucing <OpenInNewIcon sx={{ fontSize: '0.9rem' }} /></a></p>}
          </div>
          {/* View mode toggle */}
          <div className="info-section">
            <h2 className="info-heading">View Mode</h2>
            <div className="variant-selector">
              <button
                className={`variant-button ${
                  viewMode === "gallery" ? "active" : ""
                }`}
                onClick={() => setViewMode("gallery")}
              >
                Gallery View
              </button>
              <button
                className={`variant-button ${
                  viewMode === "360" ? "active" : ""
                }`}
                onClick={() => setViewMode("360")}
              >
                360° View
              </button>
              <button
                className={`variant-button ${
                  viewMode === "real" ? "active" : ""
                }`}
                onClick={() => setViewMode("real")}
              >
                Real Life View
              </button>
            </div>
          </div>
          {viewMode === "gallery" && (
            <div className="info-section">
              <h2 className="info-heading">Design Options</h2>
              <div className="variant-selector">
                {variants &&
                  ["A", "B"].map((variant) => (
                    <button
                      key={variant}
                      className={`variant-button ${
                        selectedVariant === variant ? "active" : ""
                      }`}
                      onClick={() => handleVariantClick(variant as VariantKey)}
                    >
                      Option {variant}
                    </button>
                  ))}
              </div>
            </div>
          )}
          <div className="info-section">
            <h2 className="info-heading">About</h2>
            <p className="info-text">
              {viewMode === "gallery" &&
              variantDescriptions &&
              variantDescriptions[selectedVariant]
                ? variantDescriptions[selectedVariant]
                : project.description}
            </p>
            <p className="info-text" style={{ paddingTop: "1rem" }}>
              <b>At Renova, customization is limitless.</b>
              <br />
              From materials and finishes to lighting and layout, we tailor
              every detail to your vision—bringing your unique style to life
              with precision and realism.
            </p>
          </div>
        </div>

        {/* Right column - Images */}
        <div className="detail-visuals">
          {viewMode === "gallery" ? (
            /* Gallery View */
            <>
              <div className="main-image-container">
                {getCurrentImage() && (
                  <img
                    src={getCurrentImage() || ""}
                    alt={`${project.title} - Option ${selectedVariant} - ${
                      viewLabels[selectedImageIndex] ||
                      `View ${selectedImageIndex + 1}`
                    }`}
                    className="main-image"
                  />
                )}
                <div className="image-meta">
                  <span className="image-variant">
                    Option {selectedVariant}
                  </span>
                  <span className="image-view">
                    {viewLabels[selectedImageIndex] ||
                      `View ${selectedImageIndex + 1}`}
                  </span>
                </div>
              </div>

              {/* Image Preview Carousel */}
              {variants &&
                variants[selectedVariant] &&
                variants[selectedVariant].length > 1 && (
                  <div className="image-preview-carousel">
                    {variants[selectedVariant].map(
                      (image: string, index: number) => (
                        <div
                          key={index}
                          className="preview-item"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className={`preview-image ${
                              selectedImageIndex === index ? "active" : ""
                            }`}
                          />
                          <div className="preview-label">
                            {viewLabels[index] || `View ${index + 1}`}
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
              className="sphere-container"
              ref={sphereContainerRef}
              style={{ height: sphereHeight, background: "white !important" }}
            >
              <ReactPhotoSphereViewer
                src={project.image360}
                height="100%"
                width="100%"
                container="div"
                defaultZoomLvl={0}
                loadingImg={require("../assets/renova-logo.png")}
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
            <div className="comparison-slider-container" ref={sliderRef}>
              {/* Rendered image (left side) */}
              <img
                src={variants?.A[0]}
                alt="Rendered view"
                className="comparison-image rendered-image"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
              />

              {/* Real photo (right side) */}
              <img
                src={variants?.real[0]}
                alt="Real photo"
                className="comparison-image real-image"
              />

              {/* Slider handle */}
              <div
                className="slider-divider"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <div className="slider-handle">
                  <div className="handle-arrow left-arrow">◀</div>
                  <div className="handle-arrow right-arrow">▶</div>
                </div>
                <div className="slider-line"></div>
              </div>

              {/* Labels */}
              <div className="comparison-labels">
                <div className="label left-label" style={{ left: "10px" }}>
                  Rendered
                </div>
                <div className="label right-label" style={{ right: "10px" }}>
                  Real
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
