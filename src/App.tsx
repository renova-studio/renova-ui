import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const [activeProject, setActiveProject] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Project data (simplified without role, position, year)
  const projects = [
    {
      id: 'harbour-space',
      number: '01',
      title: 'HARBOUR\nSPACE',
      image: 'https://placehold.co/800x600',
    },
    {
      id: 'student-app',
      number: '02',
      title: 'STUDENT\nAPP',
      image: 'https://placehold.co/800x600',
    },
    {
      id: 'riverside-villa',
      number: '03',
      title: 'RIVERSIDE\nVILLA',
      image: 'https://placehold.co/800x600',
    },
    {
      id: 'contact',
      number: '04',
      title: 'SOMETHING\nIN MIND?',
      image: 'https://placehold.co/800x600',
    }
  ];

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simplified class application
  const applyScrollingClasses = (direction: number) => {
    // First remove any existing scrolling classes
    document.body.classList.remove('scrolling-up', 'scrolling-down');
    
    // Apply the appropriate class based on direction
    const scrollDirection = direction > 0 ? 'scrolling-down' : 'scrolling-up';
    document.body.classList.add(scrollDirection);
    console.log('Applied class:', scrollDirection);
    
    // Force a reflow to ensure the class is applied
    void document.body.offsetHeight;
  };

  // Simplified transition handling
  const handleProjectChange = (nextIndex: number) => {
    if (isScrolling || nextIndex === activeProject) return;
    
    setIsScrolling(true);
    
    // Fade out current project text
    const currentProject = document.querySelector(`.project.active`);
    if (currentProject) {
      currentProject.classList.add('text-fading-out');
    }
    
    // Change project after a short delay
    setTimeout(() => {
      setActiveProject(nextIndex);
      
      // Reset states after transition completes
      setTimeout(() => {
        if (currentProject) {
          currentProject.classList.remove('text-fading-out');
        }
        setIsScrolling(false);
      }, 800);
    }, 100);
  };

  // Simplified scroll handling
  useEffect(() => {
    let lastScrollTime = 0;
    const scrollCooldown = 500; // ms between scroll actions
    
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      
      // Throttling - ignore any scroll during cooldown
      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown || isScrolling) {
        return;
      }
      
      lastScrollTime = now;
      
      // Simple direction detection
      const direction = e.deltaY > 0 ? 1 : -1;
      
      // Calculate next project index
      let nextIndex = activeProject + direction;
      
      // Loop navigation
      if (nextIndex < 0) nextIndex = projects.length - 1;
      if (nextIndex >= projects.length) nextIndex = 0;
      
      // Handle the project change
      handleProjectChange(nextIndex);
    };
    
    window.addEventListener('wheel', handleScroll, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeProject, isScrolling, projects.length]);

  // Simplified dot navigation
  const handleDotClick = (index: number) => {
    handleProjectChange(index);
  };

  // Project class assignment with locked perspective
  const getProjectClass = (index: number) => {
    if (index === activeProject) return 'project active';
    
    // Calculate prev and next indices with wrapping
    const prevIndex = activeProject === 0 ? projects.length - 1 : activeProject - 1;
    const nextIndex = activeProject === projects.length - 1 ? 0 : activeProject + 1;
    
    if (index === prevIndex) return 'project project-prev';
    if (index === nextIndex) return 'project project-next';
    
    return 'project';
  };

  return (
    <div className="portfolio">
      <div className="custom-cursor" ref={cursorRef}></div>
      
      <header className="header">
        <div className="logo">Fr</div>
        <div className="designer-name">FRANCISCA MOURA</div>
      </header>
      
      <main className="main-content">
        <div className="project-dots">
          {projects.map((project, index) => (
            <div 
              key={`dot-${project.id}`}
              className={`project-dot ${index === activeProject ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
        
        <div className="projects-container">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className={getProjectClass(index)}
            >
              <div className="project-content">
                <div className="project-number">{project.number}</div>
                
                <div className="project-info">
                  <h2 className="project-title">
                    {project.title.split('\n').map((line, i) => 
                      <span key={i} className="title-line">{line}</span>
                    )}
                  </h2>
                </div>
              </div>
              
              <div className="project-image-wrapper">
                <div className="project-image-container">
                  <div className="project-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
