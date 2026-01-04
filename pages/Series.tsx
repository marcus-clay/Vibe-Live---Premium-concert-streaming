
import React from 'react';
import { useParams } from 'react-router-dom';
import { SERIES } from '../data/mock';
import { EpisodeTimeline } from '../components/series/EpisodeTimeline';

export const SeriesPage: React.FC = () => {
  const { id } = useParams();
  const series = SERIES.find(s => s.id === id);

  if (!series) return <div className="p-20 text-center">Series not found</div>;

  return (
    <div className="flex-1 overflow-y-auto bg-black pb-24">
      {/* Hero Header */}
      <div className="relative h-[500px] w-full flex items-center p-8 md:p-16">
        <div className="absolute inset-0 overflow-hidden">
          <img src={series.image} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col gap-6 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-700">Original Series</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight">{series.title}</h1>
          <p className="text-xl text-zinc-300 leading-relaxed">{series.description}</p>
          
          <div className="flex items-center gap-8 mt-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Released</span>
              <span className="font-bold">2023</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Genre</span>
              <span className="font-bold">Music Documentary</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Episodes</span>
              <span className="font-bold">{series.seasons.reduce((acc, s) => acc + s.episodes.length, 0)} Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Interaction: Episode Timeline */}
      <div className="px-8 py-16">
        <div className="max-w-5xl mx-auto mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Browse Episodes</h2>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="w-2 h-2 rounded-full bg-zinc-800" />
            <div className="w-2 h-2 rounded-full bg-zinc-800" />
          </div>
        </div>
        <EpisodeTimeline seasons={series.seasons} />
      </div>
    </div>
  );
};
