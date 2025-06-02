import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/About.css";
import Logo from "./Logo";
import { Divider } from "@mui/material";
import { useTransition } from "../context/TransitionContext";

const About: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const { startTransition } = useTransition();
  const navigate = useNavigate();

  // Add scroll handler
  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const videoSection = document.querySelector('.hero-video-container');
      if (videoSection) {
        const rect = videoSection.getBoundingClientRect();
        setPastHero(rect.bottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path: string) => {
    toggleMenu();
    startTransition("in", () => {
      navigate(path);
    });
  };

  return (
    <div className="about-page">
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
            style={{ backgroundColor: menuOpen ? "white" : (pastHero ? "black" : "white") }}
          ></span>
          <span
            className="hamburger-line"
            style={{ backgroundColor: menuOpen ? "white" : (pastHero ? "black" : "white") }}
          ></span>
          <span
            className="hamburger-line"
            style={{ backgroundColor: menuOpen ? "white" : (pastHero ? "black" : "white") }}
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

      <div className="about-container">
        {/* Hero Video Section with Overlaid Header */}
        <div className="hero-video-container">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={require("../assets/video-poster.jpg")}
          >
            <source
              src={require("../assets/video-compressed.webm")}
              type="video/webm"
            />
            <source
              src={require("../assets/video-compressed.mp4")}
              type="video/mp4"
            />
            <source
              src={require("../assets/video-low.mp4")}
              type="video/mp4"
              media="(max-width: 768px) or (prefers-reduced-data: reduce)"
            />
          </video>
          <div className="video-overlay"></div>
          <div className="about-header">
            <div className="section-pre-title">Our Vision</div>
            <h1 className="about-title">Your Home, Reimagined</h1>
            <p className="about-subtitle">
              At Renova, we craft elegant experiences that let you step inside your future home before a single wall
              is touched. Explore layout options, materials, and finishes in an
              immersive environment, making confident design decisions with zero
              guesswork.
            </p>
          </div>
        </div>

        {/* Process Description - Restructured as steps */}
        <div className="process-section">
          <h2 className="section-title">Our Design Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <h3>Discovery</h3>
              <p>
                We start by getting to know you—your space, your needs, and your
                personal style. Whether you're drawn to bold minimalism or
                something more timeless and cozy, we take the time to understand
                what matters most.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">02</div>
              <h3>Digital Modeling</h3>
              <p>
                Next, we create a realistic digital model of your home,
                carefully reflecting its layout, dimensions, and lighting. Every
                detail is tailored to your actual space, so you can see exactly
                how your remodel will look and feel.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">03</div>
              <h3>Virtual Experience</h3>
              <p>
                Finally, you step into your future home using virtual reality.
                Walk through the redesigned space, test out different layouts,
                materials, and finishes, and make changes in real time. No
                guesswork, no surprises—just clarity and confidence before any
                work begins.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section - Redesigned */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Reimagine Your Space?</h2>
            <p>
              Take the first step toward your dream home with a personalized
              consultation.
            </p>
            <button
              className="cta-button"
              onClick={() => {
                startTransition("in", () => {
                  navigate("/#contact");
                });
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
