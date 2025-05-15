import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import '../styles/Portfolio.css';

// Import images directly
import luceroA1 from '../assets/lucero-a (1).png';
import brunsonA1 from '../assets/brunson-a (1).png';
import mcknightA1 from '../assets/mcknight-a (1).png';

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
  // State variables
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [expandedMenu, setExpandedMenu] = useState<string | null>('portfolio');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [previewedProject, setPreviewedProject] = useState<string | null>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  // Add scroll position state
  const [scrollY, setScrollY] = useState(0);
  // Add mobile detection state
  const [isMobile, setIsMobile] = useState(false);
  
  // Define refs for sections
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Update time and date
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time as HH:MM AM/PM
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${minutes} ${ampm} [PST]`);
      
      // Format date as Month DD, YYYY
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-US', options).toUpperCase());
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    
    // Set up intersection observer for active section
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
    
    if (previewSectionRef.current && selectedProject) {
      previewSectionRef.current.id = 'preview';
      sectionObserver.observe(previewSectionRef.current);
    }

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
      clearInterval(interval);
      sectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedProject]);
  
  useEffect(() => {
    if (projects.length > 0) {
      setCurrentImage(projects[0].image);
    }
  }, [projects]);
  
  const toggleMenu = () => {
    setExpandedMenu(expandedMenu === 'portfolio' ? null : 'portfolio');
  };
  
  // Create a utility function to generate parallax style
  const getParallaxStyle = (speed: number, isBackground: boolean = false) => {
    // Return empty transform if mobile
    if (isMobile) {
      return {};
    }
    
    return {
      transform: isBackground ? `translateY(${scrollY * speed}px) scale(1.03)` : `translateY(${scrollY * speed}px)`,
      transition: 'transform scroll() cubic-bezier(0.1, 0, 0.9, 1)'
    };
  };

  return (
    <div className="minimal-container">
      
      {/* Fixed Side Navigation */}
      <nav className="side-nav">
        <div className="nav-section">
          <div 
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => {}}
          >
            <span className="nav-text">HOME</span>
          </div>
        </div>
        
        <div className="nav-section">
          <div 
            className={`nav-item ${activeSection === 'portfolio' ? 'active' : ''}`}
            onClick={() => {
              toggleMenu();
            }}
          >
            <span className="nav-text">PORTFOLIO</span>
          </div>
        </div>
        
        <div className="nav-section">
          <div 
            className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => {}}
          >
            <span className="nav-text">CONTACT</span>
          </div>
        </div>
      </nav>
      
      {/* Fixed Header */}
      <header className="minimal-header">
        <div className="header-right">
          <div className="company-logo-container">
            <Logo className="header-logo" />
            <div className="header-company-name">renova</div>
          </div>
        </div>
      </header>
      
      <section className="home-section" ref={infoSectionRef}>
        <div className="home-text" style={getParallaxStyle(-0.2)}>
          <p className="section-main-text">
            We craft virtual experiences that align with <br />
            your vision - turning your imagination<br />
            into immersive realities.
          </p>
          <p>
            [SCROLL TO EXPLORE]
          </p>
        </div>
        
        <div className="project-thumbnails" style={getParallaxStyle(0.05)}>
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="project-thumbnail"
              onClick={() => {}}
            >
              <div className="thumbnail-number">[{project.number}]</div>
              <div className="thumbnail-image-container">
                <img src={project.image} alt={project.title} className="thumbnail-image" />
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Wrap your project sections in a projects-container */}
      <div className="projects-container">
        {projects.map((project, index) => (
          <section 
            key={project.id}
            id={`project-hero-${project.id}`}
            className="project-hero-section"
          >
            {/* Background image with parallax effect */}
            <div className="parallax-background-container">
              <img 
                src={project.image} 
                alt="" 
                className="section-background-image parallax-element"
                style={getParallaxStyle(-0.1, true)}
              />
               <img 
                src={projects[(index + 1)%projects.length].image} 
                alt="" 
                className="section-background-image2 parallax-element"
                style={getParallaxStyle(-0.1, true)}
              />
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
                <Link to={`/projects/${project.id}`} className="view-project-link">
                  <button className="view-project-button">View Project Details</button>
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
      
      {/* Contact Section */}
      <section className="contact-section" ref={contactSectionRef}>
        <div className="contact-content" style={getParallaxStyle(-0.1)}>
          <h1 className="section-heading">Get in touch</h1>
          <p className="section-paragraph">
            Ready to visualize your remodeling project? Contact us to discuss how we can help bring your vision to life.
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <a href="mailto:info@renovadesign.com" className="contact-value">info@renovadesign.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <a href="tel:+15551234567" className="contact-value">+1 (555) 123-4567</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio; 