import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 border border-primary/20",
    secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25 border border-secondary/20",
    accent: "bg-accent hover:bg-accent/90 text-slate-950 shadow-lg shadow-accent/25 font-semibold",
    outline: "border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 text-slate-200 hover:text-white backdrop-blur-sm",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/40",
    danger: "bg-error hover:bg-error/90 text-white shadow-lg shadow-error/25"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
