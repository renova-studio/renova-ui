import React from 'react';
import { ReactComponent as LogoSVG } from '../assets/logo.svg';

interface LogoProps {
  className?: string;
  onClick?: (e: React.MouseEvent<SVGElement>) => void;
}

const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => {
  return (
    <LogoSVG 
      className={className}
      onClick={onClick}
      style={{ 
        cursor: 'pointer', 
        height: 'auto',
        width: '80px'
      }}
    />
  );
};

export default Logo; 