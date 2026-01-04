
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/ui/Icons';
import { Button } from '../components/ui/Button';
import { useUserStore } from '../stores/userStore';
import { Image } from '../components/ui/Image';
import { Badge } from '../components/ui/Badge';
import { EVENTS, ARTISTS } from '../data/mock';

export const Landing: React.FC = () => {
  const { login } = useUserStore();
  const navigate = useNavigate();

  const handleStart = () => {
    login();
    navigate('/');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number] 
      } 
    }
  };

  const testimonials = [
    { name: "Sarah J.", role: "Vinyl Enthusiast", text: "The spatial audio mix is unlike anything I've ever heard. It feels like you're standing next to the bassist.", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "David K.", role: "Concert Photographer", text: "Multi-angle switching is a game changer. I love being able to choose the 'Director's Cut' in real-time.", avatar: "https://i.pravatar.cc/150?u=david" },
    { name: "Mina L.", role: "VIBE Member", text: "I watched the Weeknd's live premiere on my 75-inch TV and the 4K clarity was breathtaking.", avatar: "https://i.pravatar.cc/150?u=mina" }
  ];

  return (
    <div className="w-full h-full bg-black overflow-y-auto overflow-x-hidden select-none scroll-smooth">
      {/* SECTION 1: HERO - APPLE STYLE MINIMALISM */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image 
              src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop" 
              className="w-full h-full object-cover grayscale-[0.2]" 
            />
          </motion.div>
          {/* Multi-layered gradient for perfect legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="relative z-10 flex flex-col items-center max-w-5xl"
        >
          <motion.div variants={itemVariants} className="mb-6 flex items-center gap-4">
            <div className="h-px w-8 bg-blue-500/50" />
            <span className="text-sm font-bold tracking-[0.3em] text-blue-500 uppercase">Pro Broadcast Standard</span>
            <div className="h-px w-8 bg-blue-500/50" />
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-6xl md:text-[110px] font-bold tracking-[-0.03em] leading-[0.9] text-white mb-10 drop-shadow-sm"
          >
            The stage,<br />unbound.
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            className="text-xl md:text-2xl font-medium text-white/90 max-w-3xl leading-relaxed mb-14 drop-shadow-md"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            VIBE LIVE bridges the gap between the stadium and your sanctuary. Experience the world's most exclusive stages in 4K Dolby Vision.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-center">
            <button 
              onClick={handleStart}
              className="px-12 py-5 bg-white text-black text-xl font-bold rounded-full hover:bg-zinc-100 transition-all transform hover:scale-[1.03] active:scale-[0.98] shadow-[0_20px_40px_rgba(255,255,255,0.15)]"
            >
              Join the Front Row
            </button>
            <button 
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 bg-white/10 backdrop-blur-md text-white text-xl font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Browse the Vault
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-28 flex flex-col items-center gap-6">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Available on all your displays</span>
             <div className="flex gap-14 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <div className="flex flex-col items-center gap-3">
                   <Icons.Globe size={28} weight="bold" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-white">Web</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                   <Icons.ArrowsOut size={28} weight="bold" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-white">Tablet</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                   <Icons.Settings size={28} weight="bold" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-white">Mobile</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                   <Icons.Live size={28} weight="bold" />
                   <span className="text-[9px] font-bold uppercase tracking-widest text-white">TVOS</span>
                </div>
             </div>
          </motion.div>
        </motion.div>
        
        {/* Subtle decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      {/* SECTION 2: CATALOG - PRODUCT SHOWCASE */}
      <section id="catalog" className="py-48 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 mb-24 text-center">
            <span className="text-sm font-bold tracking-widest text-blue-500 uppercase">High Fidelity Vault</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">The Premiere Catalog.</h2>
            <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium">From global pop phenomena to underground pioneers, secure the performances that define eras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {EVENTS.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col gap-8 cursor-pointer"
                onClick={handleStart}
              >
                <div className="aspect-[16/10] rounded-[40px] overflow-hidden bg-zinc-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5">
                  <img src={event.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-8 left-8">
                    <Badge variant={event.accessLevel} className="bg-white/10 backdrop-blur-xl text-white border-white/20 px-5 py-2">{event.accessLevel}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2">
                  <h3 className="text-3xl font-bold text-white tracking-tight">{event.title}</h3>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    {ARTISTS.find(a => a.id === event.artistId)?.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: UNIVERSAL EXPERIENCE - HIGH FIDELITY DEPTH */}
      <section className="bg-[#050505] py-56 border-y border-white/5 overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          
          <div className="flex flex-col gap-16 relative z-10">
            <div className="flex flex-col gap-8">
              <span className="text-sm font-bold tracking-widest text-blue-500 uppercase">Seamless Ecosystem</span>
              <h2 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1] text-white">Your stage,<br />everywhere.</h2>
              <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium">Whether you're on the move or in the front row of your living room, VIBE adapts to deliver the world's highest fidelity music broadcast.</p>
            </div>

            <div className="flex flex-col gap-12">
              <div className="flex items-start gap-10 group">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  <Icons.Globe size={36} weight="bold" />
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-2xl font-bold text-white tracking-tight">Web Standard 4K</h4>
                  <p className="text-lg text-zinc-500 leading-relaxed max-w-md">Zero-install architecture optimized for high-bitrate streaming on Chrome, Safari, and Edge.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-10">
                <div className="flex items-start gap-10 group">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <Icons.Settings size={36} weight="bold" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-2xl font-bold text-white tracking-tight">Native Mobile Experience</h4>
                    <p className="text-lg text-zinc-500 leading-relaxed max-w-md">Purpose-built apps for iOS and Android with background spatial audio and offline viewing.</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-5 pl-[106px]">
                  <button className="h-16 px-10 bg-black border border-white/10 rounded-2xl flex items-center gap-5 hover:bg-zinc-900 transition-all hover:scale-[1.03] active:scale-[0.97] shadow-2xl">
                    <Icons.Shield size={32} weight="fill" className="text-white" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[11px] font-bold uppercase text-zinc-500 mb-1">Download on the</span>
                      <span className="text-xl font-bold text-white">App Store</span>
                    </div>
                  </button>
                  <button className="h-16 px-10 bg-black border border-white/10 rounded-2xl flex items-center gap-5 hover:bg-zinc-900 transition-all hover:scale-[1.03] active:scale-[0.97] shadow-2xl">
                    <Icons.Play size={32} weight="fill" className="text-white" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[11px] font-bold uppercase text-zinc-500 mb-1">Get it on</span>
                      <span className="text-xl font-bold text-white">Google Play</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Main Device Visual */}
            <motion.div 
              whileHover={{ y: -15 }}
              className="relative bg-zinc-900 rounded-[72px] p-5 shadow-[0_60px_120px_rgba(0,0,0,0.9)] border border-white/10 aspect-[16/10] overflow-hidden group"
            >
               <img src="https://images.unsplash.com/photo-1541613232333-214c674230d0?w=1600&h=900&fit=crop" className="w-full h-full object-cover rounded-[52px] opacity-80 transition-transform duration-[3s] group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-16">
                  <Badge variant="live" className="w-fit mb-6 px-6 py-2">Master Broadcast Feed</Badge>
                  <h4 className="text-5xl font-bold text-white tracking-tight leading-none italic uppercase">Daft Punk: Alive</h4>
               </div>
            </motion.div>
            
            {/* Floating iPhone mockup */}
            <motion.div 
              animate={{ y: [0, -25, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-16 -left-16 w-64 aspect-[9/19.5] bg-black border-[10px] border-zinc-800 rounded-[56px] shadow-[0_80px_160px_rgba(0,0,0,1)] overflow-hidden z-20"
            >
               <img src="https://images.unsplash.com/photo-1619983081563-430f63602796?w=600&h=1200&fit=crop" className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                     <span className="text-sm font-bold text-white tracking-widest uppercase">Live Monitoring</span>
                  </div>
               </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 4: TESTIMONIALS - APPLE STYLE QUOTES */}
      <section className="py-64 px-6 bg-black">
        <div className="max-w-5xl mx-auto flex flex-col gap-40">
           {testimonials.map((t, i) => (
             <motion.div 
              key={t.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-12 text-center"
             >
                <div className="flex justify-center gap-2 text-blue-500 mb-4">
                   {[1,2,3,4,5].map(s => <Icons.Heart key={s} weight="fill" size={24} />)}
                </div>
                <h3 className="text-4xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight italic">
                   "{t.text}"
                </h3>
                <div className="flex flex-col items-center gap-4">
                   <div className="w-20 h-20 rounded-full border-2 border-white/10 p-1">
                      <img src={t.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white">{t.name}</span>
                      <span className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">{t.role}</span>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* SECTION 5: FINAL CTA - THE BIG MOMENT */}
      <section className="py-48 px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[80px] p-24 md:p-40 text-center flex flex-col items-center gap-16 shadow-[0_100px_200px_rgba(255,255,255,0.05)] overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]" />
            
            <motion.h2 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-[140px] font-black tracking-tight leading-[0.85] text-black italic uppercase"
            >
              Don't miss<br />the next beat.
            </motion.h2>

            <p className="text-2xl md:text-3xl text-zinc-600 font-medium max-w-3xl leading-relaxed">
              Join 2.4 million music fans on the platform that's redefining digital performance.
            </p>

            <button 
              onClick={handleStart}
              className="px-20 py-7 bg-black text-white text-3xl font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
            >
              Create Free Account
            </button>
            
            <div className="flex flex-col items-center gap-10 mt-12 opacity-40 grayscale contrast-125">
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Secure Payment Infrastructure</span>
              <div className="flex items-center gap-16">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-8" alt="Stripe" />
                <div className="h-8 w-px bg-black/10" />
                <div className="flex gap-8 text-black">
                   <Icons.Shield size={32} weight="fill" />
                   <Icons.Lock size={32} weight="fill" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - CLEAN & STRUCTURED */}
      <footer className="py-32 border-t border-white/5 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-24 md:gap-12">
          <div className="flex flex-col gap-10">
            <h2 className="text-4xl font-black tracking-tighter text-blue-500">VIBE<span className="text-white">LIVE</span></h2>
            <p className="text-base text-zinc-500 leading-relaxed font-medium">The world's premium concert streaming architecture. Engineered for fidelity, curated for impact.</p>
            <div className="flex gap-8 text-zinc-500">
               <Icons.Globe size={24} className="hover:text-white cursor-pointer transition-colors" />
               <Icons.Settings size={24} className="hover:text-white cursor-pointer transition-colors" />
               <Icons.Waveform size={24} className="hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Experience</span>
            <div className="flex flex-col gap-4 text-base text-zinc-500 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-blue-400 transition-colors">Vibe Pass</a>
              <a href="#" className="hover:text-blue-400 transition-colors">4K Replays</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Spatial Audio</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Multi-Angle</a>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Company</span>
            <div className="flex flex-col gap-4 text-base text-zinc-500 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-blue-400 transition-colors">About VIBE</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Press Room</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Partners</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Compliance</a>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Support</span>
            <div className="flex flex-col gap-4 text-base text-zinc-500 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-blue-400 transition-colors">Account Security</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Help Center</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-40 text-[11px] font-black uppercase tracking-[0.6em] text-zinc-800 text-center">
           © 2024 VIBE LIVE BROADCAST SYSTEM • BUILT FOR IMMERSION • TOKYO • NEW YORK • LONDON
        </div>
      </footer>
    </div>
  );
};
