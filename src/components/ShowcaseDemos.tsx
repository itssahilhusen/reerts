"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Check, 
  MessageSquare, 
  Rss, 
  Repeat, 
  Calendar, 
  Bookmark, 
  Search, 
  ShieldCheck, 
  Layers, 
  Send, 
  Share2, 
  Sliders, 
  TrendingUp, 
  Clock, 
  Lock, 
  ChevronRight, 
  Smile, 
  Heart 
} from "lucide-react";

export function ShowcaseDemos() {
  const [carouselRatio, setCarouselRatio] = useState<"4:5" | "1:1" | "9:16">("4:5");
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section id="showcase-demos" className="border-t border-border py-20 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center mb-16">
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
          Wait, it does that too?
        </h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          Built specifically for high-velocity founders and agencies who demand maximum distribution with minimal overhead.
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-20 lg:gap-28 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ROW 1: AI Carousel Maker */}
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
              <Image src="/images/logos/logo-light-svg.svg" alt="" width={14} height={14} className="dark:hidden" />
              <Image src="/images/logos/logo-dark-svg.svg" alt="" width={14} height={14} className="hidden dark:block" />
              AI Carousel Maker
            </span>

            <h3 className="text-3xl font-bold tracking-tight text-balance leading-tight md:text-4xl text-foreground">
              Links, text, or a topic —<br />
              <span className="text-primary">carousels, fully designed</span>
            </h3>

            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Drop in an article, blog, YouTube or social post link, a PDF or Word file, a note, or a one-line topic. AI plans every slide and handles the copy, images, and design. Paste a link to a carousel you want to benchmark to extract its design as a template, and schedule the result to multiple channels at once.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <Image src="/images/platforms/instagram.svg" alt="Instagram" width={22} height={22} />
              <Image src="/images/platforms/threads.svg" alt="Threads" width={22} height={22} className="dark:invert" />
              <Image src="/images/platforms/linkedin.svg" alt="LinkedIn" width={22} height={22} />
              <Image src="/images/platforms/x-light.svg" alt="X" width={22} height={22} />
              <Image src="/images/platforms/facebook.svg" alt="Facebook" width={22} height={22} />
              <Image src="/images/platforms/tiktok-light.svg" alt="TikTok" width={22} height={22} />
            </div>

            <Link
              href="#pricing"
              className="mt-6 inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Demo 1 Mockup: macOS Window */}
          <div className="w-full lg:pl-4">
            <div className="relative isolate w-full">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl" />
              <div className="w-full select-none overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
                <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI Carousel Maker
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Top Bar with ratio selector */}
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">Ratio:</span>
                      <div className="flex gap-1">
                        {(["4:5", "1:1", "9:16"] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setCarouselRatio(r)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              carouselRatio === r ? "bg-primary text-primary-foreground font-bold" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                      5 Slides Ready
                    </span>
                  </div>

                  {/* Carousel Live Slide Preview */}
                  <div className="flex items-center justify-center p-3 bg-muted/30 rounded-xl">
                    <div className="w-64 aspect-[4/5] rounded-xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-4 flex flex-col justify-between shadow-lg relative">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span className="font-bold text-foreground">@founder_growth</span>
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">Slide {activeSlide + 1}/5</span>
                      </div>
                      <div className="my-auto py-2">
                        <p className="text-xs font-bold text-foreground leading-snug">
                          {activeSlide === 0
                            ? "Stop doing manual social media marketing in 2026."
                            : activeSlide === 1
                            ? "Step 1: Auto-collect viral angles from your niche."
                            : activeSlide === 2
                            ? "Step 2: Train a signature brand voice persona."
                            : activeSlide === 3
                            ? "Step 3: 1-Click Multi-channel distribution."
                            : "Step 4: Auto-DM lead magnets to every commenter."}
                        </p>
                      </div>
                      <div className="text-[9px] text-primary flex items-center justify-between font-semibold">
                        <span>reerts Engine</span>
                        <span>Swipe &rarr;</span>
                      </div>
                    </div>
                  </div>

                  {/* Slide Pills */}
                  <div className="flex gap-1.5 justify-center">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        className={`h-1.5 rounded-full transition-all ${activeSlide === i ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Comment Auto-DM (iPhone Mockup) */}
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:order-2">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
              Comment Auto-DM
            </span>

            <h3 className="text-3xl font-bold tracking-tight text-balance leading-tight md:text-4xl text-foreground">
              A comment comes in,<br />
              <span className="text-primary">DMs, replies and emails go out automatically</span>
            </h3>

            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Set automated keyword triggers on your Instagram and LinkedIn posts. When followers comment a keyword like "TEMPLATE" or "GROWTH", reerts auto-replies to the comment and delivers the resource directly to their private messages.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <Image src="/images/platforms/instagram.svg" alt="Instagram" width={22} height={22} />
              <Image src="/images/platforms/facebook.svg" alt="Facebook" width={22} height={22} />
            </div>

            <Link
              href="#pricing"
              className="mt-6 inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Demo 2 Mockup: Realistic iPhone 3D Bezel */}
          <div className="w-full lg:order-1 lg:pr-4 flex justify-center">
            <div className="relative isolate mx-auto w-full max-w-[280px]">
              <div className="absolute -inset-5 -z-10 rounded-[3.5rem] bg-primary/5 blur-2xl" />
              {/* iPhone Outer Frame */}
              <div className="rounded-[48px] bg-gradient-to-b from-neutral-500 via-neutral-800 to-neutral-500 p-[2.5px] shadow-2xl">
                <div className="rounded-[46px] bg-black p-[4px]">
                  <div className="relative select-none overflow-hidden rounded-[42px] bg-background p-4 min-h-[440px] flex flex-col justify-between">
                    {/* Dynamic Island */}
                    <div className="absolute left-1/2 top-2 z-30 flex h-[22px] w-[80px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2">
                      <span className="h-2 w-2 rounded-full bg-neutral-800" />
                    </div>

                    {/* Status Bar */}
                    <div className="flex shrink-0 items-center justify-between px-3 pt-2 text-[10px] font-semibold text-foreground/80">
                      <span>9:41</span>
                      <span>5G 100%</span>
                    </div>

                    {/* Chat Content */}
                    <div className="my-auto space-y-3 pt-4">
                      {/* Incoming comment notification */}
                      <div className="rounded-xl border border-border bg-card p-2.5 shadow-xs">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground">
                          <Image src="/images/platforms/instagram.svg" alt="" width={12} height={12} />
                          New Comment on Post
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          <strong className="text-foreground">@sarah_growth:</strong> "Please send the template!"
                        </p>
                      </div>

                      {/* Auto-DM sequence */}
                      <div className="space-y-2 text-right">
                        <div className="inline-block rounded-2xl rounded-br-xs bg-primary px-3 py-2 text-[11px] text-primary-foreground text-left shadow-xs">
                          Hey Sarah! 👋 Here is the 2026 Founder Growth Playbook you commented for:
                        </div>
                        <div className="inline-block rounded-xl border border-border bg-card p-2 text-left text-[10px] shadow-xs">
                          <span className="font-bold text-foreground block">growth_playbook_2026.pdf</span>
                          <span className="text-primary font-semibold text-[9px]">Tap to download</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom message bar */}
                    <div className="rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] text-muted-foreground flex items-center justify-between">
                      <span>Automated by reerts</span>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Unified Feed Reader */}
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
              <Rss className="h-3.5 w-3.5 text-amber-500" />
              Unified Content Feeds
            </span>

            <h3 className="text-3xl font-bold tracking-tight text-balance leading-tight md:text-4xl text-foreground">
              See the latest from every channel you follow <span className="text-primary">in one place</span>
            </h3>

            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Stop endlessly hopping across 5 different apps to see what's trending. Connect competitor social profiles, Substack newsletters, and industry RSS feeds into one streamlined unified feed reader.
            </p>

            <Link
              href="#pricing"
              className="mt-6 inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Demo 3 Mockup: macOS Window */}
          <div className="w-full lg:pl-4">
            <div className="relative isolate w-full">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl" />
              <div className="w-full select-none overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
                <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Unified Feed Radar
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex gap-2 text-xs border-b border-border pb-2">
                    <span className="font-bold text-primary border-b-2 border-primary pb-1">All Feeds (12)</span>
                    <span className="text-muted-foreground pb-1">Top Viral</span>
                    <span className="text-muted-foreground pb-1">TechCrunch</span>
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <Image src="/images/platforms/threads.svg" alt="" width={14} height={14} className="dark:invert" />
                          @indie_builder • 2h ago
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          "We crossed $80k ARR with 0 paid ads. Here is our organic playbook:"
                        </p>
                      </div>
                      <span className="rounded bg-primary text-primary-foreground font-semibold px-2 py-1 text-[10px]">
                        Draft
                      </span>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <Image src="/images/platforms/linkedin.svg" alt="" width={14} height={14} />
                          YC Founder Trends • 4h ago
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          "The shift from traditional SaaS tools to autonomous agent pipelines."
                        </p>
                      </div>
                      <span className="rounded bg-primary text-primary-foreground font-semibold px-2 py-1 text-[10px]">
                        Draft
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: Content Remixer */}
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:order-2">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
              <Repeat className="h-3.5 w-3.5 text-purple-500" />
              Content Remixer
            </span>

            <h3 className="text-3xl font-bold tracking-tight text-balance leading-tight md:text-4xl text-foreground">
              Don't start from scratch.<br />
              <span className="text-primary">Remix what already worked.</span>
            </h3>

            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Take your best-performing post from 6 months ago, or an industry benchmark, and let the AI rewrite it with fresh angles, updated numbers, and new hooks. Never run out of ideas when you have a proven library of winning content.
            </p>

            <Link
              href="#pricing"
              className="mt-6 inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Demo 4 Mockup */}
          <div className="w-full lg:order-1 lg:pr-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                <span className="font-semibold text-foreground">Remix Studio</span>
                <span className="text-purple-600 font-bold text-[11px]">3 Variations Generated</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border bg-muted/40 p-3.5 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Original Post (2024)</span>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    "3 lessons from scaling our bootstrap product to 10k users with zero funding."
                  </p>
                  <span className="text-[10px] text-muted-foreground">Views: 42.1k</span>
                </div>
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3.5 space-y-2">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">AI Remix (2026 Angle)</span>
                  <p className="text-foreground leading-relaxed text-[11px] font-medium">
                    "The 3 bootstrap rules that actually survived the AI wave. What still works today:"
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold">Predicted Virality: 96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 5: Evergreen Automation */}
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              Evergreen Queue
            </span>

            <h3 className="text-3xl font-bold tracking-tight text-balance leading-tight md:text-4xl text-foreground">
              Content you post on repeat.<br />
              <span className="text-primary">Schedule it all at once.</span>
            </h3>

            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Create evergreen recycling queues for core product features, testimonials, and case studies so your feeds never run dry when you're busy building.
            </p>

            <Link
              href="#pricing"
              className="mt-6 inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Demo 5 Mockup */}
          <div className="w-full lg:pl-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                <span className="font-semibold text-foreground">Evergreen Recycler</span>
                <span className="text-emerald-600 font-bold text-[10px]">● 4 Slots Active</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg border border-border bg-background p-2.5">
                  <div>
                    <p className="font-semibold text-foreground">Product Demo Walkthrough</p>
                    <p className="text-[10px] text-muted-foreground">Every 3 weeks • Mon 9:00 AM</p>
                  </div>
                  <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-background p-2.5">
                  <div>
                    <p className="font-semibold text-foreground">Customer Case Study: 400% ROI</p>
                    <p className="text-[10px] text-muted-foreground">Every 4 weeks • Thu 2:15 PM</p>
                  </div>
                  <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 6: Saved Links (iPhone Share Sheet) */}
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:order-2">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
              <Bookmark className="h-3.5 w-3.5 text-rose-500" />
              1-Click Share to Content
            </span>

            <h3 className="text-3xl font-bold tracking-tight text-balance leading-tight md:text-4xl text-foreground">
              Saved links you never reopen?<br />
              <span className="text-primary">One share</span> turns them into drafts
            </h3>

            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Use our browser extension or mobile share sheet to send any interesting URL directly into your reerts queue. In 10 seconds, it's a ready-to-publish draft.
            </p>

            <Link
              href="#pricing"
              className="mt-6 inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Demo 6 Mockup: iPhone Share Sheet */}
          <div className="w-full lg:order-1 lg:pr-4 flex justify-center">
            <div className="relative isolate mx-auto w-full max-w-[280px]">
              <div className="rounded-[48px] bg-gradient-to-b from-neutral-500 via-neutral-800 to-neutral-500 p-[2.5px] shadow-2xl">
                <div className="rounded-[46px] bg-black p-[4px]">
                  <div className="relative select-none overflow-hidden rounded-[42px] bg-background p-4 min-h-[440px] flex flex-col justify-between">
                    <div className="space-y-3 pt-6">
                      <div className="rounded-xl border border-border bg-card p-3 shadow-xs">
                        <span className="text-[10px] text-muted-foreground">Browser Share Sheet</span>
                        <p className="text-xs font-bold text-foreground mt-1 truncate">https://arxiv.org/abs/2602.1284</p>
                      </div>

                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> reerts Auto-Drafted:
                        </span>
                        <p className="text-[11px] text-foreground leading-relaxed font-medium">
                          "A new breakthrough in autonomous LLM reasoning was published today. Here are the 3 major takeaways for software engineers:"
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-primary py-2 text-center text-xs font-bold text-primary-foreground">
                      Added to Drafts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 7: Competitor Radar */}
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
              <Search className="h-3.5 w-3.5 text-cyan-500" />
              Competitor Radar
            </span>

            <h3 className="text-3xl font-bold tracking-tight text-balance leading-tight md:text-4xl text-foreground">
              Track everything your competitors do <span className="text-primary">in one place</span>
            </h3>

            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Monitor competitor posting frequency, their breakout viral posts, top engagement angles, and what formats generate the most comments in your niche.
            </p>

            <Link
              href="#pricing"
              className="mt-6 inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Demo 7 Mockup */}
          <div className="w-full lg:pl-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                <span className="font-semibold text-foreground">Niche Radar Dashboard</span>
                <span className="text-cyan-600 font-bold text-[10px]">3 Rivals Monitored</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Competitor A • Carousels</p>
                    <p className="text-[11px] text-muted-foreground">Peak hours: Tue/Thu 9:00 AM</p>
                  </div>
                  <span className="text-emerald-600 font-bold text-xs">+480% engagement</span>
                </div>
                <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Competitor B • Short Video</p>
                    <p className="text-[11px] text-muted-foreground">Average views: 8.4k</p>
                  </div>
                  <span className="text-blue-600 font-bold text-xs">+120% comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 8: Agency Client Connect */}
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:order-2">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Passwordless Client Connect
            </span>

            <h3 className="text-3xl font-bold tracking-tight text-balance leading-tight md:text-4xl text-foreground">
              Connect client accounts<br />
              <span className="text-primary">without their passwords</span>
            </h3>

            <p className="mt-5 max-w-xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Send a secure magic invite link. Clients log into their LinkedIn, Meta, or X accounts themselves, granting official publishing tokens with zero credential exposure.
            </p>

            <Link
              href="#pricing"
              className="mt-6 inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Demo 8 Mockup */}
          <div className="w-full lg:order-1 lg:pr-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                <span className="font-semibold text-foreground">Magic OAuth Connect Link</span>
                <span className="rounded bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 text-[10px]">100% Secure</span>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Client: Acme Holdings Corp</span>
                  <span className="text-emerald-600">● Connected</span>
                </div>
                <div className="space-y-1 text-muted-foreground text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>LinkedIn Company Page: Verified via OAuth</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Instagram Business Account: Authorized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
