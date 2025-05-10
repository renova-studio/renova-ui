import React, { useEffect, useRef } from 'react';
import '../styles/TitleAnimation.css';

interface AnimatedTitleProps {
  title: string;
  isActive: boolean;
  isPrev: boolean;
  isNext: boolean;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ 
  title, 
  isActive,
  isPrev,
  isNext
}) => {
  const titleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isActive && titleRef.current) {
      // Add animation classes when becoming active
      const lines = titleRef.current.querySelectorAll('.title-line');
      lines.forEach((line, index) => {
        setTimeout(() => {
          line.classList.add('animate-in');
        }, 100 + (index * 100));
      });
    }
  }, [isActive]);

  return (
    <div 
      ref={titleRef}
      className={`animated-title ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
    >
      {title.split('\n').map((line, i) => (
        <span key={i} className="title-line">
          {line}
        </span>
      ))}
    </div>
  );
};

export default AnimatedTitle; 