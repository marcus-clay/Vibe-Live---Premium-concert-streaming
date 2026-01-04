
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useViewportStore } from '../../stores/viewportStore';
import { useUserStore } from '../../stores/userStore';
import { Icons } from '../ui/Icons';

const navItems = [
  { id: 'home', label: 'Home', icon: Icons.Home, path: '/' },
  { id: 'live', label: 'Live', icon: Icons.Live, path: '/live' },
  { id: 'artists', label: 'Artists', icon: Icons.Artists, path: '/artists' },
  { id: 'mylist', label: 'My List', icon: Icons.MyList, path: '/my-list' },
  { id: 'vibepass', label: 'Vibe Pass', icon: Icons.Shield, path: '/vibe-pass' },
];

export const Navigation: React.FC = () => {
  const { currentViewport } = useViewportStore();
  const { logout } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  if (currentViewport === 'mobile') {
    return (
      <nav className="h-20 glass-dark border-t border-white/5 flex items-center justify-around px-4 z-40 rounded-t-[32px]">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1.5 p-2 transition-all ${
                isActive ? 'text-white' : 'text-zinc-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={{ scale: isActive ? 1.2 : 1 }}
                  className={isActive ? 'text-blue-500' : ''}
                >
                  <item.icon size={22} weight={isActive ? "fill" : "regular"} />
                </motion.div>
                <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    );
  }

  if (currentViewport === 'tv') {
    return (
      <nav className="w-72 h-full glass-dark border-r border-white/5 p-10 flex flex-col gap-12 z-40">
        <div>
          <div className="text-3xl font-black tracking-tighter text-blue-500 mb-1">VIBE<span className="text-white">LIVE</span></div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Broadcast System</div>
        </div>
        
        <div className="flex flex-col gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              id={`nav-${item.id}`}
              data-focusable="true"
              className={({ isActive }) =>
                `group flex items-center gap-5 px-6 py-4 rounded-2xl transition-all relative outline-none ${
                  isActive ? 'bg-white text-black shadow-2xl' : 'text-zinc-500 hover:text-white'
                }`
              }
            >
              <item.icon size={28} weight={location.pathname === item.path ? "fill" : "regular"} />
              <span className="text-lg font-bold">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            data-focusable="true"
            id="nav-logout"
            className="group flex items-center gap-5 px-6 py-4 rounded-2xl transition-all relative outline-none text-zinc-500 hover:text-white"
          >
            <Icons.X size={28} />
            <span className="text-lg font-bold">Logout</span>
          </button>
        </div>

        <div className="mt-auto pt-10 border-t border-white/5">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-sm">AT</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white text-left">Alex Thompson</span>
              <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest text-left">Enterprise Partner</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="h-24 px-12 flex items-center justify-between glass border-b border-white/5 sticky top-0 z-40 mx-4 mt-4 rounded-full">
      <div className="flex items-center gap-16">
        <div className="text-2xl font-black tracking-tighter text-blue-500">VIBE<span className="text-white">LIVE</span></div>
        <div className="flex items-center gap-10">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-bold uppercase tracking-widest transition-all relative py-2 ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 inset-x-0 h-1 bg-blue-500 rounded-full" 
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <NavLink to="/search" className="p-3 glass rounded-full text-zinc-400 hover:text-white transition-all">
          <Icons.Search size={22} weight="bold" />
        </NavLink>
        <button onClick={handleLogout} className="p-3 glass rounded-full text-zinc-400 hover:text-white transition-all">
          <Icons.X size={22} weight="bold" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white/20 flex items-center justify-center font-black">
            AT
          </div>
        </div>
      </div>
    </nav>
  );
};
