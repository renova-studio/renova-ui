import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Parallax } from "react-parallax";
import { useTransition } from "../context/TransitionContext";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Divider } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import juniperHero from "../assets/projects/juniper-a (4).jpg";
import mcKnightHero from "../assets/projects/mcknight-a (1).png";
import juniperImage1 from "../assets/projects/juniper-a (4).jpg";
import juniperImage2 from "../assets/projects/juniper-b (3).jpg";
import juniperImage3 from "../assets/projects/juniper-a (1).jpg";
import juniperImage4 from "../assets/projects/juniper-b (4).jpg";
import Logo from "../assets/logo.svg?react";


// Project interface
interface Project {
  id: string;
  number: string;
  title: string;
  image: string;
  image360: string;
  description: string;
  variants?: {
    [key: string]: string[];
  };
}

interface HomeProps {
  projects: Project[];
}

const Home: React.FC<HomeProps> = ({ projects }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [headerTextColor, setHeaderTextColor] = useState("text-white");

  const navigate = useNavigate();
  const { startTransition } = useTransition();

  // Handle mobile detection and scroll-based color changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;


      // Hero section (dark background)
      if (scrollY < windowHeight - 10) {
        setHeaderTextColor("text-white");
      }
      // About section (white background)
      else if (scrollY < windowHeight * 2 - 10) {
        setHeaderTextColor("text-primary");
      }
      // Portfolio section (white background)
      else if (scrollY < windowHeight * 3- 10) {
        setHeaderTextColor("text-white");
      }
      // Contact section (primary background)
      else {
        setHeaderTextColor("text-white");
      }
    };

    handleResize();
    handleScroll(); // Initial call

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle project view click with transition animation
  const handleViewProject = (projectId: string, event: React.MouseEvent) => {
    event.preventDefault();

    // Use the existing transition system from App.tsx
    startTransition("in", () => {
      navigate(`/portfolio/${projectId}`);
    });
  };

  const scrollToSection = (
    id: string,
    {
      offset = 0,        // positive = stop earlier (great for fixed headers)
      duration = 700,    // ms
      easing = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t), // easeInOutQuad
      updateHash = true, // optionally update the hash without jumping
    } = {}
  ) => {
    const el = document.getElementById(id);
    if (!el) return;
  
    const rect = el.getBoundingClientRect();
    const startY = window.scrollY || window.pageYOffset;
    const targetY = startY + rect.top - offset; // account for header height, etc.
    const startTime = performance.now();
  
    // Disable native smooth (if set in CSS) to avoid fighting the tween
    const htmlEl = document.documentElement;
    const prevBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = "auto";
  
    const step = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = easing(p);
      const y = startY + (targetY - startY) * eased;
      window.scrollTo(0, y);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        // restore scroll-behavior and set hash (without jump)
        htmlEl.style.scrollBehavior = prevBehavior;
        if (updateHash) {
          const url = new URL(window.location.href);
          url.hash = id;
          history.replaceState({}, "", url.toString());
        }
      }
    };
  
    requestAnimationFrame(step);
  };

  return (
    <div>
      <header className="fixed top-8 left-8 right-8 z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo fill="currentColor"
            className={`h-8 will-change-transform ${headerTextColor}`}
          />
          {/* Navigation */}
          <nav className="md:flex items-center gap-8 p">
            <a
              href="#/our-vision"
              className={`text-sm font-sans uppercase tracking-wider ${headerTextColor}`}
            >
              Our Mission
            </a>
            <a
              href="#portfolio"
              className={`text-sm font-sans uppercase tracking-wider ${headerTextColor}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("portfolio", { offset: 0, duration: 1000 });
              }}
            >
              Portfolio
            </a>
            <a
              href="#/materials"
              className={`text-sm font-sans uppercase tracking-wider ${headerTextColor}`}
            >
              Materials
            </a>
            <button
              className={`text-sm font-sans uppercase tracking-wider ${headerTextColor}`}
            >
              Contact
            </button>
          </nav>
        </div>
      </header>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-screen bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${juniperHero}")`,
              filter: "brightness(0.5) contrast(1.1)",
            }}
          />
        </div>

        {/* Main Content Overlay */}
        <div className="relative text-white max-w-7xl px-8 mx-auto">
          <div className="min-h-screen flex justify-center items-center">
            <div>
              <div className="text-9xl xs:text-5xl font-title leading-tight text-white">
                RENOVA
              </div>
              <div className="text-lg font-sans text-white text-center">
                We craft virtual experiences that align with your vision
              </div>
              <div className="text-lg font-sans text-white text-right">
                - turning your imagination into immersive realities.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Design with Intention */}
      <section className="min-h-screen flex items-center justify-center bg-base-200 px-60">
        <div>
          <div className="grid md:grid-cols-12 gap-16 items-center my-auto">
            {/* Left Column - Text Content */}
            <div className="col-span-4 text-left">
              <h2 className="text-5xl md:text-6xl font-tiempos font-normal text-primary mb-8 leading-tight">
                <span className="block font-title uppercase">Building Spaces,</span>
                <span className="block text-right font-title uppercase">Shaping Stories</span>
              </h2>
              <p className="text-lg font-sans text-neutral leading-relaxed max-w-2xl mb-8">
                At Renova, we believe that architectural visualization is not
                just about how a space looks - it's about how it makes you feel.
                We approach each project as a layered composition of light,
                form, and purpose, where clarity meets quiet beauty.
              </p>
              <button className="group text-primary uppercase tracking-wider text-sm font-sans hover:text-accent transition-all duration-300 flex items-center gap-3 border-b border-primary pb-1">
                LEARN MORE
                <ArrowForwardIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Right Column - Project Images */}
            <div className="col-span-8 grid grid-cols-2 gap-4">
              {/* Top Image - Larger */}
              <div className="grid gap-4">
                <div className="relative overflow-hidden">
                  <img
                    src={juniperImage1}
                    alt="Interior design project"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                
              </div>
              <div className="grid gap-4">
                {/* Bottom Image - Smaller */}
                <div className="relative overflow-hidden">
                  <img
                    src={juniperImage2}
                    alt="Interior design project"
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="relative overflow-hidden">
                  <img
                    src={juniperImage4}
                    alt="Interior design project"
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                {/* Bottom Image - Smaller */}
                <div className="relative overflow-hidden">
                  <img
                    src={juniperImage3}
                    alt="Interior design project"
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="min-h-screen bg-cover bg-center bg-no-repeat relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${mcKnightHero}")`,
              filter: "brightness(0.6) contrast(1.1)",
            }}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative flex justify-center">
          <div className="grid grid-cols-2 gap-0 items-center min-h-screen">
            {/* Left Section - Hero Content */}
            <div className="text-white">
              <div className="text-sm font-sans uppercase tracking-wider text-gray-300 mb-4">
                PORTFOLIO
              </div>
              <h2 className="text-6xl md:text-7xl font-tiempos font-normal mb-8 leading-tight">
                <span className="block font-title text-6xl">Design that</span>
                <span className="block font-title text-8xl md:text-9xl uppercase">Resonates</span>
              </h2>
              <p className="text-lg font-sans text-gray-300 leading-relaxed max-w-2xl mb-12">
                Discover how we transform your designs into immersive,
                emotionally engaging experiences.
              </p>
            </div>

            {/* Right Section - Projects Grid */}
            <div className="grid grid-cols-2 gap-8">
              {projects.slice(0, 4).map((project, index) => (
                <div
                  key={project.id}
                  className="bg-white backdrop-blur-sm shadow-lg cursor-pointer 
                  transition-transform duration-500 hover:scale-105
                  w-96 h-auto p-4"
                  onClick={(e) => handleViewProject(project.id, e)}
                >
                  <div className="flex w-full justify-between">
                    <div className="text-sm font-sans text-gray-600 mb-3">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="relative overflow-hidden mb-4 h-96 w-72">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="relative  w-full h-full object-cover"
                        style={{
                          transform: 'scale(1.2) translateY(-10px)'
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl text-right font-title text-primary uppercase tracking-wide font-medium">
                      {project.title}
                    </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-8 bg-primary flex items-center">
        <div className="text-center mx-auto text-white ">
          <h2 className="text-8xl font-title font-normal mb-8">
            Let's Create Together
          </h2>
          <p className="text-lg font-sans leading-relaxed mb-12 opacity-90">
            Ready to visualize your remodeling vision?  <br></br>Contact us to discuss
            how we can help bring your project to life with purpose and depth.
          </p>
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <EmailIcon className="text-2xl" />
              <a
                href="mailto:info@renovavisuals.com"
                className="text-xl font-sans hover:text-accent transition-colors duration-300"
              >
                info@renovavisuals.com
              </a>
            </div>
            <div className="flex items-center justify-center gap-3">
              <InstagramIcon className="text-2xl" />
              <a
                href="https://instagram.com/renova.visuals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-sans hover:text-accent transition-colors duration-300"
              >
                renova.visuals
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
