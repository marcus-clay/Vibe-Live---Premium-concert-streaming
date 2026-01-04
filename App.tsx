
import React, { useEffect, useCallback, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ViewportFrame } from './components/shell/ViewportFrame';
import { Navigation } from './components/shell/Navigation';
import { Home } from './pages/Home';
import { ArtistPage } from './pages/Artist';
import { Artists } from './pages/Artists';
import { Player } from './pages/Player';
import { SeriesPage } from './pages/Series';
import { Live } from './pages/Live';
import { Search } from './pages/Search';
import { MyList } from './pages/MyList';
import { Admin } from './pages/Admin';
import { Landing } from './pages/Landing';
import { VibePass } from './pages/VibePass';
import { useFocusStore } from './stores/focusStore';
import { useViewportStore } from './stores/viewportStore';
import { useUserStore } from './stores/userStore';
import { FocusRing } from './components/ui/FocusRing';
import { CheckoutModal } from './components/commerce/CheckoutModal';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  if (!isAuthenticated) return <Navigate to="/welcome" />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { currentViewport } = useViewportStore();
  const { isAuthenticated } = useUserStore();
  const { currentFocusId, setFocus } = useFocusStore();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  const updateFocusRect = useCallback((id: string | null) => {
    if (!id) {
      setFocus(null, null);
      return;
    }

    const el = document.getElementById(id);
    const container = contentRef.current;
    
    if (el && container) {
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      setFocus(id, {
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setFocus(null, null);
    }
  }, [setFocus]);

  // Handle Initial Focus on Navigation
  useEffect(() => {
    if (currentViewport !== 'tv') return;

    const initFocus = () => {
      const focusableElements = Array.from(document.querySelectorAll('[data-focusable="true"]'));
      if (focusableElements.length > 0) {
        const navItems = focusableElements.filter(el => el.id.startsWith('nav-'));
        const target = navItems.find(el => location.pathname === el.getAttribute('href')) || focusableElements[0];
        updateFocusRect(target.id);
      }
    };

    const timeout = setTimeout(initFocus, 200);
    return () => clearTimeout(timeout);
  }, [location.pathname, currentViewport, updateFocusRect]);

  // Handle TV Spatial Navigation
  useEffect(() => {
    if (currentViewport !== 'tv') {
      setFocus(null, null);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const focusable = Array.from(document.querySelectorAll('[data-focusable="true"]'));
      const currentEl = document.getElementById(currentFocusId || '');

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Backspace'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'Backspace') {
        navigate(-1);
        return;
      }

      if (!currentEl) {
        if (focusable.length > 0) updateFocusRect(focusable[0].id);
        return;
      }

      if (e.key === 'Enter') {
        (currentEl as HTMLElement).click();
        return;
      }

      const currentRect = currentEl.getBoundingClientRect();
      const currentCenter = {
        x: currentRect.left + currentRect.width / 2,
        y: currentRect.top + currentRect.height / 2,
      };

      let bestElement: Element | null = null;
      let minDistance = Infinity;

      focusable.forEach(el => {
        if (el === currentEl) return;
        const rect = el.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        const dx = center.x - currentCenter.x;
        const dy = center.y - currentCenter.y;

        let isCorrectDirection = false;
        const threshold = 10;

        if (e.key === 'ArrowRight' && dx > Math.abs(dy) - threshold) isCorrectDirection = true;
        if (e.key === 'ArrowLeft' && dx < -Math.abs(dy) + threshold) isCorrectDirection = true;
        if (e.key === 'ArrowDown' && dy > Math.abs(dx) - threshold) isCorrectDirection = true;
        if (e.key === 'ArrowUp' && dy < -Math.abs(dx) + threshold) isCorrectDirection = true;

        if (isCorrectDirection) {
          const distance = Math.sqrt(dx * dx + dy * dy * 1.5);
          if (distance < minDistance) {
            minDistance = distance;
            bestElement = el;
          }
        }
      });

      if (bestElement) {
        updateFocusRect((bestElement as HTMLElement).id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentViewport, currentFocusId, updateFocusRect, navigate, setFocus]);

  const showNav = isAuthenticated && !location.pathname.startsWith('/watch/');

  return (
    <ViewportFrame>
      <div 
        ref={contentRef}
        className={`w-full h-full flex flex-col relative bg-black ${currentViewport === 'tv' ? 'flex-row' : ''}`}
      >
        {showNav && currentViewport !== 'mobile' && currentViewport !== 'tv' && <Navigation />}
        <div className="flex-1 flex overflow-hidden relative">
          {showNav && currentViewport === 'tv' && <Navigation />}
          <main className="flex-1 relative overflow-hidden flex flex-col">
            <Routes>
              {/* Public Route */}
              <Route path="/welcome" element={<Landing />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/live" element={<ProtectedRoute><Live /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/artists" element={<ProtectedRoute><Artists /></ProtectedRoute>} />
              <Route path="/artist/:id" element={<ProtectedRoute><ArtistPage /></ProtectedRoute>} />
              <Route path="/watch/:id" element={<ProtectedRoute><Player /></ProtectedRoute>} />
              <Route path="/series/:id" element={<ProtectedRoute><SeriesPage /></ProtectedRoute>} />
              <Route path="/vibe-pass" element={<ProtectedRoute><VibePass /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          {currentViewport === 'tv' && <FocusRing />}
        </div>
        {showNav && currentViewport === 'mobile' && <Navigation />}
        <CheckoutModal />
      </div>
    </ViewportFrame>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
