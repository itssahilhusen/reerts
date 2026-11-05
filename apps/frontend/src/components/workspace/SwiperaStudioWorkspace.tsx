"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Wand2,
  Layers,
  Sliders,
  Palette,
  Lightbulb,
  Video,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Undo2,
  Redo2,
  FolderOpen,
  HelpCircle,
  Moon,
  Sun,
  Download,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  RefreshCw,
  Search,
  Upload,
  Globe,
  Share2,
  FileText,
  Smartphone,
  X,
  Keyboard,
  ExternalLink,
  Shuffle
} from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import swiperaTemplatesData from "@/data/swiperaTemplates";
import swiperaFontsData from "@/data/swiperaFonts";

function ViewLoadingPlaceholder() {
  return (
    <div className="flex-1 flex items-center justify-center p-12 min-h-[400px]">
      <div className="w-8 h-8 rounded-full border-2 border-[#c6f432] border-t-transparent animate-spin" />
    </div>
  );
}

const IdeasView = dynamic(() => import("./IdeasView").then((mod) => mod.IdeasView), {
  loading: () => <ViewLoadingPlaceholder />,
});

const VideosView = dynamic(() => import("./VideosView").then((mod) => mod.VideosView), {
  loading: () => <ViewLoadingPlaceholder />,
});

const ComposerSheet = dynamic(() => import("./ComposerSheet").then((mod) => mod.ComposerSheet));
const AuthForm = dynamic(() => import("@/components/auth/AuthForm").then((mod) => mod.AuthForm));

export type StudioTab = "create" | "templates" | "design" | "brand" | "ideas" | "videos";

export interface SlideData {
  id: string;
  type: "cover" | "content" | "list" | "quote" | "cta";
  label?: string;
  emoji?: string;
  title: string;
  body: string;
  items?: string[];
  image?: string;
}

interface SwiperaStudioWorkspaceProps {
  initialTab?: StudioTab;
  onOpenComposer?: (data?: any) => void;
  showAuthModal?: boolean;
  authModalMode?: "signin" | "signup";
}

export function SwiperaStudioWorkspace({
  initialTab = "templates",
  onOpenComposer: externalOnOpenComposer,
  showAuthModal = false,
  authModalMode: initialAuthModalMode = "signup",
}: SwiperaStudioWorkspaceProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // Determine initial active tab based on pathname
  const computeActiveTab = (): StudioTab => {
    if (pathname?.startsWith("/ideas")) return "ideas";
    if (pathname?.startsWith("/videos")) return "videos";
    if (pathname?.startsWith("/studio")) {
      if (initialTab === "ideas" || initialTab === "videos") return initialTab;
      return "templates";
    }
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<StudioTab>(computeActiveTab);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isEasyMode, setIsEasyMode] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [language, setLanguage] = useState<"ko" | "en">("en");
  const [projectTitle, setProjectTitle] = useState("New carousel");
  const [isSaved, setIsSaved] = useState(true);
  const [saveTime, setSaveTime] = useState<string>("Saved");

  // Slide Deck state
  const [slides, setSlides] = useState<SlideData[]>([
    {
      id: "slide_1",
      type: "cover",
      label: "ACTION",
      emoji: "✉️",
      title: "Paste your text.\nCarousel done.",
      body: "AI finds the hook, writes punchy cards, and fits every character perfectly. Save, share, follow!",
      items: ["Stop the scroll", "Never spills off card", "Export to 6 platforms"],
    },
    {
      id: "slide_2",
      type: "content",
      label: "STEP 1",
      emoji: "⚡",
      title: "First slide stops the scroll.",
      body: "Generate high-converting headlines that make your audience pause in their feeds.",
    },
    {
      id: "slide_3",
      type: "list",
      label: "BENEFITS",
      emoji: "🎯",
      title: "Write once, post in six places.",
      body: "Auto-formatted for Instagram, LinkedIn, TikTok, Threads, Facebook, and X.",
      items: ["Instagram 4:5 carousels", "LinkedIn PDF documents", "Threads swipe albums"],
    },
    {
      id: "slide_4",
      type: "cta",
      label: "GET STARTED",
      emoji: "🚀",
      title: "Every swipe, a follow.",
      body: "Turn readers into loyal followers with designer-grade slides.",
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Template & Design State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("minimal");
  const [selectedSchemeIndex, setSelectedSchemeIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<"4:5" | "1:1" | "9:16" | "16:9">("4:5");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showSafeArea, setShowSafeArea] = useState(false);
  const [safeAreaPlatform, setSafeAreaPlatform] = useState<"instagram" | "tiktok">("instagram");

  // Typography & Styling controls
  const [titleFont, setTitleFont] = useState("Bricolage Grotesque");
  const [bodyFont, setBodyFont] = useState("Pretendard");
  const [titleSize, setTitleSize] = useState(100);
  const [bodySize, setBodySize] = useState(100);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [bgPattern, setBgPattern] = useState<"none" | "dots" | "grid" | "lines" | "waves">("dots");

  // Create Form State
  const [sourceType, setSourceType] = useState<"text" | "doc" | "url">("text");
  const [rawContent, setRawContent] = useState("");
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [slideCountPref, setSlideCountPref] = useState("auto");
  const [isGenerating, setIsGenerating] = useState(false);

  // Inspector tab: "content" | "visual" | "ai"
  const [inspectorTab, setInspectorTab] = useState<"content" | "visual" | "ai">("ai");
  const [smartFitPercent, setSmartFitPercent] = useState(140);
  const [autoShrink, setAutoShrink] = useState(true);

  // Modals & Sheets
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerPost, setComposerPost] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(showAuthModal);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">(initialAuthModalMode);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPolishMenuOpen, setIsPolishMenuOpen] = useState(false);

  // Undo / Redo history stack
  const [history, setHistory] = useState<SlideData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Theme synchronization with html class & studio-mode lock
  useEffect(() => {
    document.body.classList.add("studio-mode");
    document.documentElement.classList.add("studio-mode");

    try {
      const storedTheme = localStorage.getItem("swipera-theme");
      const isDark = storedTheme === "dark" || document.documentElement.classList.contains("dark");
      setIsDarkTheme(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) { }

    return () => {
      document.body.classList.remove("studio-mode");
      document.documentElement.classList.remove("studio-mode");
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkTheme;
    setIsDarkTheme(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      try { localStorage.setItem("swipera-theme", "dark"); } catch (e) { }
    } else {
      document.documentElement.classList.remove("dark");
      try { localStorage.setItem("swipera-theme", "light"); } catch (e) { }
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "ko" : "en";
    setLanguage(nextLang);
    if (typeof window !== "undefined") {
      (window as any).APP = { name: "Swipera", lang: nextLang, openBeta: true };
    }
    toast.success(nextLang === "ko" ? "한국어로 변경되었습니다." : "Switched to English.");
  };

  // Keep route synced when user clicks Idea / Videos in rail
  const handleNavSelect = (tab: StudioTab) => {
    setActiveTab(tab);
    if (tab === "ideas") {
      router.push("/ideas");
    } else if (tab === "videos") {
      router.push("/videos");
    } else {
      if (pathname !== "/studio") {
        router.push("/studio");
      }
    }
  };

  const openComposerWithData = (data?: any) => {
    if (externalOnOpenComposer) {
      externalOnOpenComposer(data);
    } else {
      setComposerPost(data || null);
      setIsComposerOpen(true);
    }
  };

  // Find active template details
  const activeTemplate = useMemo(() => {
    return (
      (swiperaTemplatesData as any[]).find((t) => t.id === selectedTemplateId) ||
      (swiperaTemplatesData as any[])[0]
    );
  }, [selectedTemplateId]);

  const activeScheme = useMemo(() => {
    if (!activeTemplate || !activeTemplate.schemes || activeTemplate.schemes.length === 0) {
      return { bg: "#f6f5f2", fg: "#141414", a: "#c6f432", b: "#ff4fd8", muted: "#78756d" };
    }
    return activeTemplate.schemes[selectedSchemeIndex] || activeTemplate.schemes[0];
  }, [activeTemplate, selectedSchemeIndex]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Update current slide field
  const updateCurrentSlide = (fields: Partial<SlideData>) => {
    setSlides((prev) => {
      const next = [...prev];
      next[currentSlideIndex] = { ...next[currentSlideIndex], ...fields };
      return next;
    });
    setIsSaved(false);
    setTimeout(() => {
      setIsSaved(true);
      setSaveTime("Saved just now");
    }, 600);
  };

  // Add slide
  const handleAddSlide = () => {
    const newSlide: SlideData = {
      id: `slide_${Date.now()}`,
      type: "content",
      label: `CARD ${slides.length + 1}`,
      emoji: "💡",
      title: "New key insight",
      body: "Describe your point clearly in 2-3 concise sentences.",
      items: ["Point A", "Point B"],
    };
    setSlides((prev) => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
    toast.success("New slide added");
  };

  // Duplicate slide
  const handleDuplicateSlide = () => {
    const dup: SlideData = {
      ...currentSlide,
      id: `slide_${Date.now()}`,
      label: `${currentSlide.label || "CARD"} (Copy)`,
    };
    const next = [...slides];
    next.splice(currentSlideIndex + 1, 0, dup);
    setSlides(next);
    setCurrentSlideIndex(currentSlideIndex + 1);
    toast.success("Slide duplicated");
  };

  // Delete slide
  const handleDeleteSlide = () => {
    if (slides.length <= 1) {
      toast.error("Carousel must contain at least 1 slide");
      return;
    }
    const next = slides.filter((_, idx) => idx !== currentSlideIndex);
    setSlides(next);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    toast.success("Slide removed");
  };

  // Randomize Style
  const handleShuffleStyle = () => {
    const list = swiperaTemplatesData as any[];
    const randTpl = list[Math.floor(Math.random() * list.length)];
    if (randTpl) {
      setSelectedTemplateId(randTpl.id);
      setSelectedSchemeIndex(0);
      toast.success(`Applied style: ${randTpl.name}`);
    }
  };

  // AI Content Generator trigger
  const handleGenerateCarousel = () => {
    if (!rawContent.trim()) {
      toast.error("Please enter some text or topic to generate");
      return;
    }
    setIsGenerating(true);
    toast.info("AI is analyzing text and crafting carousel cards...");
    setTimeout(() => {
      setIsGenerating(false);
      setSlides([
        {
          id: `slide_gen_1`,
          type: "cover",
          label: "SUMMARY",
          emoji: "🔥",
          title: rawContent.slice(0, 40) + "...",
          body: "Here is your automatically generated carousel breakdown.",
          items: ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"],
        },
        {
          id: `slide_gen_2`,
          type: "content",
          label: "WHY IT MATTERS",
          emoji: "📈",
          title: "The biggest leverage point.",
          body: "Focusing on clear positioning produces 3x higher retention than generic posts.",
        },
        {
          id: `slide_gen_3`,
          type: "list",
          label: "CHECKLIST",
          emoji: "✅",
          title: "3 Actionable Steps to Take Today",
          body: "Implement these right away for immediate momentum.",
          items: ["Audit current content", "Pick 1 core persona", "Test 3 punchy hooks"],
        },
        {
          id: `slide_gen_4`,
          type: "cta",
          label: "TAKE ACTION",
          emoji: "👉",
          title: "Save this for your next sprint.",
          body: "Follow for weekly marketing playbooks and growth teardowns.",
        },
      ]);
      setCurrentSlideIndex(0);
      setActiveTab("templates");
      toast.success("Carousel generated successfully!");
    }, 1200);
  };

  // Quick AI rewrite actions
  const handleAIRewrite = (action: string) => {
    setIsPolishMenuOpen(false);
    toast.info(`Applying AI ${action}...`);
    setTimeout(() => {
      if (action === "shorter") {
        updateCurrentSlide({
          title: currentSlide.title.split("\n")[0] || currentSlide.title,
          body: currentSlide.body.split(".")[0] + ".",
        });
        toast.success("Text condensed & tightened!");
      } else if (action === "hook") {
        updateCurrentSlide({
          title: "Are you still doing this the hard way?",
          label: "DON'T MISS THIS",
        });
        toast.success("Engaging hook generated!");
      } else if (action === "numbers") {
        updateCurrentSlide({
          title: "How we scaled to 48,200 followers in 90 days.",
          body: "A 3-step breakdown with zero ad spend: actionable benchmarks and formulas.",
        });
        toast.success("Specific metrics injected!");
      } else if (action === "emotional") {
        updateCurrentSlide({
          title: "Stop letting great ideas go unnoticed.",
          body: "You put hours into your craft. Make sure your presentation commands the respect it deserves.",
        });
        toast.success("Emotional tone applied!");
      }
    }, 400);
  };

  // Export Slide Deck Action
  const handleExport = () => {
    toast.success("Preparing carousel download package...", {
      description: "Generating 1080×1350 PNG images for Instagram & LinkedIn PDF.",
    });
    setTimeout(() => {
      toast.success("Carousel deck ready! Download started.");
    }, 1000);
  };

  // Filter templates list
  const filteredTemplates = useMemo(() => {
    const list = swiperaTemplatesData as any[];
    if (templateFilter === "all") return list;
    return list.filter((t) => t.category === templateFilter || t.tags?.includes(templateFilter));
  }, [templateFilter]);

  return (
    <>
      <link rel="stylesheet" href="/swipera/studio-style.css" />
      <div className="flex flex-col h-screen w-full bg-[var(--bg)] text-[var(--fg)] font-sans antialiased overflow-hidden select-none">
      {/* =========================================================================
          1. TOPBAR (#topbar, 56px / h-14)
          ========================================================================= */}
      <header
        id="topbar"
        className="h-14 flex-shrink-0 bg-[var(--panel)] border-b border-[var(--line)] px-3.5 flex items-center justify-between z-30 select-none"
        data-purpose="studio-topbar"
      >
        {/* Left Region: Logo, Brand, Breadcrumb, Inline Title, Cloud Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0"
            title="Return to Swipera Home"
          >
            {/* Swipera Lime S Mark */}
            <div className="w-8 h-8 rounded-[10px] bg-[#c6f432] text-[#141414] font-black font-display text-base flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="font-display font-black text-lg tracking-tight text-[var(--fg)]">
              Swipera
            </span>
          </Link>

          <span className="text-[var(--muted)] font-normal text-sm">/</span>

          {/* Inline Editable Project Title */}
          <div className="relative flex items-center group max-w-[200px] sm:max-w-[280px]">
            <input
              id="project-title"
              type="text"
              value={projectTitle}
              onChange={(e) => {
                setProjectTitle(e.target.value);
                setIsSaved(false);
                setTimeout(() => setIsSaved(true), 800);
              }}
              className="bg-transparent text-xs sm:text-[13px] font-bold text-[var(--fg)] border border-transparent hover:border-[var(--line)] focus:border-[var(--line)] focus:bg-[var(--bg)] px-2 py-1 rounded-md outline-none transition-all truncate"
              placeholder="Title..."
            />
          </div>

          {/* Cloud Saved Indicator */}
          <div
            id="save-indicator"
            className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted)] pl-1"
          >
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
            <span>{isSaved ? saveTime : "Saving..."}</span>
          </div>
        </div>

        {/* Right Region: Undo/Redo, Projects, Shortcuts, Tour, Theme, Lang, Beta, Export */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Undo Button */}
          <button
            id="btn-undo"
            type="button"
            onClick={() => toast.info("Undo action")}
            className="tb-btn hidden md:flex text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)] p-1.5 rounded-lg transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Redo Button */}
          <button
            id="btn-redo"
            type="button"
            onClick={() => toast.info("Redo action")}
            className="tb-btn hidden md:flex text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)] p-1.5 rounded-lg transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Projects Folder Modal Button */}
          <button
            id="btn-projects"
            type="button"
            onClick={() => setIsProjectsModalOpen(true)}
            className="tb-btn hidden sm:flex text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)] p-1.5 rounded-lg transition-colors"
            title="My Projects"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            id="btn-shortcuts"
            type="button"
            onClick={() => setIsShortcutsModalOpen(true)}
            className="tb-btn hidden lg:flex text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)] p-1.5 rounded-lg transition-colors"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Help / Tour Button */}
          <button
            id="btn-tour"
            type="button"
            onClick={() =>
              toast.info("Swipera Studio Tour", {
                description: "Pick a template on the left, click slide text to edit inline, then click Save & post!",
              })
            }
            className="tb-btn hidden lg:flex text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)] p-1.5 rounded-lg transition-colors"
            title="Help Tour"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Theme Switcher Toggle (Dark / Light) */}
          <button
            id="btn-theme"
            type="button"
            onClick={toggleTheme}
            className="tb-btn text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)] p-1.5 rounded-lg transition-colors"
            title={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Switcher Toggle (KO / EN) */}
          <button
            id="btn-lang"
            type="button"
            onClick={toggleLanguage}
            className="text-[11px] font-black font-mono text-[var(--muted)] hover:text-[var(--fg)] px-2 py-1 rounded-lg hover:bg-[var(--hover)] transition-colors"
            title="Switch Language"
          >
            {language.toUpperCase()}
          </button>

          {/* Beta Badge */}
          <span className="hidden sm:inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-[#c6f432] text-[#141414] px-2 py-0.5 rounded-full">
            BETA
          </span>

          {/* High-Visibility Export CTA ("Save & post") */}
          <button
            id="btn-export"
            type="button"
            onClick={handleExport}
            className="ml-1 bg-[#141414] hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-[#141414] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">Save & post</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN BODY: RAIL (64px) + LEFT PANEL (340px) + CENTER CANVAS + INSPECTOR (300px)
          ========================================================================= */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* =====================================================================
            2.1 LEFT RAIL (#rail, width 64px)
            STRICT REQUIREMENT: EXACTLY SIX MAIN DESTINATIONS
            1. Create
            2. Styles
            3. Design
            4. Brand
               - Idea
               - Videos
            * Caption is EXCLUDED completely *
            ===================================================================== */}
        <aside
          id="rail"
          className="w-16 flex-shrink-0 bg-[var(--panel)] border-r border-[var(--line)] flex flex-col justify-between py-3 px-1.5 z-20 select-none"
          data-purpose="studio-rail-navigation"
        >
          {/* Top Destination Items */}
          <div className="flex flex-col gap-1.5 items-center">
            {/* 1. Create */}
            <button
              type="button"
              data-tab="create"
              onClick={() => handleNavSelect("create")}
              className={cn(
                "rail-btn w-12 h-13 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group",
                activeTab === "create"
                  ? "bg-[#c6f432]/20 text-[#365300] dark:text-[#c6f432] font-black"
                  : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)]"
              )}
              title="Create new carousel"
            >
              <Wand2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold tracking-tight">Create</span>
            </button>

            {/* 2. Styles */}
            <button
              type="button"
              data-tab="templates"
              onClick={() => handleNavSelect("templates")}
              className={cn(
                "rail-btn w-12 h-13 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group",
                activeTab === "templates"
                  ? "bg-[#c6f432]/20 text-[#365300] dark:text-[#c6f432] font-black"
                  : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)]"
              )}
              title="Browse 28 Styles"
            >
              <Layers className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold tracking-tight">Styles</span>
            </button>

            {/* 3. Design */}
            <button
              type="button"
              data-tab="design"
              onClick={() => handleNavSelect("design")}
              className={cn(
                "rail-btn w-12 h-13 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group",
                activeTab === "design"
                  ? "bg-[#c6f432]/20 text-[#365300] dark:text-[#c6f432] font-black"
                  : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)]"
              )}
              title="Design typography and colors"
            >
              <Sliders className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold tracking-tight">Design</span>
            </button>

            {/* 4. Brand */}
            <button
              type="button"
              data-tab="brand"
              onClick={() => handleNavSelect("brand")}
              className={cn(
                "rail-btn w-12 h-13 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group",
                activeTab === "brand"
                  ? "bg-[#c6f432]/20 text-[#365300] dark:text-[#c6f432] font-black"
                  : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)]"
              )}
              title="Brand Kit & Guidelines"
            >
              <Palette className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold tracking-tight">Brand</span>
            </button>

            {/* BRAND SUB-GROUP DIVIDER */}
            <div className="w-8 h-[1px] bg-[var(--line)] my-1" />

            <div className="text-[8.5px] font-mono uppercase tracking-widest font-black text-[var(--muted)] opacity-70">
              BRAND
            </div>

            {/* 5. Idea (Migrated section under Brand group) */}
            <button
              type="button"
              data-tab="ideas"
              onClick={() => handleNavSelect("ideas")}
              className={cn(
                "rail-btn w-12 h-13 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group",
                activeTab === "ideas"
                  ? "bg-[#c6f432]/20 text-[#365300] dark:text-[#c6f432] font-black shadow-2xs"
                  : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)]"
              )}
              title="Idea Discovery & RSS Sources"
            >
              <Lightbulb className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold tracking-tight">Idea</span>
            </button>

            {/* 6. Videos (Migrated section under Brand group) */}
            <button
              type="button"
              data-tab="videos"
              onClick={() => handleNavSelect("videos")}
              className={cn(
                "rail-btn w-12 h-13 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group",
                activeTab === "videos"
                  ? "bg-[#c6f432]/20 text-[#365300] dark:text-[#c6f432] font-black shadow-2xs"
                  : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)]"
              )}
              title="Video Generation & Rendering"
            >
              <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold tracking-tight">Videos</span>
            </button>
          </div>

          {/* Bottom Account Indicator in Rail */}
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode("signin");
                setIsAuthModalOpen(true);
              }}
              className="w-8 h-8 rounded-full bg-[var(--hover)] hover:bg-[var(--line)] flex items-center justify-center text-xs font-bold text-[var(--fg)] cursor-pointer transition-colors"
              title={session?.user?.name || "Account Profile"}
            >
              {session?.user?.name ? session.user.name.slice(0, 2).toUpperCase() : "SW"}
            </button>
          </div>
        </aside>

        {/* =====================================================================
            2.2 MIGRATED SECTIONS: IDEA OR VIDEOS FULL VIEW
            When activeTab === "ideas" or "videos", mount them cleanly!
            ===================================================================== */}
        {activeTab === "ideas" && (
          <div className="flex-1 flex flex-col bg-white overflow-y-auto">
            <IdeasView onOpenComposer={openComposerWithData} />
          </div>
        )}

        {activeTab === "videos" && (
          <div className="flex-1 flex flex-col bg-white overflow-y-auto">
            <VideosView onOpenComposer={openComposerWithData} />
          </div>
        )}

        {/* =====================================================================
            2.3 STUDIO CAROUSEL WORKSPACE (Active when tab is create/templates/design/brand)
            ===================================================================== */}
        {activeTab !== "ideas" && activeTab !== "videos" && (
          <>
            {/* ---------------------------------------------------------------
                LEFT PANEL (#left-panel, 340px)
                Tabbed inspectors for Create, Styles, Design, Brand
                --------------------------------------------------------------- */}
            <aside
              id="left-panel"
              className={cn(
                "w-[340px] flex-shrink-0 bg-[var(--panel)] border-r border-[var(--line)] flex flex-col relative transition-all duration-200 z-10",
                isLeftPanelCollapsed ? "w-0 overflow-hidden border-r-0" : "w-[340px]"
              )}
              data-purpose="studio-left-panel"
            >
              {/* Collapse/Expand Toggle Button */}
              <button
                id="lp-collapse"
                type="button"
                onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
                className="absolute top-3 right-3 w-6 h-6 rounded-md bg-[var(--hover)] hover:bg-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)] flex items-center justify-center text-xs z-20 cursor-pointer transition-colors"
                title={isLeftPanelCollapsed ? "Expand panel" : "Collapse panel"}
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              {/* Panel Content Scroll Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* ---------------- CREATE PANE ---------------- */}
                {activeTab === "create" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <h2 className="text-base font-extrabold tracking-tight text-[var(--fg)]">
                        Create Carousel
                      </h2>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        Input your text or paste a link. Swipera turns it into slides.
                      </p>
                    </div>

                    {/* Source Selector Segment */}
                    <div className="seg bg-[var(--hover)] p-1 rounded-xl flex gap-1">
                      <button
                        type="button"
                        onClick={() => setSourceType("text")}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                          sourceType === "text"
                            ? "bg-[var(--panel)] text-[var(--fg)] shadow-xs"
                            : "text-[var(--muted)] hover:text-[var(--fg)]"
                        )}
                      >
                        Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceType("doc")}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                          sourceType === "doc"
                            ? "bg-[var(--panel)] text-[var(--fg)] shadow-xs"
                            : "text-[var(--muted)] hover:text-[var(--fg)]"
                        )}
                      >
                        PDF / Doc
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceType("url")}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                          sourceType === "url"
                            ? "bg-[var(--panel)] text-[var(--fg)] shadow-xs"
                            : "text-[var(--muted)] hover:text-[var(--fg)]"
                        )}
                      >
                        Web URL
                      </button>
                    </div>

                    {/* Main Content Input */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-semibold text-[var(--muted)]">
                        <span>{sourceType === "url" ? "Article or Tweet URL" : "Paste content"}</span>
                        <span>{rawContent.length} chars</span>
                      </div>
                      <textarea
                        id="content-input"
                        value={rawContent}
                        onChange={(e) => setRawContent(e.target.value)}
                        placeholder={
                          sourceType === "url"
                            ? "https://example.com/blog/how-to-grow..."
                            : "Paste your raw notes, article snippet, or bullet points here..."
                        }
                        rows={sourceType === "url" ? 2 : 5}
                        className="w-full text-xs font-mono p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#c6f432] focus:ring-1 focus:ring-[#c6f432] transition-all resize-none"
                      />
                    </div>

                    {/* Quick Starter Prompts Chips */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--muted)]">
                        Quick Starters
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Morning routine for deep work",
                          "5 AI tools that save 10 hours",
                          "Productivity playbook for founders",
                          "SaaS marketing checklist",
                        ].map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => setRawContent(prompt)}
                            className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--hover)] hover:bg-[var(--line)] text-[var(--fg)] font-medium transition-colors text-left"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Platform Selector Chips */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--muted)]">
                        Target Platform
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { name: "Instagram", ratio: "4:5" },
                          { name: "Threads", ratio: "1:1" },
                          { name: "LinkedIn", ratio: "4:5" },
                          { name: "TikTok", ratio: "9:16" },
                          { name: "Facebook", ratio: "1:1" },
                          { name: "X", ratio: "16:9" },
                        ].map((plat) => (
                          <button
                            key={plat.name}
                            type="button"
                            onClick={() => setAspectRatio(plat.ratio as any)}
                            className={cn(
                              "text-xs py-1.5 px-2 rounded-lg border text-center font-bold transition-all",
                              aspectRatio === plat.ratio
                                ? "border-[#c6f432] bg-[#c6f432]/10 text-[var(--fg)]"
                                : "border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--fg)]"
                            )}
                          >
                            <div>{plat.name}</div>
                            <div className="text-[9px] font-mono opacity-70">{plat.ratio}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button CTA */}
                    <button
                      id="btn-generate"
                      type="button"
                      disabled={isGenerating}
                      onClick={handleGenerateCarousel}
                      className="w-full py-2.5 bg-[#c6f432] hover:bg-[#b8e82a] text-[#141414] font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isGenerating ? (
                        <div className="w-4 h-4 border-2 border-[#141414] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 fill-current" />
                      )}
                      <span>{isGenerating ? "Crafting Slides..." : "AI Create Carousel"}</span>
                    </button>
                  </div>
                )}

                {/* ---------------- STYLES PANE ---------------- */}
                {activeTab === "templates" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-extrabold tracking-tight text-[var(--fg)]">
                          Styles
                        </h2>
                        <span className="text-[10px] font-mono font-bold text-[var(--muted)]">
                          28 styles
                        </span>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        28 styles plus your own. One tap applies to every card.
                      </p>
                    </div>

                    {/* Lime Promo Banner: Make a template from image */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-[#c6f432] to-[#d6ff52] text-[#141414] shadow-xs cursor-pointer hover:brightness-95 transition-all">
                      <div className="text-xs font-black flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Make a template from an image</span>
                      </div>
                      <p className="text-[11px] opacity-80 mt-1 leading-tight">
                        Upload a carousel you like — get a template in the same style
                      </p>
                    </div>

                    {/* Actions row: New template, Remix current, Import */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => toast.info("Create custom template")}
                        className="py-1.5 px-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[11px] font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors truncate"
                      >
                        + New
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info("Remix current template colors")}
                        className="py-1.5 px-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[11px] font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors truncate"
                      >
                        Remix
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info("Import template JSON")}
                        className="py-1.5 px-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[11px] font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors truncate"
                      >
                        Import
                      </button>
                    </div>

                    {/* AI Suggested Template Banner */}
                    <div className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-[var(--fg)] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#365300] dark:text-[#c6f432]" />
                          <span>AI suggested: Minimal</span>
                        </div>
                        <div className="text-[10px] text-[var(--muted)]">High contrast readability</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTemplateId("minimal");
                          toast.success("Applied Minimal template");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[var(--panel)] border border-[var(--line)] hover:bg-[var(--hover)] text-xs font-bold text-[var(--fg)] transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {["all", "photo", "bold", "editorial", "flat", "clean"].map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setTemplateFilter(filter)}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                            templateFilter === filter
                              ? "bg-[var(--fg)] text-[var(--bg)]"
                              : "border border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]"
                          )}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    {/* 28 Templates Grid */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      {filteredTemplates.map((tpl: any) => {
                        const isSelected = selectedTemplateId === tpl.id;
                        const scheme = tpl.schemes?.[0] || { bg: "#f6f5f2", fg: "#141414", a: "#c6f432" };

                        return (
                          <div
                            key={tpl.id}
                            onClick={() => {
                              setSelectedTemplateId(tpl.id);
                              setSelectedSchemeIndex(0);
                              toast.success(`Applied ${tpl.name} style`);
                            }}
                            className={cn(
                              "tpl-card rounded-xl border-2 overflow-hidden cursor-pointer transition-all p-1.5 flex flex-col gap-1.5 group relative",
                              isSelected
                                ? "border-[#c6f432] bg-[#c6f432]/5 shadow-xs"
                                : "border-[var(--line)] bg-[var(--bg)] hover:border-[var(--muted)]"
                            )}
                          >
                            {/* Card Visual Mockup Thumbnail */}
                            <div
                              className="aspect-[4/5] w-full rounded-lg relative overflow-hidden flex flex-col justify-between p-2.5 shadow-2xs"
                              style={{ backgroundColor: scheme.bg, color: scheme.fg }}
                            >
                              <div className="flex items-center justify-between w-full z-10">
                                {tpl.badge ? (
                                  <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#c6f432] text-[#141414] shadow-xs">
                                    {tpl.badge}
                                  </span>
                                ) : (
                                  <span className="text-[7.5px] font-mono tracking-widest uppercase opacity-60">
                                    {tpl.category}
                                  </span>
                                )}
                              </div>
                              <div
                                className="font-extrabold text-[12px] leading-tight my-auto"
                                style={{ color: scheme.a }}
                              >
                                {tpl.name}
                              </div>
                              <div className="w-full flex justify-between items-center text-[7.5px] opacity-70">
                                <span className="font-mono">1/4</span>
                                <div className="flex gap-1">
                                  {tpl.schemes?.slice(0, 4).map((s: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="w-1.5 h-1.5 rounded-full"
                                      style={{ backgroundColor: s.a || s.fg }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Card Metadata */}
                            <div className="flex items-center justify-between px-1">
                              <span className="text-xs font-bold truncate text-[var(--fg)]">
                                {tpl.name}
                              </span>
                              <span className="text-[9px] font-mono text-[var(--muted)]">
                                {tpl.schemes?.length || 4} colors
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ---------------- DESIGN PANE ---------------- */}
                {activeTab === "design" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <h2 className="text-base font-extrabold tracking-tight text-[var(--fg)]">
                        Design & Typography
                      </h2>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        Customize fonts, color schemes, and layout geometry.
                      </p>
                    </div>

                    {/* Color Schemes Accordion */}
                    <div className="space-y-2 p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)]">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--muted)] block">
                        Color Schemes ({activeTemplate.name})
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        {activeTemplate.schemes?.map((scheme: any, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedSchemeIndex(idx)}
                            className={cn(
                              "w-8 h-8 rounded-full border-2 overflow-hidden relative transition-transform",
                              selectedSchemeIndex === idx
                                ? "border-[var(--fg)] scale-110 shadow-sm"
                                : "border-[var(--line)] hover:scale-105"
                            )}
                            title={scheme.name}
                          >
                            <div
                              className="w-full h-1/2"
                              style={{ backgroundColor: scheme.bg }}
                            />
                            <div
                              className="w-full h-1/2"
                              style={{ backgroundColor: scheme.a }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Typography Settings */}
                    <div className="space-y-3 p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)]">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--muted)] block">
                        Typography
                      </span>

                      {/* Title Font */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[var(--muted)]">Title Font</label>
                        <select
                          value={titleFont}
                          onChange={(e) => setTitleFont(e.target.value)}
                          className="w-full p-2 text-xs font-semibold rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--fg)] outline-none"
                        >
                          <option value="Bricolage Grotesque">Bricolage Grotesque</option>
                          <option value="Pretendard">Pretendard Variable</option>
                          <option value="Inter">Inter</option>
                          <option value="Playfair Display">Playfair Display (Serif)</option>
                          <option value="Space Grotesk">Space Grotesk</option>
                          <option value="Archivo Black">Archivo Black</option>
                        </select>
                      </div>

                      {/* Title Size Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-[var(--muted)]">
                          <span>Title Scale</span>
                          <span className="font-mono">{titleSize}%</span>
                        </div>
                        <input
                          type="range"
                          min="70"
                          max="150"
                          value={titleSize}
                          onChange={(e) => setTitleSize(Number(e.target.value))}
                          className="w-full accent-[#365300] dark:accent-[#c6f432]"
                        />
                      </div>

                      {/* Alignment */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[var(--muted)]">Alignment</label>
                        <div className="seg bg-[var(--hover)] p-1 rounded-lg flex gap-1">
                          <button
                            type="button"
                            onClick={() => setTextAlign("left")}
                            className={cn(
                              "flex-1 py-1 flex items-center justify-center rounded-md text-xs",
                              textAlign === "left" ? "bg-[var(--panel)] text-[var(--fg)] shadow-xs" : "text-[var(--muted)]"
                            )}
                          >
                            <AlignLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTextAlign("center")}
                            className={cn(
                              "flex-1 py-1 flex items-center justify-center rounded-md text-xs",
                              textAlign === "center" ? "bg-[var(--panel)] text-[var(--fg)] shadow-xs" : "text-[var(--muted)]"
                            )}
                          >
                            <AlignCenter className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTextAlign("right")}
                            className={cn(
                              "flex-1 py-1 flex items-center justify-center rounded-md text-xs",
                              textAlign === "right" ? "bg-[var(--panel)] text-[var(--fg)] shadow-xs" : "text-[var(--muted)]"
                            )}
                          >
                            <AlignRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Background Pattern */}
                    <div className="space-y-2 p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)]">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--muted)] block">
                        Background Pattern
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {["none", "dots", "grid", "lines", "waves"].map((pat) => (
                          <button
                            key={pat}
                            type="button"
                            onClick={() => setBgPattern(pat as any)}
                            className={cn(
                              "py-1.5 px-2 rounded-lg border text-xs font-bold uppercase transition-all",
                              bgPattern === pat
                                ? "border-[#c6f432] bg-[#c6f432]/10 text-[var(--fg)]"
                                : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]"
                            )}
                          >
                            {pat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- BRAND PANE ---------------- */}
                {activeTab === "brand" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <h2 className="text-base font-extrabold tracking-tight text-[var(--fg)]">
                        Brand Kit
                      </h2>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        Set your logo, username handle, and tone guidelines.
                      </p>
                    </div>

                    {/* Handle input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--muted)]">Channel / Handle</label>
                      <input
                        type="text"
                        defaultValue="@swipera.io"
                        className="w-full text-xs font-mono p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] outline-none"
                      />
                    </div>

                    {/* Website */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--muted)]">Website URL</label>
                      <input
                        type="text"
                        defaultValue="https://swipera.io"
                        className="w-full text-xs font-mono p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] outline-none"
                      />
                    </div>

                    {/* Logo Uploader */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--muted)]">Brand Logo</label>
                      <div className="border-2 border-dashed border-[var(--line)] rounded-xl p-4 text-center hover:border-[#c6f432] transition-colors cursor-pointer">
                        <Upload className="w-5 h-5 mx-auto text-[var(--muted)] mb-1" />
                        <span className="text-xs font-bold text-[var(--fg)]">Upload SVG or PNG</span>
                        <p className="text-[10px] text-[var(--muted)] mt-0.5">Max size 2MB</p>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-2 pt-1 border-t border-[var(--line)]">
                      <label className="flex items-center justify-between text-xs font-bold text-[var(--fg)] cursor-pointer">
                        <span>Show page numbers</span>
                        <input type="checkbox" defaultChecked className="accent-[#365300] dark:accent-[#c6f432]" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-[var(--fg)] cursor-pointer">
                        <span>Show swipe hint arrow</span>
                        <input type="checkbox" defaultChecked className="accent-[#365300] dark:accent-[#c6f432]" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-[var(--fg)] cursor-pointer">
                        <span>Show topic category badge</span>
                        <input type="checkbox" defaultChecked className="accent-[#365300] dark:accent-[#c6f432]" />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* ---------------------------------------------------------------
                CENTER CANVAS AREA (#canvas-area)
                Top slide toolbar, floating #ctx-bar, slide stage card,
                bottom quick style bar, and filmstrip
                --------------------------------------------------------------- */}
            <main
              id="canvas-area"
              className="flex-1 flex flex-col bg-[var(--canvas)] overflow-hidden relative"
              data-purpose="studio-canvas"
            >
              {/* Expand Left Panel pill if collapsed */}
              {isLeftPanelCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsLeftPanelCollapsed(false)}
                  className="absolute top-3 left-3 z-30 bg-[var(--panel)] border border-[var(--line)] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--fg)] shadow-sm hover:bg-[var(--hover)] transition-all flex items-center gap-1.5"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                  <span>Show panel</span>
                </button>
              )}

              {/* ---------------- SLIDE TOOLBAR (#slide-toolbar) ---------------- */}
              <div
                id="slide-toolbar"
                className="h-11 flex-shrink-0 bg-[var(--panel)]/70 backdrop-blur-md border-b border-[var(--line)] px-4 flex items-center justify-between z-20"
              >
                {/* Left: Slide pagination, Polish rewrite, Add image, Duplicate, Trash */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-mono text-[var(--fg)] px-1.5">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>

                  <button
                    type="button"
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                    className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)] disabled:opacity-30 transition-colors"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={currentSlideIndex === slides.length - 1}
                    onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                    className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)] disabled:opacity-30 transition-colors"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-[1px] bg-[var(--line)] mx-1" />

                  {/* Polish AI Rewrite Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPolishMenuOpen(!isPolishMenuOpen)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-[var(--fg)] bg-[var(--hover)] hover:bg-[var(--line)] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#365300] dark:text-[#c6f432]" />
                      <span>Polish</span>
                    </button>

                    {/* Polish Dropdown Menu */}
                    {isPolishMenuOpen && (
                      <div className="absolute top-full left-0 mt-1.5 w-52 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          type="button"
                          onClick={() => handleAIRewrite("shorter")}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--fg)] hover:bg-[var(--hover)] transition-colors"
                        >
                          Shorter & punchier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAIRewrite("numbers")}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--fg)] hover:bg-[var(--hover)] transition-colors"
                        >
                          Add specific numbers
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAIRewrite("hook")}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--fg)] hover:bg-[var(--hover)] transition-colors"
                        >
                          Hook question headline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAIRewrite("emotional")}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--fg)] hover:bg-[var(--hover)] transition-colors"
                        >
                          More emotional tone
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleDuplicateSlide}
                    className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--hover)] transition-colors"
                    title="Duplicate slide"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteSlide}
                    className="p-1 rounded-md text-[var(--muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Right: Zoom controls, Safe Area, Mobile Preview */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                    <button
                      type="button"
                      onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
                      className="p-1 hover:text-[var(--fg)]"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
                      className="p-1 hover:text-[var(--fg)]"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="h-4 w-[1px] bg-[var(--line)]" />

                  {/* Safe Area Toggle */}
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--fg)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSafeArea}
                      onChange={(e) => setShowSafeArea(e.target.checked)}
                      className="accent-[#365300] dark:accent-[#c6f432]"
                    />
                    <span>Safe area</span>
                  </label>

                  {/* Fullscreen Mobile Preview */}
                  <button
                    type="button"
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[var(--muted)] hover:text-[var(--fg)] px-2 py-1 rounded-md hover:bg-[var(--hover)] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              {/* ---------------- CENTER CANVAS STAGE ---------------- */}
              <div
                className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden"
                style={{
                  backgroundImage:
                    bgPattern === "dots"
                      ? "radial-gradient(currentColor 1px, transparent 1px)"
                      : bgPattern === "grid"
                        ? "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)"
                        : "none",
                  backgroundSize: bgPattern === "dots" ? "16px 16px" : bgPattern === "grid" ? "20px 20px" : "auto",
                  color: isDarkTheme ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                }}
              >
                {/* Floating Context Bar directly over slide card */}
                <div
                  id="ctx-bar"
                  className="ctx-bar mb-3 bg-[var(--panel)] border border-[var(--line)] rounded-full px-3 py-1 shadow-md flex items-center gap-2 z-20 animate-in fade-in duration-150"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#365300] dark:text-[#c6f432] bg-[#c6f432]/20 px-2 py-0.5 rounded-full">
                    {currentSlide.label || "CTA"}
                  </span>

                  {/* 4 Color Palette Dots */}
                  <div className="flex items-center gap-1">
                    {[
                      activeScheme.bg,
                      activeScheme.a,
                      activeScheme.b || "#ff4fd8",
                      activeScheme.fg,
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full border border-black/10 cursor-pointer hover:scale-125 transition-transform"
                        style={{ backgroundColor: c }}
                        title={`Color ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="h-3 w-[1px] bg-[var(--line)]" />

                  <button
                    type="button"
                    onClick={() => handleAIRewrite("hook")}
                    className="p-1 hover:text-[#365300] dark:hover:text-[#c6f432] text-[var(--muted)] transition-colors"
                    title="Generate AI Hook"
                  >
                    <Sparkles className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDuplicateSlide}
                    className="p-1 hover:text-[var(--fg)] text-[var(--muted)] transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteSlide}
                    className="p-1 hover:text-red-500 text-[var(--muted)] transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* ACTIVE SLIDE CARD (Rendered at proportional aspect ratio) */}
                <div
                  id="active-card-stage"
                  className={cn(
                    "relative rounded-2xl shadow-2xl transition-all duration-200 overflow-hidden flex flex-col justify-between p-7 sm:p-9 select-text box-border",
                    aspectRatio === "4:5"
                      ? "w-[330px] h-[412px] sm:w-[390px] sm:h-[488px]"
                      : aspectRatio === "1:1"
                        ? "w-[340px] h-[340px] sm:w-[420px] sm:h-[420px]"
                        : aspectRatio === "9:16"
                          ? "w-[270px] h-[480px] sm:w-[300px] sm:h-[533px]"
                          : "w-[440px] h-[248px]"
                  )}
                  style={{
                    backgroundColor: activeScheme.bg,
                    backgroundImage:
                      selectedTemplateId === "minimal" || selectedTemplateId === "fashion"
                        ? "radial-gradient(circle at 85% 85%, rgba(250, 180, 50, 0.28) 0%, transparent 60%)"
                        : undefined,
                    color: activeScheme.fg,
                    transform: `scale(${zoomLevel / 100})`,
                  }}
                >
                  {/* Top Header of Card: Category Tag & Brand */}
                  <div className="flex items-center justify-between w-full z-10 flex-shrink-0">
                    <span
                      className="text-[10px] sm:text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-[5px] border"
                      style={{
                        borderColor: activeScheme.a || "#ff9500",
                        color: activeScheme.a || "#ff9500",
                      }}
                    >
                      {currentSlide.label || "ACTION"}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">
                      @swipera.io
                    </span>
                  </div>

                  {/* Center Content: Illustration / Sticker + Headline + Body */}
                  <div
                    className={cn(
                      "flex-1 flex flex-col justify-center my-auto space-y-3 py-3 z-10",
                      textAlign === "center" ? "items-center text-center" : textAlign === "right" ? "items-end text-right" : "items-start text-left"
                    )}
                  >
                    {/* 3D Purple Envelope Sticker with Pink Arrow */}
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-200/50 to-pink-100/50 dark:from-purple-900/40 dark:to-pink-900/30 flex items-center justify-center shadow-sm relative group cursor-pointer hover:scale-105 transition-transform">
                      <div className="text-3xl filter drop-shadow-md">
                        {currentSlide.emoji || "✉️"}
                      </div>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-pink-500 rounded-full flex items-center justify-center text-white text-[8px] font-black shadow-xs animate-bounce">
                        ↓
                      </div>
                    </div>

                    {/* Headline Editable directly */}
                    <h1
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateCurrentSlide({ title: e.currentTarget.textContent || "" })}
                      className="font-extrabold tracking-tight leading-[1.15] outline-none hover:ring-1 hover:ring-[#c6f432] rounded-md px-1 transition-all"
                      style={{
                        fontFamily: titleFont,
                        fontSize: `${(titleSize / 100) * 1.55}rem`,
                      }}
                    >
                      {currentSlide.title}
                    </h1>

                    {/* Body Text Editable directly */}
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateCurrentSlide({ body: e.currentTarget.textContent || "" })}
                      className="text-xs sm:text-[13px] leading-relaxed max-w-[90%] opacity-85 outline-none hover:ring-1 hover:ring-[#c6f432] rounded-md px-1 transition-all"
                      style={{ fontFamily: bodyFont }}
                    >
                      {currentSlide.body}
                    </p>

                    {/* Optional List Items Repeater */}
                    {currentSlide.items && currentSlide.items.length > 0 && (
                      <div className="space-y-1.5 w-full pt-1 text-left">
                        {currentSlide.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: activeScheme.a }}
                            />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Safe Area Overlay Guide */}
                  {showSafeArea && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-red-500/60 z-30 flex flex-col justify-between p-4">
                      <div className="bg-red-500/20 text-red-600 dark:text-red-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded text-center">
                        Header Safe Zone (Stories / Reels UI)
                      </div>
                      <div className="bg-red-500/20 text-red-600 dark:text-red-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded text-center">
                        Footer Safe Zone (Captions / Controls)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ---------------- QUICK STYLE BAR (#style-bar) ---------------- */}
              <div
                id="style-bar"
                className="h-10 flex-shrink-0 bg-[var(--panel)]/90 border-t border-[var(--line)] px-4 flex items-center justify-between gap-2 overflow-x-auto select-none"
              >
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#365300] dark:text-[#c6f432]" />
                    <span>Style</span>
                  </span>
                </div>

                {/* Quick style pills matching Swipera reference */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  {[
                    { id: "dark", label: "Dark Bold" },
                    { id: "brutalism", label: "Brutalism" },
                    { id: "neongeo", label: "Neon Geo" },
                    { id: "editorial", label: "Editorial Photo" },
                    { id: "swiss", label: "Swiss Bold" },
                    { id: "pop", label: "Neon Pop" },
                    { id: "minimal", label: "Minimal" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(style.id);
                        setSelectedSchemeIndex(0);
                        toast.success(`Style: ${style.label}`);
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                        selectedTemplateId === style.id
                          ? "bg-[var(--fg)] text-[var(--bg)] shadow-xs"
                          : "border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--fg)]"
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Shuffle Button (Electric Lime) */}
                  <button
                    type="button"
                    onClick={handleShuffleStyle}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c6f432] text-[#141414] font-black text-xs hover:brightness-95 transition-all shadow-xs"
                    title="Randomize style"
                  >
                    <Shuffle className="w-3 h-3 stroke-[2.5]" />
                    <span>Shuffle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("templates")}
                    className="text-xs font-bold text-[var(--muted)] hover:text-[var(--fg)] whitespace-nowrap"
                  >
                    See all &rarr;
                  </button>
                </div>
              </div>

              {/* ---------------- BOTTOM FILMSTRIP (#filmstrip-wrap) ---------------- */}
              <div
                id="filmstrip-wrap"
                className="h-20 flex-shrink-0 bg-[var(--panel)] border-t border-[var(--line)] px-4 py-2 flex items-center gap-2.5 overflow-x-auto z-10"
              >
                {slides.map((s, index) => {
                  const isActive = currentSlideIndex === index;

                  return (
                    <div
                      key={s.id}
                      onClick={() => setCurrentSlideIndex(index)}
                      className={cn(
                        "film-item relative w-12 h-15 rounded-lg border-2 cursor-pointer flex flex-col justify-between p-1 transition-all overflow-hidden flex-shrink-0",
                        isActive
                          ? "border-[#c6f432] bg-[#c6f432]/10 scale-105 shadow-xs"
                          : "border-[var(--line)] bg-[var(--bg)] hover:border-[var(--muted)] opacity-75 hover:opacity-100"
                      )}
                    >
                      <span className="text-[8px] font-black font-mono px-1 py-0.2 rounded bg-black/60 text-white self-start">
                        {index + 1}
                      </span>
                      <div className="text-[6.5px] font-bold leading-tight line-clamp-2 truncate">
                        {s.title}
                      </div>
                      <span className="text-[6.5px] font-mono uppercase opacity-60">
                        {s.type}
                      </span>
                    </div>
                  );
                })}

                {/* Add Slide Button Card (+) */}
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="w-12 h-15 rounded-lg border-2 border-dashed border-[var(--line)] hover:border-[#c6f432] text-[var(--muted)] hover:text-[#365300] dark:hover:text-[#c6f432] flex flex-col items-center justify-center gap-1 flex-shrink-0 transition-colors cursor-pointer"
                  title="Add new slide"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span className="text-[8px] font-bold">Add</span>
                </button>
              </div>
            </main>

            {/* ---------------------------------------------------------------
                RIGHT INSPECTOR PANEL (#inspector, 300px)
                Tabs: Content, Visual, AI (Smart Text Fit) + Easy Dock
                --------------------------------------------------------------- */}
            <aside
              id="inspector"
              className={cn(
                "w-[300px] flex-shrink-0 bg-[var(--panel)] border-l border-[var(--line)] flex flex-col transition-all duration-200 z-10",
                !isInspectorOpen && "w-0 overflow-hidden border-l-0"
              )}
              data-purpose="studio-inspector"
            >
              {/* Inspector Header */}
              <div className="h-11 px-3.5 border-b border-[var(--line)] flex items-center justify-between">
                <span className="text-xs font-extrabold text-[var(--fg)]">
                  Slide properties
                </span>
                <span className="text-[10px] font-mono text-[var(--muted)]">
                  {currentSlideIndex + 1}/{slides.length}
                </span>
              </div>

              {/* Three Sub-tabs: Content, Visual, AI */}
              <div className="p-2 border-b border-[var(--line)] bg-[var(--hover)]/40">
                <div className="seg bg-[var(--hover)] p-0.5 rounded-lg flex">
                  <button
                    type="button"
                    onClick={() => setInspectorTab("content")}
                    className={cn(
                      "flex-1 py-1 text-xs font-bold rounded-md transition-all",
                      inspectorTab === "content"
                        ? "bg-[var(--panel)] text-[var(--fg)] shadow-xs"
                        : "text-[var(--muted)] hover:text-[var(--fg)]"
                    )}
                  >
                    Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorTab("visual")}
                    className={cn(
                      "flex-1 py-1 text-xs font-bold rounded-md transition-all",
                      inspectorTab === "visual"
                        ? "bg-[var(--panel)] text-[var(--fg)] shadow-xs"
                        : "text-[var(--muted)] hover:text-[var(--fg)]"
                    )}
                  >
                    Visual
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorTab("ai")}
                    className={cn(
                      "flex-1 py-1 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1",
                      inspectorTab === "ai"
                        ? "bg-[var(--panel)] text-[var(--fg)] shadow-xs"
                        : "text-[var(--muted)] hover:text-[var(--fg)]"
                    )}
                  >
                    <Sparkles className="w-3 h-3 text-[#365300] dark:text-[#c6f432]" />
                    <span>AI</span>
                  </button>
                </div>
              </div>

              {/* Inspector Body */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
                {/* ---------- AI TAB: SMART TEXT FIT ---------- */}
                {inspectorTab === "ai" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Smart Text Fit Gauge Bar */}
                    <div className="p-3 rounded-xl border border-[var(--line)] bg-[#c6f432]/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-[var(--fg)] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#365300] dark:text-[#c6f432]" />
                          <span>Smart text fit</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#365300] dark:text-[#c6f432]">
                          Auto-filled • text {smartFitPercent}%
                        </span>
                      </div>

                      {/* Green Gauge Bar */}
                      <div className="w-full h-2 rounded-full bg-[var(--line)] overflow-hidden">
                        <div
                          className="h-full bg-[#c6f432] rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (smartFitPercent / 160) * 100)}%` }}
                        />
                      </div>

                      {/* Shorter / Fit Length / Longer Buttons */}
                      <div className="grid grid-cols-3 gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSmartFitPercent(110);
                            handleAIRewrite("shorter");
                          }}
                          className="py-1 px-1.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[10px] font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors text-center"
                        >
                          Shorter
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSmartFitPercent(140);
                            toast.success("Text optimized to ideal length");
                          }}
                          className="py-1 px-1.5 rounded-lg bg-[#c6f432] text-[#141414] text-[10px] font-black text-center shadow-2xs"
                        >
                          Fit length
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSmartFitPercent(160);
                            toast.info("Expanded text details");
                          }}
                          className="py-1 px-1.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[10px] font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors text-center"
                        >
                          Longer
                        </button>
                      </div>

                      {/* Auto-shrink checkbox */}
                      <label className="flex items-center justify-between text-[11px] font-medium text-[var(--fg)] pt-1 cursor-pointer">
                        <span>Auto-shrink text on overflow</span>
                        <input
                          type="checkbox"
                          checked={autoShrink}
                          onChange={(e) => setAutoShrink(e.target.checked)}
                          className="accent-[#365300] dark:accent-[#c6f432]"
                        />
                      </label>
                    </div>

                    {/* Fit All Button */}
                    <button
                      type="button"
                      onClick={() => toast.success("All 4 slides auto-fitted without overflow!")}
                      className="w-full py-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-xs font-bold text-[var(--fg)] hover:bg-[var(--hover)] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#365300] dark:text-[#c6f432]" />
                      <span>AI fit all overflowing slides</span>
                    </button>

                    {/* Quick AI Actions */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--muted)]">
                        Quick AI Actions
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAIRewrite("shorter")}
                          className="py-2 px-2.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-xs font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors text-left"
                        >
                          ✂️ Shorter
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAIRewrite("hook")}
                          className="py-2 px-2.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-xs font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors text-left"
                        >
                          🎯 Hook
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAIRewrite("numbers")}
                          className="py-2 px-2.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-xs font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors text-left"
                        >
                          🔢 Specific
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAIRewrite("emotional")}
                          className="py-2 px-2.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-xs font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors text-left"
                        >
                          ✨ Variant
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------- CONTENT TAB ---------- */}
                {inspectorTab === "content" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--muted)]">Slide Type</label>
                      <select
                        value={currentSlide.type}
                        onChange={(e) => updateCurrentSlide({ type: e.target.value as any })}
                        className="w-full p-2 text-xs font-semibold rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--fg)] outline-none"
                      >
                        <option value="cover">Cover Slide</option>
                        <option value="content">Content Slide</option>
                        <option value="list">Bullet List Slide</option>
                        <option value="quote">Quote / Stat Slide</option>
                        <option value="cta">Call to Action Slide</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--muted)]">Category Tag</label>
                      <input
                        type="text"
                        value={currentSlide.label || ""}
                        onChange={(e) => updateCurrentSlide({ label: e.target.value })}
                        className="w-full text-xs font-mono p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--muted)]">Headline</label>
                      <textarea
                        value={currentSlide.title}
                        onChange={(e) => updateCurrentSlide({ title: e.target.value })}
                        rows={2}
                        className="w-full text-xs font-mono p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--muted)]">Body Text</label>
                      <textarea
                        value={currentSlide.body}
                        onChange={(e) => updateCurrentSlide({ body: e.target.value })}
                        rows={3}
                        className="w-full text-xs font-mono p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* ---------- VISUAL TAB ---------- */}
                {inspectorTab === "visual" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--muted)]">Slide Emoji Icon</label>
                      <div className="flex gap-2">
                        {["✉️", "🔥", "⚡", "🎯", "🚀", "💡"].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => updateCurrentSlide({ emoji })}
                            className={cn(
                              "w-8 h-8 rounded-lg border flex items-center justify-center text-sm",
                              currentSlide.emoji === emoji
                                ? "border-[#c6f432] bg-[#c6f432]/10"
                                : "border-[var(--line)] bg-[var(--bg)]"
                            )}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[var(--muted)]">Image Attachment</label>
                      <div className="border border-dashed border-[var(--line)] rounded-xl p-3 text-center hover:border-[#c6f432] transition-colors cursor-pointer">
                        <Upload className="w-4 h-4 mx-auto text-[var(--muted)] mb-1" />
                        <span className="text-[11px] font-bold text-[var(--fg)]">Choose image</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ---------------- FIXED EASY DOCK (#easy-dock) ---------------- */}
              <div
                id="easy-dock"
                className="p-3 border-t border-[var(--line)] bg-[var(--panel)] flex-shrink-0"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsEasyMode(!isEasyMode);
                    toast.info(isEasyMode ? "Switched to Pro Mode" : "Switched to Easy Mode");
                  }}
                  className={cn(
                    "w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                    isEasyMode
                      ? "bg-[#c6f432] text-[#141414]"
                      : "border border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] hover:bg-[var(--hover)]"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEasyMode ? "Easy Mode: Active" : "Switch to Easy Mode"}</span>
                </button>
              </div>
            </aside>
          </>
        )}
      </div>

      {/* =========================================================================
          3. MODALS & OVERLAYS: PROJECTS MODAL, SHORTCUTS MODAL, PREVIEW MODAL
          ========================================================================= */}
      {/* Projects Modal */}
      {isProjectsModalOpen && (
        <div
          onClick={() => setIsProjectsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-base font-extrabold text-[var(--fg)]">My Projects</h3>
              <button
                type="button"
                onClick={() => setIsProjectsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--hover)] text-[var(--muted)] hover:text-[var(--fg)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { title: "New carousel", date: "Today", count: 4, style: "Minimal" },
                { title: "Growth Marketing Playbook", date: "Yesterday", count: 6, style: "Brutalism" },
                { title: "Weekly Tech Breakdown", date: "3 days ago", count: 5, style: "Swiss Bold" },
              ].map((proj, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setProjectTitle(proj.title);
                    setIsProjectsModalOpen(false);
                    toast.success(`Loaded "${proj.title}"`);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl border border-[var(--line)] hover:border-[#c6f432] hover:bg-[var(--hover)] transition-all cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[var(--fg)]">{proj.title}</div>
                    <div className="text-[10px] text-[var(--muted)]">
                      {proj.date} • {proj.count} slides • {proj.style}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-bold text-[var(--fg)] px-2.5 py-1 rounded-lg border border-[var(--line)]"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {isShortcutsModalOpen && (
        <div
          onClick={() => setIsShortcutsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-base font-extrabold text-[var(--fg)]">Keyboard Shortcuts</h3>
              <button
                type="button"
                onClick={() => setIsShortcutsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--hover)] text-[var(--muted)] hover:text-[var(--fg)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[var(--line)]">
                <span className="text-[var(--muted)]">Undo action</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--hover)] font-bold">⌘Z</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--line)]">
                <span className="text-[var(--muted)]">Redo action</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--hover)] font-bold">⌘Y</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--line)]">
                <span className="text-[var(--muted)]">Previous Slide</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--hover)] font-bold">&larr;</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--line)]">
                <span className="text-[var(--muted)]">Next Slide</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--hover)] font-bold">&rarr;</kbd>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted)]">Save & Export</span>
                <kbd className="px-2 py-0.5 rounded bg-[var(--hover)] font-bold">⌘S</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Preview Modal */}
      {isPreviewModalOpen && (
        <div
          onClick={() => setIsPreviewModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="phone relative w-[320px] h-[640px] rounded-[44px] bg-[#0b0b0f] p-3 shadow-2xl ring-2 ring-white/10 flex flex-col justify-between"
          >
            {/* Phone Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#0b0b0f] rounded-b-xl z-20" />

            {/* Simulated Phone Screen */}
            <div className="w-full h-full rounded-[34px] overflow-hidden bg-black flex flex-col justify-between p-4 pt-8">
              <div className="flex justify-between items-center text-white/70 text-[10px] font-bold">
                <span>Instagram</span>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-white hover:opacity-80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Centered slide in mobile */}
              <div
                className="w-full aspect-[4/5] rounded-xl overflow-hidden p-5 flex flex-col justify-between my-auto shadow-md"
                style={{ backgroundColor: activeScheme.bg, color: activeScheme.fg }}
              >
                <div className="text-[9px] font-black uppercase text-[#365300] dark:text-[#c6f432]">
                  {currentSlide.label || "ACTION"}
                </div>
                <div className="my-auto space-y-1.5 text-center">
                  <div className="text-xl">{currentSlide.emoji}</div>
                  <h2 className="font-extrabold text-sm leading-tight">{currentSlide.title}</h2>
                  <p className="text-[10px] opacity-80">{currentSlide.body}</p>
                </div>
                <div className="flex justify-between text-[8px] font-mono opacity-60">
                  <span>
                    {currentSlideIndex + 1}/{slides.length}
                  </span>
                  <span>Swipe &rarr;</span>
                </div>
              </div>

              <div className="text-center text-white/50 text-[9px]">
                Mobile Feed View Simulation
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Composer Sheet */}
      <ComposerSheet
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        initialPost={composerPost}
      />

      {/* Auth Modal overlay */}
      {isAuthModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAuthModalOpen(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
            <AuthForm
              initialMode={authModalMode}
              onClose={() => setIsAuthModalOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
}