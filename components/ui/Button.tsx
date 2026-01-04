
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Fix: Use Omit to remove the broad 'children' type from HTMLMotionProps and explicitly 
// define it as React.ReactNode to resolve type mismatch errors in the render block where 
// MotionValue types are not expected for this specific component implementation.
interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none tracking-tight';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/10',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
    glass: 'glass text-white hover:bg-white/10',
    ghost: 'bg-transparent text-zinc-400 hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-10 py-4 text-base md:text-lg',
  };

  // Destructure disabled to ensure it is handled correctly alongside isLoading
  const { disabled, ...rest } = props;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
};
