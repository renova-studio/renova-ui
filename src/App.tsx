import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import './App.css';
import Logo from './components/Logo';
import ProjectDetail from './components/ProjectDetail';
import Portfolio from './components/Portfolio';
import { TransitionProvider, useTransition } from './context/TransitionContext';
import Materials from './components/Materials';

// Import project 360° images
import lucero360 from './assets/projects/lucero-360.jpeg';
import mcknight360 from './assets/projects/mcknight-360.jpeg';
import brunson360 from './assets/projects/brunson-360.jpeg';

// Import project main images (variant A, first image)
import luceroImage from './assets/projects/lucero-a (2).png';
import mcknightImage from './assets/projects/mcknight-a (1).png';
import brunsonImage from './assets/projects/brunson-a (1).png';

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
    description: 'A timeless, light-filled kitchen with a central island and expansive storage under vaulted ceilings.'
  },
  {
    id: 'mcknight',
    number: '02',
    title: 'MCKNIGHT',
    image: mcknightImage,
    image360: mcknight360,
    description: 'Elegant, functional design with layered cabinetry, open shelving, and statement lighting.',

  },
  {
    id: 'brunson',
    number: '03',
    title: 'BRUNSON',
    image: brunsonImage,
    image360: brunson360,
    description: 'Efficient design centered around a large window and an open island workspace.',
  }
];

const App: React.FC = () => {
  const [detailView, setDetailView] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  

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
    <TransitionProvider>
      <HashRouter>
        <div className="app-container">
          <TransitionOverlay />
          <Routes>
            <Route path="/" element={<Portfolio projects={projects} />} />
            <Route path="/projects/:projectId" element={<ProjectDetailWrapper projects={projects} />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </HashRouter>
    </TransitionProvider>
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
  
  return <ProjectDetail project={project} />;
};

// Transition Overlay Component
const TransitionOverlay = () => {
  const { isTransitioning } = useTransition();
  const [phase, setPhase] = useState<'growing' | 'shrinking'>('growing');
  
  useEffect(() => {
    if (isTransitioning) {
      // Start with growing phase
      setPhase('growing');
      
      // Switch to shrinking phase after all rectangles grow
      const timer = setTimeout(() => {
        setPhase('shrinking');
      }, 2500); // Adjust this time to allow for all rectangles to grow
      
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);
  
  if (!isTransitioning) return null;
  
  return (
    <div className="fullscreen-overlay">
      <div className={`transition-rectangle ${phase}`}></div>
      <div className={`transition-rectangle ${phase}`}></div>
      <div className={`transition-rectangle ${phase}`}></div>
      <div className={`transition-rectangle ${phase}`}></div>
      <div className={`transition-rectangle ${phase}`}></div>
      <div className={`transition-rectangle ${phase}`}></div>
      <div className={`transition-rectangle ${phase}`}></div>
      <div className={`transition-rectangle ${phase}`}></div>
    </div>
  );
};

export default App;
