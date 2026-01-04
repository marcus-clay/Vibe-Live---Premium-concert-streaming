
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ARTISTS, EVENTS } from '../data/mock';
import { Icons } from '../components/ui/Icons';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Image } from '../components/ui/Image';
import { ArtistRecommendationGraph } from '../components/graph/ArtistRecommendationGraph';

export const ArtistPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const artist = ARTISTS.find(a => a.id === id);
  const artistEvents = EVENTS.filter(e => e.artistId === id);
  const latestEvent = artistEvents[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [id]);

  if (!artist) return <div className="p-20 text-center">Artist not found</div>;

  return (
    <div className="flex-1 overflow-y-auto bg-black pb-32">
      {/* Cinematic Header Section */}
      <section className="relative min-h-[70vh] w-full flex items-end p-8 md:p-20 mb-12">
        <div className="absolute inset-0 overflow-hidden z-0 bg-zinc-950">
          <Image 
            src={artist.coverImage} 
            alt={artist.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover opacity-40 blur-[2px]" 
          />
          {/* Multi-layered Gradients for TVOS depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-12 w-full max-w-7xl mx-auto">
          <div className="w-56 h-56 md:w-72 md:h-72 flex-shrink-0">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-[40px]" />
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="w-full h-full"
              >
                <Image 
                  src={artist.image} 
                  alt={artist.name}
                  aspectRatio="square"
                  containerClassName="rounded-[40px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border-4 border-white/5" 
                />
              </motion.div>
            )}
          </div>
          
          <div className="flex flex-col gap-6 flex-1 w-full text-center md:text-left">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <Skeleton className="h-8 w-40 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-20 w-3/4" />
                  <Skeleton className="h-12 w-full max-w-2xl" />
                  <div className="flex gap-4 mt-4 justify-center md:justify-start">
                    <Skeleton className="h-14 w-40" />
                    <Skeleton className="h-14 w-56" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="loaded-header"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <Badge variant="glass" className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-4 py-1.5 font-black">Verified Vibe Artist</Badge>
                    <span className="text-zinc-400 text-sm font-black uppercase tracking-[0.2em]">{(artist.followers / 1000000).toFixed(1)}M Global Reach</span>
                  </div>
                  
                  <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white">
                    {artist.name}
                  </h1>
                  
                  <p className="text-xl md:text-2xl font-medium text-zinc-400 max-w-3xl leading-relaxed tracking-tight mb-4">
                    {artist.bio}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
                    <Button 
                      size="lg" 
                      className="px-14 py-5 text-lg"
                      variant={isFollowing ? 'secondary' : 'primary'}
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? 'Joined Circle' : 'Join Fan Circle'}
                    </Button>
                    {latestEvent && (
                      <Button 
                        size="lg" 
                        variant="glass" 
                        className="px-10 py-5 text-lg gap-3"
                        onClick={() => navigate(`/watch/${latestEvent.id}`)}
                      >
                        <Icons.Play weight="fill" size={24} /> Experience Latest Live
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Content Body */}
      <div className="max-w-7xl mx-auto px-8 flex flex-col gap-24">
        {/* Constellation Section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between px-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Connection Network</span>
              <h2 className="text-4xl font-black tracking-tight">Sonic Constellation</h2>
            </div>
          </div>
          <div className="min-h-[450px]">
            {isLoading ? (
              <Skeleton className="w-full h-[450px] rounded-[40px]" />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-[40px] p-2"
              >
                <ArtistRecommendationGraph artistId={artist.id} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Concerts Grid Section */}
        <div className="flex flex-col gap-10">
          <div className="flex items-end justify-between px-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Vault</span>
              <h2 className="text-4xl font-black tracking-tight">Live Archives</h2>
            </div>
            <button className="px-6 py-2 glass rounded-full text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
              Filter by Era
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col gap-6">
                      <Skeleton className="aspect-video rounded-[32px]" />
                      <div className="flex flex-col gap-2 px-4">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {artistEvents.map((event, idx) => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -12 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 25,
                        delay: 0.1 * idx 
                      }}
                      onClick={() => navigate(`/watch/${event.id}`)}
                      className="group cursor-pointer flex flex-col outline-none"
                    >
                      <div className="relative mb-6 shadow-2xl transition-all duration-500 group-hover:shadow-blue-500/20">
                        <Image 
                          src={event.image} 
                          alt={event.title}
                          containerClassName="rounded-[32px] border border-white/5 group-hover:border-blue-500/30"
                          className="transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div className="w-20 h-20 glass rounded-full flex items-center justify-center text-white">
                            <Icons.Play weight="fill" size={36} />
                          </motion.div>
                        </div>
                        <div className="absolute bottom-5 right-5">
                           <Badge variant="glass" className="bg-black/40 backdrop-blur-xl border-white/20">Ultra 4K</Badge>
                        </div>
                      </div>
                      <div className="px-6 flex flex-col gap-1">
                        <h3 className="font-black text-2xl tracking-tight group-hover:text-blue-400 transition-colors truncate">{event.title}</h3>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] leading-relaxed">Recorded Live • {event.duration / 60}m Special • Spatial Audio</p>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
