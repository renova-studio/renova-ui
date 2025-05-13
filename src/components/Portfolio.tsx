import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import '../styles/Portfolio.css';

// Import images directly
import luceroA1 from '../assets/lucero-a (1).png';
import brunsonA1 from '../assets/brunson-a (1).png';
import mcknightA1 from '../assets/mcknight-a (1).png';

// Remove the custom type and use a more direct approach
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
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [expandedMenu, setExpandedMenu] = useState<string | null>('portfolio');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [previewedProject, setPreviewedProject] = useState<string | null>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  
  // Define refs
  const parallaxRef = useRef<HTMLDivElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);
  const fixedImageContainerRef = useRef<HTMLDivElement>(null);
  
  // Add a state to track if we're in the portfolio section
  const [isInPortfolioSection, setIsInPortfolioSection] = useState(false);
  
  // Add a state to track if we're in the project sections
  const [isInProjectSection, setIsInProjectSection] = useState(false);
  
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
    
    // Update the current project based on scroll position
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Get all project preview sections
      const projectSections = document.querySelectorAll('.project-preview-section');
      
      // Check if any project section is in view
      let isAnyProjectVisible = false;
      let activeIndex = 0;
      
      projectSections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        // If the section is in the viewport (or close to it)
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          isAnyProjectVisible = true;
          
          // If the section is centered in the viewport, make it the active one
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            activeIndex = index;
          }
        }
      });
      
      // Update visibility state based on whether any project is visible
      setIsInPortfolioSection(isAnyProjectVisible);
      
      // Update the current project index if it changed
      if (activeIndex !== currentProjectIndex) {
        setCurrentProjectIndex(activeIndex);
      }
      
      // Apply parallax effect to background images
      const backgroundImages = document.querySelectorAll('.section-background-image');
      backgroundImages.forEach((img) => {
        const section = img.closest('section');
        if (section) {
          const sectionTop = section.offsetTop;
          const distanceFromTop = scrollPosition - sectionTop;
          const parallaxOffset = distanceFromTop * 0.4;
          (img as HTMLElement).style.transform = `translateY(${parallaxOffset}px) translateZ(-1px) scale(2)`;
        }
      });
      
      // Apply parallax to other elements
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      }
      
      // Add this to the handleScroll function
      console.log('Current project index:', activeIndex);
      console.log('Is any project visible:', isAnyProjectVisible);
      console.log('Project sections count:', projectSections.length);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Set up intersection observers to detect which section is in view
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // When 50% of the section is visible
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
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
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      sectionObserver.disconnect();
    };
  }, [selectedProject, currentProjectIndex]);
  
  const toggleMenu = () => {
    setExpandedMenu(expandedMenu === 'portfolio' ? null : 'portfolio');
  };
  
  // Update the scrollToSection function to accept any ref with a current property
  const scrollToSection = (sectionRef: { current: HTMLDivElement | null }) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const handleThumbnailClick = (project: Project) => {
    setSelectedProject(project);
    setPreviewedProject(project.id);
    
    // Scroll to the preview section
    if (previewSectionRef.current) {
      previewSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  return (
    <div className="minimal-container">
      {/* Parallax Background */}
      <div className="parallax-container">
        <div className="parallax-background" ref={parallaxRef}></div>
      </div>
      
      {/* Fixed Side Navigation */}
      <nav className="side-nav">
        <div className="nav-section">
          <div 
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => scrollToSection(infoSectionRef)}
          >
            <span className="nav-text">HOME</span>
          </div>
        </div>
        
        <div className="nav-section">
          <div 
            className={`nav-item ${activeSection === 'portfolio' ? 'active' : ''}`}
            onClick={() => {
              scrollToSection(portfolioSectionRef);
              toggleMenu();
            }}
          >
            <span className="nav-text">PORTFOLIO</span>
          </div>
        </div>
        
        <div className="nav-section">
          <div 
            className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => scrollToSection(contactSectionRef)}
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
          <div className="current-time">{currentTime}</div>
          <div className="current-date">{currentDate}</div>
        </div>
      </header>
      
      {/* Main Content - Scrollable */}
      <main className="minimal-main">
        {/* Info Section */}
        <section className="home-section" ref={infoSectionRef}>
          <div className="home-text">
            <p className="section-main-text">
              We craft virtual experiences that align with <br />
              your vision - turning your imagination<br />
              into immersive realities.
            </p>
            <p>
            [SCROLL TO EXPLORE]
            </p>
          </div>
          
          <div className="project-thumbnails">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-thumbnail"
                onClick={() => handleThumbnailClick(project)}
              >
                <div className="thumbnail-number">[{project.number}]</div>
                <div className="thumbnail-image-container">
                  <img src={project.image} alt={project.title} className="thumbnail-image" />
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Fixed Project Image Container - only visible in project sections */}
        <div 
          className={`fixed-image-container ${isInPortfolioSection ? 'visible' : 'hidden'}`} 
          ref={fixedImageContainerRef}
        >
          <div className="fixed-image-wrapper">
            {projects.map((project, index) => (
              <img 
                key={project.id}
                src={project.image} 
                alt={project.title} 
                className={`fixed-preview-image ${index === currentProjectIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
        
        {/* Project Preview Sections */}
        {projects.map((project, index) => (
          <section 
            key={project.id}
            id={`preview-${project.id}`}
            className="project-preview-section"
          >
            {/* Background image with blur effect */}
            <img 
              src={project.image} 
              alt="" 
              className="section-background-image"
            />
            
            <div className="project-preview">
              {/* Empty div for spacing where the image would be */}
              <div className="preview-image-placeholder"></div>
              
              <div className="preview-content">
                <div className="preview-header">
                  <div className="preview-number">[{project.number}]</div>
                  <h2 className="preview-title">{project.title}</h2>
                </div>
                <p className="preview-description">{project.description}</p>
                <Link to={`/projects/${project.id}`} className="view-project-link">
                  <button className="view-project-button">View Project Details</button>
                </Link>
              </div>
            </div>
          </section>
        ))}
        
        {/* Contact Section */}
        <section className="contact-section" ref={contactSectionRef}>
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
        </section>
      </main>
    </div>
  );
};

export default Portfolio; 