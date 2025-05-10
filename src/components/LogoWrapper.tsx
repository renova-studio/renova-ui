import React from 'react';
import Logo from './Logo';

interface LogoWrapperProps {
  className?: string;
}

const LogoWrapper: React.FC<LogoWrapperProps> = ({ className }) => {
  return (
    <div className={className}>
      <Logo />
    </div>
  );
};

export default LogoWrapper; 