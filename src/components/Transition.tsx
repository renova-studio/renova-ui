import React, { useEffect, useRef } from 'react';

interface TransitionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const Transition: React.FC<TransitionProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.8,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (elementRef.current) {
                elementRef.current.style.opacity = '1';
                elementRef.current.style.transform = 'translateY(0)';
              }
            }, delay * 1000);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);
  
  return (
    <div 
      ref={elementRef}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
        transitionDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
};

export default Transition; 