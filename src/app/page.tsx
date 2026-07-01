"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Users, 
  Compass, 
  BrainCircuit, 
  ChevronDown, 
  Zap, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  BookmarkCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      title: "AI Compatibility Matching",
      description: "Analyze technical profiles, code styles, and schedules to find compatible partners with a unified compatibility index."
    },
    {
      icon: <Compass className="w-6 h-6 text-accent" />,
      title: "Problem Statement Analyzer",
      description: "Audit hackathon prompts automatically. Generate summaries, recommended role splits, and structured study roadmaps."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-success" />,
      title: "Skill Gap Analysis",
      description: "Compare your current skills with problem requirements to outline missing concepts, study priorities, and match tutors."
    },
    {
      icon: <Users className="w-6 h-6 text-secondary" />,
      title: "AI Team Builder",
      description: "Input a target problem statement and generate a recommended team from the developer pool to maximize winning odds."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Create Your Profile",
      desc: "Connect your GitHub and specify your stack expertise, design styles, and weekly hackathon availability."
    },
    {
      num: "02",
      title: "Explore Hackathons",
      desc: "Browse global developer events and let the AI index and break down complex engineering tracks."
    },
    {
      num: "03",
      title: "Run AI Teammate Match",
      desc: "Receive curated developer cards, compare compatibility stats, and invite developers to join your squad."
    },
    {
      num: "04",
      title: "Form Teams & Win",
      desc: "Coordinate tasks using real-time channels, address skill gaps with roadmap pointers, and ship winning prototypes."
    }
  ];

  const stats = [
    { value: "10,000+", label: "Developers Registered" },
    { value: "450+", label: "Teams Formed via AI" },
    { value: "$1.2M+", label: "Total Hackathon Prize Pools" },
    { value: "94%", label: "Satisfaction Rate" }
  ];

  const testimonials = [
    {
      quote: "HackMatch AI changed how we compete. The Skill Gap tool recommended learning courses that helped us write our Foundry tests in 12 hours.",
      author: "Aditya Roy",
      role: "Ethereum Hackathon Winner",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=aditya"
    },
    {
      quote: "We generated our entire backend-frontend roster in minutes. The matching score accurately predicted how our work paces aligned.",
      author: "Chloe Vance",
      role: "Techstars Builder",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=chloe"
    }
  ];

  const faqs = [
    {
      q: "How does the AI Compatibility Score work?",
      a: "It parses your technical stacks, experience levels, and availability metrics, performing an intersection and complement query to ensure teams are both technically complete and collaborative."
    },
    {
      q: "Is it free to browse hackathons and message developers?",
      a: "Yes! HackMatch AI is completely free for student developers participating in community and collegiate hackathons."
    },
    {
      q: "Can I use it to find designers or just developers?",
      a: "Our roles include UI/UX Designers, Product Managers, Backend/Frontend Devs, and Blockchain/AI Architects, ensuring comprehensive team building."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navbar Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-900/60 bg-dark-bg/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-200 via-white to-cyan-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              HackMatch <span className="text-accent font-semibold">AI</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-100 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-slate-100 transition-colors">Stories</a>
            <a href="#faq" className="hover:text-slate-100 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="primary" size="sm" className="hidden sm:inline-flex">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:py-32">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-7 flex flex-col items-start text-left space-y-6">
            <Badge variant="primary" className="py-1 px-3 flex items-center gap-1.5 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Hackathon Companion</span>
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] animate-slide-up">
              Build Your Perfect <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Hackathon Team
              </span> with AI
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Discover local and global hackathons, audit complex engineering tracks, assess skill gaps, and match with compatible student builders using structured compatibility metrics.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="shadow-indigo-500/20 group">
                  Get Started for Free
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg">
                  Browse Hackathons
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="md:col-span-5 relative w-full aspect-square md:aspect-auto md:h-[450px] flex items-center justify-center">
            <div className="relative w-full max-w-[400px] glass-panel p-6 rounded-2xl shadow-2xl border-slate-800/80 bg-slate-950/40 relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>
                <div className="text-xs font-semibold text-accent flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>AI MATCH ENGINE</span>
                </div>
              </div>

              {/* Central User Badge */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-xs font-bold">VM</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">You (Fullstack)</h4>
                    <p className="text-[10px] text-slate-400">React, Node, Solidity</p>
                  </div>
                </div>
                <Badge variant="accent">Online</Badge>
              </div>

              {/* Connecting Lines Graphic */}
              <div className="flex justify-center my-4">
                <div className="w-[1px] h-8 bg-gradient-to-b from-indigo-500 via-cyan-500 to-purple-500 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
              </div>

              {/* Matching Teammate Card */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/30 shadow-indigo-950/10 mb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-xs font-bold">SC</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">Sarah C.</h4>
                      <p className="text-[10px] text-slate-400">Python, LangChain, ML</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-indigo-400 block">AI SCORE</span>
                    <span className="text-xs font-bold text-white">96%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: '96%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="py-20 border-t border-slate-900 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="accent">Features</Badge>
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Packed with features to build winners
            </h2>
            <p className="text-sm text-slate-400">
              Go from scanning project instructions to organizing tasks and calculating optimal rosters with specific tools built for hackathons.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <GlassCard key={i} className="hover:scale-[1.01] transition-transform">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl w-fit mb-5">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="secondary">Process</Badge>
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              How HackMatch AI Works
            </h2>
            <p className="text-sm text-slate-400">
              Getting set up takes 5 minutes. Discover, team up, learn, and deliver.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((s, i) => (
              <div key={i} className="relative space-y-4">
                <div className="text-5xl font-black bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent select-none">
                  {s.num}
                </div>
                <h3 className="text-base font-bold text-slate-200">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 border-t border-slate-900 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {st.value}
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="success">Testimonials</Badge>
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Endorsed by Hackathon Veterans
            </h2>
            <p className="text-sm text-slate-400">
              See how collegiate teams use HackMatch to score podium finishes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <GlassCard key={i} className="flex flex-col justify-between hover:scale-[1.01]">
                <p className="text-xs italic text-slate-300 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{t.author}</h4>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      <section id="faq" className="py-20 border-t border-slate-900 bg-slate-950/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <Badge variant="slate">FAQ</Badge>
            <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="border border-slate-850 rounded-xl overflow-hidden glass-panel"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-900/60 pt-4 animate-fade-in bg-slate-900/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <footer className="border-t border-slate-900 bg-slate-950/60 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              HackMatch <span className="text-accent font-semibold">AI</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} HackMatch AI. Built for developers globally.
          </p>

          <div className="flex gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
