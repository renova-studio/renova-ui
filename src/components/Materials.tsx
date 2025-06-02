import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImages } from "../utils/imageImports";
import "../styles/Materials.css";
import Logo from "./Logo";
import { Divider } from "@mui/material";
import { useTransition } from "../context/TransitionContext";

interface Material {
  name: string;
  category: string;
  imagePath: string;
  originalName?: string;
}

const Materials: React.FC = () => {
  const [materials, setMaterials] = useState<Record<string, Material[]>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const { startTransition } = useTransition();
  const navigate = useNavigate();

  useEffect(() => {
    const organizeMaterials = async () => {
      try {
        const images = await getImages();
        const organizedMaterials: Record<string, Material[]> = {};

        Object.entries(images).forEach(([path, imageModule]) => {
          const pathParts = path.split("/");
          const category = pathParts[0];
          const filename = pathParts[1];

          if (!organizedMaterials[category]) {
            organizedMaterials[category] = [];
          }

          organizedMaterials[category].push({
            name: filename.replace(/-/g, " "),
            category,
            imagePath: imageModule.default,
            originalName: imageModule.originalName,
          });
        });

        setMaterials(organizedMaterials);
      } catch (error) {
        console.error("Error loading materials:", error);
      }
    };

    organizeMaterials();
  }, []);

  const categories = Object.keys(materials);

  const filteredMaterials =
    activeCategory === "all"
      ? Object.values(materials).flat()
      : materials[activeCategory] || [];

  const handleImageClick = (material: Material) => {
    setSelectedMaterial(material);
    document.body.style.overflow = "hidden";
  };

  const handleClosePreview = () => {
    setSelectedMaterial(null);
    document.body.style.overflow = "auto";
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path: string) => {
    toggleMenu();
    startTransition("in", () => {
      navigate(path);
    });
  };

  // Memoize expensive calculations
  const materialsList = useMemo(() => {
    return filteredMaterials.map((material) => ({
      ...material,
      // Any expensive transformations here
    }));
  }, [filteredMaterials]);

  // Use React.memo for child components
  const MaterialItem = React.memo(({ material }: { material: Material }) => (
    <div className="material-card" onClick={() => handleImageClick(material)}>
      <div className="material-image-container">
        <img
          src={material.imagePath}
          alt={material.originalName || material.name}
          className="material-image"
        />
        <div className="material-overlay">
          <span className="material-code">
            {material.name.substring(0, 3).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="material-info">
        <h3 className="material-name">
          {material.originalName || material.name}
        </h3>
        <div className="material-meta">
          <span className="material-category">{material.category}</span>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="materials-page">
      <header className="minimal-header">
        <div className="company-logo-container">
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

      {/* Add hamburger menu */}
      <div
        className={`hamburger-menu-container ${menuOpen ? "menu-open" : ""}`}
      >
        <button className="hamburger-button" onClick={toggleMenu}>
          <span
            className="hamburger-line"
            style={{ backgroundColor: menuOpen ? "white" : "black" }}
          ></span>
          <span
            className="hamburger-line"
            style={{ backgroundColor: menuOpen ? "white" : "black" }}
          ></span>
          <span
            className="hamburger-line"
            style={{ backgroundColor: menuOpen ? "white" : "black" }}
          ></span>
        </button>

        <div className="menu-overlay">
          <div className="menu-content">
            <nav className="menu-navigation">
              <ul>
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/");
                    }}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/our-vision"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu();
                      startTransition("in", () => {
                        navigate("/our-vision");
                      });
                    }}
                  >
                    Our Vision
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/");
                    }}
                  >
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="/materials"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/materials");
                    }}
                  >
                    Materials & Finishes
                  </a>
                </li>
                <li>
                  <a
                    href="/#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/#contact");
                    }}
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="materials-container">
        <div className="materials-header">
          <div className="project-number">Materials & Finishes</div>
          <h1 className="materials-title">Premium Materials Collection</h1>
          <p className="materials-subtitle">
            A curated selection of exceptional materials, carefully chosen to
            enhance your space with sophistication and enduring elegance.
          </p>
        </div>

        <div className="category-nav">
          <button
            className={`category-button ${
              activeCategory === "all" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="materials-grid">
          {materialsList.map((material) => (
            <MaterialItem key={material.name} material={material} />
          ))}
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedMaterial && (
        <div className="material-preview-overlay" onClick={handleClosePreview}>
          <div
            className="material-preview-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="material-preview-close"
              onClick={handleClosePreview}
            >
              ×
            </button>
            <div className="material-preview-image-container">
              <img
                src={selectedMaterial.imagePath}
                alt={selectedMaterial.originalName || selectedMaterial.name}
                className="material-preview-image"
              />
            </div>
            <div className="material-preview-info">
              <h2 className="material-preview-title">
                {selectedMaterial.originalName || selectedMaterial.name}
              </h2>
              <div className="material-preview-meta">
                <span className="material-preview-category">
                  {selectedMaterial.category}
                </span>
                <span className="material-preview-finish">Natural Finish</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
