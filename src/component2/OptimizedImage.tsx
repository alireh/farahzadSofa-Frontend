// components/OptimizedImage.tsx
import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ desktopSrc, mobileSrc, alt, className }) => {
  const [currentSrc, setCurrentSrc] = useState(desktopSrc);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCurrentSrc(mobileSrc);
      } else {
        setCurrentSrc(desktopSrc);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [desktopSrc, mobileSrc]);

  return <img src={currentSrc} alt={alt} className={className} loading="lazy" />;
};

export default OptimizedImage;