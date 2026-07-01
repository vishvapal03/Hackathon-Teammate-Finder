"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, Github, Chrome, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Toast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ show: true, message: 'Please enter both email and password.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToast({ show: true, message: 'Login successful! Redirecting...', type: 'success' });
      
      // Store user session context
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setToast({ show: true, message: err.message || 'Something went wrong.', type: 'error' });
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setToast({ show: true, message: `Simulating ${provider} login...`, type: 'info' });
    setLoading(true);
    setTimeout(() => {
      // Login with Vishvapal seed user (ID 1)
      const mockUser = {
        id: "1",
        name: "Vishvapal Mittal",
        email: "vishvapal@example.com",
        college: "Indian Institute of Technology",
        degree: "B.Tech Computer Science",
        year: "3rd Year",
        bio: "Fullstack developer interested in building scalable web apps and AI agents. Passionate about participating in national and global hackathons.",
        skills: ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "MongoDB"],
        experience: "Intermediate",
        preferredRole: "Fullstack Developer",
        interests: ["AI", "Web Development", "Open Innovation"],
        availability: "High (15-20 hrs/week)",
        github: "vishvapal03",
        linkedin: "vishvapal-mittal",
        portfolio: "https://vishvapal.dev",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=vishvapal"
      };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      setToast({ show: true, message: 'Social authentication completed.', type: 'success' });
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10 space-y-6">
        
        {/* Logo Banner */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Terminal className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-3">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to find your teammate match</p>
        </div>

        {/* Login Card */}
        <GlassCard hoverEffect={false} className="border-slate-800/80 bg-slate-950/30">
          <form onSubmit={handleLogin} className="space-y-4">
            
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#" className="text-[10px] text-indigo-400 hover:underline">Forgot password?</a>
              </div>
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
                  Connecting...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-x-0 h-[1px] bg-slate-900" />
            <span className="relative px-3 bg-[#0F172A] text-[10px] font-semibold text-slate-500 uppercase tracking-wider">or sign in with</span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => handleSocialLogin('Google')} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" />
              <span>Google</span>
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={() => handleSocialLogin('GitHub')} disabled={loading}>
              <Github className="w-4 h-4 text-slate-200" />
              <span>GitHub</span>
            </Button>
          </div>
        </GlassCard>

        {/* Footer Prompt */}
        <p className="text-xs text-center text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-indigo-400 font-semibold hover:underline">
            Sign up now
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
