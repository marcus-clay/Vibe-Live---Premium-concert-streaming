
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MerchItem } from '../../types';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/Button';

interface MerchSidebarProps {
  items: MerchItem[];
  isOpen: boolean;
  onClose: () => void;
  currentSongId?: string;
}

export const MerchSidebar: React.FC<MerchSidebarProps> = ({ items, isOpen, onClose, currentSongId }) => {
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const handleBuy = async (id: string) => {
    setBuyingId(id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPurchasedIds(prev => new Set(prev).add(id));
    setBuyingId(null);
  };

  const featuredItems = items.filter(i => i.linkedSongId === currentSongId);
  const otherItems = items.filter(i => i.linkedSongId !== currentSongId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md z-40" 
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 inset-y-0 w-[400px] glass-dark border-l border-white/10 z-50 p-8 flex flex-col gap-8 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Official Merch</span>
                <h2 className="text-2xl font-black">Tour Boutique</h2>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                <Icons.X size={24} weight="bold" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-10 pr-2">
              {featuredItems.length > 0 && (
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Featured Now</span>
                  <div className="flex flex-col gap-4">
                    {featuredItems.map(item => (
                      <MerchCard 
                        key={item.id} 
                        item={item} 
                        isBuying={buyingId === item.id}
                        isOwned={purchasedIds.has(item.id)}
                        onBuy={() => handleBuy(item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Collection</span>
                <div className="flex flex-col gap-4">
                  {otherItems.map(item => (
                    <MerchCard 
                      key={item.id} 
                      item={item} 
                      isBuying={buyingId === item.id}
                      isOwned={purchasedIds.has(item.id)}
                      onBuy={() => handleBuy(item.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Free shipping globally</span>
                <Icons.Shield weight="bold" className="text-blue-500" />
              </div>
              <Button variant="secondary" className="w-full h-14" onClick={onClose}>Continue Watching</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MerchCard: React.FC<{ item: MerchItem, onBuy: () => void, isBuying: boolean, isOwned: boolean }> = ({ item, onBuy, isBuying, isOwned }) => (
  <div className={`flex gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 transition-all ${isOwned ? 'opacity-60 grayscale' : 'hover:bg-white/10'}`}>
    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black flex-shrink-0">
      <img src={item.image} alt="" className="w-full h-full object-cover" />
    </div>
    <div className="flex flex-col flex-1 justify-center gap-1">
      <h3 className="text-sm font-bold truncate">{item.name}</h3>
      <p className="text-xl font-black">${item.price}</p>
      {isOwned ? (
        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Purchased</span>
      ) : (
        <button 
          onClick={onBuy}
          disabled={isBuying}
          className="text-left text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] hover:text-white transition-colors disabled:opacity-50"
        >
          {isBuying ? 'Securing...' : 'Quick Buy'}
        </button>
      )}
    </div>
  </div>
);
