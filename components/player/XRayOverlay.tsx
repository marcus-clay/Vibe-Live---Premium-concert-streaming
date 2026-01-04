
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../stores/playerStore';
import { Icons } from '../ui/Icons';

const PERFORMANCE_METADATA = [
  { 
    time: 15, 
    type: 'gear', 
    title: 'Prophet-6 Polyphonic Synth', 
    desc: 'The pulsating bass in "Gasoline" is driven by this sequential analog powerhouse.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&h=200&fit=crop'
  },
  { 
    time: 45, 
    type: 'fashion', 
    title: 'Custom Saint Laurent Suit', 
    desc: 'The red blazer from the "After Hours" era, redesigned for 4K broadcast depth.',
    image: 'https://images.unsplash.com/photo-1594932224828-b4b059b8fe0e?w=200&h=200&fit=crop'
  },
  { 
    time: 80, 
    type: 'trivia', 
    title: 'Spatial Audio Mix: 128 Channels', 
    desc: 'Each instrument is mapped to a 3D coordinate for the immersive headset experience.',
    image: 'https://images.unsplash.com/photo-1558403194-611308249627?w=200&h=200&fit=crop'
  }
];

export const XRayOverlay: React.FC = () => {
  const { isXRayOpen, currentTime } = usePlayerStore();
  
  const activeCards = PERFORMANCE_METADATA.filter(m => 
    currentTime >= m.time && currentTime <= m.time + 15
  );

  return (
    <AnimatePresence>
      {isXRayOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none z-40 bg-blue-900/10 backdrop-blur-[2px]"
        >
          {/* Grid lines for "Scanning" look */}
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          <div className="absolute top-1/2 -translate-y-1/2 left-20 flex flex-col gap-6 w-72 pointer-events-auto">
            {activeCards.length === 0 ? (
              <div className="glass-dark p-6 rounded-3xl border border-blue-500/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Immersive Intel</p>
                <p className="text-sm text-zinc-400 font-medium">Monitoring broadcast for metadata... Next insight at song bridge.</p>
              </div>
            ) : (
              activeCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-dark p-5 rounded-[32px] border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
                      {card.type === 'gear' ? <Icons.Waveform size={20} /> : <Icons.Info size={20} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">{card.type}</span>
                  </div>
                  <div className="flex gap-4">
                    <img src={card.image} className="w-16 h-16 rounded-xl object-cover border border-white/10" alt="" />
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-white leading-tight">{card.title}</h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="absolute top-10 right-1/2 translate-x-1/2">
             <div className="px-6 py-2 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                VIBE Intel Active
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
