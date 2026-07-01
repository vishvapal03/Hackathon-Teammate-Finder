"use client";

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  CheckCircle, 
  UserPlus, 
  X, 
  Compass, 
  BookmarkCheck,
  BrainCircuit,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';

export default function TeamManagementPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'my-teams' | 'explore-teams'>('my-teams');
  
  // Data stores
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & form fields
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [idea, setIdea] = useState('');
  const [selectedHackathon, setSelectedHackathon] = useState('h1');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('');
  const [missingRolesInput, setMissingRolesInput] = useState('');
  const [creating, setCreating] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  const hackathons = [
    { id: "h1", name: "GenAI Buildathon 2026" },
    { id: "h2", name: "Web3 Future Hack" }
  ];

  const loadTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      setAllTeams(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
    loadTeams();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !teamName) return;

    setCreating(true);
    const skills = requiredSkillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const roles = missingRolesInput.split(',').map(r => r.trim()).filter(r => r.length > 0);

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: teamName,
          hackathonId: selectedHackathon,
          problemStatementId: '', // initially empty, to be assigned by Analyzer
          idea,
          requiredSkills: skills,
          missingRoles: roles,
          creator: currentUser
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create team");

      setToast({ show: true, message: `Team '${teamName}' created successfully!`, type: 'success' });
      setTeamName('');
      setIdea('');
      setRequiredSkillsInput('');
      setMissingRolesInput('');
      setCreateModalOpen(false);
      
      // Reload teams list
      loadTeams();
    } catch (err: any) {
      setToast({ show: true, message: err.message || "Failed to build team.", type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    if (!currentUser) return;
    if (!confirm("Are you sure you want to leave this team?")) return;

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'leave',
          teamId,
          userId: currentUser.id
        })
      });

      if (!res.ok) throw new Error("Failed to process leave action");
      
      setToast({ show: true, message: "You have left the team.", type: 'info' });
      loadTeams();
    } catch (err: any) {
      setToast({ show: true, message: err.message || "Error leaving team.", type: 'error' });
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!currentUser) return;

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          teamId,
          userId: currentUser.id,
          preferredRole: currentUser.preferredRole
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join team");

      setToast({ show: true, message: `Joined team '${data.team.name}'!`, type: 'success' });
      loadTeams();
    } catch (err: any) {
      setToast({ show: true, message: err.message || "Error joining team.", type: 'error' });
    }
  };

  if (!currentUser) return null;

  const myTeams = allTeams.filter(t => t.members.some((m: any) => m.id === currentUser.id));
  const exploreTeams = allTeams.filter(t => !t.members.some((m: any) => m.id === currentUser.id));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Team Management
          </h1>
          <p className="text-xs text-slate-400">Assemble lists of members, coordinate roles, or join other public squads searching for help.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Team
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 gap-6">
        <button
          onClick={() => setActiveTab('my-teams')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer relative ${
            activeTab === 'my-teams' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          My Teams ({myTeams.length})
          {activeTab === 'my-teams' && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('explore-teams')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer relative ${
            activeTab === 'explore-teams' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Explore Open Teams ({exploreTeams.length})
          {activeTab === 'explore-teams' && (
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-primary" />
          )}
        </button>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : activeTab === 'my-teams' ? (
        myTeams.length === 0 ? (
          <EmptyState 
            title="No active teams" 
            description="You are not in any teams. Create a team using the button or browse open teams to join." 
            icon={<Users className="w-8 h-8 text-slate-650" />}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {myTeams.map((t) => (
              <GlassCard key={t.id} className="flex flex-col justify-between hover:border-indigo-500/20">
                <div className="space-y-4">
                  
                  {/* Team Card Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-100">{t.name}</h3>
                      <p className="text-[9px] text-indigo-400 mt-0.5">
                        Event: {hackathons.find(h => h.id === t.hackathonId)?.name || 'Unknown Hackathon'}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[8px] font-bold text-cyan-400 flex items-center gap-0.5">
                        <BrainCircuit className="w-2.5 h-2.5" />
                        AI TEAM SCORE
                      </span>
                      <span className="text-xs font-bold text-white">{t.aiScore}%</span>
                    </div>
                  </div>

                  {/* Idea */}
                  <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/20 p-3 rounded-xl border border-slate-900">
                    <span className="font-bold text-slate-350 block mb-1">Project Idea:</span>
                    {t.idea || "No idea defined yet. Edit project properties to describe your stack concept."}
                  </p>

                  {/* Skills required */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide">Required Stack:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {t.requiredSkills.map((s: string) => (
                        <Badge key={s} variant="slate">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Missing Roles */}
                  {t.missingRoles.length > 0 && (
                    <div className="space-y-1.5 bg-warning/5 border border-warning/10 p-3 rounded-xl">
                      <span className="text-[9px] font-bold text-warning uppercase tracking-wide flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Missing Roles Needed:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {t.missingRoles.map((r: string) => (
                          <Badge key={r} variant="warning">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Member avatars with role badges */}
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide block">Roster ({t.members.length}):</span>
                    <div className="space-y-2">
                      {t.members.map((m: any) => (
                        <div key={m.id} className="flex items-center justify-between text-xs p-1">
                          <div className="flex items-center gap-2">
                            <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full border border-slate-800 bg-slate-900" />
                            <span className="text-slate-300 font-medium">{m.name}</span>
                          </div>
                          <Badge variant="primary">{m.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="flex justify-end gap-3 border-t border-slate-900 pt-4 mt-4">
                  <Button variant="danger" size="sm" className="w-full text-xs" onClick={() => handleLeaveTeam(t.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                    Leave Team
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )
      ) : exploreTeams.length === 0 ? (
        <EmptyState 
          title="No open teams found" 
          description="All teams are currently full or no public squads are active." 
          icon={<Compass className="w-8 h-8 text-slate-650" />}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {exploreTeams.map((t) => (
            <GlassCard key={t.id} className="flex flex-col justify-between hover:border-indigo-500/20">
              <div className="space-y-4">
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">{t.name}</h3>
                    <p className="text-[9px] text-indigo-400 mt-0.5">
                      Event: {hackathons.find(h => h.id === t.hackathonId)?.name || 'Unknown Hackathon'}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[8px] font-bold text-cyan-400 flex items-center gap-0.5">
                      <BrainCircuit className="w-2.5 h-2.5" />
                      AI SYNERGY
                    </span>
                    <span className="text-xs font-bold text-white">{t.aiScore}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/10 p-3 rounded-xl border border-slate-900">
                  <span className="font-bold text-slate-350 block mb-1">Project Idea:</span>
                  {t.idea || "No idea defined yet."}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide">Required Stack:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.requiredSkills.map((s: string) => (
                      <Badge key={s} variant="slate">{s}</Badge>
                    ))}
                  </div>
                </div>

                {t.missingRoles.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-warning uppercase tracking-wide block">Looking For:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {t.missingRoles.map((r: string) => (
                        <Badge key={r} variant="warning">{r}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide block">Current Members:</span>
                  <div className="flex gap-2">
                    {t.members.map((m: any) => (
                      <div key={m.id} className="relative group">
                        <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full border border-slate-800 bg-slate-900" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-950 text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{m.name} ({m.role})</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="border-t border-slate-900 pt-4 mt-4">
                <Button variant="accent" size="sm" className="w-full text-xs" onClick={() => handleJoinTeam(t.id)}>
                  <UserPlus className="w-3.5 h-3.5" />
                  Join Team
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Create Team Modal Overlay */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md animate-slide-up">
            <GlassCard hoverEffect={false} className="border-slate-850 bg-slate-950/60 p-6 space-y-4">
              
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <h3 className="text-xs font-bold text-slate-200">Create New Team</h3>
                <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-900 cursor-pointer">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prompt Wizards"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target Hackathon</label>
                  <select
                    value={selectedHackathon}
                    onChange={(e) => setSelectedHackathon(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-250 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {hackathons.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Project Idea Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your stack project concept or build objectives..."
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Required Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, PyTorch, LangChain"
                    value={requiredSkillsInput}
                    onChange={(e) => setRequiredSkillsInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Missing Roles Needed (comma separated)</label>
                  <input
                    type="text"
                    placeholder="AI Engineer, Frontend Dev"
                    value={missingRolesInput}
                    onChange={(e) => setMissingRolesInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full mt-2" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4.5 h-4.5" />
                      Establish Team
                    </>
                  )}
                </Button>

              </form>

            </GlassCard>
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
