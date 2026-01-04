
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/ui/Icons';
import { ARTISTS, EVENTS } from '../data/mock';
import { useViewportStore } from '../stores/viewportStore';
import { VideoCatalogService, VideoClip } from '../services/videoService';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiResults, setAiResults] = useState<VideoClip[]>([]);
  const navigate = useNavigate();
  const { currentViewport } = useViewportStore();

  const filters = ['All', 'Artists', 'Concerts', 'AI Search'];

  const handleAISearch = async () => {
    if (!query) return;
    setIsSearchingAI(true);
    setActiveFilter('AI Search');
    try {
      const results = await VideoCatalogService.searchClips(query);
      setAiResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const filteredArtists = ARTISTS.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase()) && 
    (activeFilter === 'All' || activeFilter === 'Artists')
  );

  const filteredEvents = EVENTS.filter(e => 
    e.title.toLowerCase().includes(query.toLowerCase()) && 
    (activeFilter === 'All' || activeFilter === 'Concerts')
  );

  return (
    <div className="flex-1 overflow-y-auto bg-black p-8 md:p-16 pb-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center text-zinc-500 group-focus-within:text-blue-500 transition-colors">
            <Icons.Search size={24} weight="bold" />
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Search artists, or try 'High energy stage clips'..."
            className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-3xl py-6 pl-16 pr-24 text-xl font-medium outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
          />
          <button 
            onClick={handleAISearch}
            className="absolute right-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-blue-500 transition-colors"
          >
            AI Scan
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                if (filter === 'AI Search' && query && aiResults.length === 0) handleAISearch();
              }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="flex flex-col gap-12 mt-8">
          <AnimatePresence mode="wait">
            {activeFilter === 'AI Search' ? (
              <motion.div
                key="ai-search-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-8"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-600/20 text-blue-500 rounded-lg">
                    <Icons.Waveform size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">AI Curated Clips</h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Matched from VIBE Catalog API</p>
                  </div>
                </div>

                {isSearchingAI ? (
                  <div className="flex flex-col items-center py-20 gap-4">
                    <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Scanning Cloud Archives...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiResults.map(clip => (
                      <motion.div
                        key={clip.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => navigate(`/watch/e1`)} // Simple simulation to player
                        className="group flex flex-col gap-4 p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl cursor-pointer hover:bg-zinc-900/60 transition-all"
                      >
                        <div className="aspect-video bg-zinc-800 rounded-2xl overflow-hidden relative">
                           <video src={clip.url} muted className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Icons.Play size={32} weight="fill" />
                           </div>
                           <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold">
                              {clip.duration ? `${clip.duration}s` : 'CLIP'}
                           </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="font-bold text-lg leading-tight">{clip.title}</h3>
                          <p className="text-sm text-zinc-500 line-clamp-2">{clip.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="standard-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-12">
                {query === '' ? (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Recent Searches</h2>
                    <div className="flex flex-col gap-2">
                      {['The Weeknd', 'Coachella 2024', 'Daft Punk Alive'].map(s => (
                        <button 
                          key={s} 
                          onClick={() => setQuery(s)}
                          className="flex items-center gap-4 text-left p-4 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white font-medium"
                        >
                          <Icons.Home size={18} /> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {filteredArtists.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Artists</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {filteredArtists.map(artist => (
                            <motion.div
                              key={artist.id}
                              onClick={() => navigate(`/artist/${artist.id}`)}
                              className="flex flex-col items-center gap-3 p-4 bg-zinc-900/30 rounded-2xl cursor-pointer hover:bg-zinc-900/60 transition-colors"
                            >
                              <img src={artist.image} className="w-24 h-24 rounded-full object-cover border-2 border-zinc-800" alt="" />
                              <span className="font-bold text-center">{artist.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredEvents.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Concerts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredEvents.map(event => (
                            <motion.div
                              key={event.id}
                              onClick={() => navigate(`/watch/${event.id}`)}
                              className="flex gap-4 p-4 bg-zinc-900/30 rounded-2xl cursor-pointer hover:bg-zinc-900/60 transition-colors items-center"
                            >
                              <img src={event.image} className="w-24 aspect-video rounded-lg object-cover" alt="" />
                              <div className="flex flex-col">
                                <span className="font-bold">{event.title}</span>
                                <span className="text-xs text-zinc-500 uppercase tracking-widest font-black">Full Replay</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredArtists.length === 0 && filteredEvents.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-4">
                        <Icons.X size={48} />
                        <p className="text-lg font-medium">No results found for "{query}"</p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
