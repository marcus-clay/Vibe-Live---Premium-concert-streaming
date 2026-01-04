
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../ui/Icons';

export const BackstagePass: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="absolute bottom-40 right-10 w-[320px] aspect-video glass-dark rounded-[32px] border-2 border-blue-500/30 overflow-hidden z-50 shadow-[0_0_50px_rgba(59,130,246,0.4)]"
        >
          <video 
            src="https://assets.mixkit.co/videos/preview/mixkit-backstage-of-a-rock-concert-with-lots-of-lights-41715-large.mp4" 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Exclusive Feed</span>
                <span className="text-xs font-black uppercase text-white">Backstage Rehearsal</span>
              </div>
              <button onClick={onClose} className="p-1.5 bg-black/40 rounded-full text-white/60 hover:text-white transition-colors">
                <Icons.X size={14} weight="bold" />
              </button>
            </div>
          </div>
          <div className="absolute top-4 left-4">
             <div className="px-2 py-1 bg-red-600 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-white animate-ping" />
                Live Access
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
