"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  BrainCircuit, 
  Github, 
  Linkedin, 
  Mail, 
  Users, 
  X, 
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';
import { CardSkeleton } from '@/components/ui/Skeleton';

export default function BrowseDevelopersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Data lists
  const [developers, setDevelopers] = useState<any[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search / filter states
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  
  // Modals & UI states
  const [activeInviteDev, setActiveInviteDev] = useState<any | null>(null);
  const [activeProfileDev, setActiveProfileDev] = useState<any | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return;
    const parsedUser = JSON.parse(stored);
    setCurrentUser(parsedUser);

    const loadData = async () => {
      try {
        // 1. Fetch matches with AI scores
        const matchRes = await fetch(`/api/ai/match?userId=${parsedUser.id}`);
        if (!matchRes.ok) throw new Error("Failed to load match listings");
        const matchData = await matchRes.json();
        setDevelopers(matchData);

        // 2. Fetch user's active teams (to facilitate invitations)
        const teamRes = await fetch('/api/teams');
        if (teamRes.ok) {
          const allTeams = await teamRes.json();
          const parsedId = parsedUser.id;
          setUserTeams(allTeams.filter((t: any) => t.members.some((m: any) => m.id === parsedId)));
        }
      } catch (err: any) {
        setToast({ show: true, message: err.message || 'Error loading developer directory.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSendInvite = async (teamId: string, teamName: string) => {
    if (!currentUser || !activeInviteDev) return;

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          teamId,
          teamName,
          senderName: currentUser.name,
          receiverId: activeInviteDev.developer.id
        })
      });

      if (!res.ok) throw new Error("Failed to send invitation notification");

      setToast({ show: true, message: `Invitation sent to ${activeInviteDev.developer.name}!`, type: 'success' });
    } catch (err: any) {
      setToast({ show: true, message: err.message || 'Failed to send invite.', type: 'error' });
    } finally {
      setActiveInviteDev(null);
    }
  };

  const handleConnect = (dev: any) => {
    // Route to direct message view
    router.push(`/dashboard/messages?connectWith=${dev.id}`);
  };

  // Skill Options list extracted from users
  const allSkills = Array.from(new Set(developers.flatMap(d => d.developer.skills || [])));

  // Filter developers based on UI criteria
  const filteredDevelopers = developers.filter(item => {
    const dev = item.developer;
    const nameMatch = dev.name.toLowerCase().includes(search.toLowerCase()) || 
                      (dev.bio || '').toLowerCase().includes(search.toLowerCase());
    
    const skillMatch = selectedSkill === 'All' || 
                       dev.skills.some((s: string) => s.toLowerCase() === selectedSkill.toLowerCase());
    
    const expMatch = selectedExperience === 'All' || dev.experience === selectedExperience;
    
    const availMatch = selectedAvailability === 'All' || 
                       (selectedAvailability === 'High' && dev.availability.includes('High')) ||
                       (selectedAvailability === 'Medium' && dev.availability.includes('Medium')) ||
                       (selectedAvailability === 'Low' && dev.availability.includes('Low'));

    return nameMatch && skillMatch && expMatch && availMatch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
          Browse Developers
        </h1>
        <p className="text-xs text-slate-400">Discover and form connections with candidate developers evaluated by AI compatibility match scores.</p>
      </div>

      {/* Filter and Search Box */}
      <GlassCard hoverEffect={false} className="border-slate-800/80 bg-slate-950/20 p-5 space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search developers by name, stack, or biography keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-850 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 md:w-fit">
            
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-slate-900 border border-slate-850 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Skills</option>
              {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="bg-slate-900 border border-slate-850 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Experience</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="bg-slate-900 border border-slate-850 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Availability</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

          </div>
        </div>

      </GlassCard>

      {/* Grid listing */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredDevelopers.length === 0 ? (
        <EmptyState title="No matching developers" description="Try clearing your tags or search keyword filter." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((item) => {
            const dev = item.developer;
            const match = item.match;
            return (
              <GlassCard key={dev.id} className="flex flex-col justify-between hover:border-indigo-500/20">
                <div>
                  
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <img src={dev.avatar} alt={dev.name} className="w-11 h-11 rounded-full border border-slate-800 bg-slate-900" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{dev.name}</h4>
                        <p className="text-[9px] text-slate-500 max-w-[120px] truncate">{dev.college}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end shrink-0">
                      <span className="text-[8px] font-bold text-cyan-400 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI MATCH
                      </span>
                      <span className="text-xs font-black text-white">{match.overall}%</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="primary">{dev.preferredRole}</Badge>
                    <Badge variant="slate">{dev.experience}</Badge>
                  </div>

                  {/* Bio */}
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {dev.bio || "No biography provided yet."}
                  </p>

                  {/* Skills tags list */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {dev.skills.slice(0, 4).map((s: string) => (
                      <span key={s} className="text-[9px] font-medium bg-slate-900 text-slate-300 border border-slate-850 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                    {dev.skills.length > 4 && (
                      <span className="text-[9px] text-slate-500 px-1">+ {dev.skills.length - 4} more</span>
                    )}
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col gap-2 border-t border-slate-900 pt-3.5 mt-auto">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="grow py-1 text-xs" onClick={() => setActiveProfileDev(item)}>
                      View Profile
                    </Button>
                    
                    <button 
                      onClick={() => handleConnect(dev)}
                      className="p-2 border border-slate-800 rounded-xl hover:bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>

                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full text-xs py-1"
                    onClick={() => {
                      if (userTeams.length === 0) {
                        setToast({ show: true, message: "Please build an active hackathon team first under 'Teams' tab.", type: 'warning' });
                      } else {
                        setActiveInviteDev(item);
                      }
                    }}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Invite to Team
                  </Button>
                </div>

              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Select Team Invitation Modal Overlay */}
      {activeInviteDev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <GlassCard hoverEffect={false} className="max-w-md w-full border-slate-800/80 bg-slate-950/60 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h3 className="text-xs font-bold text-slate-200">Invite {activeInviteDev.developer.name}</h3>
              <button onClick={() => setActiveInviteDev(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-[11px] text-slate-400">Select which of your active hackathon teams you want to invite this developer to:</p>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {userTeams.map(t => (
                <div 
                  key={t.id}
                  className="flex items-center justify-between p-3 border border-slate-850 rounded-xl bg-slate-900/40 hover:bg-slate-900 hover:border-indigo-500/30 transition-all cursor-pointer"
                  onClick={() => handleSendInvite(t.id, t.name)}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{t.name}</h4>
                    <p className="text-[9px] text-slate-500">Missing: {t.missingRoles.join(', ') || 'None'}</p>
                  </div>
                  <Badge variant="primary">Select</Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Full Profile Inspect Modal Overlay */}
      {activeProfileDev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-xl">
            <GlassCard hoverEffect={false} className="border-slate-800/80 bg-slate-950/60 p-6 space-y-6 relative">
              <button 
                onClick={() => setActiveProfileDev(null)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded hover:bg-slate-900"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-4 border-b border-slate-900 pb-4">
                <img src={activeProfileDev.developer.avatar} alt={activeProfileDev.developer.name} className="w-16 h-16 rounded-full border border-slate-800 bg-slate-900" />
                <div>
                  <h3 className="text-sm font-bold text-white">{activeProfileDev.developer.name}</h3>
                  <p className="text-[10px] text-slate-400">{activeProfileDev.developer.college}</p>
                  <div className="flex gap-1.5 mt-2">
                    <Badge variant="accent">AI Match: {activeProfileDev.match.overall}%</Badge>
                    <Badge variant="slate">{activeProfileDev.developer.preferredRole}</Badge>
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Biography</h4>
                  <p className="text-slate-200 leading-relaxed bg-slate-900/30 border border-slate-900 p-3 rounded-xl">
                    {activeProfileDev.developer.bio || "No biography details yet."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Availability</h4>
                    <p className="text-slate-200">{activeProfileDev.developer.availability}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Experience</h4>
                    <p className="text-slate-200">{activeProfileDev.developer.experience}</p>
                  </div>
                </div>

                {/* Compatibility Audit */}
                <div className="space-y-3 bg-indigo-950/10 border border-indigo-500/20 p-4 rounded-xl">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-1.5 text-[9px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Compatibility Breakdown
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex justify-between border-b border-indigo-550/10 pb-1">
                      <span className="text-slate-400">Skill Complement</span>
                      <span className="font-bold text-slate-250">{activeProfileDev.match.skills}%</span>
                    </div>
                    <div className="flex justify-between border-b border-indigo-550/10 pb-1">
                      <span className="text-slate-400">Interest Alignment</span>
                      <span className="font-bold text-slate-250">{activeProfileDev.match.interests}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Availability Sync</span>
                      <span className="font-bold text-slate-250">{activeProfileDev.match.availability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Communication Sync</span>
                      <span className="font-bold text-slate-250">{activeProfileDev.match.communication}%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-3 pt-2.5 border-t border-indigo-500/10">
                    <span className="text-[9px] font-bold text-indigo-300 block uppercase tracking-wide">Key Strength:</span>
                    <ul className="list-disc pl-4 text-[10px] text-slate-350 space-y-0.5">
                      {activeProfileDev.match.strengths.map((str: string, index: number) => (
                        <li key={index}>{str}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-2">
                  {activeProfileDev.developer.github && (
                    <a href={`https://github.com/${activeProfileDev.developer.github}`} target="_blank" rel="noreferrer" className="text-slate-450 hover:text-slate-200 flex items-center gap-1">
                      <Github className="w-4 h-4" />
                      <span className="text-[10px]">{activeProfileDev.developer.github}</span>
                    </a>
                  )}
                  {activeProfileDev.developer.linkedin && (
                    <a href={`https://linkedin.com/in/${activeProfileDev.developer.linkedin}`} target="_blank" rel="noreferrer" className="text-slate-450 hover:text-slate-250 flex items-center gap-1">
                      <Linkedin className="w-4 h-4" />
                      <span className="text-[10px]">LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
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
