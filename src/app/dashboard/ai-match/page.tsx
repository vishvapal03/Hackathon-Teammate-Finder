"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BrainCircuit, 
  Sparkles, 
  Search, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Cpu,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Toast } from '@/components/ui/Toast';

export default function AiMatchPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

  const loadMatches = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/match?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to load matching candidates");
      const data = await res.json();
      setMatches(data);
      if (data.length > 0) {
        setSelectedMatch(data[0]); // select top match by default
      }
    } catch (err: any) {
      setToast({ show: true, message: err.message || 'Failed to load matching profiles.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      loadMatches(parsed.id);
    }
  }, []);

  const handleRecalculate = () => {
    if (!user) return;
    setToast({ show: true, message: "Recalculating compatibility scores using LLM parameters...", type: 'success' });
    setTimeout(() => {
      loadMatches(user.id);
    }, 1000);
  };

  const handleConnect = (devId: string) => {
    router.push(`/dashboard/messages?connectWith=${devId}`);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
            AI Compatibility Matcher
          </h1>
          <p className="text-xs text-slate-400">Evaluate candidates with complementary tech stacks, aligned interests, and schedules.</p>
        </div>

        <Button variant="accent" size="sm" onClick={handleRecalculate} disabled={loading}>
          <Cpu className="w-4 h-4" />
          Find Best Team
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <p className="text-xs text-slate-400">Running compatibility matrix scans...</p>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <GlassCard hoverEffect={false} className="py-12 text-center text-slate-400">
          No candidate matching profiles found in database. Complete your profile details to unlock recommendation engines.
        </GlassCard>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left panel: list of recommended builders */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider px-1">Top Matches</h3>
            
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
              {matches.map((m) => {
                const dev = m.developer;
                const score = m.match.overall;
                const isSelected = selectedMatch?.developer.id === dev.id;

                return (
                  <div
                    key={dev.id}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected 
                        ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' 
                        : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/50 hover:border-slate-800'
                    }`}
                    onClick={() => setSelectedMatch(m)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={dev.avatar} alt={dev.name} className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900 flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-100 truncate">{dev.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{dev.preferredRole}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[9px] font-bold text-indigo-400 block">AI MATCH</span>
                      <span className="text-sm font-black text-white">{score}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: compatibility report cards */}
          {selectedMatch && (
            <div className="lg:col-span-7 space-y-6 animate-fade-in">
              <h3 className="text-xs font-bold text-slate-355 uppercase tracking-wider">Audit Report: {selectedMatch.developer.name}</h3>

              <GlassCard hoverEffect={false} className="border-slate-800 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-900">
                  <div className="flex items-center gap-3">
                    <img src={selectedMatch.developer.avatar} alt={selectedMatch.developer.name} className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{selectedMatch.developer.name}</h4>
                      <p className="text-[10px] text-slate-400">{selectedMatch.developer.college}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleConnect(selectedMatch.developer.id)}>
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </Button>
                  </div>
                </div>

                {/* Compatibility percentages bars */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metrics Breakdown</h4>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Technical Stack Intersection</span>
                        <span className="font-semibold text-slate-205">{selectedMatch.match.skills}%</span>
                      </div>
                      <ProgressBar value={selectedMatch.match.skills} variant="primary" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Interest Compatibility</span>
                        <span className="font-semibold text-slate-205">{selectedMatch.match.interests}%</span>
                      </div>
                      <ProgressBar value={selectedMatch.match.interests} variant="accent" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Availability Sync</span>
                        <span className="font-semibold text-slate-205">{selectedMatch.match.availability}%</span>
                      </div>
                      <ProgressBar value={selectedMatch.match.availability} variant="secondary" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Communication Alignment</span>
                        <span className="font-semibold text-slate-205">{selectedMatch.match.communication}%</span>
                      </div>
                      <ProgressBar value={selectedMatch.match.communication} variant="success" />
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses list */}
                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-900">
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Synergy Strengths
                    </h4>
                    <ul className="list-disc pl-4 text-xs text-slate-300 space-y-2">
                      {selectedMatch.match.strengths.map((str: string, i: number) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[9px] font-bold text-error uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      Potential Gaps
                    </h4>
                    <ul className="list-disc pl-4 text-xs text-slate-300 space-y-2">
                      {selectedMatch.match.weaknesses.map((w: string, i: number) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suggested improvements */}
                <div className="bg-indigo-950/10 border border-indigo-500/15 p-4 rounded-xl space-y-2.5">
                  <h4 className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Suggested AI Roadmaps
                  </h4>
                  <ol className="list-decimal pl-4 text-xs text-slate-300 space-y-1.5">
                    {selectedMatch.match.improvements.map((imp: string, i: number) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ol>
                </div>

              </GlassCard>
            </div>
          )}

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
