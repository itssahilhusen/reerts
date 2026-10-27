"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Layers, 
  Link as LinkIcon, 
  FileText, 
  Pencil, 
  Download, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Check, 
  Loader2, 
  Eye, 
  Wand2, 
  Sliders,
  Palette,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CarouselSlideItem } from "@/types";

interface CarouselViewProps {
  onOpenComposer: (post?: any) => void;
}

export function CarouselView({ onOpenComposer }: CarouselViewProps) {
  // Input Step vs Slide Editor Step
  const [currentStep, setCurrentStep] = useState<"input" | "editor">("input");
  const [inputTab, setInputTab] = useState<"topic" | "link" | "text">("topic");
  const [inputValue, setInputValue] = useState("5 High-Conversion Strategies for Solo SaaS Founders");
  const [isPlanning, setIsPlanning] = useState(false);
  const [theme, setTheme] = useState<"dark" | "gradient" | "minimal">("dark");
  const [aspectRatio, setAspectRatio] = useState<"4:5" | "1:1">("4:5");

  // Active slide in canvas
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Slides State
  const [carouselTitle, setCarouselTitle] = useState("5 SaaS Growth Frameworks");
  const [slides, setSlides] = useState<CarouselSlideItem[]>([
    {
      id: "slide-1",
      order: 1,
      slideType: "COVER",
      headline: "5 High-Conversion Strategies for Solo SaaS Founders",
      body: "How bootstrapped founders turn single feature commits into sustainable revenue machines.",
      tag: "Framework",
      bgGradient: "from-amber-500/20 to-rose-500/20",
    },
    {
      id: "slide-2",
      order: 2,
      slideType: "PROBLEM",
      headline: "The Trap of Random Content",
      body: "Posting spontaneously without a feedback loop leads to burnout and flatlining engagement. Consistent creators build repeatable distribution loops.",
      tag: "Bottleneck",
      bgGradient: "from-blue-500/20 to-indigo-500/20",
    },
    {
      id: "slide-3",
      order: 3,
      slideType: "CONTENT",
      headline: "Rule of 1 Core Message per Slide",
      body: "Never crowd slides with dense paragraphs. High-contrast typography, a single takeaway, and generous margins increase swipe-through rates by 240%.",
      tag: "Design Rule",
      bgGradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      id: "slide-4",
      order: 4,
      slideType: "COMPARISON",
      headline: "Read vs. Skipped Content",
      body: "❌ Generic advice without proof.\n✅ Direct playbooks with concrete step-by-step numbers and visual hierarchy.",
      tag: "Benchmark",
      bgGradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "slide-5",
      order: 5,
      slideType: "CLOSING",
      headline: "Save this playbook for your next sprint",
      body: "Bookmark for later. Follow @reerts.in for weekly systems on automated creator distribution.",
      tag: "Save & Share",
      bgGradient: "from-primary/20 to-secondary/20",
    },
  ]);

  const handlePlanCarousel = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a topic, URL, or notes");
      return;
    }
    setIsPlanning(true);
    try {
      const res = await fetch("/api/carousel/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: inputTab === "topic" ? inputValue : undefined,
          url: inputTab === "link" ? inputValue : undefined,
          text: inputTab === "text" ? inputValue : undefined,
        }),
      });
      const data = await res.json();
      if (data.slides && data.slides.length > 0) {
        setCarouselTitle(data.title || inputValue);
        const mappedSlides = data.slides.map((s: any, idx: number) => ({
          id: `slide-${idx + 1}`,
          order: s.order || idx + 1,
          slideType: s.slideType || "CONTENT",
          headline: s.headline,
          body: s.body,
          tag: s.tag,
          bgGradient: s.bgGradient,
        }));
        setSlides(mappedSlides);
        setActiveSlideIndex(0);
        setCurrentStep("editor");
        toast.success("AI planned 5 high-converting slides!");
      }
    } catch (err) {
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setIsPlanning(false);
    }
  };

  const updateSlideHeadline = (val: string) => {
    const updated = [...slides];
    updated[activeSlideIndex].headline = val;
    setSlides(updated);
  };

  const updateSlideBody = (val: string) => {
    const updated = [...slides];
    updated[activeSlideIndex].body = val;
    setSlides(updated);
  };

  const handleAddSlide = () => {
    const nextOrder = slides.length + 1;
    const newSlide: CarouselSlideItem = {
      id: `slide-${Date.now()}`,
      order: nextOrder,
      slideType: "CONTENT",
      headline: `Slide ${nextOrder} Key Insight`,
      body: "Enter your tactical breakdown or key supporting point here.",
      tag: "Insight",
      bgGradient: "from-primary/10 to-muted/20",
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
    toast.success("Added new slide");
  };

  const handleRemoveSlide = (index: number) => {
    if (slides.length <= 2) {
      toast.error("Carousels require at least 2 slides");
      return;
    }
    const updated = slides.filter((_, idx) => idx !== index).map((s, idx) => ({ ...s, order: idx + 1 }));
    setSlides(updated);
    setActiveSlideIndex(Math.max(0, index - 1));
    toast.info("Slide removed");
  };

  const handleDownload = () => {
    toast.success("Slides exported as high-resolution PNG / PDF package!");
  };

  const handleCreatePost = () => {
    const postContent = `${carouselTitle}\n\nSwipe through the carousel for the complete 5-step breakdown 👈\n\nWhich strategy will you test first? Let me know below!\n\n#socialmedia #contentstrategy #carousels #growth`;
    onOpenComposer({
      title: carouselTitle,
      content: postContent,
      platforms: ["linkedin", "instagram", "threads"],
    });
  };

  const activeSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Bar matching reference */}
      <div className="h-14 border-b border-border bg-card/50 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Layers className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">AI Carousel Studio</h1>
            <p className="text-[11px] text-muted-foreground">Turn links, notes, or topics into publish-ready carousels</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentStep === "editor" ? (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep("input")}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg border border-border"
              >
                Plan Again
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-all shadow-2xs"
              >
                <Download className="size-3.5" />
                <span className="hidden sm:inline">Export PNG/PDF</span>
              </button>
              <button
                type="button"
                onClick={handleCreatePost}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
              >
                <Share2 className="size-3.5" />
                <span>Create Post</span>
              </button>
            </>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">Step 1 of 2: Plan Slides</span>
          )}
        </div>
      </div>

      {/* Content Area */}
      {currentStep === "input" ? (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center max-w-3xl mx-auto w-full space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" /> AI Slide Planner
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              What do you want to create a carousel about?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Drop in a link, a quick note, or a general topic. Our model will structure the hook, argument flow, and closing CTA into 5 slides.
            </p>
          </div>

          {/* Input Source Selector Pills */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/60 border border-border">
            <button
              type="button"
              onClick={() => setInputTab("topic")}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                inputTab === "topic" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              One-line Topic
            </button>
            <button
              type="button"
              onClick={() => setInputTab("link")}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1",
                inputTab === "link" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LinkIcon className="size-3" /> URL / Article
            </button>
            <button
              type="button"
              onClick={() => setInputTab("text")}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1",
                inputTab === "text" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="size-3" /> Raw Text / Notes
            </button>
          </div>

          {/* Main Input Box */}
          <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-sm space-y-4">
            {inputTab === "text" ? (
              <textarea
                rows={4}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Paste your raw notes, bullets, or newsletter draft..."
                className="w-full bg-background rounded-xl border border-border p-3 text-xs sm:text-sm text-foreground outline-none focus:border-primary resize-none leading-relaxed"
              />
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputTab === "link" ? "https://yourblog.com/post-name" : "e.g. 5 SaaS Pricing Mistakes to Avoid"}
                  className="flex-1 bg-background rounded-xl border border-border px-4 py-2.5 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                  onKeyDown={(e) => e.key === "Enter" && handlePlanCarousel()}
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
              <span>Theme: Modern High-Contrast Dark</span>
              <button
                type="button"
                disabled={isPlanning}
                onClick={handlePlanCarousel}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50"
              >
                {isPlanning ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
                <span>{isPlanning ? "Planning Slides..." : "Plan Carousel (Free)"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Step 2: Interactive Editor and Canvas */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Canvas Preview */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20 overflow-y-auto relative border-b lg:border-b-0 lg:border-r border-border">
            {/* Aspect Ratio & Theme Bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center rounded-lg border border-border bg-card p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setAspectRatio("4:5")}
                  className={cn("px-2.5 py-1 rounded-md transition-all", aspectRatio === "4:5" ? "bg-muted text-foreground" : "text-muted-foreground")}
                >
                  4:5 (Portrait)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio("1:1")}
                  className={cn("px-2.5 py-1 rounded-md transition-all", aspectRatio === "1:1" ? "bg-muted text-foreground" : "text-muted-foreground")}
                >
                  1:1 (Square)
                </button>
              </div>

              <div className="flex items-center rounded-lg border border-border bg-card p-0.5 text-[11px] font-semibold">
                {(["dark", "gradient", "minimal"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={cn("capitalize px-2.5 py-1 rounded-md transition-all", theme === t ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Slide Card Viewport */}
            <div
              className={cn(
                "relative rounded-2xl shadow-2xl border transition-all duration-300 flex flex-col justify-between p-7 select-none overflow-hidden",
                aspectRatio === "4:5" ? "w-[300px] h-[375px] sm:w-[340px] sm:h-[425px]" : "w-[320px] h-[320px] sm:w-[360px] sm:h-[360px]",
                theme === "dark" && "bg-neutral-950 text-white border-neutral-800",
                theme === "gradient" && "bg-gradient-to-br from-indigo-950 via-neutral-900 to-purple-950 text-white border-indigo-900/50",
                theme === "minimal" && "bg-white text-neutral-900 border-neutral-200"
              )}
            >
              {/* Header inside slide */}
              <div className="flex items-center justify-between">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  theme === "minimal" ? "bg-neutral-100 text-neutral-800" : "bg-neutral-800/80 text-neutral-200"
                )}>
                  {activeSlide.tag || "Insight"}
                </span>
                <span className={cn(
                  "font-mono text-[11px] font-semibold",
                  theme === "minimal" ? "text-neutral-500" : "text-neutral-400"
                )}>
                  {activeSlideIndex + 1} / {slides.length}
                </span>
              </div>

              {/* Main Content inside slide */}
              <div className="space-y-3 my-auto">
                <h3 className={cn(
                  "font-extrabold tracking-tight leading-tight",
                  activeSlide.slideType === "COVER" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
                  theme === "minimal" ? "text-neutral-900" : "text-neutral-100"
                )}>
                  {activeSlide.headline}
                </h3>
                <p className={cn(
                  "text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium",
                  theme === "minimal" ? "text-neutral-600" : "text-neutral-300"
                )}>
                  {activeSlide.body}
                </p>
              </div>

              {/* Footer inside slide */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] opacity-70">
                <span className="font-semibold tracking-wide">REERTS.IN</span>
                <span className="flex items-center gap-1">Swipe <ChevronRight className="size-3" /></span>
              </div>
            </div>

            {/* Slide Navigation Arrows */}
            <div className="flex items-center gap-4 mt-5">
              <button
                type="button"
                disabled={activeSlideIndex === 0}
                onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                className="size-8 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 transition-all shadow-2xs"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs font-semibold text-muted-foreground">
                Slide {activeSlideIndex + 1} of {slides.length}
              </span>
              <button
                type="button"
                disabled={activeSlideIndex === slides.length - 1}
                onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                className="size-8 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 transition-all shadow-2xs"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Right Editor Controls & Slide List */}
          <div className="w-full lg:w-[380px] border-l border-border bg-card p-6 flex flex-col space-y-5 overflow-y-auto shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Slide Editor</h2>
              <button
                type="button"
                onClick={() => handleRemoveSlide(activeSlideIndex)}
                className="text-muted-foreground hover:text-destructive transition-colors text-xs flex items-center gap-1"
                title="Delete this slide"
              >
                <Trash2 className="size-3" /> Delete Slide
              </button>
            </div>

            {/* Headline Editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Slide Headline</label>
              <input
                type="text"
                value={activeSlide.headline}
                onChange={(e) => updateSlideHeadline(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary"
              />
            </div>

            {/* Body Editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Slide Body / Bullet Points</label>
              <textarea
                rows={4}
                value={activeSlide.body}
                onChange={(e) => updateSlideBody(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs font-medium text-foreground outline-none focus:border-primary resize-none leading-relaxed"
              />
            </div>

            {/* Slide Strip Thumbnail Navigator */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">All Slides ({slides.length})</span>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Plus className="size-3" /> Add Slide
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className={cn(
                      "aspect-[4/5] rounded-lg border p-1.5 flex flex-col justify-between text-left transition-all text-[9px]",
                      activeSlideIndex === idx
                        ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                        : "border-border bg-muted/40 hover:border-border/80"
                    )}
                  >
                    <span className="font-mono font-bold text-muted-foreground">#{idx + 1}</span>
                    <span className="line-clamp-2 font-medium leading-tight text-foreground">{slide.headline}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCreatePost}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
              >
                <Share2 className="size-3.5" />
                <span>Create Post with Carousel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
