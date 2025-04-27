'use client';

import React, { useState, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile screen size
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleMobileTooltip = () => {
    if (isMobile) {
      setIsHovered((prev) => !prev);
    }
  };

  return (
    <span
      className="relative cursor-help inline-block"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={toggleMobileTooltip}
    >
      {children}
      {isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-black text-white text-sm md:text-base px-3 py-2 rounded shadow-lg">
          {content}
        </div>
      )}
    </span>
  );
}
