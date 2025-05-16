import React from 'react';
import logo from '../assets/logo.svg';

interface LogoProps {
  className?: string; // Make className optional
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className = '', style={} }) => {
  return (
    <img src={logo} alt="Renova Logo" className={className} style={style} />
  );
};

export default Logo; 