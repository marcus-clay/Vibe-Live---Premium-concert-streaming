
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENTS, ARTISTS, FALLBACK_VIDEO_URL, FALLBACK_IMAGE_URL } from '../data/mock';
import { usePlayerStore } from '../stores/playerStore';
import { useUserStore } from '../stores/userStore';
import { VideoCatalogService } from '../services/videoService';
import { SetlistTimeline } from '../components/player/SetlistTimeline';
import { MultiAngleSwitcher } from '../components/player/MultiAngleSwitcher';
import { SpatialAudioVisualizer } from '../components/player/SpatialAudioVisualizer';
import { MerchSidebar } from '../components/commerce/MerchSidebar';
import { FanCircle } from '../components/player/FanCircle';
import { BackstagePass } from '../components/player/BackstagePass';
import { XRayOverlay } from '../components/player/XRayOverlay';
import { Icons } from '../components/ui/Icons';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const PREVIEW_LIMIT = 45; // 45 seconds free preview

export const Player: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = EVENTS.find(e => e.id === id);
  const artist = ARTISTS.find(a => a.id === event?.artistId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMerchOpen, setIsMerchOpen] = useState(false);
  const [manualPlayRequired, setManualPlayRequired] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'none' | 'audio' | 'info'>('none');
  
  const { hasAccess, openCheckout } = useUserStore();
  const isAuthorized = id ? (event?.accessLevel === 'free' || hasAccess(id)) : false;

  const { 
    isPlaying, 
    togglePlay, 
    setPlaying,
    isLoading,
    setLoading,
    currentTime, 
    setCurrentTime,
    duration, 
    setDuration,
    isControlsVisible, 
    setControlsVisible, 
    currentAngleId,
    dynamicSourceUrl,
    setDynamicSource,
    isFanCircleOpen,
    setFanCircleOpen,
    isBackstageOpen,
    setBackstageOpen,
    isXRayOpen,
    setXRayOpen,
  } = usePlayerStore();

  useEffect(() => {
    const fetchSource = async () => {
      if (!event || !artist) return;
      setLoading(true);
      
      if (!isAuthorized && event.accessLevel !== 'free') {
        setIsPreviewMode(true);
      } else {
        setIsPreviewMode(false);
      }

      try {
        const clip = await VideoCatalogService.findVideoForEvent(event.title, artist.name);
        setDynamicSource(clip?.url || event.videoUrl || FALLBACK_VIDEO_URL);
      } catch (err) {
        setDynamicSource(event.videoUrl || FALLBACK_VIDEO_URL);
      } finally {
        setLoading(false);
      }
    };
    fetchSource();
    return () => {
      setDynamicSource(null);
      setPlaying(false);
    };
  }, [id, event, artist, isAuthorized]);
  
  const activeAngle = event?.angles.find(a => a.id === currentAngleId);
  const videoSrc = activeAngle?.videoUrl || dynamicSourceUrl || event?.videoUrl || FALLBACK_VIDEO_URL;

  useEffect(() => {
    if (videoRef.current && !isLoading) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          setManualPlayRequired(true);
          setPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoSrc, isLoading]);

  useEffect(() => {
    if (isPreviewMode && currentTime >= PREVIEW_LIMIT) {
      setShowPaywall(true);
      setPlaying(false);
      setControlsVisible(true);
    }
  }, [currentTime, isPreviewMode]);

  useEffect(() => {
    let timeout: any;
    const wakeControls = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying && !manualPlayRequired && !showPaywall && activeMenu === 'none') setControlsVisible(false);
      }, 3000);
    };
    window.addEventListener('mousemove', wakeControls);
    window.addEventListener('keydown', wakeControls);
    return () => {
      window.removeEventListener('mousemove', wakeControls);
      window.removeEventListener('keydown', wakeControls);
      clearTimeout(timeout);
    };
  }, [isPlaying, manualPlayRequired, showPaywall, activeMenu]);

  if (!event) return null;

  const handleManualPlay = () => {
    setManualPlayRequired(false);
    setPlaying(true);
  };

  const currentSong = [...event.setlist].reverse().find(s => s.timestamp <= currentTime) || event.setlist[0];
  const isAdBreakActive = event.accessLevel === 'limited' && (currentTime > 45 && currentTime < 60);
  const hideCursor = !isControlsVisible && isPlaying && !manualPlayRequired && !isLoading && !showPaywall;

  return (
    <div className={`fixed inset-0 bg-black z-50 overflow-hidden transition-all duration-500 ${hideCursor ? 'cursor-none' : 'cursor-auto'}`}>
      <motion.div key="player-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
        
        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 bg-zinc-950">
          <img src={event.image || FALLBACK_IMAGE_URL} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-3xl scale-110" alt="" />
          <video 
            key={videoSrc}
            ref={videoRef} 
            src={videoSrc} 
            muted={isPreviewMode && !showPaywall}
            className={`w-full h-full object-cover transition-all duration-1000 ${isAdBreakActive || showPaywall || !isPlaying ? 'blur-[50px] opacity-40 grayscale-[0.4] scale-105' : 'opacity-100 scale-100'}`} 
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)} 
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            onError={() => {
              if (videoRef.current) {
                // If the dynamic source fails, immediately switch to rock-solid fallback
                videoRef.current.src = FALLBACK_VIDEO_URL;
                videoRef.current.play().catch(console.warn);
              }
            }}
            playsInline 
            loop
            autoPlay 
          />
        </div>

        {/* Global Ingesting Layer */}
        <AnimatePresence mode="wait">
          {(isLoading || manualPlayRequired) && !showPaywall ? (
            <motion.div 
              key="overlay-state"
              initial={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8"
            >
              {isLoading ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Syncing VIBE Stream</p>
                </div>
              ) : manualPlayRequired ? (
                <div className="flex flex-col items-center gap-10">
                   <motion.button 
                    whileHover={{ scale: 1.2 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={handleManualPlay} 
                    className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_80px_rgba(255,255,255,0.4)] group"
                   >
                     <Icons.Play size={56} weight="fill" className="ml-2 group-hover:scale-110 transition-transform" />
                   </motion.button>
                   <div className="flex flex-col items-center gap-4">
                      <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white">Direct Feed Ready</h2>
                      <Button variant="ghost" onClick={() => navigate(-1)} className="text-zinc-600 hover:text-white flex items-center gap-2">
                        <Icons.ChevronLeft weight="bold" /> Return to Lounge
                      </Button>
                   </div>
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Immersive Pause Overlay */}
        <AnimatePresence>
          {!isPlaying && !isLoading && !showPaywall && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col justify-end p-20 bg-black/60 backdrop-blur-md pointer-events-none"
            >
              <div className="flex flex-col gap-12 max-w-5xl pointer-events-auto">
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <Badge variant="glass" className="bg-blue-600/30 text-blue-300 border-blue-500/20 font-black px-4 py-2">Mastered Replay</Badge>
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">4K Dolby Vision • Spatial Audio 7.1</span>
                  </div>
                  <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none italic uppercase text-white drop-shadow-2xl">{event.title}</h2>
                  <p className="text-2xl text-zinc-400 font-medium tracking-tight max-w-3xl leading-relaxed">{artist?.bio.split('.')[0]}. Experience this performance as never before with multi-angle switching.</p>
                </motion.div>

                <div className="flex gap-8 items-center">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay} 
                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                  >
                    <Icons.Play size={44} weight="fill" className="ml-1.5" />
                  </motion.button>
                  <div className="h-12 w-px bg-white/10" />
                  <div className="flex gap-4">
                    <button onClick={() => setActiveMenu(activeMenu === 'audio' ? 'none' : 'audio')} className={`h-16 glass px-10 rounded-full flex items-center gap-4 transition-all ${activeMenu === 'audio' ? 'bg-blue-600 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)]' : 'hover:bg-white/10'}`}>
                      {/* Fix: changed Icons.SpeakerHigh to Icons.VolumeHigh as defined in components/ui/Icons.tsx */}
                      <Icons.VolumeHigh size={24} weight="bold" />
                      <span className="text-xs font-black uppercase tracking-widest">Audio & Subtitles</span>
                    </button>
                    <button onClick={() => setActiveMenu(activeMenu === 'info' ? 'none' : 'info')} className={`h-16 glass px-10 rounded-full flex items-center gap-4 transition-all ${activeMenu === 'info' ? 'bg-blue-600 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)]' : 'hover:bg-white/10'}`}>
                      <Icons.Info size={24} weight="bold" />
                      <span className="text-xs font-black uppercase tracking-widest">Concert Intel</span>
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeMenu === 'audio' && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="flex gap-24 p-12 glass-dark rounded-[40px] border border-white/10 mt-2 shadow-2xl">
                      <div className="flex flex-col gap-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Audio Configuration</span>
                        <div className="flex flex-col gap-5">
                          <button className="flex items-center gap-4 text-white font-bold group text-lg"><div className="w-2 h-2 rounded-full bg-blue-500" /> VIBE Spatial Mix [Enhanced]</button>
                          <button className="flex items-center gap-4 text-zinc-500 font-bold hover:text-white transition-colors text-lg"><div className="w-2 h-2 rounded-full bg-zinc-800" /> Direct Monitor Feed</button>
                          <button className="flex items-center gap-4 text-zinc-500 font-bold hover:text-white transition-colors text-lg"><div className="w-2 h-2 rounded-full bg-zinc-800" /> Atmosphere / Crowd Only</button>
                        </div>
                      </div>
                      <div className="w-px bg-white/5" />
                      <div className="flex flex-col gap-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Subtitle Settings</span>
                        <div className="flex flex-col gap-5">
                          <button className="flex items-center gap-4 text-white font-bold group text-lg"><div className="w-2 h-2 rounded-full bg-blue-500" /> Disabled</button>
                          <button className="flex items-center gap-4 text-zinc-500 font-bold hover:text-white transition-colors text-lg"><div className="w-2 h-2 rounded-full bg-zinc-800" /> English [Lyrics/CC]</button>
                          <button className="flex items-center gap-4 text-zinc-500 font-bold hover:text-white transition-colors text-lg"><div className="w-2 h-2 rounded-full bg-zinc-800" /> Japanese [Translation]</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeMenu === 'info' && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="p-12 glass-dark rounded-[40px] border border-white/10 mt-2 flex flex-col gap-8 shadow-2xl">
                      <div className="flex items-center gap-8">
                        <div className="w-48 aspect-video rounded-2xl overflow-hidden shadow-xl border border-white/10">
                          <img src={event.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <span className="text-3xl font-black text-white">{event.title}</span>
                           <span className="text-sm text-blue-400 font-black uppercase tracking-widest">Released: Dec 2024 • VIBE Exclusive Premiere</span>
                        </div>
                      </div>
                      <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl font-medium italic border-l-2 border-blue-500/30 pl-8">"This performance redefined the architecture of digital broadcast. Utilizing our proprietary relay system, we've captured the absolute raw energy of the arena in pristine 4K fidelity."</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle Preview Banner */}
        <AnimatePresence>
          {isPreviewMode && !showPaywall && isControlsVisible && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-32 inset-x-0 flex justify-center z-[60]"
            >
              <div className="glass px-8 py-3.5 rounded-full border border-blue-500/40 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Free Preview Active</span>
                </div>
                <div className="h-5 w-px bg-white/20" />
                <button 
                  onClick={() => openCheckout(event.id)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-all hover:scale-105"
                >
                  Unlock Unlimited Global Access
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upgrade Modal */}
        <AnimatePresence>
          {showPaywall && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 z-[70] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-2xl w-full glass-dark rounded-[60px] p-16 border border-white/10 flex flex-col items-center text-center gap-12 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-[0_0_60px_rgba(37,99,235,0.4)] rotate-12">
                  <Icons.Lock size={48} weight="fill" className="text-white -rotate-12" />
                </div>
                <div className="flex flex-col gap-6">
                  <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">The Stage Awaits</h2>
                  <p className="text-zinc-400 text-xl font-medium leading-relaxed px-10">
                    The preview for <span className="text-white italic">"{event.title}"</span> has ended. 
                    Unlock full multi-angle controls, spatial audio mastering, and the entire Replay Vault.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-5 w-full">
                  <Button size="lg" className="flex-1 h-20 text-xl font-black uppercase tracking-widest" onClick={() => openCheckout(event.id)}>
                    Get Full Ticket — ${event.price || 19.99}
                  </Button>
                  <Button variant="glass" size="lg" className="flex-1 h-20 text-xl font-black uppercase tracking-widest" onClick={() => navigate(-1)}>
                    Lounge Return
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <XRayOverlay />
        <FanCircle isOpen={isFanCircleOpen} onClose={() => setFanCircleOpen(false)} />
        <BackstagePass isOpen={isBackstageOpen} onClose={() => setBackstageOpen(false)} />

        {/* Master Controls UI */}
        {!isLoading && !manualPlayRequired && !isAdBreakActive && (
          <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${showPaywall || !isPlaying ? 'opacity-20 grayscale blur-sm scale-[0.98]' : 'opacity-100 scale-100'}`}>
            <AnimatePresence>
              {isControlsVisible ? (
                <motion.div 
                  key="top-controls"
                  initial={{ opacity: 0, y: -40 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -40 }} 
                  className="absolute top-10 inset-x-10 flex items-center justify-between z-10 pointer-events-auto px-10"
                >
                  <div className="glass px-10 py-5 rounded-full flex items-center gap-8 shadow-2xl border border-white/10">
                    <button onClick={() => navigate(-1)} className="text-white hover:text-blue-400 transition-all hover:scale-110">
                      <Icons.ChevronLeft size={36} weight="bold" />
                    </button>
                    <div className="h-10 w-px bg-white/10" />
                    <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic truncate max-w-sm">{event.title}</h1>
                  </div>
                  <div className="flex gap-5">
                    <button onClick={() => setXRayOpen(!isXRayOpen)} className={`w-16 h-16 glass rounded-full flex items-center justify-center transition-all ${isXRayOpen ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.6)]' : 'hover:bg-white/20'}`}>
                      <Icons.Info size={28} weight="bold" />
                    </button>
                    <button onClick={() => setIsMerchOpen(true)} className="h-16 glass px-10 rounded-full flex items-center gap-4 text-white hover:bg-white/20 transition-all border border-white/10">
                      <Icons.PlusSquare size={26} weight="bold" />
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Shop</span>
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            
            <AnimatePresence>
              {isControlsVisible ? (
                <motion.div 
                  key="bottom-controls"
                  initial={{ opacity: 0, y: 40 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 40 }} 
                  className="absolute bottom-10 inset-x-10 flex flex-col gap-10 z-10 pointer-events-auto px-10"
                >
                  <div className="grid grid-cols-3 items-end">
                    <div className="flex flex-col gap-4">
                       <MultiAngleSwitcher angles={event.angles} />
                    </div>
                    <div className="flex justify-center gap-6 pb-2">
                       <motion.button 
                        whileHover={{ scale: 1.15 }} 
                        whileTap={{ scale: 0.9 }} 
                        onClick={togglePlay} 
                        disabled={showPaywall}
                        className="w-28 h-28 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.5)] disabled:opacity-20"
                       >
                        {isPlaying ? <Icons.Pause size={56} weight="fill" /> : <Icons.Play size={56} weight="fill" className="ml-2" />}
                      </motion.button>
                    </div>
                    <div className="flex justify-end"><SpatialAudioVisualizer /></div>
                  </div>
                  <div className="glass px-16 py-10 rounded-[60px] flex flex-col gap-6 shadow-2xl border border-white/10">
                    <SetlistTimeline setlist={event.setlist} />
                    <div className="flex justify-between items-center px-4">
                      <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] tabular-nums">
                        {Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-4">
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                         <span className="text-white text-2xl font-black tracking-tight uppercase italic">{currentSong?.title || "Live Performance"}</span>
                      </div>
                      <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] tabular-nums">
                        -{Math.floor((duration - currentTime) / 60)}:{(Math.floor(duration - currentTime) % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
      <MerchSidebar isOpen={isMerchOpen} onClose={() => setIsMerchOpen(false)} items={event.merch || []} currentSongId={currentSong?.id} />
    </div>
  );
};
