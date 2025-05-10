import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Logo from './components/Logo';
import ProjectDetail from './components/ProjectDetail';
import Portfolio from './components/Portfolio';

// Import project 360° images
import lucero360 from './assets/lucero-360.jpeg';
import mcknight360 from './assets/mcknight-360.jpeg';
import brunson360 from './assets/brunson-360.jpeg';

// Import project main images (variant A, first image)
import luceroImage from './assets/lucero-a (1).png';
import mcknightImage from './assets/mcknight-a (1).png';
import brunsonImage from './assets/brunson-a (1).png';

const App: React.FC = () => {
  const [detailView, setDetailView] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  
  // Project data with correct 360° images and main images
  const projects = [
    {
      id: 'lucero',
      number: '01',
      title: 'LUCERO',
      image: luceroImage,
      image360: lucero360,
      description: 'Modern kitchen remodel with open concept design and premium finishes.'
    },
    {
      id: 'mcknight',
      number: '02',
      title: 'MCKNIGHT',
      image: mcknightImage,
      image360: mcknight360,
      description: 'Complete bathroom renovation with luxury fixtures and custom tilework.'
    },
    {
      id: 'brunson',
      number: '03',
      title: 'BRUNSON',
      image: brunsonImage,
      image360: brunson360,
      description: 'Living room transformation with custom built-ins and contemporary styling.'
    }
  ];

  // Update time and date
  useEffect(() => {
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
    const interval = setInterval(updateDateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Handle project image click to show details
  const handleProjectClick = (projectId: string) => {
    setDetailView(projectId);
    document.body.style.overflow = 'hidden';
  };

  // Handle back button click to return to the main view
  const handleBackClick = () => {
    setDetailView(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Portfolio projects={projects} />} />
          <Route 
            path="/projects/:projectId" 
            element={<ProjectDetailWrapper projects={projects} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

// Wrapper component to handle finding the project by ID from URL params
const ProjectDetailWrapper = ({ projects }: { projects: any[] }) => {
  const projectId = window.location.pathname.split('/projects/')[1];
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return <Navigate to="/" replace />;
  }
  
  return <ProjectDetail project={project} onBack={() => window.history.back()} />;
};

export default App;
