import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title = "No results found", 
  description = "Try adjusting your search queries or filter tags.", 
  icon = <Search className="w-8 h-8 text-slate-500" />
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 rounded-2xl border border-slate-800/80 bg-slate-950/20 max-w-sm mx-auto my-6 animate-fade-in">
      <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
