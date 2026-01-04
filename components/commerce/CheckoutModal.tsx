
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { usePlayerStore } from '../../stores/playerStore';
import { EVENTS } from '../../data/mock';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/Button';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, activeCheckoutEventId, closeCheckout, purchaseEvent } = useUserStore();
  const { setPlaying } = usePlayerStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const event = EVENTS.find(e => e.id === activeCheckoutEventId);
  if (!event) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate high-security payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Allow success state to breathe before closing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update entitlement
    purchaseEvent(event.id);
    // Immediately trigger playback for the player waiting in the background
    setPlaying(true);
    
    setIsSuccess(false);
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCheckout}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md glass-dark rounded-[40px] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
          >
            {isSuccess ? (
              <div className="p-12 flex flex-col items-center text-center gap-6">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                >
                  <Icons.Shield size={48} weight="bold" className="text-white" />
                </motion.div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-black tracking-tight">Access Granted</h2>
                  <p className="text-zinc-400 font-medium">Your ticket for {event.title} is now active. Enjoy the show.</p>
                </div>
              </div>
            ) : (
              <div className="p-10 flex flex-col gap-8">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Transaction</span>
                    <h2 className="text-3xl font-black tracking-tight">Unlock Premiere</h2>
                  </div>
                  <button onClick={closeCheckout} className="p-2 text-zinc-500 hover:text-white transition-colors">
                    <Icons.X size={24} weight="bold" />
                  </button>
                </div>

                <div className="flex gap-4 p-4 bg-white/5 rounded-3xl border border-white/5">
                  <img src={event.image} className="w-24 aspect-video rounded-xl object-cover" alt="" />
                  <div className="flex flex-col justify-center overflow-hidden">
                    <h3 className="font-bold text-sm leading-tight truncate">{event.title}</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Single Event Ticket</p>
                  </div>
                  <div className="ml-auto flex items-center pr-2">
                    <span className="text-xl font-black tabular-nums">$19.99</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    <span>Account</span>
                    <span className="text-white">alex.t@vibe.live</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    <span>Payment Method</span>
                    <span className="text-white flex items-center gap-2">
                      <Icons.CreditCard weight="fill" /> •••• 4242
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    size="lg" 
                    className="w-full h-16 text-lg gap-3" 
                    isLoading={isProcessing}
                    onClick={handlePurchase}
                  >
                    {!isProcessing && <Icons.Shield weight="bold" />} Purchase Access
                  </Button>
                  <p className="text-[10px] text-center text-zinc-600 font-medium leading-relaxed">
                    By confirming, you agree to VIBE Terms of Service. Purchases are immediate and non-refundable for live broadcast events.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
