import React from 'react';
import { motion } from 'framer-motion';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-micro focus:outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm hover:shadow focus:ring-primary-500/25',
    secondary: 'bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 border border-neutral-200 focus:ring-neutral-500/10',
    accent: 'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white shadow-sm hover:shadow focus:ring-accent-500/25',
  };

  const sizes = {
    sm: 'px-sm py-xs text-xs',
    md: 'px-md py-sm text-sm',
    lg: 'px-lg py-md text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <motion.span
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center justify-center gap-inherit w-full h-full"
        style={{ display: 'contents' }}
      >
        {children}
      </motion.span>
    </button>
  );
};
export default CTAButton;
