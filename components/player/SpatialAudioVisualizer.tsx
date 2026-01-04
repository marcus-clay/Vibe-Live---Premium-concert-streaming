
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const channels = [
  { id: 'L', angle: 210 },
  { id: 'C', angle: 270 },
  { id: 'R', angle: 330 },
  { id: 'RS', angle: 45 },
  { id: 'LS', angle: 135 },
  { id: 'LB', angle: 165 },
  { id: 'RB', angle: 15 },
  { id: 'LFE', angle: -1, isSub: true },
];

export const SpatialAudioVisualizer: React.FC = () => {
  const [levels, setLevels] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newLevels: Record<string, number> = {};
      channels.forEach(ch => {
        newLevels[ch.id] = 0.2 + Math.random() * 0.8;
      });
      setLevels(newLevels);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 bg-black/80 backdrop-blur-xl border border-zinc-800 rounded-2xl w-64">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">7.1 Spatial Audio</span>
        <div className="flex gap-0.5">
          <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-1 h-3 bg-blue-500/50 rounded-full animate-pulse delay-75" />
          <div className="w-1 h-3 bg-blue-500/30 rounded-full animate-pulse delay-150" />
        </div>
      </div>
      
      <div className="relative h-32 flex items-center justify-center">
        {/* The listener/center */}
        <div className="w-8 h-8 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center z-10">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>

        {/* Orbit Rings */}
        <div className="absolute inset-0 border border-zinc-800 rounded-full scale-75 opacity-50" />
        <div className="absolute inset-0 border border-zinc-800 rounded-full scale-50 opacity-20" />

        {/* Channels */}
        {channels.map((ch) => {
          if (ch.isSub) return null;
          const level = levels[ch.id] || 0.5;
          return (
            <motion.div
              key={ch.id}
              className="absolute w-2 h-2 rounded-full bg-zinc-700"
              style={{
                top: `${50 + 40 * Math.sin((ch.angle * Math.PI) / 180)}%`,
                left: `${50 + 40 * Math.cos((ch.angle * Math.PI) / 180)}%`,
              }}
              animate={{
                scale: 1 + level * 0.5,
                backgroundColor: level > 0.8 ? '#3b82f6' : '#3f3f46',
                boxShadow: level > 0.8 ? '0 0 10px #3b82f6' : 'none'
              }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-zinc-500 uppercase">
                {ch.id}
              </div>
            </motion.div>
          );
        })}

        {/* Subwoofer indicator */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <div className="text-[8px] font-bold text-zinc-500 uppercase">LFE</div>
          <motion.div 
            className="w-4 h-1 bg-blue-500 rounded-full"
            animate={{ scaleX: 0.5 + (levels['LFE'] || 0) }}
          />
        </div>
      </div>
    </div>
  );
};
