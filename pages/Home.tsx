
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENTS, ARTISTS, SERIES } from '../data/mock';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icons';
import { Skeleton } from '../components/ui/Skeleton';
import { Image } from '../components/ui/Image';
import { useViewportStore } from '../stores/viewportStore';

interface ContentRailProps {
  title: string;
  items: any[];
  type: 'event' | 'artist' | 'series';
  isLoading: boolean;
  railId: string;
}

const ContentRail: React.FC<ContentRailProps> = ({ title, items, type, isLoading, railId }) => {
  const navigate = useNavigate();
  const { currentViewport } = useViewportStore();
  const isMobile = currentViewport === 'mobile';

  if (items.length === 0 && !isLoading) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className={`${isMobile ? 'px-6' : 'px-20'} flex items-end justify-between`}>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Broadcast</span>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight text-white`}>{title}</h2>
        </div>
        {!isMobile && (
          <button className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-2">
            View All <Icons.ChevronRight size={14} weight="bold" />
          </button>
        )}
      </div>
      <div className={`flex gap-6 overflow-x-auto ${isMobile ? 'px-6' : 'px-20'} pb-10 scrollbar-hide snap-x`}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`flex-shrink-0 ${type === 'artist' ? 'w-32' : 'w-96'}`}>
              <Skeleton className={`mb-4 ${type === 'artist' ? 'aspect-square rounded-full' : 'aspect-video rounded-[32px]'}`} />
            </div>
          ))
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              className={`flex-shrink-0 cursor-pointer group snap-start ${type === 'artist' ? (isMobile ? 'w-32' : 'w-52') : (isMobile ? 'w-72' : 'w-[400px]')}`}
              onClick={() => {
                if (type === 'artist') navigate(`/artist/${item.id}`);
                if (type === 'event') navigate(`/watch/${item.id}`);
                if (type === 'series') navigate(`/series/${item.id}`);
              }}
            >
              <div className={`relative mb-6 shadow-2xl transition-all duration-500 ${type === 'artist' ? 'rounded-full' : 'rounded-[32px] border border-white/5 group-hover:border-blue-500/30'}`}>
                <Image 
                  src={type === 'series' ? item.image : item.image || item.coverImage} 
                  alt={item.title || item.name}
                  aspectRatio={type === 'artist' ? 'square' : 'video'}
                  className="transition-transform duration-700 group-hover:scale-110"
                  containerClassName={type === 'artist' ? 'rounded-full' : 'rounded-[32px]'}
                />
                {type === 'event' && <div className="absolute top-4 left-4 z-10"><Badge variant={item.accessLevel}>{item.accessLevel}</Badge></div>}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[inherit]">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
                    <Icons.Play weight="fill" size={24} />
                  </div>
                </div>
              </div>
              <div className={`flex flex-col gap-1 ${type === 'artist' ? 'items-center text-center' : ''}`}>
                <h3 className="font-bold text-xl truncate group-hover:text-blue-400 transition-colors text-white">{item.title || item.name}</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">{item.genre || 'Premium Broadcast'}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const heroEvent = EVENTS[0];
  const { currentViewport } = useViewportStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isSmallViewport = currentViewport === 'mobile' || currentViewport === 'tablet';

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-black pb-48 scroll-smooth">
      <div className="sticky top-0 z-[60] bg-blue-600/10 backdrop-blur-md border-b border-blue-500/20 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Live Studio Access Active</span>
        </div>
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 px-6 py-2 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-lg">
          <Icons.Analytics size={14} weight="fill" /> VIBE Studio
        </button>
      </div>

      <section className={`relative w-full flex flex-col justify-end mb-24 ${isSmallViewport ? 'h-[65vh] p-8' : 'h-[85vh] p-24'}`}>
        <div className="absolute inset-0 z-0 bg-zinc-950">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full"><Skeleton className="w-full h-full rounded-none" /></motion.div>
            ) : (
              <motion.div key="content" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="w-full h-full relative">
                <Image src={heroEvent.image} alt={heroEvent.title} containerClassName="w-full h-full" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative z-10 flex flex-col gap-10 max-w-6xl">
          {!isLoading && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <Badge variant="live" className="px-6 py-2">Premiere Event</Badge>
                <Badge variant={heroEvent.accessLevel} className="px-6 py-2 uppercase tracking-[0.2em]">{heroEvent.accessLevel}</Badge>
              </div>
              <div className="flex flex-col gap-6">
                <h1 className={`${currentViewport === 'mobile' ? 'text-5xl' : 'text-8xl md:text-9xl'} font-black tracking-tighter leading-[0.85] text-white`}>{heroEvent.title}</h1>
                <p className={`${currentViewport === 'mobile' ? 'text-lg line-clamp-2' : 'text-2xl'} font-medium text-zinc-400 max-w-3xl leading-relaxed tracking-tight`}>Immersive 4K experience with Spatial Audio Mastered. Get your digital ticket and join the world's most exclusive stage.</p>
              </div>
              <div className="flex flex-wrap gap-5">
                <Button size="lg" className="px-12 py-5 gap-3 text-lg" onClick={() => navigate(`/watch/${heroEvent.id}`)}>
                  <Icons.Play weight="fill" size={28} /> Start Broadcast
                </Button>
                <Button variant="glass" size="lg" className="px-12 py-5 gap-3 text-lg" onClick={() => navigate(`/artist/${heroEvent.artistId}`)}>
                  <Icons.Info weight="bold" size={28} /> Experience Intel
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Commercial Engagement Promo - CTA CONNECTED */}
      {!isLoading && (
        <section className={`mb-32 ${isSmallViewport ? 'px-6' : 'px-20'}`}>
          <div className="glass-dark rounded-[48px] p-12 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000" />
            <div className="flex flex-col gap-4 max-w-2xl relative z-10">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><Icons.Shield weight="fill" /></div>
                 <span className="text-xs font-black uppercase tracking-widest text-blue-500">Member Exclusive</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Unlimited Access with VIBE Pass</h2>
              <p className="text-xl text-zinc-400 font-medium tracking-tight">Access the entire archive, backstage feeds, and multi-angle 4K broadcasts for one monthly price.</p>
              <div className="flex gap-4 mt-4">
                <Button size="lg" className="px-10" onClick={() => navigate('/vibe-pass')}>Get VIBE Pass</Button>
                <Button variant="ghost" className="text-zinc-500 hover:text-white" onClick={() => navigate('/vibe-pass')}>Learn More</Button>
              </div>
            </div>
            <div className="flex-shrink-0 relative z-10">
               <div className="grid grid-cols-2 gap-4">
                  {[ARTISTS[0], ARTISTS[1], ARTISTS[2], ARTISTS[3]].map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                       <img src={a.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </motion.div>
                  ))}
               </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col gap-32">
        <ContentRail title="Live & Trending" items={EVENTS.filter(e => e.type === 'live')} type="event" isLoading={isLoading} railId="live" />
        <ContentRail title="Artist Roster" items={ARTISTS} type="artist" isLoading={isLoading} railId="artists" />
        <ContentRail title="Coming Soon" items={EVENTS.filter(e => e.type === 'upcoming')} type="event" isLoading={isLoading} railId="upcoming" />
        <ContentRail title="Exclusive Series" items={SERIES} type="series" isLoading={isLoading} railId="series" />
        <ContentRail title="Fan Favorites" items={EVENTS.filter(e => e.accessLevel === 'free')} type="event" isLoading={isLoading} railId="free" />
        <ContentRail title="Concert Archives" items={EVENTS.filter(e => e.type === 'replay')} type="event" isLoading={isLoading} railId="replay" />
      </div>

      {/* Gear Spotlight Interaction */}
      {!isLoading && (
        <section className={`mt-32 ${isSmallViewport ? 'px-6' : 'px-20'}`}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Deep Dive</span>
              <h2 className="text-4xl font-black tracking-tight text-white">Gear Spotlight</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="glass-dark rounded-[40px] p-8 border border-white/5 flex flex-col gap-6 hover:bg-zinc-900/40 transition-all group cursor-pointer">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-black">
                     <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Badge variant="glass" className="w-fit">Synthesizers</Badge>
                     <h3 className="text-2xl font-bold">The Prophet-6 Legacy</h3>
                     <p className="text-sm text-zinc-500 font-medium">Discover how this synth defined the sound of Dawn FM.</p>
                  </div>
               </div>
               <div className="glass-dark rounded-[40px] p-8 border border-white/5 flex flex-col gap-6 hover:bg-zinc-900/40 transition-all group cursor-pointer">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-black">
                     <img src="https://images.unsplash.com/photo-1514525253361-bee8a18744ad?w=500&h=500&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Badge variant="glass" className="w-fit">Lighting</Badge>
                     <h3 className="text-2xl font-bold">Atmospheric Design</h3>
                     <p className="text-sm text-zinc-500 font-medium">Inside the lasers and haze of Hyperdrama.</p>
                  </div>
               </div>
               <div className="glass-dark rounded-[40px] p-8 border border-white/5 flex flex-col gap-6 hover:bg-zinc-900/40 transition-all group cursor-pointer">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-black">
                     <img src="https://images.unsplash.com/photo-1594932224828-b4b059b8fe0e?w=500&h=500&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Badge variant="glass" className="w-fit">Tour Fashion</Badge>
                     <h3 className="text-2xl font-bold">Couture for the Stage</h3>
                     <p className="text-sm text-zinc-500 font-medium">Saint Laurent and the After Hours aesthetic.</p>
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
