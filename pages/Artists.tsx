
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ARTISTS } from '../data/mock';
import { useViewportStore } from '../stores/viewportStore';
import { Icons } from '../components/ui/Icons';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';

export const Artists: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const { currentViewport } = useViewportStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const genres = ['All', 'Pop', 'Electronic', 'Hip Hop', 'Indie Rock', 'R&B'];
  const filteredArtists = filter === 'All' 
    ? ARTISTS 
    : ARTISTS.filter(a => a.genre.includes(filter));

  const isMobile = currentViewport === 'mobile';

  return (
    <div className="flex-1 overflow-y-auto bg-black p-8 md:p-16 pb-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Roster</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">Global Icons</h1>
            <p className="text-zinc-500 font-medium">Connect with the visionaries shaping music today.</p>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map(g => (
              <button
                key={g}
                onClick={() => setFilter(g)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  filter === g ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-12">
          <AnimatePresence mode="wait">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-6">
                  <Skeleton className="w-full aspect-square rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ))
            ) : (
              filteredArtists.map((artist, idx) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/artist/${artist.id}`)}
                  className="group flex flex-col items-center cursor-pointer outline-none text-center"
                  id={`artist-card-${artist.id}`}
                  data-focusable={currentViewport === 'tv'}
                >
                  <div className="relative w-full aspect-square mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-white/5 transition-all duration-500 group-hover:border-blue-500/50 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] overflow-hidden">
                      <img 
                        src={artist.image} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                        alt={artist.name} 
                      />
                    </div>
                    
                    {artist.followers > 50000000 && (
                      <div className="absolute top-0 right-0">
                        <Badge variant="live" className="animate-pulse shadow-lg scale-90">Trending</Badge>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
                      {/* Fix: Icons.Users -> Icons.Artists as defined in components/ui/Icons.tsx */}
                      <Icons.Artists size={40} className="text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-black text-xl md:text-2xl tracking-tighter group-hover:text-blue-400 transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {artist.genre} • {(artist.followers / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
