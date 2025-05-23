import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import '../styles/Portfolio.css';
import { useTransition } from '../context/TransitionContext';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Divider } from '@mui/material';
// Removed unused logo import

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

interface PortfolioProps {
  projects: Project[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects }) => {
  // Removed unused state variables
  const [activeSection, setActiveSection] = useState('home');
  // Add scroll position state
  const [scrollY, setScrollY] = useState(0);
  // Add mobile detection state
  const [isMobile, setIsMobile] = useState(false);
  // Remove unused animatingToProject state
  const navigate = useNavigate();
  const { startTransition } = useTransition();
  
  // Define refs for sections
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  // Removed unused previewSectionRef
  
  // Add refs for project sections
  const projectRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // Menu state
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Add loading state for images
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [visibleProjects, setVisibleProjects] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);
    
    // Observe each section
    if (infoSectionRef.current) {
      infoSectionRef.current.id = 'home';
      sectionObserver.observe(infoSectionRef.current);
    }
    
    if (portfolioSectionRef.current) {
      portfolioSectionRef.current.id = 'portfolio';
      sectionObserver.observe(portfolioSectionRef.current);
    }
    
    if (contactSectionRef.current) {
      contactSectionRef.current.id = 'contact';
      sectionObserver.observe(contactSectionRef.current);
    }
    
    // Removed unused previewSectionRef observer

    // Add scroll event listener for parallax effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add resize event listener to detect mobile devices
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initialize mobile detection
    handleResize();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      sectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Removed selectedProject dependency since it's no longer used
  
  // Removed unused useEffect for currentImage
  
  // Add this function to handle menu toggling
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Create a utility function to generate parallax style
  const getParallaxStyle = (speed: number, isBackground: boolean = false) => {
    return {
      transform: isBackground ? `translateY(${scrollY * speed}px) scale(1.03)` : `translateY(${scrollY * speed}px)`,
      transition: 'transform scroll() cubic-bezier(0.1, 0, 0.9, 1)'
    };
  };

  // Handle project view click with animation
  const handleViewProject = (projectId: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Use the context to start the transition
    startTransition('in', () => {
      navigate(`/projects/${projectId}`);
    });
  };

  // Function to handle thumbnail click and scroll to project
  const handleThumbnailClick = (projectId: string) => {
    const projectSection = projectRefs.current[projectId];
    if (projectSection) {
      smoothScrollTo(projectSection);
    }
  };

  // Smooth scroll function
  const smoothScrollTo = (target: HTMLElement | number) => {
    // Get the target position
    const targetPosition = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1500;
    let startTime: number | null = null;
    
    // Animation function
    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function (easeInOutQuad)
      const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
      const newPosition = startPosition + distance * ease(progress);
      window.scrollTo(0, newPosition);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  };

  // Helper function to check if in project preview
  const isInProject = () => {
    // Check if current active section is a project section
    return activeSection.startsWith('project-hero-');
  };

  useEffect(() => {
    // Function to check if we're at the top of the page
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // If we're within the first 100px of the page, hide the header
      if (scrollPosition < 100) {
        setActiveSection('home');
      } else {
        setActiveSection('other');
      }
    };

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initialize based on current scroll position
    handleScroll();

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const projectId = entry.target.getAttribute('data-project-id');
          if (projectId) {
            setVisibleProjects(prev => new Set(prev).add(projectId));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe project containers
    document.querySelectorAll('[data-project-id]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Handle image load events
  const handleImageLoad = (projectId: string) => {
    setLoadedImages(prev => new Set(prev).add(projectId));
  };

  return (
    <div className="minimal-container">
      <header className="minimal-header" style={{ 
        opacity: window.scrollY < window.innerHeight ? 0 : 1,
        visibility: window.scrollY < window.innerHeight ? 'hidden' : 'visible',
      }} >
        <div 
          className="company-logo-container" 
          onClick={() => smoothScrollTo(0)}
          style={{ cursor: 'pointer' }}
        >
          <Logo className="header-logo" style={{ filter: isInProject() ? 'invert(1)' : 'invert(0)'  }} />
          <Divider sx={{ 
            padding: '0 0.25rem', 
            opacity: 1, 
            borderRightWidth: '2px', 
            borderColor: isInProject() ? 'white' : 'black', 
            marginTop:'0',
            marginBottom:'0',
            marginRight: '0.25rem'}} orientation="vertical" variant="middle" flexItem />
          <span className="company-name-text" style={{ fontSize: '1.75rem', color: isInProject() ? 'white' : 'black' }}>renova</span>
        </div>
      </header>
      <div className="home-logo-container-wrapper" style={getParallaxStyle(0.5)}>
        <div className="home-logo-container">
            <Logo className="home-logo" />  
            <Divider sx={{ 
              lineHeight: '7rem',
              padding: isMobile ? '0 1rem' : '0 1.5rem', 
              opacity: 1, 
              borderRightWidth: '2px', 
              borderColor: 'gray', 
              marginRight: isMobile ? '2rem' : '3rem' }} orientation="vertical" variant="middle" flexItem />
            <span className="home-company-name-text">renova</span>
        </div>
      </div>
      
      <section className="home-section" ref={infoSectionRef}>
        <div className="home-text">
          <p className="section-main-text" style={getParallaxStyle(-0.1)}>
            We craft virtual experiences that align with
            your vision - turning your imagination
            into immersive realities.
          </p>
          <p style={getParallaxStyle(-0.1)}>
            [SCROLL TO EXPLORE]
          </p>
        </div>
            
        <div className="project-thumbnails">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="project-thumbnail"
              data-project-id={project.id}
              onClick={() => handleThumbnailClick(project.id)}
              style={getParallaxStyle(-0.15 - 0.05 * (index))}
            >
              <div className="thumbnail-number">[{project.number}]</div>
              <div className="thumbnail-image-container">
                {visibleProjects.has(project.id) && (
                  <>
                    {!loadedImages.has(project.id) && (
                      <div className="image-placeholder">
                        <div className="loading-spinner"></div>
                      </div>
                    )}
                    <img 
                      src={project.image}
                      alt={project.title}
                      className={`thumbnail-image ${loadedImages.has(project.id) ? 'loaded' : ''}`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(project.id)}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Wrap your project sections in a projects-container */}
      <div className="projects-container">
        {projects.map((project) => (
          <section 
            key={project.id}
            id={`project-hero-${project.id}`}
            className="project-hero-section"
            data-project-id={project.id}
            ref={(el) => {
              projectRefs.current[project.id] = el;
            }}
          >
            <div className="parallax-background-container">
              {visibleProjects.has(project.id) && (
                <>
                  {!loadedImages.has(`hero-${project.id}`) && (
                    <div className="image-placeholder">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  <img 
                    src={project.image}
                    alt=""
                    className={`section-background-image parallax-element ${
                      loadedImages.has(`hero-${project.id}`) ? 'loaded' : ''
                    }`}
                    style={getParallaxStyle(-0.1, true)}
                    loading="lazy"
                    onLoad={() => handleImageLoad(`hero-${project.id}`)}
                  />
                </>
              )}
            </div>
            <div className="project-hero">
              <div className="project-hero-image-container" style={getParallaxStyle(0.05)}>
                <div className="project-hero-image-wrapper">
                    <img
                        src={project.image} 
                        alt="Current project" 
                        className="project-hero-image"
                      />
                </div>
              </div>
              <div className="project-hero-content" style={getParallaxStyle(0.05)}>
                <div className="project-hero-header">
                  <div className="project-hero-number">[{project.number}]</div>
                  <h2 className="project-hero-title">{project.title}</h2>
                </div>
                <p className="project-hero-description">{project.description}</p>
                <button 
                  className="view-project-button"
                  onClick={(e) => handleViewProject(project.id, e)}
                >
                  View Project Details
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>
      
      {/* Contact Section */}
      <section className="contact-section" ref={contactSectionRef}>
        <div className="contact-content" >
          <h1 className="section-heading">Get in touch</h1>
          <p className="section-paragraph">
            Ready to visualize your remodeling project? Contact us to discuss how we can help bring your vision to life.
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <EmailIcon sx={{ color: 'var(--text-dark)' }} />
              <a href="mailto:info@renovadesign.com" className="contact-value">info@renovavisuals.com</a>
            </div>
            <div className="contact-item">
              <InstagramIcon sx={{ color: 'var(--text-dark)' }} />
              <a href="https://instagram.com/renova.visuals"  target="_blank" rel="noopener noreferrer" className="contact-value">
                renova.visuals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Add this JSX right after the <div className="minimal-container"> line */}
      <div className={`hamburger-menu-container ${menuOpen ? 'menu-open' : ''}`}>
        <button className="hamburger-button" onClick={toggleMenu}>
          <span className="hamburger-line" style={{ backgroundColor: isInProject() || menuOpen ? 'white' : 'black' }}></span>
          <span className="hamburger-line" style={{ backgroundColor: isInProject() || menuOpen ? 'white' : 'black' }}></span>
          <span className="hamburger-line" style={{ backgroundColor: isInProject() || menuOpen ? 'white' : 'black' }}></span>
        </button>
        
        <div className="menu-overlay">
          <div className="menu-content">
            <nav className="menu-navigation">
              <ul>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      toggleMenu(); 
                      smoothScrollTo(0); // Scroll to top
                    }}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a 
                    href="/materials"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu();
                      startTransition('in', () => {
                        navigate('/materials');
                      });
                    }}
                  >
                    Materials
                  </a>
                </li>
                <li><p>Work</p></li>
                {projects.map((project, index) => (
                  <li style={{ paddingLeft: '2rem' }} key={project.id}>
                    <p style={{ paddingRight: '0.5rem' }}>[{project.number}]</p>
                    <a 
                      href={`#project-hero-${project.id}`} 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        toggleMenu();
                        // Use the projectRefs directly with our smooth scroll function
                        if (projectRefs.current[project.id]) {
                          smoothScrollTo(projectRefs.current[project.id]!);
                        }
                      }}
                    >
                      {project.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a 
                    href="#contact" 
                    onClick={(e) => { 
                      e.preventDefault();
                      toggleMenu(); 
                      const contactSection = contactSectionRef.current;
                      if (contactSection) {
                        smoothScrollTo(contactSection);
                      }
                    }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 