"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Laptop, 
  Link2, 
  Trash2, 
  AlertTriangle,
  Github,
  Chrome,
  Save,
  Moon,
  Sun
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  // Settings states
  const [visibility, setVisibility] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inviteAlerts, setInviteAlerts] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleSaveSettings = () => {
    setToast({ show: true, message: "Preferences saved successfully!", type: 'success' });
  };

  const handleDisconnect = (provider: string) => {
    setToast({ show: true, message: `Disconnected ${provider} integration.`, type: 'info' });
  };

  const handleDeleteAccount = () => {
    if (confirm("WARNING: Are you sure you want to permanently delete your HackMatch AI account? This action is irreversible and deletes all teams and profiles.")) {
      localStorage.removeItem('currentUser');
      setToast({ show: true, message: "Account deleted. Redirecting...", type: 'error' });
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          Settings
        </h1>
        <p className="text-xs text-slate-400">Configure your system preferences, connected accounts, and visibility rules.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Left Side: Category links */}
        <div className="md:col-span-4 space-y-3">
          <GlassCard hoverEffect={false} className="p-3 border-slate-800 space-y-1">
            <button className="w-full text-left text-xs font-semibold px-3 py-2 rounded-xl text-primary bg-primary/10 border border-primary/20 flex items-center gap-2.5">
              <User className="w-4 h-4 text-primary" />
              General Preferences
            </button>
          </GlassCard>
        </div>

        {/* Right Side: Settings fields */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Profile Visibility */}
          <GlassCard hoverEffect={false} className="border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-indigo-400" />
              Privacy & Visibility
            </h3>
            
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Public Profile Search</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Allow other developers on the platform to discover your profile card and invite you to squads.</p>
              </div>
              <input 
                type="checkbox" 
                checked={visibility}
                onChange={() => setVisibility(!visibility)}
                className="w-8 h-4 bg-slate-900 border border-slate-800 rounded-full appearance-none checked:bg-primary relative before:absolute before:content-[''] before:w-3 before:h-3 before:bg-white before:rounded-full before:top-[1px] before:left-[1px] checked:before:left-[17px] before:transition-all cursor-pointer"
              />
            </div>
          </GlassCard>

          {/* Notifications */}
          <GlassCard hoverEffect={false} className="border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-purple-400" />
              Notification Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Email Notifications</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Receive reminders about upcoming registration deadlines and team events.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                  className="w-8 h-4 bg-slate-900 border border-slate-800 rounded-full appearance-none checked:bg-primary relative before:absolute before:content-[''] before:w-3 before:h-3 before:bg-white before:rounded-full before:top-[1px] before:left-[1px] checked:before:left-[17px] before:transition-all cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-900">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Team Invitation Alerts</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Get notified immediately when a teammate matcher sends you an invitation card.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={inviteAlerts}
                  onChange={() => setInviteAlerts(!inviteAlerts)}
                  className="w-8 h-4 bg-slate-900 border border-slate-800 rounded-full appearance-none checked:bg-primary relative before:absolute before:content-[''] before:w-3 before:h-3 before:bg-white before:rounded-full before:top-[1px] before:left-[1px] checked:before:left-[17px] before:transition-all cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-900">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">AI Compatibility Alerts</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Get weekly suggestions pointing out top compatibility scores in the database.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={matchAlerts}
                  onChange={() => setMatchAlerts(!matchAlerts)}
                  className="w-8 h-4 bg-slate-900 border border-slate-800 rounded-full appearance-none checked:bg-primary relative before:absolute before:content-[''] before:w-3 before:h-3 before:bg-white before:rounded-full before:top-[1px] before:left-[1px] checked:before:left-[17px] before:transition-all cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* Theme selection */}
          <GlassCard hoverEffect={false} className="border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-2">
              <Laptop className="w-4.5 h-4.5 text-cyan-400" />
              Theme Mode
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setTheme('dark'); setToast({ show: true, message: "Dark Mode activated.", type: 'success' }); }}
                className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark' ? 'border-primary bg-primary/5 text-white' : 'border-slate-850 hover:bg-slate-900/40 text-slate-400'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold">Dark Theme (Default)</span>
              </button>
              <button 
                onClick={() => { setTheme('light'); setToast({ show: true, message: "Light Mode is coming in full release! Keeps default dark theme.", type: 'info' }); }}
                className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  theme === 'light' ? 'border-primary bg-primary/5 text-white' : 'border-slate-850 hover:bg-slate-900/40 text-slate-400'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Light Theme</span>
              </button>
            </div>
          </GlassCard>

          {/* Connected Accounts */}
          <GlassCard hoverEffect={false} className="border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-2 flex items-center gap-2">
              <Link2 className="w-4.5 h-4.5 text-success" />
              Connected Accounts
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-850 rounded-xl bg-slate-900/20">
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-white" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">GitHub</h4>
                    <p className="text-[10px] text-slate-500">Connected as @{user.github || 'developer'}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="py-1 text-xs" onClick={() => handleDisconnect('GitHub')}>
                  Disconnect
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-850 rounded-xl bg-slate-900/20">
                <div className="flex items-center gap-3">
                  <Chrome className="w-5 h-5 text-red-500" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Google OAuth</h4>
                    <p className="text-[10px] text-slate-500">Connected as {user.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="py-1 text-xs" onClick={() => handleDisconnect('Google')}>
                  Disconnect
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Danger Zone */}
          <GlassCard hoverEffect={false} className="border-red-950/20 bg-red-950/5 p-6 space-y-4">
            <h3 className="text-xs font-bold text-error uppercase tracking-wider border-b border-red-900/20 pb-2 flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-error" />
              Danger Zone
            </h3>
            
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Delete Account</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Delete all profiles and team rosters permanently. This action cannot be undone.</p>
              </div>
              <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </GlassCard>

          {/* Submit preferences */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
            <Button variant="primary" onClick={handleSaveSettings}>
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>

        </div>

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
