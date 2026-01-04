
import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../components/ui/Icons';
import { Button } from '../components/ui/Button';
import { useUserStore } from '../stores/userStore';
import { Badge } from '../components/ui/Badge';

export const VibePass: React.FC = () => {
  const { entitlements, toggleSubscription } = useUserStore();

  const benefits = [
    { title: 'The Complete Vault', desc: 'Unrestricted access to every concert, documentary, and session ever premiered on VIBE.', icon: Icons.Play },
    { title: '4K Master Tier', desc: 'Unlock the highest bitrate playback available, specifically mastered for OLED displays.', icon: Icons.Globe },
    { title: 'POVs & VIP Angles', desc: 'Choose between exclusive vantage points including drummer-pov and backstage access.', icon: Icons.Camera },
    { title: 'Spatial Audio 7.1', desc: 'Immersive soundscapes mapped in 3D space for an unparalleled sonic experience.', icon: Icons.Waveform },
    { title: 'Studio Ingest Early', desc: 'Get 48-hour early access to upcoming live premieres and limited virtual merch drops.', icon: Icons.Bell },
    { title: 'Offline Broadcast', desc: 'Download your favorite performances for crystal-clear offline viewing anywhere.', icon: Icons.ArrowsOut },
  ];

  const faqs = [
    { q: "Can I cancel my VIBE Pass anytime?", a: "Absolutely. You can manage or cancel your subscription directly from your account settings with zero friction." },
    { q: "Which devices support the 4K Master Tier?", a: "All modern smart TVs, 4K monitors, and flagship mobile devices (iOS/Android) support our maximum resolution." },
    { q: "How often is new content added to the Vault?", a: "We premiere at least 2 major global events every month, plus weekly 'Session' and 'Behind the Scenes' drops." }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-black p-8 md:p-20 pb-48 scroll-smooth">
      <div className="max-w-6xl mx-auto flex flex-col gap-24">
        {/* Cinematic Header */}
        <header className="flex flex-col items-center text-center gap-8 relative">
          <div className="absolute -top-20 inset-x-0 h-40 bg-blue-600/10 blur-[100px] pointer-events-none" />
          <Badge variant="premium" className="px-8 py-3 text-sm border-blue-500/40">Tier 4 Member Center</Badge>
          <h1 className="text-6xl md:text-[140px] font-black tracking-tighter leading-[0.8] italic uppercase text-white drop-shadow-2xl">VIBE PASS.</h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-3xl leading-relaxed">The ultimate passport to the world's most prestigious stages. Experience music in its most absolute form.</p>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark rounded-[48px] p-12 border border-white/5 flex flex-col gap-8 hover:bg-zinc-900/40 hover:border-blue-500/20 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-blue-500/30">
                <benefit.icon size={32} weight="bold" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{benefit.title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Section */}
        <section className="flex flex-col gap-12 mt-12">
          <div className="text-center">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Comparison</span>
            <h2 className="text-4xl font-black mt-2">Elevate Your Access.</h2>
          </div>
          
          <div className="w-full flex flex-col md:flex-row gap-10">
            {/* Standard */}
            <div className="flex-1 glass rounded-[48px] p-12 border border-white/5 flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold">Standard Tier</h3>
                <p className="text-zinc-500 text-sm">Pay-per-view access to individual premieres.</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black">$0</span>
                <span className="text-zinc-500 font-bold mb-1 uppercase tracking-widest text-xs">/ mo</span>
              </div>
              <div className="flex flex-col gap-4">
                <CheckItem text="PPV Ticket Access" active />
                <CheckItem text="Live Chat Entry" active />
                <CheckItem text="Standard Audio (Stereo)" active />
                <CheckItem text="Vault Archives" />
                <CheckItem text="Multi-Angle POV" />
              </div>
            </div>

            {/* VIBE Pass */}
            <div className="flex-1 glass rounded-[48px] p-12 border-2 border-blue-600/40 flex flex-col gap-10 relative bg-blue-600/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <Badge variant="live" className="px-6 py-2 shadow-2xl">Recommended</Badge>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-white">Full VIBE Pass</h3>
                <p className="text-blue-400 text-sm font-bold">Unlimited access to everything we build.</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black">$24</span>
                <span className="text-zinc-500 font-bold mb-1 uppercase tracking-widest text-xs">/ mo</span>
              </div>
              <div className="flex flex-col gap-4">
                <CheckItem text="Unlimited Live Premieres" active />
                <CheckItem text="Full Vault Archive Access" active />
                <CheckItem text="4K Master Fidelity" active />
                <CheckItem text="Spatial Audio 7.1" active />
                <CheckItem text="Multi-Angle POV Selection" active />
              </div>
              <Button 
                className="w-full h-16 text-lg font-black italic uppercase mt-4" 
                variant={entitlements.isPremiumSubscriber ? 'glass' : 'primary'}
                onClick={toggleSubscription}
              >
                {entitlements.isPremiumSubscriber ? 'Manage Active Pass' : 'Unlock Everything'}
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="flex flex-col gap-12 border-t border-white/5 pt-24">
          <div className="text-center">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Support</span>
            <h2 className="text-4xl font-black mt-2">Intel & Operations.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
            {faqs.map(faq => (
              <div key={faq.q} className="flex flex-col gap-4">
                <h4 className="text-xl font-bold text-white">{faq.q}</h4>
                <p className="text-zinc-400 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center flex flex-col items-center gap-8">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl animate-pulse-subtle">
              <Icons.Shield weight="fill" size={32} />
           </div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter">Secure Your Front Row Seat.</h2>
           <p className="text-zinc-500 max-w-xl font-medium">Join millions of fans who have upgraded their concert experience. 30-day money-back guarantee for first-time subscribers.</p>
           <div className="flex items-center gap-10 mt-6">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-6 opacity-30 invert" alt="Stripe" />
              <div className="h-6 w-px bg-white/10" />
              <div className="flex gap-4 opacity-30 text-white">
                 <Icons.CreditCard size={24} weight="fill" />
                 <Icons.Lock size={24} weight="fill" />
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

const CheckItem: React.FC<{ text: string, active?: boolean }> = ({ text, active }) => (
  <div className={`flex items-center gap-3 ${active ? 'text-zinc-100' : 'text-zinc-600'}`}>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${active ? 'bg-blue-500 border-blue-500 text-black' : 'border-zinc-800'}`}>
      {active && <Icons.Shield weight="fill" size={10} />}
    </div>
    <span className="text-sm font-bold uppercase tracking-widest">{text}</span>
  </div>
);
