"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Search, 
  MapPin, 
  Calendar, 
  Award, 
  Users, 
  BrainCircuit,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch('/api/hackathons');
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        setHackathons(data);
      } catch (err: any) {
        setToast({ show: true, message: err.message || 'Error loading events.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const toggleSave = (id: string) => {
    const active = savedIds.includes(id);
    if (active) {
      setSavedIds(savedIds.filter(item => item !== id));
      setToast({ show: true, message: "Hackathon removed from saved list.", type: 'info' });
    } else {
      setSavedIds([...savedIds, id]);
      setToast({ show: true, message: "Hackathon saved to dashboard highlights!", type: 'success' });
    }
  };

  const domains = ["All", "AI", "Blockchain", "Web Development", "IoT", "Cyber Security", "Healthcare", "AR/VR", "Open Innovation"];

  const filtered = hackathons.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || 
                          h.organizer.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || h.domain.toLowerCase() === selectedDomain.toLowerCase();
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-indigo-400" />
          Hackathon Companion
        </h1>
        <p className="text-xs text-slate-400">Discover events, bookmark challenges, and let the AI scan problem requirements to design rosters.</p>
      </div>

      {/* Filter and search bar */}
      <GlassCard hoverEffect={false} className="border-slate-800 bg-slate-950/20 p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search hackathons by event name or organizer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-850 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-250 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {domains.slice(0, 5).map(d => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedDomain === d
                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Renders Hackathons */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No hackathons found" description="Try selecting another domain or search query." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-8">
          {filtered.map((h) => {
            const isSaved = savedIds.includes(h.id);
            return (
              <GlassCard key={h.id} className="flex flex-col overflow-hidden p-0 hover:border-indigo-500/20">
                
                {/* Banner Banner */}
                <div className="relative h-44 w-full">
                  <img src={h.banner} alt={h.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Domain tag */}
                  <Badge variant="accent" className="absolute top-4 left-4 font-bold">{h.domain}</Badge>

                  {/* Bookmark Button */}
                  <button 
                    onClick={() => toggleSave(h.id)}
                    className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-indigo-400 backdrop-blur-sm border border-slate-800 transition-colors cursor-pointer"
                  >
                    <Bookmark className={`w-4.5 h-4.5 ${isSaved ? 'fill-indigo-500 text-indigo-500' : ''}`} />
                  </button>
                </div>

                {/* Info Container */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-100">{h.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{h.organizer}</p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>Deadline: {h.registrationDeadline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>Venue: {h.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-205">{h.prizePool}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span>Teams: {h.minTeamSize}-{h.maxTeamSize} builders</span>
                      </div>
                    </div>
                  </div>

                  {/* Action link */}
                  <div className="flex gap-3 border-t border-slate-900 pt-4 mt-auto">
                    <Link href={`/dashboard/hackathons/${h.id}`} className="w-full">
                      <Button variant="primary" size="sm" className="w-full text-xs font-bold gap-1.5">
                        <BrainCircuit className="w-4 h-4" />
                        Analyze Problem Statements
                      </Button>
                    </Link>
                  </div>

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
