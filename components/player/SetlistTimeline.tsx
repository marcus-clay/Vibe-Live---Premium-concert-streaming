
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SongMarker } from '../../types';
import { usePlayerStore } from '../../stores/playerStore';

interface SetlistTimelineProps {
  setlist: SongMarker[];
}

export const SetlistTimeline: React.FC<SetlistTimelineProps> = ({ setlist }) => {
  const { currentTime, duration, setCurrentTime, isPlaying, setPlaying } = usePlayerStore();
  const [hoveredSong, setHoveredSong] = useState<SongMarker | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasPlayingBeforeDrag = useRef(false);

  const currentProgress = isDragging ? dragProgress : (currentTime / duration) * 100;

  const calculateProgress = useCallback((clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * 100;
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    wasPlayingBeforeDrag.current = isPlaying;
    setPlaying(false);
    
    const progress = calculateProgress(e.clientX);
    setDragProgress(progress);
    setCurrentTime((progress / 100) * duration);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const progress = calculateProgress(e.clientX);
      setDragProgress(progress);
      setCurrentTime((progress / 100) * duration);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (wasPlayingBeforeDrag.current) {
          setPlaying(true);
        }
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, calculateProgress, duration, setCurrentTime, setPlaying]);

  return (
    <div className="relative w-full group py-8">
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className="h-1.5 w-full bg-white/10 rounded-full cursor-pointer relative overflow-visible transition-all hover:h-2"
      >
        {/* Background Track Rail */}
        <div className="absolute inset-0 bg-white/5 rounded-full" />

        {/* Active Progress Fill */}
        <motion.div 
          className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
          style={{ width: `${currentProgress}%` }}
          // Using duration: 0 for immediate updates during dragging to prevent lag/errors
          transition={isDragging ? { duration: 0 } : { type: 'spring', bounce: 0, duration: 0.2 }}
        >
          {/* Scrubber Handle */}
          <motion.div 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center z-30"
            initial={false}
            animate={{ 
              scale: isDragging ? 1.4 : 1,
              opacity: isDragging ? 1 : 0.8
            }}
            whileHover={{ scale: 1.2 }}
          >
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Song Markers */}
        {setlist.map((song) => {
          const songPos = (song.timestamp / duration) * 100;
          const isPassed = currentProgress > songPos;
          
          return (
            <div
              key={song.id}
              className={`absolute top-1/2 -translate-y-1/2 w-0.5 h-3 transition-all z-20 ${
                isPassed ? 'bg-blue-300' : 'bg-white/30'
              } hover:bg-white hover:w-1.5 hover:h-6 hover:shadow-[0_0_10px_white]`}
              style={{ left: `${songPos}%` }}
              onMouseEnter={() => setHoveredSong(song)}
              onMouseLeave={() => setHoveredSong(null)}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTime(song.timestamp);
              }}
            />
          );
        })}

        {/* Tooltip for Hovered Song */}
        <AnimatePresence>
          {hoveredSong && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute -top-14 px-4 py-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-bold whitespace-nowrap z-50 shadow-2xl flex flex-col items-center gap-1"
              style={{ left: `${(hoveredSong.timestamp / duration) * 100}%`, transform: 'translateX(-50%)' }}
            >
              <span className="text-blue-400 text-[10px] uppercase tracking-widest">
                {Math.floor(hoveredSong.timestamp / 60)}:{(hoveredSong.timestamp % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-white">{hoveredSong.title}</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-r border-b border-white/10 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrubbing Time Display Overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-blue-600 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] z-50"
            >
              <span className="text-2xl font-black text-white tabular-nums">
                {Math.floor(((currentProgress / 100) * duration) / 60)}:
                {Math.floor(((currentProgress / 100) * duration) % 60).toString().padStart(2, '0')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
