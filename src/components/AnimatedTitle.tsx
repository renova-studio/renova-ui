import React, { useEffect, useRef, useMemo } from 'react';
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

  // Add useMemo to prevent unnecessary recalculations
  const letters = useMemo(() => title.split('\n').flatMap(line => line.split('')), [title]);
  
  return (
    <div 
      ref={titleRef}
      className={`animated-title ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            // Use transform instead of top/left positioning
            transform: `translateY(0)`,
            willChange: 'transform, opacity',
            animationDelay: `${index * 0.1}s`
          }}
          className="animated-letter"
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export default AnimatedTitle; 