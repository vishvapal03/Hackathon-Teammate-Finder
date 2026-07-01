"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Trophy, 
  Users, 
  Calendar, 
  UserCheck, 
  Activity,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Cpu,
  Bell
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    profileCompletion: 80,
    aiMatchScore: 94,
    upcomingEventsCount: 2,
    activeTeamsCount: 1,
  });
  const [invitations, setInvitations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      
      // Calculate profile completion based on field presence
      const fields = ['bio', 'github', 'linkedin', 'portfolio', 'preferredRole', 'experience', 'availability'];
      const completedFields = fields.filter(f => parsed[f] && parsed[f].length > 0);
      const completionPercentage = Math.min(100, Math.round(((completedFields.length + 3) / 10) * 100)); // base 30% for name/email/skills
      
      setStats(prev => ({
        ...prev,
        profileCompletion: completionPercentage
      }));

      // Fetch invitations
      fetch(`/api/notifications?userId=${parsed.id}`)
        .then(res => res.json())
        .then(data => {
          setInvitations(data.filter((n: any) => n.type === 'team_invitation' && !n.read));
        })
        .catch(console.error);

      // Fetch teams
      fetch('/api/teams')
        .then(res => res.json())
        .then(data => {
          setTeams(data.filter((t: any) => t.members.some((m: any) => m.id === parsed.id)));
        })
        .catch(console.error);

      // Fetch hackathons
      fetch('/api/developers')
        .then(res => res.json())
        .then(devs => {
          // fetch match score
          return fetch(`/api/ai/match?userId=${parsed.id}`);
        })
        .then(res => res.json())
        .then(matches => {
          if (matches && matches.length > 0) {
            setStats(prev => ({
              ...prev,
              aiMatchScore: matches[0].match.overall
            }));
          }
        })
        .catch(console.error);
    }

    // Default mock hackathons fetch
    setHackathons([
      { id: "h1", name: "GenAI Buildathon 2026", deadline: "July 10, 2026", domain: "AI" },
      { id: "h2", name: "Web3 Future Hack", deadline: "Aug 5, 2026", domain: "Blockchain" }
    ]);
  }, []);

  const handleAcceptInvite = async (inviteId: string, teamId: string) => {
    if (!user) return;
    try {
      // 1. Join Team via API
      const joinRes = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          teamId,
          userId: user.id,
          preferredRole: user.preferredRole
        })
      });

      if (!joinRes.ok) throw new Error("Failed to join team");

      // 2. Mark Invitation as Read
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }) // clears notifications
      });

      // 3. Reload Page State
      setInvitations(prev => prev.filter(i => i.id !== inviteId));
      
      // reload teams
      const teamRes = await fetch('/api/teams');
      if (teamRes.ok) {
        const allTeams = await teamRes.json();
        setTeams(allTeams.filter((t: any) => t.members.some((m: any) => m.id === user.id)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Welcome back, {user.name.split(' ')[0]}!
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Here is a summary of your hackathon teammate searches and active project squads.</p>
        </div>
        
        <Link href="/dashboard/ai-builder">
          <Button variant="accent" size="sm" className="shadow-cyan-500/10">
            <Cpu className="w-4 h-4" />
            AI Team Builder
          </Button>
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard className="space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Profile Match State</span>
            <UserCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats.profileCompletion}%</div>
            <ProgressBar value={stats.profileCompletion} variant="primary" className="mt-2" />
          </div>
          <p className="text-[10px] text-slate-500">Completing bio and portfolio links increases compatibility matches.</p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Top AI Compatibility</span>
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats.aiMatchScore}%</div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge variant="accent" className="px-1.5 py-0">High Match</Badge>
              <span className="text-[10px] text-slate-400">Ready to build</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500">Top matching candidate registered in the platform database.</p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Open Hackathons</span>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats.upcomingEventsCount}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400">Next event: July 15</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500">Upcoming global hackathons with active teammate search pools.</p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Teams</span>
            <Users className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{teams.length}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge variant="success" className="px-1.5 py-0">Squad formed</Badge>
            </div>
          </div>
          <p className="text-[10px] text-slate-500">Rosters you currently belong to or manage in the system.</p>
        </GlassCard>

      </div>

      {/* Main Grid: Pending Invitations & Active Teams */}
      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Left Side: Teams & Saved Events */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Active Teams */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-indigo-400" />
              Your Active Teams
            </h3>
            
            {teams.length === 0 ? (
              <GlassCard hoverEffect={false} className="py-8 text-center text-slate-400 text-xs">
                You are not currently in any teams. Use the Browse Developers or AI Team Builder tools to build one!
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {teams.map((t) => (
                  <GlassCard key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/20">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-xs font-bold text-slate-100">{t.name}</h4>
                        <Badge variant="primary">AI Score: {t.aiScore}%</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-md line-clamp-1">{t.idea || "No idea defined yet."}</p>
                      
                      {/* Members Avatar list */}
                      <div className="flex items-center gap-1.5 mt-3">
                        {t.members.map((m: any) => (
                          <div key={m.id} className="relative group">
                            <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full border border-slate-800 bg-slate-900" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-950 text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{m.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/dashboard/teams" className="shrink-0 flex items-center justify-end">
                      <Button variant="outline" size="sm">
                        Manage Team
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          {/* Saved Events */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-purple-400" />
              Saved Hackathons
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {hackathons.map((h) => (
                <GlassCard key={h.id} className="p-5 flex flex-col justify-between h-36 hover:border-purple-500/20">
                  <div>
                    <Badge variant="slate" className="mb-2">{h.domain}</Badge>
                    <h4 className="text-xs font-bold text-slate-100">{h.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Deadline: {h.deadline}</p>
                  </div>
                  <Link href={`/dashboard/hackathons`} className="flex items-center text-[10px] font-bold text-purple-400 hover:text-purple-300 gap-1 mt-3">
                    Analyze Problem Statements
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </GlassCard>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Pending Invitations & Stats */}
        <div className="md:col-span-4 space-y-8">
          
          {/* Pending Invitations */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-accent" />
              Pending Invitations
            </h3>

            {invitations.length === 0 ? (
              <GlassCard hoverEffect={false} className="py-8 text-center text-slate-500 text-xs">
                No pending team invitations.
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {invitations.map((inv) => (
                  <GlassCard key={inv.id} hoverEffect={false} className="p-4 border-accent/20 bg-slate-950/20">
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      {inv.message}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="accent" size="sm" className="py-1 text-xs grow" onClick={() => handleAcceptInvite(inv.id, inv.teamId)}>
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" className="py-1 text-xs" onClick={() => setInvitations(prev => prev.filter(i => i.id !== inv.id))}>
                        Ignore
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          {/* Platform Performance / System Health */}
          <GlassCard hoverEffect={false} className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 border-b border-slate-900 pb-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              AI Search Analytics
            </h4>
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Match Accuracy</span>
                <span className="font-semibold text-slate-200">98.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Matched Stack</span>
                <span className="font-semibold text-indigo-400">React & LangChain</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Searches Audited</span>
                <span className="font-semibold text-slate-200">24 runs</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
}
