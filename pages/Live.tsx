
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EVENTS } from '../data/mock';
import { Badge } from '../components/ui/Badge';
import { Icons } from '../components/ui/Icons';
import { Image } from '../components/ui/Image';
import { useViewportStore } from '../stores/viewportStore';

export const Live: React.FC = () => {
  const navigate = useNavigate();
  const { currentViewport } = useViewportStore();
  const liveEvents = EVENTS.filter(e => e.type === 'live');
  const upcomingEvents = EVENTS.filter(e => e.type === 'upcoming');

  return (
    <div className="flex-1 overflow-y-auto bg-black p-8 md:p-16 pb-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Happening Now</h1>
          <p className="text-zinc-500 font-medium">Experience the world's biggest stages in real-time.</p>
        </header>

        {/* Live Now Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {liveEvents.map(event => (
            <motion.div
              key={event.id}
              id={`live-card-${event.id}`}
              data-focusable={currentViewport === 'tv'}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/watch/${event.id}`)}
              className="relative rounded-[32px] overflow-hidden cursor-pointer group border border-zinc-800 shadow-2xl"
            >
              <Image src={event.image} alt={event.title} containerClassName="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <Badge variant="live">Live Now</Badge>
                <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white flex items-center gap-2 border border-white/5">
                  <Icons.Artists size={12} /> {event.viewers}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black tracking-tight">{event.title}</h2>
                  <p className="text-zinc-300 text-sm font-medium">Main Stage • Worldwide Broadcast</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-xl group-hover:scale-110 transition-transform">
                  <Icons.Play weight="fill" size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Schedule */}
        <section className="flex flex-col gap-8 mt-12">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
            <h2 className="text-3xl font-black tracking-tight">Broadcast Schedule</h2>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Today</button>
              <button className="px-6 py-2 glass rounded-full text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">This Week</button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  id={`upcoming-item-${event.id}`}
                  data-focusable={currentViewport === 'tv'}
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="flex items-center gap-8 p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800 transition-all group cursor-pointer"
                  onClick={() => navigate(`/artist/${event.artistId}`)}
                >
                  <div className="w-24 text-center flex flex-col items-center">
                    <span className="text-sm font-black text-blue-500 uppercase tracking-[0.2em]">{new Date(event.startTime!).getHours()}:00</span>
                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">GMT</span>
                  </div>
                  
                  <div className="w-40 flex-shrink-0">
                    <Image src={event.image} alt="" containerClassName="rounded-2xl border border-white/5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant={event.accessLevel}>{event.accessLevel}</Badge>
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Premiere</span>
                    </div>
                    <h3 className="font-black text-2xl tracking-tight text-white">{event.title}</h3>
                    <p className="text-sm text-zinc-500 font-medium">Multi-angle 4K • Spatial Audio Mastered</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:flex flex-col gap-1">
                      <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Countdown</div>
                      <div className="text-lg font-mono font-black text-white">02:14:55</div>
                    </div>
                    <button className="w-14 h-14 rounded-full glass flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                      <Icons.Bell size={24} weight="bold" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center glass rounded-[32px] border border-dashed border-white/5">
                <p className="text-zinc-500 font-medium">No further broadcasts scheduled for today.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
