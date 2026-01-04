
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from './Skeleton';
import { FALLBACK_IMAGE_URL } from '../../data/mock';

interface ImageProps {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
}

export const Image: React.FC<ImageProps> = ({ 
  src, 
  alt = "", 
  className = "", 
  containerClassName = "",
  aspectRatio = 'video' 
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded'>('loading');
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE_URL);

  const ratioClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]'
  };

  const handleError = () => {
    // If the primary image fails, immediately swap to fallback
    if (imgSrc !== FALLBACK_IMAGE_URL) {
      setImgSrc(FALLBACK_IMAGE_URL);
    }
    setStatus('loaded');
  };

  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${ratioClasses[aspectRatio]} ${containerClassName}`}>
      <AnimatePresence>
        {status === 'loading' && (
          <motion.div 
            key="skeleton"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <Skeleton className="w-full h-full rounded-none" />
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={imgSrc}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={handleError}
        loading="lazy"
        className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
          status === 'loaded' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-xl'
        } ${className}`}
      />
    </div>
  );
};
