
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusStore } from '../../stores/focusStore';

export const FocusRing: React.FC = () => {
  const { focusRect, currentFocusId } = useFocusStore();

  return (
    <AnimatePresence>
      {focusRect && currentFocusId && (
        <motion.div
          initial={false}
          animate={{
            top: focusRect.top,
            left: focusRect.left,
            width: focusRect.width,
            height: focusRect.height,
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 35,
            mass: 0.6,
          }}
          style={{
            position: 'absolute', // Changed to absolute so it's relative to the Viewport content
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          {/* TVOS Style Vibrant Glow Border */}
          <div
            className="absolute inset-0"
            style={{
              border: `4px solid #fff`, // Pure white for that bright Molotov/Apple TV feel
              borderRadius: 'inherit',
              margin: '-4px', // Tighter fit
              boxShadow: '0 0 25px rgba(255, 255, 255, 0.4), 0 0 60px rgba(59, 130, 246, 0.5)',
            }}
          />
          
          {/* Internal reflection */}
          <div className="absolute inset-0 bg-white/10 rounded-[inherit] mix-blend-overlay" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
