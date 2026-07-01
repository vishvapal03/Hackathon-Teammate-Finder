import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'outline' | 'slate';
}

export function Badge({ children, className, variant = 'slate', ...props }: BadgeProps) {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium select-none border transition-all duration-150";

  const variants = {
    primary: "bg-primary/10 border-primary/25 text-indigo-300",
    secondary: "bg-secondary/10 border-secondary/25 text-purple-300",
    accent: "bg-accent/10 border-accent/25 text-cyan-300",
    success: "bg-success/10 border-success/25 text-success",
    warning: "bg-warning/10 border-warning/25 text-warning",
    error: "bg-error/10 border-error/25 text-error",
    outline: "border-slate-800 bg-transparent text-slate-300",
    slate: "bg-slate-800/80 border-slate-700/50 text-slate-300"
  };

  return (
    <span
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
