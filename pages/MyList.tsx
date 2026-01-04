
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENTS, SERIES } from '../data/mock';
import { Icons } from '../components/ui/Icons';
import { useViewportStore } from '../stores/viewportStore';
import { usePlayerStore } from '../stores/playerStore';
// Fix: Import the missing Badge component to resolve "Cannot find name 'Badge'" error.
import { Badge } from '../components/ui/Badge';

export const MyList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Vault');
  const navigate = useNavigate();
  const { currentViewport } = useViewportStore();
  const { capturedMoments } = usePlayerStore();
  
  const savedItems = [EVENTS[2], EVENTS[4], SERIES[0]];
  const historyItems = [EVENTS[0], EVENTS[3]];

  return (
    <div className="flex-1 overflow-y-auto bg-black p-8 md:p-16 pb-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Fan Profile</span>
            <h1 className="text-5xl font-black tracking-tight">The Archive</h1>
          </div>
          
          <div className="flex gap-10 border-b border-zinc-900">
            {['Vault', 'History', 'Saved', 'Notifications'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="tab-underline"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-500" 
                  />
                )}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'Vault' ? (
            <motion.div
              key="vault"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-12"
            >
              {/* Fan Level Progress */}
              <div className="glass-dark rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-12 border border-white/5">
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="80" cy="80" r="70" className="fill-none stroke-white/5 stroke-[12]" />
                       <circle cx="80" cy="80" r="70" className="fill-none stroke-blue-500 stroke-[12]" style={{ strokeDasharray: 440, strokeDashoffset: 110 }} />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                       <span className="text-4xl font-black">75</span>
                       <span className="text-[10px] font-bold text-zinc-500 uppercase">Fan Rank</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-4 flex-1">
                    <div className="flex flex-col">
                       <h2 className="text-3xl font-black">Elite Broadcaster</h2>
                       <p className="text-zinc-400 font-medium">You have attended 12 live events and captured 45 unique moments.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="px-5 py-2 glass rounded-2xl flex items-center gap-2">
                          <Icons.Shield weight="fill" className="text-blue-500" />
                          <span className="text-xs font-bold text-white">Pro Badge</span>
                       </div>
                       <div className="px-5 py-2 glass rounded-2xl flex items-center gap-2">
                          <Icons.Globe weight="fill" className="text-indigo-500" />
                          <span className="text-xs font-bold text-white">Global Voyager</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Captured Moments Grid */}
              <div className="flex flex-col gap-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black">Digital Souvenirs</h3>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{capturedMoments.length} Captured</span>
                 </div>
                 
                 {capturedMoments.length === 0 ? (
                   <div className="py-20 flex flex-col items-center gap-6 glass rounded-[40px] border border-dashed border-white/10">
                      <Icons.Camera size={48} className="text-zinc-800" />
                      <p className="text-zinc-500 font-medium">Use the shutter icon during a stream to capture your first moment.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {capturedMoments.map(m => (
                        <motion.div 
                          key={m.id}
                          layoutId={m.id}
                          className="group relative aspect-[3/4] glass-dark rounded-[32px] overflow-hidden border border-white/10 p-4 flex flex-col gap-4 cursor-pointer hover:border-blue-500/30"
                        >
                           <div className="flex-1 rounded-2xl overflow-hidden relative">
                              <img src={m.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                              <div className="absolute top-4 left-4">
                                 <Badge variant="glass" className="bg-blue-600/40 border-blue-400/20 backdrop-blur-xl">Moment #{(m.timestamp).toFixed(0)}</Badge>
                              </div>
                           </div>
                           <div className="flex flex-col gap-1 px-2">
                              <h4 className="font-black text-white truncate">{m.title}</h4>
                              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none">Minted Dec 2024 • Certified by VIBE</p>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                 )}
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {(activeTab === 'Saved' ? savedItems : historyItems).map((item: any) => (
                <motion.div
                  key={item.id}
                  onClick={() => navigate(item.artistId ? `/watch/${item.id}` : `/series/${item.id}`)}
                  className="group flex flex-col gap-3 cursor-pointer"
                >
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-zinc-800">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Icons.Play weight="fill" size={32} />
                    </div>
                  </div>
                  <div className="flex flex-col px-1">
                    <h3 className="font-bold truncate">{item.title}</h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      {item.artistId ? 'Concert Replay' : 'Original Series'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
