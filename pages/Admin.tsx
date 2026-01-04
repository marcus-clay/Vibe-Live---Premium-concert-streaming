
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/ui/Icons';
import { Badge } from '../components/ui/Badge';
import { EVENTS, ARTISTS } from '../data/mock';
import { Button } from '../components/ui/Button';

type StudioTab = 'Dashboard' | 'Media Manager' | 'Broadcast Settings' | 'Monetization';
type AssetDetailTab = 'Overview' | 'Analytics' | 'Protection' | 'Distribution';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('Dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [assetTab, setAssetTab] = useState<AssetDetailTab>('Overview');
  
  const [metrics, setMetrics] = useState({
    viewers: 12842,
    revenue: 42805,
    health: 99.8,
    activeTickets: 8421
  });

  const selectedAsset = useMemo(() => 
    EVENTS.find(e => e.id === selectedAssetId), 
    [selectedAssetId]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        viewers: prev.viewers + Math.floor(Math.random() * 20 - 5),
        revenue: prev.revenue + (Math.random() > 0.8 ? 19 : 0),
        health: 99.7 + Math.random() * 0.2,
        activeTickets: prev.activeTickets + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#050505] p-6 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Studio Navigation Bar */}
        <header className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Broadcast Station Alpha</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">VIBE Studio</h1>
            </div>
            <div className="flex gap-3">
              <Button size="sm" variant="primary" className="gap-2" onClick={() => setIsUploading(true)}>
                <Icons.PlusSquare weight="bold" /> Upload Media
              </Button>
              <button className="p-3 glass rounded-full text-zinc-400 hover:text-white transition-all">
                <Icons.Settings size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-8 border-b border-white/5 pb-2">
            {(['Dashboard', 'Media Manager', 'Broadcast Settings', 'Monetization'] as StudioTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-black uppercase tracking-widest pb-4 relative transition-all ${
                  activeTab === tab ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="studio-tab" className="absolute bottom-0 inset-x-0 h-1 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'Dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-10"
            >
              {/* Analytics Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard title="Live Viewers" value={metrics.viewers.toLocaleString()} change="+12.4%" icon={Icons.Globe} />
                <AnalyticsCard title="Daily Revenue" value={`$${metrics.revenue.toLocaleString()}`} change="+$1,240" icon={Icons.CreditCard} color="text-blue-500" />
                <AnalyticsCard title="System Health" value={`${metrics.health.toFixed(1)}%`} change="STABLE" icon={Icons.Waveform} color="text-green-500" />
                <AnalyticsCard title="Ticket Sales" value={metrics.activeTickets.toLocaleString()} change="+842" icon={Icons.LockOpen} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Monitor Section */}
                <div className="lg:col-span-2 glass-dark rounded-[40px] p-8 border border-white/5 flex flex-col gap-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Ingest Monitor</h3>
                      <Badge variant="live">Primary Feed 1</Badge>
                   </div>
                   <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden relative border border-white/10">
                      <video src={EVENTS[0].videoUrl} muted autoPlay loop className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="flex flex-col items-center gap-2">
                            <Icons.Waveform size={48} className="text-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Master Stream Relay</span>
                         </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                         <span>Resolution: 3840x2160</span>
                         <span>Latency: 42ms</span>
                         <span>Protocol: SRT-E</span>
                      </div>
                   </div>
                </div>

                {/* Conversion Sidebar */}
                <div className="glass-dark rounded-[40px] p-8 border border-white/5 flex flex-col gap-6">
                   <h3 className="text-xl font-bold text-white">Recent Conversions</h3>
                   <div className="flex flex-col gap-4">
                      {['User_482', 'Studio_Fan', 'VIBE_Member', 'Guest_29'].map((user, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Icons.CreditCard weight="fill" className="text-blue-500" size={18} />
                           </div>
                           <div className="flex flex-col flex-1">
                              <span className="text-sm font-bold text-white">{user}</span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase">Ticket Purchase</span>
                           </div>
                           <span className="text-sm font-black text-white">$19.99</span>
                        </div>
                      ))}
                   </div>
                   <Button variant="glass" className="w-full">Full Report</Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Media Manager' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
               <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                     <div className="relative">
                        <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input type="text" placeholder="Search catalog..." className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-2.5 text-sm outline-none focus:border-blue-500 transition-all text-white" />
                     </div>
                     <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none text-zinc-400">
                        <option>All Artists</option>
                        {ARTISTS.map(a => <option key={a.id}>{a.name}</option>)}
                     </select>
                  </div>
                  <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                     <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                        <Icons.Analytics size={18} />
                     </button>
                     <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                        <Icons.PlusSquare size={18} />
                     </button>
                  </div>
               </div>

               {viewMode === 'list' ? (
                 <div className="glass-dark rounded-[32px] overflow-hidden border border-white/5">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                             <th className="px-8 py-6">Asset Name</th>
                             <th className="px-8 py-6">Artist</th>
                             <th className="px-8 py-6">Access</th>
                             <th className="px-8 py-6">Status</th>
                             <th className="px-8 py-6">Duration</th>
                             <th className="px-8 py-6 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {EVENTS.map(event => (
                            <tr key={event.id} className="hover:bg-white/5 transition-all group">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <img src={event.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                     <span className="font-bold text-sm text-white">{event.title}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-sm text-zinc-400">
                                  {ARTISTS.find(a => a.id === event.artistId)?.name}
                               </td>
                               <td className="px-8 py-6">
                                  <Badge variant={event.accessLevel}>{event.accessLevel}</Badge>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-green-500" />
                                     <span className="text-[10px] font-black text-white uppercase">Published</span>
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-sm tabular-nums text-zinc-500">
                                  {event.duration}m
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <div className="flex justify-end gap-2">
                                     <button 
                                      onClick={() => setSelectedAssetId(event.id)}
                                      className="p-2 text-zinc-500 hover:text-blue-500 transition-all"
                                      title="Manage Asset"
                                     >
                                      <Icons.Settings size={18} />
                                     </button>
                                     <button className="p-2 text-zinc-500 hover:text-white transition-all"><Icons.Globe size={18} /></button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {EVENTS.map(event => (
                      <div key={event.id} onClick={() => setSelectedAssetId(event.id)} className="glass-dark p-4 rounded-[32px] border border-white/5 flex flex-col gap-4 group cursor-pointer hover:border-blue-500/30 transition-all">
                         <div className="aspect-video rounded-2xl overflow-hidden relative">
                            <img src={event.image} className="w-full h-full object-cover" alt="" />
                            <div className="absolute top-3 left-3">
                               <Badge variant={event.accessLevel}>{event.accessLevel}</Badge>
                            </div>
                         </div>
                         <div className="flex justify-between items-start px-2">
                            <div className="flex flex-col">
                               <h4 className="font-bold text-sm text-white">{event.title}</h4>
                               <span className="text-[10px] text-zinc-500 font-bold uppercase">Updated 2h ago</span>
                            </div>
                            <div className="p-2 text-zinc-500 group-hover:text-white transition-colors">
                              <Icons.Settings size={16} />
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </motion.div>
          )}

          {activeTab === 'Broadcast Settings' && (
            <motion.div
              key="broadcast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
            >
               <div className="glass-dark p-8 rounded-[40px] border border-white/5 flex flex-col gap-8">
                  <h3 className="text-xl font-bold text-white">Global Protection</h3>
                  <div className="flex flex-col gap-6">
                     <ToggleOption label="DRM Encryption" desc="Enforce hardware-level content protection." defaultChecked />
                     <ToggleOption label="Geo-Blocking" desc="Restrict broadcast to specific regional IPs." />
                     <ToggleOption label="Dynamic Watermarking" desc="Inject unique viewer IDs into the stream buffer." defaultChecked />
                     <ToggleOption label="Fraud Detection" desc="Auto-terminate sessions with abnormal behavior." defaultChecked />
                  </div>
               </div>
               
               <div className="glass-dark p-8 rounded-[40px] border border-white/5 flex flex-col gap-8">
                  <h3 className="text-xl font-bold text-white">Streaming Quality</h3>
                  <div className="flex flex-col gap-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Global Bitrate Cap</label>
                        <input type="range" className="w-full accent-blue-500" />
                        <div className="flex justify-between text-[10px] font-bold text-zinc-600">
                           <span>Adaptive</span>
                           <span>25 Mbps (4K Ultra)</span>
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Audio Codec</label>
                        <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-zinc-400">
                           <option>Spatial Dolby Atmos (High)</option>
                           <option>Lossless PCM</option>
                           <option>AAC-HE (Standard)</option>
                        </select>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'Monetization' && (
            <motion.div
              key="money"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-10"
            >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="glass-dark p-8 rounded-[40px] border border-white/5 flex flex-col gap-8">
                     <h3 className="text-xl font-bold text-white">Ad-Break Integration</h3>
                     <p className="text-sm text-zinc-500">Configure mid-roll insertion points for Limited access tiers.</p>
                     <div className="flex flex-col gap-4">
                        {[
                          { time: '00:15:00', duration: '30s', type: 'Preroll' },
                          { time: '00:45:00', duration: '60s', type: 'Midroll' },
                          { time: '01:20:00', duration: '15s', type: 'Overlay' },
                        ].map((ad, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                             <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">{ad.time}</span>
                                <span className="text-[10px] text-zinc-500 font-bold uppercase">{ad.type}</span>
                             </div>
                             <span className="text-xs font-black text-blue-500">{ad.duration}</span>
                          </div>
                        ))}
                        <Button variant="ghost" className="w-full border border-dashed border-zinc-800 rounded-2xl py-4">+ Add Ad Point</Button>
                     </div>
                  </div>

                  <div className="glass-dark p-8 rounded-[40px] border border-white/5 flex flex-col gap-8">
                     <h3 className="text-xl font-bold text-white">Dynamic Pricing</h3>
                     <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Base Ticket Price (USD)</label>
                           <input type="number" defaultValue={19.99} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 text-white" />
                        </div>
                        <ToggleOption label="Early Bird Discount" desc="Automatically apply 20% off for first 1000 tickets." defaultChecked />
                        <ToggleOption label="Loyalty Tiering" desc="Reduce price for subscribers of the artist channel." />
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal Simulation */}
      <AnimatePresence>
         {isUploading && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUploading(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl glass-dark rounded-[40px] p-12 border border-white/10 flex flex-col gap-8">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">Upload Studio Asset</h2>
                    <button onClick={() => setIsUploading(false)} className="text-zinc-500 hover:text-white transition-colors"><Icons.X size={24} /></button>
                 </div>
                 <div className="border-2 border-dashed border-white/10 rounded-3xl p-20 flex flex-col items-center gap-4 hover:border-blue-500/50 transition-all cursor-pointer">
                    <Icons.PlusSquare size={48} className="text-blue-500" />
                    <p className="text-sm font-bold text-zinc-400">Drag high-bitrate master files here</p>
                    <span className="text-[10px] font-black text-zinc-600 uppercase">Supports: MP4, MOV, ProRes, WAV</span>
                 </div>
                 <div className="flex gap-4">
                    <Button variant="secondary" className="flex-1" onClick={() => setIsUploading(false)}>Cancel</Button>
                    <Button variant="primary" className="flex-1">Start Ingest</Button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

      {/* Asset Detail Overlay */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-end md:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAssetId(null)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="relative w-full max-w-3xl h-full md:h-auto md:max-h-[90vh] glass-dark md:rounded-[48px] border-l border-white/10 overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-10 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border border-white/10">
                      <img src={selectedAsset.image} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex flex-col">
                      <h2 className="text-2xl font-bold text-white">{selectedAsset.title}</h2>
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                        {ARTISTS.find(a => a.id === selectedAsset.artistId)?.name} • Asset ID: {selectedAsset.id}
                      </p>
                   </div>
                </div>
                <button onClick={() => setSelectedAssetId(null)} className="p-3 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all">
                   <Icons.X size={20} />
                </button>
              </div>

              {/* Asset Navigation */}
              <div className="flex gap-8 px-10 pt-8">
                {(['Overview', 'Analytics', 'Protection', 'Distribution'] as AssetDetailTab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAssetTab(tab)}
                    className={`text-[10px] font-black uppercase tracking-widest pb-4 relative transition-all ${
                      assetTab === tab ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab}
                    {assetTab === tab && (
                      <motion.div layoutId="asset-tab" className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-10">
                <AnimatePresence mode="wait">
                  {assetTab === 'Overview' && (
                    <motion.div key="ov" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
                       <div className="grid grid-cols-2 gap-8">
                          <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Title</label>
                             <input type="text" defaultValue={selectedAsset.title} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-blue-500 text-white" />
                          </div>
                          <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Access Tier</label>
                             <select defaultValue={selectedAsset.accessLevel} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm outline-none text-zinc-400">
                                <option value="free">Free Access</option>
                                <option value="limited">Limited (Ad-Supported)</option>
                                <option value="premium">Premium Ticket</option>
                             </select>
                          </div>
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Metadata Description</label>
                          <textarea className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-blue-500 h-32 text-zinc-300">Experience the world-record breaking tour by {ARTISTS.find(a => a.id === selectedAsset.artistId)?.name} in ultra-high fidelity. Includes 4K multi-angle switching and immersive spatial audio mastered for VIBE.</textarea>
                       </div>
                    </motion.div>
                  )}

                  {assetTab === 'Analytics' && (
                    <motion.div key="an" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
                       <div className="grid grid-cols-3 gap-6">
                          <AnalyticsMiniCard title="Total Views" value="45.2K" color="text-white" />
                          <AnalyticsMiniCard title="Watch Time" value="12.8m" color="text-blue-400" />
                          <AnalyticsMiniCard title="Conversion" value="3.4%" color="text-green-400" />
                       </div>
                       
                       <div className="glass-dark p-6 rounded-[32px] border border-white/5 h-64 flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                             <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Engagement Over Time</h4>
                             <Badge variant="glass">Last 30 Days</Badge>
                          </div>
                          <div className="flex-1 flex items-end gap-2 pb-2">
                             {Array.from({ length: 24 }).map((_, i) => (
                               <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm group relative" style={{ height: `${20 + Math.random() * 80}%` }}>
                                  <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="flex flex-col gap-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Traffic Sources</h4>
                          <div className="flex flex-col gap-3">
                             <ProgressBarItem label="Organic Search" value={65} />
                             <ProgressBarItem label="Social Referrals" value={22} />
                             <ProgressBarItem label="Direct / Studio" value={13} />
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {assetTab === 'Protection' && (
                    <motion.div key="pr" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
                       <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Asset Protection Settings</h4>
                       <div className="flex flex-col gap-6">
                          <ToggleOption label="Hardware DRM" desc="Force Widevine L1 / FairPlay protection for 4K streams." defaultChecked />
                          <ToggleOption label="Screen Recording Prevention" desc="Inject blank frames when recording software is detected." defaultChecked />
                          <ToggleOption label="Watermark Injection" desc="Overlay dynamic user-ID watermarks on the client side." />
                          <ToggleOption label="Geo-Fencing" desc="Restrict playback to approved IP blocks only." />
                       </div>
                    </motion.div>
                  )}

                  {assetTab === 'Distribution' && (
                    <motion.div key="dist" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-10">
                       <div className="flex flex-col gap-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Deep Link Generator</h4>
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                             <code className="text-xs text-blue-400 font-mono">vibe.studio/relay/sh?v={selectedAsset.id}&ts=live</code>
                             <button className="px-4 py-2 bg-zinc-800 rounded-xl text-[10px] font-black uppercase text-white hover:bg-zinc-700 transition-all">Copy</button>
                          </div>
                       </div>

                       <div className="flex flex-col gap-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Platform Deployment</h4>
                          <div className="grid grid-cols-2 gap-4">
                             <DistributionButton platform="YouTube Live" status="Connected" active />
                             <DistributionButton platform="Twitch" status="Standby" />
                             <DistributionButton platform="Instagram" status="Limited" />
                             <DistributionButton platform="Vevo" status="Pro" />
                          </div>
                       </div>

                       <div className="p-6 bg-blue-600/10 rounded-3xl border border-blue-500/20 flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                             <Icons.Globe size={24} weight="bold" />
                          </div>
                          <div className="flex flex-col flex-1">
                             <span className="text-sm font-bold text-white">Public Relay Active</span>
                             <span className="text-[10px] text-zinc-500 font-bold uppercase">This asset is currently discoverable globally.</span>
                          </div>
                          <Button size="sm" variant="glass">Go Dark</Button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="p-8 border-t border-white/5 flex gap-4">
                 <Button variant="secondary" className="flex-1 h-14" onClick={() => setSelectedAssetId(null)}>Discard Changes</Button>
                 <Button variant="primary" className="flex-1 h-14" onClick={() => setSelectedAssetId(null)}>Apply Settings</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnalyticsMiniCard: React.FC<{ title: string, value: string, color: string }> = ({ title, value, color }) => (
  <div className="p-6 glass rounded-3xl border border-white/5 flex flex-col gap-1">
     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{title}</span>
     <span className={`text-2xl font-bold ${color}`}>{value}</span>
  </div>
);

const ProgressBarItem: React.FC<{ label: string, value: number }> = ({ label, value }) => (
  <div className="flex flex-col gap-2">
     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-zinc-400">{label}</span>
        <span className="text-white">{value}%</span>
     </div>
     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-blue-500" />
     </div>
  </div>
);

const DistributionButton: React.FC<{ platform: string, status: string, active?: boolean }> = ({ platform, status, active }) => (
  <button className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${active ? 'bg-white/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
     <div className="flex flex-col text-left">
        <span className="text-xs font-bold text-white">{platform}</span>
        <span className="text-[9px] text-zinc-500 font-bold uppercase">{status}</span>
     </div>
     <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-zinc-800'}`} />
  </button>
);

const AnalyticsCard: React.FC<{ title: string, value: string, change: string, icon: any, color?: string }> = ({ title, value, change, icon: Icon, color = "text-white" }) => (
  <div className="glass-dark rounded-[32px] p-8 flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-all shadow-xl">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{title}</span>
      <Icon size={20} className="text-zinc-600" />
    </div>
    <div className="flex flex-col">
      <h3 className={`text-4xl font-bold tracking-tight ${color}`}>{value}</h3>
      <span className="text-[10px] font-black text-green-500 tracking-widest mt-1">{change}</span>
    </div>
  </div>
);

const ToggleOption: React.FC<{ label: string, desc: string, defaultChecked?: boolean }> = ({ label, desc, defaultChecked }) => (
  <div className="flex items-center justify-between group">
     <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">{label}</span>
        <span className="text-[10px] text-zinc-500 font-medium">{desc}</span>
     </div>
     <div className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer ${defaultChecked ? 'bg-blue-600' : 'bg-zinc-800'}`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-all ${defaultChecked ? 'translate-x-6' : 'translate-x-0'}`} />
     </div>
  </div>
);
