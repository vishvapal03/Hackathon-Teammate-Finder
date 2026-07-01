import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  showText?: boolean;
  text?: string;
}

export function ProgressBar({ value, className, variant = 'primary', showText = false, text }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, value));
  
  const variants = {
    primary: "bg-primary shadow-sm shadow-primary/20",
    secondary: "bg-secondary shadow-sm shadow-secondary/20",
    accent: "bg-accent shadow-sm shadow-accent/20",
    success: "bg-success shadow-sm shadow-success/20"
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {showText && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-400">
          <span>{text || 'Progress'}</span>
          <span className="font-semibold text-slate-200">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/20">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
