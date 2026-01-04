
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text' | 'artist';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  // Use zinc-800 instead of 900 for better contrast on black backgrounds
  const baseStyles = 'bg-zinc-800 overflow-hidden relative';
  
  const shimmer = (
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
  );

  const variants = {
    rectangular: 'rounded-2xl',
    circular: 'rounded-full',
    artist: 'rounded-full aspect-square',
    text: 'rounded h-4 w-full',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} aria-hidden="true">
      {shimmer}
    </div>
  );
};
