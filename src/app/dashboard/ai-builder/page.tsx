"use client";

import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  HelpCircle, 
  Users, 
  BookmarkCheck, 
  UserPlus, 
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Toast } from '@/components/ui/Toast';

export default function AiTeamBuilderPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Selection states
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  const [problemStatements, setProblemStatements] = useState<any[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState('');
  
  // Builder results
  const [loading, setLoading] = useState(false);
  const [teamReport, setTeamReport] = useState<any | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }

    // Fetch hackathons & problem statements
    fetch('/api/hackathons')
      .then(res => res.json())
      .then(data => {
        setHackathons(data);
        if (data.length > 0) {
          setSelectedHackathonId(data[0].id);
          setProblemStatements(data[0].problemStatements || []);
          if (data[0].problemStatements.length > 0) {
            setSelectedProblemId(data[0].problemStatements[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleHackathonChange = (id: string) => {
    setSelectedHackathonId(id);
    const found = hackathons.find(h => h.id === id);
    const problems = found ? found.problemStatements : [];
    setProblemStatements(problems);
    if (problems.length > 0) {
      setSelectedProblemId(problems[0].id);
    } else {
      setSelectedProblemId('');
    }
  };

  const handleGenerateTeam = async () => {
    if (!currentUser || !selectedHackathonId || !selectedProblemId) return;

    setLoading(true);
    setTeamReport(null);

    try {
      const res = await fetch(`/api/ai/team-builder?userId=${currentUser.id}&hackathonId=${selectedHackathonId}&problemStatementId=${selectedProblemId}`);
      if (!res.ok) throw new Error("Failed to generate team builder recommendations");
      const data = await res.json();
      
      // Simulate slight processing latency for premium AI load feel
      setTimeout(() => {
        setTeamReport(data);
        setToast({ show: true, message: "AI Team compilation completed successfully!", type: 'success' });
        setLoading(false);
      }, 1000);

    } catch (err: any) {
      setToast({ show: true, message: err.message || 'Error generating team recommendation.', type: 'error' });
      setLoading(false);
    }
  };

  const handleInviteTeammate = async (teammateId: string, teammateName: string) => {
    if (!currentUser) return;
    
    try {
      const res = await fetch('/api/teams');
      if (!res.ok) throw new Error("Failed to load squads");
      const allTeams = await res.json();
      const userTeams = allTeams.filter((t: any) => t.members.some((m: any) => m.id === currentUser.id));

      if (userTeams.length === 0) {
        // Automatically create a team if user does not have one
        const createRes = await fetch('/api/teams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            name: `${currentUser.name.split(' ')[0]}'s AI Team`,
            hackathonId: selectedHackathonId,
            problemStatementId: selectedProblemId,
            idea: 'Leveraging AI recommendations to construct a custom prototype.',
            requiredSkills: currentUser.skills,
            missingRoles: teamReport.missingRoles,
            creator: currentUser
          })
        });

        if (!createRes.ok) throw new Error("Auto-team creation failed");
        const newTeamData = await createRes.json();
        
        // Send invite
        const inviteRes = await fetch('/api/teams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'invite',
            teamId: newTeamData.team.id,
            teamName: newTeamData.team.name,
            senderName: currentUser.name,
            receiverId: teammateId
          })
        });
        if (!inviteRes.ok) throw new Error("Invitation failed");
        setToast({ show: true, message: `Created team and sent invitation to ${teammateName}!`, type: 'success' });
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
      setToast({ show: true, message: err.message || 'Failed to invite developer.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-indigo-400" />
          AI Team Builder
        </h1>
        <p className="text-xs text-slate-400">Select an upcoming hackathon and challenge to automatically match developers to fill missing roles.</p>
      </div>

      {/* Select Box controls */}
      <GlassCard hoverEffect={false} className="border-slate-800 bg-slate-950/20 p-5 space-y-4">
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Target Hackathon</label>
            <select
              value={selectedHackathonId}
              onChange={(e) => handleHackathonChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-850 text-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {hackathons.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wide">Problem Track</label>
            <select
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-855 text-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {problemStatements.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-900/60">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleGenerateTeam}
            disabled={loading || !selectedProblemId}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Compiling roster parameters...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Team
              </>
            )}
          </Button>
        </div>

      </GlassCard>

      {/* Builder output report */}
      {teamReport && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid md:grid-cols-12 gap-8">
            
            {/* Left side: compatibility score and strengths */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Teammates cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider px-1">Recommended Roster</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* First teammate: User */}
                  <GlassCard hoverEffect={false} className="border-indigo-500/20 bg-indigo-950/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full border border-indigo-550/40 bg-slate-900" />
                        <div>
                          <h4 className="text-xs font-bold text-indigo-300">{currentUser.name}</h4>
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">YOU (Lead)</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wide">Primary Role: {currentUser.preferredRole}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {currentUser.skills.slice(0, 4).map((s: string) => (
                          <Badge key={s} variant="slate" className="text-[9px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </GlassCard>

                  {/* Recommendations */}
                  {teamReport.recommendedTeammates.map((t: any) => (
                    <GlassCard key={t.id} hoverEffect={false} className="border-slate-850 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-3">
                            <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900" />
                            <div>
                              <h4 className="text-xs font-bold text-slate-205">{t.name}</h4>
                              <p className="text-[9px] text-slate-500 truncate max-w-[120px]">{t.college}</p>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleInviteTeammate(t.id, t.name)}
                            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/30 text-indigo-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Invite to Squad"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wide">Fills Role: {t.preferredRole}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {t.coveredSkills.map((s: any) => (
                            <Badge key={s} variant="accent" className="text-[9px]">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <GlassCard hoverEffect={false} className="border-slate-800 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Team Strengths
                    </h4>
                    <ul className="list-disc pl-4 text-xs text-slate-300 space-y-2">
                      {teamReport.strengths.map((str: string, i: number) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[9px] font-bold text-warning uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Team Weaknesses
                    </h4>
                    <ul className="list-disc pl-4 text-xs text-slate-300 space-y-2">
                      {teamReport.weaknesses.map((w: string, i: number) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Improvements */}
                <div className="bg-indigo-950/10 border border-indigo-500/20 p-4 rounded-xl space-y-2.5">
                  <h4 className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    AI Execution Roadmap
                  </h4>
                  <ol className="list-decimal pl-4 text-xs text-slate-300 space-y-1.5">
                    {teamReport.suggestedImprovements.map((imp: string, i: number) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ol>
                </div>
              </GlassCard>

            </div>

            {/* Right side: overall score meters */}
            <div className="md:col-span-4 space-y-6">
              
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider px-1 font-semibold">Synergy Report</h3>

              <GlassCard hoverEffect={false} className="border-slate-850 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Roster Balance Score</span>
                    <span className="text-xs font-bold text-white">{teamReport.teamScore}%</span>
                  </div>
                  <ProgressBar value={teamReport.teamScore} variant="primary" />
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-900">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Winning Odds Estimate</span>
                    <span className="text-xs font-bold text-cyan-400">{teamReport.winningProbability}%</span>
                  </div>
                  <ProgressBar value={teamReport.winningProbability} variant="accent" />
                </div>

                {/* Missing roles check */}
                <div className="space-y-2 pt-3 border-t border-slate-900">
                  <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide block">Remaining Skill Gaps:</span>
                  <div className="flex flex-wrap gap-1">
                    {teamReport.missingRoles.length === 0 ? (
                      <Badge variant="success" className="text-[9px]">Zero Gaps</Badge>
                    ) : (
                      teamReport.missingRoles.map((r: any) => (
                        <Badge key={r} variant="warning" className="text-[9px]">{r}</Badge>
                      ))
                    )}
                  </div>
                </div>
              </GlassCard>

            </div>

          </div>

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
