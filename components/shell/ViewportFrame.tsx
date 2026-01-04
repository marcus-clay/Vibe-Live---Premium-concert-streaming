
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useViewportStore } from '../../stores/viewportStore';
import { VIEWPORTS } from '../../constants';
import { ViewportType } from '../../types';

export const ViewportFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentViewport, setViewport } = useViewportStore();
  const config = VIEWPORTS[currentViewport];
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate the scale needed to fit the viewport into the screen with some padding
  const dynamicScale = useMemo(() => {
    const padding = 40;
    const availableWidth = windowSize.width - padding;
    const availableHeight = windowSize.height - padding;
    
    const scaleX = availableWidth / config.width;
    const scaleY = availableHeight / config.height;
    
    // We want to fill as much as possible, but never exceed 1 (original size) 
    // unless we're on a very high-res screen where we can afford it.
    // For this portfolio piece, we'll allow scaling up to 1.
    return Math.min(scaleX, scaleY, 1);
  }, [windowSize, config]);

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)] opacity-50" />
      
      {/* Viewport Selector Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] glass-dark border border-white/10 p-1 rounded-2xl flex gap-1 shadow-2xl scale-90 md:scale-100">
        {(Object.keys(VIEWPORTS) as ViewportType[]).map((v) => (
          <button
            key={v}
            onClick={() => setViewport(v)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              currentViewport === v ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="absolute bottom-6 right-8 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] z-[100]">
        SIMULATING: {config.name} • {config.width}x{config.height} • Scale {(dynamicScale * 100).toFixed(0)}%
      </div>

      <motion.div
        layout
        initial={false}
        animate={{
          width: config.width,
          height: config.height,
          scale: dynamicScale
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 28, mass: 1 }}
        className="bg-black shadow-[0_0_120px_rgba(0,0,0,0.8)] rounded-[48px] border-[14px] border-[#111] relative overflow-hidden"
        style={{ transformOrigin: 'center center' }}
      >
        <div className="w-full h-full relative overflow-hidden bg-black flex flex-col">
          {children}
        </div>

        {/* Device elements */}
        {currentViewport === 'mobile' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-[#111] rounded-b-[24px] z-50 flex items-center justify-center gap-2">
            <div className="w-10 h-1 bg-zinc-800 rounded-full" />
            <div className="w-2 h-2 bg-zinc-800 rounded-full" />
          </div>
        )}
        
        {/* Subtle Screen Reflection */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.02] to-transparent z-40" />
      </motion.div>
    </div>
  );
};
