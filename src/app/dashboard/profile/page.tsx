"use client";

import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Github, 
  Linkedin, 
  Globe, 
  FileText,
  Save,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toast } from '@/components/ui/Toast';

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });
  
  // Form fields
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('Intermediate');
  const [preferredRole, setPreferredRole] = useState('Fullstack Developer');
  const [availability, setAvailability] = useState('High (15-20 hrs/week)');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  
  // Dynamic skill/interest inputs
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setName(parsed.name || '');
      setCollege(parsed.college || '');
      setDegree(parsed.degree || '');
      setYear(parsed.year || '1st Year');
      setBio(parsed.bio || '');
      setExperience(parsed.experience || 'Intermediate');
      setPreferredRole(parsed.preferredRole || 'Fullstack Developer');
      setAvailability(parsed.availability || 'High (15-20 hrs/week)');
      setGithub(parsed.github || '');
      setLinkedin(parsed.linkedin || '');
      setPortfolio(parsed.portfolio || '');
      setSkills(parsed.skills || []);
      setInterests(parsed.interests || []);
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const updatedProfile = {
      id: user.id,
      name,
      college,
      degree,
      year,
      bio,
      experience,
      preferredRole,
      availability,
      github,
      linkedin,
      portfolio,
      skills,
      interests
    };

    try {
      const res = await fetch('/api/developers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }

      setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
      
      // Update local storage
      const refreshedUser = { ...user, ...data.user };
      localStorage.setItem('currentUser', JSON.stringify(refreshedUser));
      setUser(refreshedUser);
    } catch (err: any) {
      setToast({ show: true, message: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.some(s => s.toLowerCase() === newSkill.trim().toLowerCase())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.some(i => i.toLowerCase() === newInterest.trim().toLowerCase())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(i => i !== interestToRemove));
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-400" />
          Edit Developer Profile
        </h1>
        <p className="text-xs text-slate-400">Update your details to help the AI pair you with compatible hackathon teams.</p>
      </div>

      <form onSubmit={handleSave} className="grid md:grid-cols-12 gap-8">
        
        {/* Left column: Avatar and Resume */}
        <div className="md:col-span-4 space-y-6">
          <GlassCard hoverEffect={false} className="flex flex-col items-center text-center p-6 border-slate-800">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border border-slate-700 bg-slate-900 shadow-xl mb-4" />
            <h3 className="text-xs font-bold text-slate-200">{name}</h3>
            <p className="text-[10px] text-slate-500">{user.email}</p>
            <Badge variant="accent" className="mt-3">{preferredRole}</Badge>
          </GlassCard>

          <GlassCard hoverEffect={false} className="p-5 border-slate-850">
            <h4 className="text-xs font-bold text-slate-250 flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-purple-400" />
              Resume Attachment
            </h4>
            <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-purple-500/40 cursor-pointer transition-colors">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-[10px] text-slate-400 font-medium">Click to upload resume PDF</p>
              <span className="text-[9px] text-slate-500 block mt-0.5">Max size: 5MB</span>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Form fields */}
        <div className="md:col-span-8 space-y-6">
          <GlassCard hoverEffect={false} className="space-y-6 border-slate-800">
            
            {/* General section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-2">General Information</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">University / College</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Degree & Major</label>
                  <input
                    type="text"
                    placeholder="B.Tech Computer Science"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Year of Study</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-250 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Bio / Description</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Tell potential teammates about your interests, work pace, and hackathon milestones..."
                />
              </div>
            </div>

            {/* Experience and Role Preferences */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-2">Roster Ranks</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Experience Level</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-250 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Preferred Role</label>
                  <select
                    value={preferredRole}
                    onChange={(e) => setPreferredRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-250 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Fullstack Developer">Fullstack Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="AI/ML Engineer">AI/ML Engineer</option>
                    <option value="Blockchain Engineer">Blockchain Engineer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Weekly Availability</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-255 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Low (5-10 hrs/week)">Low (5-10 hrs/week)</option>
                    <option value="Medium (10-15 hrs/week)">Medium (10-15 hrs/week)</option>
                    <option value="High (15-20 hrs/week)">High (15-20 hrs/week)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Skills & Tags Chips */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-2">Skills & Interests</h3>
              
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Skills (e.g. React, Python)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-colors grow"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map(s => (
                    <Badge key={s} variant="primary" className="gap-1 px-2.5 py-1">
                      {s}
                      <X className="w-3 h-3 cursor-pointer text-indigo-400 hover:text-white" onClick={() => removeSkill(s)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Interests (e.g. IoT, Healthcare)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    placeholder="Add an interest"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-colors grow"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addInterest}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {interests.map(i => (
                    <Badge key={i} variant="accent" className="gap-1 px-2.5 py-1">
                      {i}
                      <X className="w-3 h-3 cursor-pointer text-cyan-400 hover:text-white" onClick={() => removeInterest(i)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Social handles */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-2">Social Channels</h3>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Username</span>
                  </div>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Handle</span>
                  </div>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio Website</span>
                  </div>
                  <input
                    type="text"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>

          </GlassCard>
        </div>

      </form>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
