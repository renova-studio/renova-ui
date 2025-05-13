import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
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

// Define project type
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

// Project data with correct 360° images and main images
const projects: Project[] = [
  {
    id: 'lucero',
    number: '01',
    title: 'LUCERO',
    image: luceroImage,
    image360: lucero360,
    description: 'Modern kitchen remodel with open concept design and custom cabinetry.',
    variants: {
      A: [
        '/images/lucero-a-daylight.jpg',
        '/images/lucero-a-golden.jpg',
        '/images/lucero-a-night.jpg',
        '/images/lucero-a-twilight.jpg'
      ],
      B: [
        '/images/lucero-b-daylight.jpg',
        '/images/lucero-b-golden.jpg',
        '/images/lucero-b-night.jpg',
        '/images/lucero-b-twilight.jpg'
      ]
    }
  },
  {
    id: 'mcknight',
    number: '02',
    title: 'MCKNIGHT',
    image: mcknightImage,
    image360: mcknight360,
    description: 'Elegant bathroom renovation with freestanding tub and walk-in shower.',
    variants: {
      A: [
        '/images/mcknight-a-daylight.jpg',
        '/images/mcknight-a-golden.jpg',
        '/images/mcknight-a-night.jpg',
        '/images/mcknight-a-twilight.jpg'
      ],
      B: [
        '/images/mcknight-b-daylight.jpg',
        '/images/mcknight-b-golden.jpg',
        '/images/mcknight-b-night.jpg',
        '/images/mcknight-b-twilight.jpg'
      ]
    }
  },
  {
    id: 'brunson',
    number: '03',
    title: 'BRUNSON',
    image: brunsonImage,
    image360: brunson360,
    description: 'Contemporary living room redesign with custom built-ins and fireplace.',
    variants: {
      A: [
        '/images/brunson-a-daylight.jpg',
        '/images/brunson-a-golden.jpg',
        '/images/brunson-a-night.jpg',
        '/images/brunson-a-twilight.jpg'
      ],
      B: [
        '/images/brunson-b-daylight.jpg',
        '/images/brunson-b-golden.jpg',
        '/images/brunson-b-night.jpg',
        '/images/brunson-b-twilight.jpg'
      ]
    }
  }
];

const App: React.FC = () => {
  const [detailView, setDetailView] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  
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
          <Route path="/projects/:projectId" element={<ProjectDetailWrapper projects={projects} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

// Wrapper component to handle project finding with useParams
interface ProjectDetailWrapperProps {
  projects: Project[];
}

const ProjectDetailWrapper: React.FC<ProjectDetailWrapperProps> = ({ projects }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return <div>Project not found</div>;
  }
  
  const handleBack = () => {
    navigate('/');
  };
  
  return <ProjectDetail project={project} onBack={handleBack} />;
};

export default App;
