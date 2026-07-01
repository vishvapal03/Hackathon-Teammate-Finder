"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Terminal, 
  LayoutDashboard, 
  User, 
  Users, 
  Compass, 
  BrainCircuit, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  Sparkles,
  Search,
  Cpu
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    // Session check
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      router.push('/auth/login');
      return;
    }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    // Fetch unread notifications count
    const loadNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${parsedUser.id}`);
        if (res.ok) {
          const list = await res.json();
          setUnreadNotifications(list.filter((n: any) => !n.read).length);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadNotifications();
  }, [router, pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400">Loading session context...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" />, path: '/dashboard' },
    { name: 'My Profile', icon: <User className="w-4.5 h-4.5" />, path: '/dashboard/profile' },
    { name: 'Browse Developers', icon: <Search className="w-4.5 h-4.5" />, path: '/dashboard/developers' },
    { name: 'Teams', icon: <Users className="w-4.5 h-4.5" />, path: '/dashboard/teams' },
    { name: 'AI Match', icon: <BrainCircuit className="w-4.5 h-4.5" />, path: '/dashboard/ai-match' },
    { name: 'Hackathons', icon: <Compass className="w-4.5 h-4.5" />, path: '/dashboard/hackathons' },
    { name: 'AI Team Builder', icon: <Cpu className="w-4.5 h-4.5" />, path: '/dashboard/ai-builder' },
    { name: 'Messages', icon: <MessageSquare className="w-4.5 h-4.5" />, path: '/dashboard/messages' },
    { 
      name: 'Notifications', 
      icon: <Bell className="w-4.5 h-4.5" />, 
      path: '/dashboard/notifications',
      badge: unreadNotifications > 0 ? unreadNotifications : undefined 
    },
    { name: 'Settings', icon: <Settings className="w-4.5 h-4.5" />, path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden h-16 border-b border-slate-900 bg-dark-bg/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">HackMatch AI</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-900 bg-slate-950/20 p-5 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            HackMatch <span className="text-accent">AI</span>
          </span>
        </div>

        {/* Menu Navigation List */}
        <nav className="space-y-1 flex-grow">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={active ? 'text-primary' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <Badge variant={active ? "primary" : "slate"} className="px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="border-t border-slate-900 pt-4 mt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-slate-800 bg-slate-900" />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-200 truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-500 truncate">{user.preferredRole || "Student"}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-error hover:bg-error/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-500 hover:text-error" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-slate-950 border-r border-slate-900 p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm text-white">HackMatch AI</span>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const active = pathname === item.path;
                    return (
                      <Link 
                        key={item.name} 
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          active 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={active ? 'text-primary' : 'text-slate-500'}>{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="primary" className="px-1.5 py-0">{item.badge}</Badge>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-900 pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-slate-800 bg-slate-900" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{user.name}</h4>
                    <p className="text-[10px] text-slate-500">{user.preferredRole || "Student"}</p>
                  </div>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-error hover:bg-error/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}
