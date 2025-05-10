import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import '../styles/Portfolio.css';

interface PortfolioProps {
  projects: {
    id: string;
    number: string;
    title: string;
    image: string;
    description: string;
  }[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [expandedMenu, setExpandedMenu] = useState<string | null>('portfolio');
  
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
    
    return () => clearInterval(interval);
  }, []);
  
  const toggleMenu = (menu: string) => {
    if (expandedMenu === menu) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(menu);
    }
  };
  
  return (
    <div className="minimal-container">
      {/* Side Navigation */}
      <nav className="side-nav">
        <div className="nav-section">
          <div 
            className={`nav-item ${expandedMenu === 'info' ? 'active' : ''}`}
            onClick={() => toggleMenu('info')}
          >
            <span className="nav-text">INFO</span>
          </div>
        </div>
        
        <div className="nav-section">
          <div 
            className={`nav-item ${expandedMenu === 'portfolio' ? 'active' : ''}`}
            onClick={() => toggleMenu('portfolio')}
          >
            <span className="nav-text">PORTFOLIO</span>
          </div>
          
          {expandedMenu === 'portfolio' && (
            <div className="nav-submenu">
              {projects.map((project) => (
                <Link 
                  to={`/projects/${project.id}`} 
                  key={project.id} 
                  className="nav-subitem"
                >
                  <span className="nav-number">[{project.number}]</span>
                  <span className="nav-subitem-text">{project.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="nav-section">
          <div 
            className={`nav-item ${expandedMenu === 'contact' ? 'active' : ''}`}
            onClick={() => toggleMenu('contact')}
          >
            <span className="nav-text">CONTACT</span>
          </div>
        </div>
      </nav>
      
      {/* Header */}
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
      
      {/* Main Content */}
      <main className="minimal-main">
        <div className="intro-text">
          <h1 className="intro-heading">Visualize your remodeling project before it begins.</h1>
          <p className="intro-paragraph">
            We help clients visualize their remodeling projects with immersive 3D renderings and 360° views.
            See your space transformed before any construction starts.
          </p>
        </div>
      </main>
      
      {/* Project Thumbnails */}
      <div className="minimal-thumbnails">
        {projects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id} className="project-thumbnail">
            <div className="thumbnail-image-container">
              <img src={project.image} alt={project.title} className="thumbnail-image" />
            </div>
            <div className="thumbnail-info">
              <div className="thumbnail-number">[{project.number}]</div>
              <h2 className="thumbnail-title">{project.title}</h2>
              <p className="thumbnail-description">{project.description}</p>
              <button className="view-project-button">View Project</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Portfolio; 