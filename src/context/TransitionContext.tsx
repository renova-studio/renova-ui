import React, { createContext, useState, useContext } from 'react';

interface TransitionContextType {
  isTransitioning: boolean;
  transitionDirection: 'in' | 'out';
  startTransition: (direction: 'in' | 'out', callback?: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'in' | 'out'>('in');
  const [callback, setCallback] = useState<(() => void) | undefined>(undefined);
  
  const startTransition = (direction: 'in' | 'out', cb?: () => void) => {
    setTransitionDirection(direction);
    setIsTransitioning(true);
    
    if (cb) {
      setCallback(() => cb);
      
      // Execute callback after the growing phase is complete
      setTimeout(() => {
        cb();
      }, 2200); // Growing phase + max delay (0.8s animation + 1.2s max delay + 0.2s buffer)
      
      // End the transition after all animations complete
      setTimeout(() => {
        setIsTransitioning(false);
      }, 4400); // Complete cycle (growing + shrinking + all delays)
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 4400);
    }
  };
  
  return (
    <TransitionContext.Provider value={{ 
      isTransitioning, 
      transitionDirection,
      startTransition
    }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}; 