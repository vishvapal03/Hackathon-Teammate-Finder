import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ show, message, type = 'info', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    error: <AlertCircle className="w-5 h-5 text-error" />,
    info: <Info className="w-5 h-5 text-cyan-400" />
  };

  const borderColors = {
    success: "border-success/30 shadow-success/5",
    warning: "border-warning/30 shadow-warning/5",
    error: "border-error/30 shadow-error/5",
    info: "border-cyan-400/30 shadow-cyan-400/5"
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed bottom-6 right-6 z-[100] flex items-center gap-3 p-4 rounded-xl border glass-panel shadow-2xl min-w-[300px] max-w-md",
            borderColors[type]
          )}
        >
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="flex-grow text-sm font-medium text-slate-100">{message}</div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
