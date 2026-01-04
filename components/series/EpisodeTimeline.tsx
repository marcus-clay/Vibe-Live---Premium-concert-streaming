
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Season, Episode } from '../../types';
import { Icons } from '../ui/Icons';

interface EpisodeTimelineProps {
  seasons: Season[];
}

export const EpisodeTimeline: React.FC<EpisodeTimelineProps> = ({ seasons }) => {
  const navigate = useNavigate();
  const [activeSeasonId, setActiveSeasonId] = useState(seasons[0].id);
  const [activeEpisodeId, setActiveEpisodeId] = useState(seasons[0].episodes[0].id);

  const activeSeason = seasons.find(s => s.id === activeSeasonId)!;
  const activeEpisode = activeSeason.episodes.find(e => e.id === activeEpisodeId)!;

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Season Selection Chips */}
      <div className="flex gap-4 px-4">
        {seasons.map((season) => (
          <button
            key={season.id}
            id={`season-${season.id}`}
            data-focusable="true"
            onClick={() => {
              setActiveSeasonId(season.id);
              setActiveEpisodeId(season.episodes[0].id);
            }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeSeasonId === season.id ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Season {season.number}
          </button>
        ))}
      </div>

      {/* Episode Navigation Strip */}
      <div className="relative h-48 flex items-center gap-12 px-12 overflow-x-auto scrollbar-hide">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-zinc-900" />
        
        {activeSeason.episodes.map((ep, idx) => {
          const isActive = activeEpisodeId === ep.id;
          const radius = 30;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (ep.progress * circumference);

          return (
            <motion.div
              key={ep.id}
              id={`episode-${ep.id}`}
              data-focusable="true"
              onClick={() => setActiveEpisodeId(ep.id)}
              className="relative flex-shrink-0 cursor-pointer z-10"
              animate={{ scale: isActive ? 1.2 : 1 }}
            >
              <svg className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r={radius} className="fill-none stroke-zinc-900 stroke-[6]" />
                <motion.circle
                  cx="40" cy="40" r={radius}
                  className="fill-none stroke-blue-500 stroke-[6] stroke-round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ strokeDasharray: circumference }}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-black ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                  {idx + 1}
                </span>
              </div>

              {isActive && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Active Episode Details Panel */}
      <motion.div
        key={activeEpisodeId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-8 bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800"
      >
        <div className="w-full md:w-80 aspect-video rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
          <img src={activeEpisode.image} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold">{activeEpisode.title}</h3>
            <span className="text-sm font-bold text-zinc-500">{activeEpisode.duration}</span>
          </div>
          <p className="text-zinc-400 text-lg leading-relaxed">{activeEpisode.description}</p>
          <div className="mt-4 flex gap-4">
            <button 
              id="episode-play-btn"
              data-focusable="true"
              onClick={() => navigate('/watch/e1')}
              className="px-6 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
            >
              <Icons.Play weight="fill" />
              {activeEpisode.progress > 0 ? 'Resume Episode' : 'Play Episode'}
            </button>
            <button id="episode-download-btn" data-focusable="true" className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors">
              Download
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
