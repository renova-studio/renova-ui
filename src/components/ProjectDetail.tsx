import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import Logo from "./Logo";
import '../styles/ProjectDetail.css';
import { useTransition } from '../context/TransitionContext';

// Define view labels for thumbnails
const viewLabels = ["Daylight", "Golden Hour", "Nightfall", "Twilight"];

// Define types for variants
type VariantKey = "A" | "B";
type VariantImages = Record<VariantKey, string[]>;

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
  const [viewMode, setViewMode] = useState<"gallery" | "360">("gallery");
  const viewerRef = useRef<any>(null);
  const sphereContainerRef = useRef<HTMLDivElement>(null);
  const [sphereHeight, setSphereHeight] = useState("70vh");

  // Calculate the appropriate height for the sphere container
  useEffect(() => {
    if (viewMode === "360") {
      const updateHeight = () => {
        if (sphereContainerRef.current) {
          const windowHeight = window.innerHeight;
          const containerTop = sphereContainerRef.current.getBoundingClientRect().top;
          const availableHeight = windowHeight - containerTop - 40; // 40px for margin
          setSphereHeight(`${availableHeight}px`);
        }
      };
      
      updateHeight();
      window.addEventListener('resize', updateHeight);
      
      return () => {
        window.removeEventListener('resize', updateHeight);
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
            require(`../assets/lucero-a (1).png`),
            require(`../assets/lucero-a (2).png`),
            require(`../assets/lucero-a (3).png`),
            require(`../assets/lucero-a (4).png`),
          ],
          B: [
            require(`../assets/lucero-b (1).png`),
            require(`../assets/lucero-b (2).png`),
            require(`../assets/lucero-b (3).png`),
            require(`../assets/lucero-b (4).png`),
          ],
        },
        mcknight: {
          A: [
            require(`../assets/mcknight-a (1).png`),
            require(`../assets/mcknight-a (2).png`),
            require(`../assets/mcknight-a (3).png`),
          ],
          B: [
            require(`../assets/mcknight-b (1).png`),
            require(`../assets/mcknight-b (2).png`),
            require(`../assets/mcknight-b (3).png`),
          ],
        },
        brunson: {
          A: [
            require(`../assets/brunson-a (1).png`),
            require(`../assets/brunson-a (2).png`),
            require(`../assets/brunson-a (3).png`),
          ],
          B: [
            require(`../assets/brunson-b (1).png`),
            require(`../assets/brunson-b (2).png`),
            require(`../assets/brunson-b (3).png`),
          ],
        },
      };
      return projectVariants[project.id];
    } catch (error) {
      console.error("Error loading project variants:", error);
      return null;
    }
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
    startTransition('out', () => {
      navigate('/');
    });
  };

  return (
    <div className="minimal-detail-view">
      {/* Project header - Logo on right side */}
      <header className="detail-header">
        {/* Back navigation */}
        <div className="detail-nav">
          <Link to="/" className="back-link" onClick={handleGoBack}>
            ← BACK TO HOME
          </Link>
        </div>
        <div className="detail-logo-container">
          <Logo className="detail-logo" />
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
          </div>
          
          <div className="info-section">
            <h2 className="info-heading">About</h2>
            <p className="info-text">
              {project.description}
            </p>
            <p className="info-text">
              This remodeling visualization showcases our approach to creating immersive environments
              that blend functionality with aesthetic appeal. Each design option
              offers a unique perspective on the space.
            </p>
          </div>
          
          {/* View mode toggle */}
          <div className="info-section">
            <h2 className="info-heading">View Mode</h2>
            <div className="variant-selector">
              <button
                className={`variant-button ${viewMode === "gallery" ? "active" : ""}`}
                onClick={() => setViewMode("gallery")}
              >
                Gallery View
              </button>
              <button
                className={`variant-button ${viewMode === "360" ? "active" : ""}`}
                onClick={() => setViewMode("360")}
              >
                360° View
              </button>
            </div>
          </div>
          
          {viewMode === "gallery" && (
            <div className="info-section">
              <h2 className="info-heading">Design Options</h2>
              <div className="variant-selector">
                {variants && Object.keys(variants).map((variant) => (
                  <button
                    key={variant}
                    className={`variant-button ${selectedVariant === variant ? "active" : ""}`}
                    onClick={() => handleVariantClick(variant as VariantKey)}
                  >
                    Option {variant}
                  </button>
                ))}
              </div>
            </div>
          )}
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
                    alt={`${project.title} - Option ${selectedVariant} - ${viewLabels[selectedImageIndex] || `View ${selectedImageIndex + 1}`}`}
                    className="main-image"
                  />
                )}
                <div className="image-meta">
                  <span className="image-variant">Option {selectedVariant}</span>
                  <span className="image-view">{viewLabels[selectedImageIndex] || `View ${selectedImageIndex + 1}`}</span>
                </div>
              </div>
              
              {/* Image Preview Carousel */}
              {variants && variants[selectedVariant] && variants[selectedVariant].length > 1 && (
                <div className="image-preview-carousel">
                  {variants[selectedVariant].map((image: string, index: number) => (
                    <div 
                      key={index} 
                      className="preview-item"
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className={`preview-image ${selectedImageIndex === index ? "active" : ""}`}
                      />
                      <div className="preview-label">
                        {viewLabels[index] || `View ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* 360 View */
            <div 
              className="sphere-container" 
              ref={sphereContainerRef}
              style={{ height: sphereHeight }}
            >
              <ReactPhotoSphereViewer
                src={project.image360}
                height="100%"
                width="100%"
                container="div"
                defaultZoomLvl={0}
                littlePlanet={false}
                mousewheelCtrlKey={true}
                navbar={["autorotate", "zoom", "fullscreen"]}
                onReady={handleViewerReady}
                plugins={[]}
                sphereCorrection={{ pan: 0, tilt: 0, roll: 0 }}
                minFov={30}
                maxFov={90}
                moveSpeed={1}
                zoomSpeed={1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
