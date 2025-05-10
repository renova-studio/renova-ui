import React from 'react';
import logo from '../assets/logo.svg';

interface LogoProps {
  className?: string; // Make className optional
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <img src={logo} alt="Renova Logo" className={className} />
  );
};

export default Logo; 