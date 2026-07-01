import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[16px] p-6 transition-all duration-300 relative overflow-hidden",
        hoverEffect && "glass-card-hover",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      {children}
    </div>
  );
}
