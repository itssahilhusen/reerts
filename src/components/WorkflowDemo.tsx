"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Rss, 
  Pencil, 
  Send, 
  BarChart3, 
  Sliders, 
  Check, 
  ArrowRight, 
  Copy, 
  Calendar, 
  TrendingUp, 
  Eye, 
  MessageCircle, 
  Share2, 
  Compass, 
  UserCheck, 
  Plus,
  Clock,
  ExternalLink
} from "lucide-react";

export function WorkflowDemo() {
  const steps = [
    { id: "discover", label: "Discover", title: "Find high-converting content ideas automatically" },
    { id: "persona", label: "Brand Voice", title: "Lock into your authentic writing persona" },
    { id: "draft", label: "Create Draft", title: "Generate multi-platform drafts and carousels" },
    { id: "schedule", label: "Multi-Publish", title: "Queue across all social platforms at optimal hours" },
    { id: "analyze", label: "Analytics", title: "Turn performance data into your next viral post" },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto step progression every 6 seconds if user hasn't paused
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoPlay, steps.length]);

  return (
    <section id="workflow-demo" className="border-t border-border px-4 py-20 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logos/logo-light-svg.svg"
            alt="reerts"
            width={32}
            height={32}
            className="rounded-md dark:hidden"
          />
          <Image
            src="/images/logos/logo-dark-svg.svg"
            alt="reerts"
            width={32}
            height={32}
            className="rounded-md hidden dark:block"
          />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          See reerts in action
        </h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          A continuous loop from topic discovery to published multi-platform posts and feedback analysis.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-5xl">
        {/* Step Selector Pills Bar */}
        <div 
          className="mx-auto flex w-full max-w-5xl items-stretch gap-1 rounded-xl bg-muted/60 p-1.5 shadow-2xs"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          {steps.map((st, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setActiveStep(idx);
                  setAutoPlay(false);
                }}
                className={`relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-lg px-2 py-2.5 text-xs font-semibold transition-all md:text-sm ${
                  isActive
                    ? "bg-background text-foreground shadow-xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="hidden md:inline">{st.label}</span>

                {/* Animated progress underline */}
                {isActive && autoPlay && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary animate-[pulse_6s_linear_infinite]" />
                )}
              </button>
            );
          })}
        </div>

        {/* macOS Window Shell */}
        <div className="relative mx-auto mt-6 w-full max-w-5xl md:mt-8">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl" />

          <div
            role="group"
            className="w-full select-none overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
          >
            {/* Window Title Bar */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                <Image
                  src="/images/logos/logo-light-svg.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="rounded dark:hidden"
                />
                <Image
                  src="/images/logos/logo-dark-svg.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="rounded hidden dark:block"
                />
                reerts • {steps[activeStep].label}
              </span>
            </div>

            {/* Window Body: Sidebar + Main Stage */}
            <div className="flex min-h-[38rem] md:min-h-[42rem] flex-col md:flex-row">
              {/* Left Mini Sidebar */}
              <div className="w-full md:w-56 shrink-0 border-r border-border bg-muted/20 p-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Workspace
                  </div>
                  <button
                    onClick={() => setActiveStep(0)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      activeStep === 0 ? "bg-card text-foreground shadow-2xs font-semibold border border-border" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Compass className="h-4 w-4 text-amber-500" />
                    <span>Discover</span>
                  </button>
                  <button
                    onClick={() => setActiveStep(1)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      activeStep === 1 ? "bg-card text-foreground shadow-2xs font-semibold border border-border" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserCheck className="h-4 w-4 text-purple-500" />
                    <span>Brand Persona</span>
                  </button>
                  <button
                    onClick={() => setActiveStep(2)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      activeStep === 2 ? "bg-card text-foreground shadow-2xs font-semibold border border-border" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Pencil className="h-4 w-4 text-blue-500" />
                    <span>Drafts &amp; Carousels</span>
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      activeStep === 3 ? "bg-card text-foreground shadow-2xs font-semibold border border-border" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <span>Multi-Scheduler</span>
                  </button>
                  <button
                    onClick={() => setActiveStep(4)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                      activeStep === 4 ? "bg-card text-foreground shadow-2xs font-semibold border border-border" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 text-rose-500" />
                    <span>Analytics Loop</span>
                  </button>
                </div>

                <div className="hidden md:block pt-4 border-t border-border">
                  <div className="rounded-lg bg-primary/5 p-2.5 border border-primary/20 text-[11px]">
                    <div className="font-semibold text-foreground">AI Credits: 450</div>
                    <div className="text-muted-foreground text-[10px]">Renews in 18 days</div>
                  </div>
                </div>
              </div>

              {/* Main Stage Canvas */}
              <div className="flex-1 p-6 md:p-8 bg-card overflow-y-auto">
                {/* 1. DISCOVER STAGE */}
                {activeStep === 0 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Content Discovery Stream</h3>
                        <p className="text-xs text-muted-foreground">AI continuously filters viral angles from your niche across social channels.</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">
                        ● 14 New Signals
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-border bg-background p-4 space-y-3 hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <Image src="/images/platforms/threads.svg" alt="" width={16} height={16} className="dark:invert" />
                            Threads • Breakout Post
                          </span>
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">98 Virality</span>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                          "Most SaaS founders spend 90% of their time coding features and 10% on distribution. Flip this ratio: 4 tactical rules we used to reach $50k MRR..."
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40">
                          <span>14.2k views • 380 comments</span>
                          <button 
                            onClick={() => setActiveStep(2)}
                            className="flex items-center gap-1 font-bold text-primary hover:underline"
                          >
                            1-Click Draft <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4 space-y-3 hover:border-primary/40 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <Image src="/images/platforms/linkedin.svg" alt="" width={16} height={16} />
                            LinkedIn • Industry Trend
                          </span>
                          <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">94 Virality</span>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                          "Why every B2B company is firing agencies and moving social marketing into internal automated founder systems in 2026."
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40">
                          <span>28.9k views • 512 reposts</span>
                          <button 
                            onClick={() => setActiveStep(2)}
                            className="flex items-center gap-1 font-bold text-primary hover:underline"
                          >
                            1-Click Draft <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PERSONA STAGE */}
                {activeStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Brand Persona Settings</h3>
                        <p className="text-xs text-muted-foreground">Trained on your historical top posts to preserve your unique syntax and pacing.</p>
                      </div>
                      <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-600">
                        Persona: "Founder Direct"
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-xl border border-border bg-background p-5 space-y-4">
                        <h4 className="font-semibold text-sm text-foreground">Tone &amp; Cadence Matrix</h4>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Pacing &amp; Sentence Length</span>
                            <span className="font-bold text-primary">Punchy &amp; Direct</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full w-[85%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Vocabulary Conviction</span>
                            <span className="font-bold text-purple-600">Unfiltered / Tactical</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full w-[90%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Emoji Density</span>
                            <span className="font-bold text-muted-foreground">Minimal (max 1 per post)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full w-[25%]" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-5 space-y-3">
                        <h4 className="font-semibold text-sm text-foreground">Generated Voice Sample</h4>
                        <div className="rounded-lg bg-muted/40 p-3 text-xs text-foreground font-mono leading-relaxed">
                          "Most startup advice is fluff. If your organic distribution takes more than 15 minutes a day, you're not marketing—you're procrastinating. Here are 3 automation rules we live by:"
                        </div>
                        <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                          <Check className="h-4 w-4" />
                          <span>Persona similarity match: 99.4%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. DRAFT & CAROUSEL STAGE */}
                {activeStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Multi-Format Post Studio</h3>
                        <p className="text-xs text-muted-foreground">Drafted in your persona, automatically tailored for LinkedIn, X, Threads &amp; Carousels.</p>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600">LinkedIn</span>
                        <span className="rounded bg-zinc-500/10 px-2 py-0.5 text-xs font-semibold text-foreground">X</span>
                        <span className="rounded bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600">Carousel</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      <div className="md:col-span-7 rounded-xl border border-border bg-background p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                          <span className="font-semibold text-foreground">Post Editor (Ready to Queue)</span>
                          <span className="rounded bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 text-[10px]">Hook Score: 98/100</span>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                          Stop doing manual social media marketing in 2026.
                          
                          Indie founders who win don't spend 4 hours drafting posts every day. They run a 10-minute automated pipeline:
                          
                          1. Auto-collect proven viral signals
                          2. Lock down a signature brand persona
                          3. Generate formatted slide carousels in 1 click
                          4. Auto-deliver lead magnets via DMs when followers comment
                          
                          We automated ours and reached 140k impressions last month.
                        </p>
                        <div className="pt-2 flex items-center justify-between border-t border-border/50 text-xs">
                          <span className="text-muted-foreground text-[11px]">Channels: LinkedIn, X, Threads</span>
                          <button
                            onClick={() => setActiveStep(3)}
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                          >
                            Schedule Post
                          </button>
                        </div>
                      </div>

                      {/* Carousel Thumbnail Preview */}
                      <div className="md:col-span-5 rounded-xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-4 space-y-3 shadow-md">
                        <span className="text-[10px] font-bold text-primary uppercase">Generated Carousel Deck</span>
                        <div className="aspect-[4/5] rounded-lg border border-border bg-card p-4 flex flex-col justify-between shadow-xs">
                          <span className="text-[10px] font-semibold text-muted-foreground">Slide 1 / 5</span>
                          <p className="text-sm font-bold text-foreground leading-snug">
                            The 10-Minute Marketing System for High-Growth Founders.
                          </p>
                          <span className="text-[10px] font-semibold text-primary">Swipe &rarr;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. MULTI-PUBLISH STAGE */}
                {activeStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Multi-Channel Queue</h3>
                        <p className="text-xs text-muted-foreground">Auto-distributed across peak engagement time slots for each platform.</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">
                        Peak Time Smart Optimizer Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                          <span>Monday</span>
                          <span className="text-muted-foreground text-[11px]">09:15 AM</span>
                        </div>
                        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-2.5 text-xs space-y-1">
                          <div className="flex items-center gap-1 font-bold text-blue-700 dark:text-blue-300 text-[10px]">
                            <Image src="/images/platforms/linkedin.svg" alt="" width={12} height={12} /> LinkedIn Post
                          </div>
                          <p className="text-[11px] text-foreground font-medium line-clamp-2">The 10-Minute Marketing System...</p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                          <span>Tuesday</span>
                          <span className="text-muted-foreground text-[11px]">02:30 PM</span>
                        </div>
                        <div className="rounded-lg bg-zinc-500/10 border border-border p-2.5 text-xs space-y-1">
                          <div className="flex items-center gap-1 font-bold text-foreground text-[10px]">
                            <Image src="/images/platforms/x-light.svg" alt="" width={12} height={12} /> X Thread (5 tweets)
                          </div>
                          <p className="text-[11px] text-foreground font-medium line-clamp-2">How we reached 140k impressions...</p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                          <span>Wednesday</span>
                          <span className="text-muted-foreground text-[11px]">06:00 PM</span>
                        </div>
                        <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-2.5 text-xs space-y-1">
                          <div className="flex items-center gap-1 font-bold text-purple-700 dark:text-purple-300 text-[10px]">
                            <Image src="/images/platforms/threads.svg" alt="" width={12} height={12} className="dark:invert" /> Threads Post
                          </div>
                          <p className="text-[11px] text-foreground font-medium line-clamp-2">Behind the scenes founder notes...</p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                          <span>Thursday</span>
                          <span className="text-muted-foreground text-[11px]">11:00 AM</span>
                        </div>
                        <div className="rounded-lg bg-pink-500/10 border border-pink-500/20 p-2.5 text-xs space-y-1">
                          <div className="flex items-center gap-1 font-bold text-pink-700 dark:text-pink-300 text-[10px]">
                            <Image src="/images/platforms/instagram.svg" alt="" width={12} height={12} /> Instagram Carousel
                          </div>
                          <p className="text-[11px] text-foreground font-medium line-clamp-2">5-Slide Playbook Deck...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. ANALYTICS & REVIEW STAGE */}
                {activeStep === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Unified Performance Analytics</h3>
                        <p className="text-xs text-muted-foreground">Turns organic reach into next week's automated content ideas.</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <TrendingUp className="h-3.5 w-3.5" />
                        +34.2% vs previous week
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-xl border border-border bg-background p-4 space-y-1">
                        <span className="text-xs text-muted-foreground">Total Impressions</span>
                        <div className="text-2xl font-bold text-foreground">142,850</div>
                        <span className="text-[10px] text-emerald-600 font-semibold">+41,200 organic</span>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4 space-y-1">
                        <span className="text-xs text-muted-foreground">Automated DMs Delivered</span>
                        <div className="text-2xl font-bold text-foreground">1,842</div>
                        <span className="text-[10px] text-blue-600 font-semibold">100% official API</span>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4 space-y-1">
                        <span className="text-xs text-muted-foreground">New Email Leads</span>
                        <div className="text-2xl font-bold text-foreground">624</div>
                        <span className="text-[10px] text-purple-600 font-semibold">33.8% conversion</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                      <span className="text-xs font-semibold text-foreground">Next Week Automated Recommendations:</span>
                      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-foreground flex items-center justify-between">
                        <span>Carousels on LinkedIn drove 68% of new follower conversions. Auto-scheduling 2 more next week.</span>
                        <span className="rounded bg-primary text-primary-foreground font-semibold px-2 py-0.5 text-[10px]">Queued</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
