
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraAngle } from '../../types';
import { usePlayerStore } from '../../stores/playerStore';
import { Icons } from '../ui/Icons';

interface MultiAngleSwitcherProps {
  angles: CameraAngle[];
}

export const MultiAngleSwitcher: React.FC<MultiAngleSwitcherProps> = ({ angles }) => {
  const { currentAngleId, setAngle } = usePlayerStore();
  const [hoveredAngle, setHoveredAngle] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 p-4 bg-black/80 backdrop-blur-xl border border-zinc-800 rounded-2xl w-fit">
      <div className="flex items-center gap-2 px-1">
        <Icons.Camera size={14} className="text-zinc-500" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Multi-Angle Cam</span>
      </div>

      <div className="flex gap-2">
        {angles.map((angle, idx) => {
          const isActive = currentAngleId === angle.id;
          const isHovered = hoveredAngle === angle.id;

          return (
            <button
              key={angle.id}
              id={`angle-${angle.id}`}
              data-focusable="true"
              onClick={() => setAngle(angle.id)}
              onMouseEnter={() => setHoveredAngle(angle.id)}
              onMouseLeave={() => setHoveredAngle(null)}
              className={`relative w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                isActive ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <img src={angle.thumbnail} alt={angle.label} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                <div className="text-[9px] font-bold text-white uppercase truncate">{angle.label}</div>
              </div>

              <div className="absolute top-1 right-1 w-4 h-4 bg-black/60 rounded flex items-center justify-center text-[9px] font-bold text-zinc-300">
                {idx + 1}
              </div>

              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute inset-0 z-10 bg-blue-500/20 flex items-center justify-center backdrop-blur-[2px]"
                  >
                    <Icons.Play size={20} weight="fill" className="text-white drop-shadow-lg" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
};
