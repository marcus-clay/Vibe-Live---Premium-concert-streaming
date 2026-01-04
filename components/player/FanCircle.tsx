
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../ui/Icons';

const MOCK_MESSAGES = [
  { id: 1, user: "Elena", msg: "This setlist is insane! 🔥", avatar: "E" },
  { id: 2, user: "Marcus", msg: "Audio quality is 10/10 with spatial", avatar: "M" },
  { id: 3, user: "Jae", msg: "Dawn FM era is goated", avatar: "J" },
  { id: 4, user: "VIBE BOT", msg: "Artist is now watching the feed!", avatar: "VB", system: true },
];

export const FanCircle: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const newMsg = {
        id: Date.now(),
        user: ["Alex", "Sam", "Jordan", "Taylor"][Math.floor(Math.random() * 4)],
        msg: ["LOUDER!", "Best night ever", "Wait for the bridge...", "ICONIC"][Math.floor(Math.random() * 4)],
        avatar: "A"
      };
      setMessages(prev => [...prev.slice(-20), newMsg]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="absolute left-10 top-1/2 -translate-y-1/2 w-80 glass-dark rounded-[40px] border border-white/10 z-50 p-6 flex flex-col gap-6 max-h-[60vh] shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Community</span>
              <h3 className="text-xl font-black">Fan Circle</h3>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Icons.X size={20} weight="bold" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 scrollbar-hide">
            {messages.map(m => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.system ? 'bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20' : ''}`}
              >
                {!m.system && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black text-blue-500 flex-shrink-0">
                    {m.avatar}
                  </div>
                )}
                <div className="flex flex-col">
                  {!m.system && <span className="text-[10px] font-bold text-zinc-500 uppercase">{m.user}</span>}
                  <p className={`text-sm ${m.system ? 'text-blue-400 font-bold italic' : 'text-zinc-200'}`}>{m.msg}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              placeholder="React to the set..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-blue-500 transition-colors"
            />
            <button className="p-2 bg-blue-600 rounded-xl text-white">
              <Icons.PlusSquare size={18} weight="fill" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
