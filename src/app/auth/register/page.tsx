"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Toast } from '@/components/ui/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [github, setGithub] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !college || !github) {
      setToast({ show: true, message: 'Please fill in all the details.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, college, github })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setToast({ show: true, message: 'Account created! Logging you in...', type: 'success' });
      
      // Auto-login setting session
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setToast({ show: true, message: err.message || 'Something went wrong.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[460px] z-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Terminal className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-3">Join HackMatch AI</h2>
          <p className="text-xs text-slate-400">Assemble your winning hackathon team</p>
        </div>

        {/* Card */}
        <GlassCard hoverEffect={false} className="border-slate-800/80 bg-slate-950/30">
          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Name</label>
                <input
                  type="text"
                  placeholder="Vishvapal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">GitHub Username</label>
                <input
                  type="text"
                  placeholder="vishvapal03"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">College / Institute</label>
              <input
                type="text"
                placeholder="IIT Bombay"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </Button>
          </form>
        </GlassCard>

        {/* Footer Prompt */}
        <p className="text-xs text-center text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-400 font-semibold hover:underline">
            Login here
          </Link>
        </p>

      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
