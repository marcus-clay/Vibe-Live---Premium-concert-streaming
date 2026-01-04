
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { Artist, RecommendationLink } from '../../types';
import { ARTISTS, RECOMMENDATION_LINKS } from '../../data/mock';
import { useViewportStore } from '../../stores/viewportStore';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  image: string;
  isMain?: boolean;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  type: 'genre' | 'collaboration' | 'similar' | 'era';
}

export const ArtistRecommendationGraph: React.FC<{ artistId: string }> = ({ artistId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredArtist, setHoveredArtist] = useState<Artist | null>(null);
  const { currentViewport } = useViewportStore();
  const navigate = useNavigate();

  // On mobile, show a simple list instead
  if (currentViewport === 'mobile') {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
        {ARTISTS.filter(a => a.id !== artistId).map(artist => (
          <div 
            key={artist.id} 
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="flex-shrink-0 w-32 flex flex-col gap-2"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-800">
              <img src={artist.image} className="w-full h-full object-cover" />
            </div>
            <div className="text-xs font-bold text-center truncate">{artist.name}</div>
          </div>
        ))}
      </div>
    );
  }

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes: Node[] = ARTISTS.map(a => ({
      id: a.id,
      name: a.name,
      image: a.image,
      isMain: a.id === artistId
    }));

    const links: Link[] = RECOMMENDATION_LINKS.map(l => ({
      source: l.source,
      target: l.target,
      type: l.type
    }));

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));

    const linkColors = {
      genre: '#52525b',
      collaboration: '#3b82f6',
      similar: '#6366f1',
      era: '#22c55e'
    };

    const link = svg.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => linkColors[d.type])
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        const fullArtist = ARTISTS.find(a => a.id === d.id);
        if (fullArtist) setHoveredArtist(fullArtist);
      })
      .on("mouseleave", () => setHoveredArtist(null))
      .on("click", (event, d) => navigate(`/artist/${d.id}`));

    // Add images
    node.append("defs")
      .append("pattern")
      .attr("id", d => `pattern-${d.id}`)
      .attr("width", 1)
      .attr("height", 1)
      .attr("viewBox", "0 0 100 100")
      .append("image")
      .attr("width", 100)
      .attr("height", 100)
      .attr("xlink:href", d => d.image);

    node.append("circle")
      .attr("r", d => d.isMain ? 45 : 30)
      .attr("fill", d => `url(#pattern-${d.id})`)
      .attr("stroke", d => d.isMain ? "#3b82f6" : "#27272a")
      .attr("stroke-width", d => d.isMain ? 4 : 2);

    node.append("text")
      .attr("dy", d => d.isMain ? 65 : 45)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", d => d.isMain ? "12px" : "10px")
      .attr("font-weight", "bold")
      .text(d => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [artistId, navigate, currentViewport]);

  return (
    <div className="relative w-full h-[400px] bg-zinc-900/30 rounded-3xl border border-zinc-800 overflow-hidden">
      <div className="absolute top-6 left-6 flex flex-col gap-1 z-10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Constellation Discovery</h3>
        <p className="text-xs text-zinc-400">Interactive recommendations based on collaborations and genre</p>
      </div>

      <svg ref={svgRef} className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" />

      {/* Connection Legend */}
      <div className="absolute bottom-6 left-6 flex flex-wrap gap-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Genre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Collaboration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Similar Sound</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Era</span>
        </div>
      </div>

      {/* Hover Card */}
      <AnimatePresence>
        {hoveredArtist && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute top-6 right-6 w-64 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 z-20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={hoveredArtist.image} className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-800" />
              <div>
                <h4 className="text-sm font-bold">{hoveredArtist.name}</h4>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{hoveredArtist.genre}</p>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-4 line-clamp-3">{hoveredArtist.bio}</p>
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
              <span>{(hoveredArtist.followers / 1000000).toFixed(1)}M Followers</span>
              <span className="text-blue-400">View Profile</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
