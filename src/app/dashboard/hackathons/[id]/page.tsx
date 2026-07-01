"use client";

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  BrainCircuit, 
  Award, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  Calendar,
  AlertTriangle,
  Lightbulb,
  FileText,
  UserPlus,
  Play,
  ArrowRight
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Toast } from '@/components/ui/Toast';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HackathonDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id: hackathonId } = use(params);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hackathon, setHackathon] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [skillGap, setSkillGap] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return;
    const parsedUser = JSON.parse(stored);
    setCurrentUser(parsedUser);

    const loadData = async () => {
      try {
        const res = await fetch('/api/hackathons');
        if (!res.ok) throw new Error("Failed to load hackathon details");
        const list = await res.json();
        const found = list.find((h: any) => h.id === hackathonId);
        setHackathon(found || null);
      } catch (err: any) {
        setToast({ show: true, message: err.message || 'Error loading hackathon details.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [hackathonId]);

  useEffect(() => {
    if (!currentUser || !hackathon) return;
    
    const problem = hackathon.problemStatements[selectedProblemIndex];
    if (!problem) return;

    setAnalyzing(true);
    
    // Fetch skill gap analysis from the backend AI engine
    fetch(`/api/ai/skill-gap?userId=${currentUser.id}&hackathonId=${hackathon.id}&problemStatementId=${problem.id}`)
      .then(res => res.json())
      .then(data => {
        setSkillGap(data);
      })
      .catch(console.error)
      .finally(() => setAnalyzing(false));

  }, [currentUser, hackathon, selectedProblemIndex]);

  const handleCreateTeam = () => {
    if (!hackathon) return;
    const problem = hackathon.problemStatements[selectedProblemIndex];
    
    // Redirect to Team Management page, pass state to trigger creation template
    router.push(`/dashboard/teams`);
  };

  const handleInviteTeammate = async (teammateId: string, teammateName: string) => {
    if (!currentUser) return;
    
    try {
      // Find or verify if user has a team
      const res = await fetch('/api/teams');
      if (!res.ok) throw new Error("Failed to search squads");
      const allTeams = await res.json();
      const userTeams = allTeams.filter((t: any) => t.members.some((m: any) => m.id === currentUser.id));

      if (userTeams.length === 0) {
        setToast({ show: true, message: "Please establish an active team first in the 'Teams' tab to send invitations.", type: 'warning' });
        return;
      }

      // Invite to user's first team
      const inviteRes = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          teamId: userTeams[0].id,
          teamName: userTeams[0].name,
          senderName: currentUser.name,
          receiverId: teammateId
        })
      });

      if (!inviteRes.ok) throw new Error("Invite action failed");
      setToast({ show: true, message: `Invitation sent to ${teammateName}!`, type: 'success' });
    } catch (err: any) {
      setToast({ show: true, message: err.message || 'Failed to send team invitation.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-sm font-bold text-white">Event not found</h2>
        <Link href="/dashboard/hackathons">
          <Button variant="outline" size="sm">Go Back</Button>
        </Link>
      </div>
    );
  }

  const activeProblem = hackathon.problemStatements[selectedProblemIndex];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Back Button */}
      <Link href="/dashboard/hackathons" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-450 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" />
        Back to Hackathons
      </Link>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-6">
        <div>
          <Badge variant="accent" className="mb-2 font-bold">{hackathon.domain}</Badge>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">{hackathon.name}</h1>
          <p className="text-xs text-slate-500 mt-1">Organized by {hackathon.organizer} &bull; Date: {hackathon.eventDate}</p>
        </div>

        <Button variant="primary" size="sm" onClick={handleCreateTeam}>
          Create Team for this Problem
        </Button>
      </div>

      {/* Problem Tabs */}
      <div className="flex border-b border-slate-900 gap-4 overflow-x-auto pb-1">
        {hackathon.problemStatements.map((p: any, index: number) => {
          const active = selectedProblemIndex === index;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProblemIndex(index)}
              className={`pb-3 text-xs font-bold whitespace-nowrap cursor-pointer relative transition-all ${
                active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              {p.title}
              {active && (
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-indigo-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid content */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Side: Analyzer details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Summary Box */}
          <GlassCard hoverEffect={false} className="border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              AI Problem Diagnostics
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/20 p-4 rounded-xl border border-slate-900/60">
              {activeProblem.description}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs">
              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Complexity</span>
                <Badge variant={activeProblem.difficulty === 'Hard' ? 'error' : 'warning'} className="mt-1">
                  {activeProblem.difficulty}
                </Badge>
              </div>

              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Build Time</span>
                <span className="font-semibold text-slate-200 mt-1 block">{activeProblem.estimatedTime}</span>
              </div>

              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900">
                <span className="text-[9px] font-bold text-slate-500 block uppercase">Roles Required</span>
                <span className="font-semibold text-indigo-400 mt-1 block">{activeProblem.roles.length} roles</span>
              </div>
            </div>
          </GlassCard>

          {/* Learn Roadmap Timeline */}
          <GlassCard hoverEffect={false} className="border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Play className="w-5 h-5 text-purple-400" />
              AI Recommended Development Roadmap
            </h3>

            <div className="space-y-6 pl-4 border-l border-slate-900 relative">
              {activeProblem.roadmap.map((step: string, index: number) => (
                <div key={index} className="relative pl-6">
                  {/* node dot */}
                  <div className="absolute top-1 left-[-21px] w-3 h-3 rounded-full bg-purple-500 border-2 border-dark-bg" />
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-wider block">Phase {index + 1}</span>
                  <p className="text-xs text-slate-300 mt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Resources & Deliverables */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            <GlassCard hoverEffect={false} className="p-5 border-slate-850 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Useful Resources
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-400">
                {activeProblem.resources.map((r: string, idx: number) => {
                  const parts = r.split(' (');
                  const name = parts[0];
                  const url = parts[1]?.replace(')', '') || '#';
                  return (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                        {name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </GlassCard>

            <GlassCard hoverEffect={false} className="p-5 border-slate-850 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-success" />
                Deliverables
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-400">
                {activeProblem.deliverables.map((d: string, idx: number) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </GlassCard>

          </div>

          {/* Innovation & Challenges */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            <GlassCard hoverEffect={false} className="p-5 border-slate-850 bg-amber-950/5 border-amber-950/20 space-y-2">
              <h4 className="text-xs font-bold text-warning flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Innovation Tips
              </h4>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                {activeProblem.innovationTips}
              </p>
            </GlassCard>

            <GlassCard hoverEffect={false} className="p-5 border-slate-850 bg-red-950/5 border-red-950/20 space-y-2">
              <h4 className="text-xs font-bold text-error flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Possible Challenges
              </h4>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                {activeProblem.challenges}
              </p>
            </GlassCard>

          </div>

        </div>

        {/* Right Side: Skill Gap Analysis */}
        <div className="lg:col-span-4 space-y-8">
          
          <h3 className="text-xs font-bold text-slate-355 uppercase tracking-wider px-1">Skill Gap Analysis</h3>

          {analyzing ? (
            <div className="p-8 text-center text-slate-500 text-xs">Running gap assessment...</div>
          ) : skillGap ? (
            <div className="space-y-6">
              
              {/* Gap Score Card */}
              <GlassCard hoverEffect={false} className="border-slate-850 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Skill Match Rate</span>
                  <Badge variant="primary">{skillGap.matchPercent}%</Badge>
                </div>
                <ProgressBar value={skillGap.matchPercent} variant="primary" />
                <p className="text-[10px] text-slate-500">How well your registered skills align with this problemStatement requirements.</p>
              </GlassCard>

              {/* Skills lists */}
              <GlassCard hoverEffect={false} className="border-slate-850 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-[9px] font-bold text-success uppercase tracking-wider">Matching Skills You Have</h4>
                  <div className="flex flex-wrap gap-1">
                    {skillGap.matchingSkills.length === 0 ? (
                      <span className="text-[10px] text-slate-500">None detected</span>
                    ) : (
                      skillGap.matchingSkills.map((s: string) => (
                        <Badge key={s} variant="success">{s}</Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <h4 className="text-[9px] font-bold text-warning uppercase tracking-wider">Missing Skills Needed</h4>
                  <div className="flex flex-wrap gap-1">
                    {skillGap.missingSkills.length === 0 ? (
                      <span className="text-[10px] text-success">Skill overlap complete!</span>
                    ) : (
                      skillGap.missingSkills.map((s: string) => (
                        <Badge key={s} variant="warning">{s}</Badge>
                      ))
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Learning Timeline Priority */}
              {skillGap.learningPriority.length > 0 && (
                <GlassCard hoverEffect={false} className="border-slate-850 space-y-3">
                  <h4 className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Recommended Study Priorities
                  </h4>
                  <div className="space-y-3">
                    {skillGap.learningPriority.map((p: any, idx: number) => (
                      <div key={idx} className="text-[11px] border-l-2 border-slate-800 pl-3 py-0.5 space-y-0.5">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-200">{p.skill}</span>
                          <span className={p.priority === 'High' ? 'text-error' : 'text-warning'}>{p.priority} Priority</span>
                        </div>
                        <p className="text-slate-400">{p.course}</p>
                        <p className="text-[9px] text-slate-500">Time estimate: {p.estimatedTime}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Teammates recommendation */}
              {skillGap.recommendedTeammates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider px-1">Complementary Teammates</h4>
                  <div className="space-y-3">
                    {skillGap.recommendedTeammates.map((t: any) => (
                      <div 
                        key={t.developer.id}
                        className="p-4 border border-slate-850 rounded-2xl bg-slate-900/30 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img src={t.developer.avatar} alt={t.developer.name} className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900" />
                          <div>
                            <h5 className="text-xs font-bold text-slate-200">{t.developer.name}</h5>
                            <span className="text-[9px] text-slate-500">Covers: {t.matchingSkills.join(', ')}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleInviteTeammate(t.developer.id, t.developer.name)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : null}

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
