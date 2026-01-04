
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'live' | 'upcoming' | 'replay' | 'glass' | 'free' | 'premium' | 'limited';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'glass', className = '' }) => {
  const styles = {
    live: 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]',
    upcoming: 'bg-blue-600 text-white',
    replay: 'bg-zinc-800 text-zinc-300',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/10',
    free: 'bg-green-600/20 text-green-400 border border-green-500/30',
    premium: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
    limited: 'bg-orange-600/20 text-orange-400 border border-orange-500/30',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[variant]} ${className}`}>
      {variant === 'live' && (
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      )}
      {children}
    </span>
  );
};
