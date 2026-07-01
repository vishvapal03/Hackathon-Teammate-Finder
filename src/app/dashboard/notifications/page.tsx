"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  CheckCircle, 
  Trash2, 
  Users, 
  Info,
  Sparkles,
  Check,
  ChevronRight
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  const loadNotifications = async (userId: string) => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to load notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      loadNotifications(parsed.id);
    }
  }, []);

  const handleClearAll = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (!res.ok) throw new Error("Failed to clear notifications");

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setToast({ show: true, message: "All notifications marked as read.", type: 'success' });
    } catch (err: any) {
      setToast({ show: true, message: err.message || "Failed to clear notifications.", type: 'error' });
    }
  };

  const handleAcceptInvite = async (inviteId: string, teamId: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          teamId,
          userId: user.id,
          preferredRole: user.preferredRole
        })
      });

      if (!res.ok) throw new Error("Failed to join team");

      setToast({ show: true, message: "Joined team successfully!", type: 'success' });
      
      // Mark read
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      loadNotifications(user.id);
    } catch (err: any) {
      setToast({ show: true, message: err.message || "Failed to accept invitation.", type: 'error' });
    }
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setToast({ show: true, message: "Notification removed.", type: 'info' });
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            Notifications
          </h1>
          <p className="text-xs text-slate-400">View team request notifications, AI alerts, and hackathon schedules.</p>
        </div>

        {notifications.some(n => !n.read) && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <Check className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState 
          title="All caught up!" 
          description="You don't have any notifications at the moment." 
          icon={<Bell className="w-8 h-8 text-slate-650" />}
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => {
            const isInvite = n.type === 'team_invitation';
            const isAi = n.type === 'ai_recommendation';

            return (
              <GlassCard 
                key={n.id} 
                hoverEffect={false} 
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-805 ${
                  n.read ? 'opacity-60 bg-slate-900/10' : 'border-indigo-500/10 bg-slate-900/40 shadow-lg shadow-indigo-950/5'
                }`}
              >
                
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0 mt-0.5">
                    {isInvite ? (
                      <Users className="w-4.5 h-4.5 text-indigo-400" />
                    ) : isAi ? (
                      <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
                    ) : (
                      <Info className="w-4.5 h-4.5 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-200">{n.title}</h4>
                      {!n.read && <Badge variant="primary">New</Badge>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[9px] text-slate-500 block mt-2">
                      {new Date(n.timestamp).toLocaleDateString()} &bull; {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-2 shrink-0 self-end sm:self-center">
                  {isInvite && !n.read && (
                    <Button variant="accent" size="sm" className="py-1 text-xs" onClick={() => handleAcceptInvite(n.id, n.teamId)}>
                      Accept Invitation
                    </Button>
                  )}
                  {isAi && (
                    <Link href="/dashboard/ai-match">
                      <Button variant="outline" size="sm" className="py-1 text-xs gap-1">
                        View Matches
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  )}
                  <button 
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 text-slate-500 hover:text-error rounded hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Remove alert"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>

              </GlassCard>
            );
          })}
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
