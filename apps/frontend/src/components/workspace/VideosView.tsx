"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Play,
  Pause,
  Upload,
  Video,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Plus,
  Check,
  CheckCircle2,
  Sliders,
  Palette,
  Type,
  Gauge,
  Subtitles,
  Share2,
  Download,
  Trash2,
  RefreshCw,
  Layers,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  FileVideo,
  Info,
  Send,
  X,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import {
  VIDEO_TEMPLATES,
  COLOR_PRESETS,
  FONT_PRESETS,
  SPOKEN_LANGUAGES,
  OUTPUT_FORMATS,
  PLATFORMS_LIST,
  DEFAULT_BRAND_KIT,
  VideoTemplate,
  BrandKitSettings,
} from "@/data/videoTemplates";
import { VideoCanvasPreview } from "./VideoCanvasPreview";
import { MakerzzProjectReviewView } from "./MakerzzProjectReviewView";

interface VideosViewProps {
  onOpenComposer?: (data?: any) => void;
}

export function VideosView({ onOpenComposer }: VideosViewProps) {
  // Main Flow switcher: "edit" (Edit my video) vs "post" (Just post it)
  const [flowMode, setFlowMode] = useState<"edit" | "post">("edit");

  // Sub-tabs: "studio" (creation) vs "projects" (my rendered reels)
  const [viewTab, setViewTab] = useState<"studio" | "projects">("studio");

  // Filter state for styles
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Input source: "take" (video upload) vs "faceless" (topic/script)
  const [sourceType, setSourceType] = useState<"take" | "faceless">("take");
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; size: string; path: string; duration: number }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [facelessTopic, setFacelessTopic] = useState("");

  // Selected Style IDs (Makerzz allows picking up to 6 at once)
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([
    "cap-paper",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // "More options" accordion state
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [lookPreset, setLookPreset] = useState("clean");
  const [lookStrength, setLookStrength] = useState(0.8);
  const [avatarCutout, setAvatarCutout] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.35);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [spokenLanguage, setSpokenLanguage] = useState("auto");
  const [outputFormat, setOutputFormat] = useState("9:16");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "instagram",
    "tiktok",
    "youtube",
  ]);
  const [commentToDmEnabled, setCommentToDmEnabled] = useState(false);
  const [commentKeyword, setCommentKeyword] = useState("GUIDE");
  const [dmOffer, setDmOffer] = useState("my free prompt pack");

  // "Customise" (Brand Kit) accordion state
  const [isCustomiseOpen, setIsCustomiseOpen] = useState(false);
  const [brandKit, setBrandKit] = useState<BrandKitSettings>(DEFAULT_BRAND_KIT);
  const [selectedColorPreset, setSelectedColorPreset] = useState<string>("house");
  const [selectedFontPreset, setSelectedFontPreset] = useState<string>("house");

  // Projects queue
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [activePreviewProject, setActivePreviewProject] = useState<any | null>(null);
  const [previewDisplayMode, setPreviewDisplayMode] = useState<"composite" | "raw">("raw");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBrandKit();
    fetchProjects();
  }, []);

  // Poll in-progress video jobs
  useEffect(() => {
    const hasActive = projects.some(
      (p) => p.status !== "READY" && p.status !== "FAILED"
    );
    if (!hasActive) return;

    const interval = setInterval(() => {
      fetchProjects(false);
    }, 2500);

    return () => clearInterval(interval);
  }, [projects]);

  const fetchBrandKit = async () => {
    try {
      const res = await fetch("/api/studio/me/brandkit");
      const data = await res.json();
      if (data.brandKit) {
        setBrandKit(data.brandKit);
      }
    } catch (e) {
      console.warn("Could not load brand kit", e);
    }
  };

  const fetchProjects = async (showLoading = true) => {
    if (showLoading) setIsLoadingProjects(true);
    try {
      const res = await fetch("/api/studio/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
        setActivePreviewProject((prev: any) => {
          if (!prev) return null;
          const updated = data.projects.find((p: any) => p.id === prev.id);
          return updated || prev;
        });
      }
    } catch (e) {
      console.warn("Could not load projects", e);
    } finally {
      if (showLoading) setIsLoadingProjects(false);
    }
  };

  const handleDeleteProject = async (project: any) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/studio/projects/${encodeURIComponent(project.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete video");
      setProjects((current) => current.filter((item) => item.id !== project.id));
      setActivePreviewProject((current: any) => current?.id === project.id ? null : current);
      toast.success("Video deleted");
    } catch (error: any) {
      toast.error(error.message || "Could not delete video");
    }
  };

  const handleSaveBrandKit = async () => {
    try {
      const res = await fetch("/api/studio/me/brandkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandKit),
      });
      if (res.ok) {
        toast.success("Brand kit saved", {
          description: "New videos will start with these colors and fonts.",
        });
      }
    } catch {
      toast.error("Failed to save brand kit");
    }
  };

  const handleApplyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setSelectedColorPreset(preset.id);
    setBrandKit((prev) => ({
      ...prev,
      accent: preset.colors.accent,
      accentHi: preset.colors.accentHi,
      accent2: preset.colors.accent2,
      bg: preset.colors.bg,
      panel: preset.colors.panel,
      panel2: preset.colors.panel2,
      ink: preset.colors.ink,
      dim: preset.colors.dim,
      line: preset.colors.line,
    }));
  };

  const handleApplyFontPreset = (preset: typeof FONT_PRESETS[0]) => {
    setSelectedFontPreset(preset.id);
    setBrandKit((prev) => ({
      ...prev,
      font: {
        ...prev.font,
        display: preset.display,
        body: preset.body,
        serif: preset.serif,
      },
    }));
  };

  const toggleStyleSelection = (styleId: string) => {
    // Automatically synchronize brand kit colors with selected style identity
    if (styleId === "cap-paper" || styleId.includes("paper")) {
      setBrandKit((prev) => ({
        ...prev,
        bg: "#F4F1EA",
        ink: "#111111",
        accent: "#F59E0B",
        accentHi: "#FBBF24",
        panel: "#FFFFFF",
        panel2: "#E5E1D8",
        line: "rgba(0,0,0,0.08)",
      }));
    } else if (styleId === "limeslides" || styleId === "cap-slides" || styleId.includes("lime")) {
      setBrandKit((prev) => ({
        ...prev,
        bg: "#C6FF3D",
        ink: "#000000",
        accent: "#000000",
        accentHi: "#1A1A1A",
        panel: "#121214",
      }));
    } else if (styleId === "classified-yt" || styleId.includes("classified")) {
      setBrandKit((prev) => ({
        ...prev,
        bg: "#0B0B0C",
        ink: "#FFFFFF",
        accent: "#AE0006",
        accentHi: "#FF3B4E",
        panel: "#19191B",
      }));
    } else if (styleId === "documentary") {
      setBrandKit((prev) => ({
        ...prev,
        bg: "#100F0D",
        ink: "#F7F4EB",
        accent: "#D4AF37",
        accentHi: "#F5C542",
        panel: "#1A1710",
      }));
    }

    setSelectedStyleIds((prev) => {
      if (prev.length === 1 && prev[0] === styleId) {
        return prev;
      }
      return [styleId];
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    // In-browser detached probe to detect metadata
    let duration = 38.0;
    try {
      const probeVideo = document.createElement("video");
      probeVideo.preload = "metadata";
      probeVideo.src = objectUrl;
      await new Promise<void>((resolve) => {
        probeVideo.onloadedmetadata = () => {
          duration = Math.round((probeVideo.duration || 38.0) * 10) / 10;
          resolve();
        };
        probeVideo.onerror = () => resolve();
        setTimeout(resolve, 2000);
      });
    } catch {
      // fallback
    }

    // Save actual file bytes to backend /public/uploads/videos
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/studio/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const serverPath = data.upload?.path || `/uploads/videos/${file.name}`;

      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: sizeMb,
          path: serverPath,
          duration,
        },
      ]);
      toast.success(`Uploaded "${file.name}" (${duration}s)`);
    } catch {
      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: sizeMb,
          path: objectUrl,
          duration,
        },
      ]);
      toast.success(`Loaded "${file.name}" (${duration}s)`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateVideo = async () => {
    if (sourceType === "take" && uploadedFiles.length === 0) {
      toast.error("Please add your video take first");
      return;
    }
    if (sourceType === "faceless" && !facelessTopic.trim()) {
      toast.error("Please write a topic or script for your faceless video");
      return;
    }
    if (selectedStyleIds.length === 0) {
      toast.error("Please select at least one video style");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create project for each selected style variation
      const requests = selectedStyleIds.map((styleId) => {
        const payload = {
          mode: sourceType === "faceless" ? "faceless" : "edit",
          styleIds: [styleId],
          platforms: selectedPlatforms,
          automation: commentToDmEnabled
            ? {
                keyword: commentKeyword.trim().toUpperCase(),
                offer: dmOffer.trim(),
              }
            : undefined,
          options: {
            avatarCutout,
            look: lookPreset,
            lookStrength,
          },
          settings: {
            ...brandKit,
            music: { on: musicEnabled, volume: musicVolume },
            sfx: { on: sfxEnabled, volume: sfxVolume },
          },
          brief: {
            outputFormat,
            topic: sourceType === "faceless" ? facelessTopic : undefined,
          },
          source: {
            kind: sourceType === "faceless" ? "faceless" : "upload",
            uploadPaths: uploadedFiles.map((f) => f.path),
            durationSec: uploadedFiles[0]?.duration || 45,
            topic: facelessTopic,
            language: spokenLanguage,
          },
        };

        return fetch("/api/studio/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then((r) => r.json());
      });

      const results = await Promise.all(requests);
      const firstCreated = results.find((r) => r?.project)?.project;

      toast.success("Videos are editing in parallel!", {
        description: `${selectedStyleIds.length} variation(s) are rendering now.`,
      });

      await fetchProjects();
      if (firstCreated) {
        setActivePreviewProject(firstCreated);
      }
      setViewTab("projects");
    } catch (err: any) {
      toast.error("Could not start video edit", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter video styles
  const filteredTemplates = VIDEO_TEMPLATES.filter((tpl) => {
    if (selectedTag !== "all") {
      if (!tpl.pickerTags?.includes(selectedTag)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tpl.name.toLowerCase().includes(q) ||
        tpl.pitch.toLowerCase().includes(q) ||
        tpl.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate estimated credits based on Makerzz formula: base 100 + 40/shorts + styles
  const estimatedCredits = Math.max(100, selectedStyleIds.length * 60);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/60 font-sans text-slate-900 pb-28 select-text">
      {/* Top Header & Flow Selector */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 pb-2">
        {/* Flow Mode Switcher: "Edit my video" vs "Just post it" */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex bg-slate-200/70 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setFlowMode("edit");
                setViewTab("studio");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                flowMode === "edit"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              Edit my video
            </button>
            <button
              onClick={() => {
                setFlowMode("post");
                if (onOpenComposer) onOpenComposer();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                flowMode === "post"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Send className="w-3.5 h-3.5 text-slate-600" />
              Just post it
            </button>
          </div>

          {/* View Tab Toggle: Studio Creator vs Rendered Projects Queue */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewTab("studio")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewTab === "studio"
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setViewTab("projects")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                viewTab === "projects"
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              My Videos
              {projects.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {projects.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Hero Title (hidden when inspecting a specific project review page) */}
        {!(viewTab === "projects" && activePreviewProject) && (
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
              Create a <span className="text-brand-500">video</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
              Drop your raw takes in, pick up to 6 styles, and our AI edits finished vertical reels in parallel with captions, sound, and cuts on the beat.
            </p>
          </header>
        )}
      </div>

      {/* Main Workspace Body */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6">
        {viewTab === "studio" ? (
          <div className="space-y-8">
            {/* ========================================================================= */}
            {/* SECTION 1: WHAT DO YOU HAVE? (VIDEO UPLOAD & PROBING)                     */}
            {/* ========================================================================= */}
            <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-mono">
                    1. What do you have?
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your raw take, talking clips, or type a topic for a faceless video.
                  </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setSourceType("take")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      sourceType === "take"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Take or clips
                  </button>
                  <button
                    onClick={() => setSourceType("faceless")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      sourceType === "faceless"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Faceless explainer
                  </button>
                </div>
              </div>

              {sourceType === "take" ? (
                <div>
                  {/* Upload Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-brand-500/70 bg-slate-50/60 hover:bg-brand-50/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-brand-500 group-hover:scale-105 transition-all shadow-xs mb-3">
                      {isUploading ? (
                        <RefreshCw className="w-5 h-5 animate-spin text-brand-500" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {isUploading ? "Inspecting video..." : "Drop your raw video take here, or click to browse"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      MP4, MOV, WebM · Auto-probed for duration & resolution
                    </p>
                  </div>

                  {/* Uploaded File List Chips */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                        >
                          <FileVideo className="w-4 h-4 text-brand-500" />
                          <span className="font-semibold text-slate-800 truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-slate-400">({file.size})</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                            {file.duration}s
                          </span>
                          <button
                            onClick={() =>
                              setUploadedFiles(
                                uploadedFiles.filter((_, i) => i !== idx)
                              )
                            }
                            className="text-slate-400 hover:text-red-600 transition-colors ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 font-mono">
                    Topic or Script for AI Video Generation
                  </label>
                  <textarea
                    rows={4}
                    value={facelessTopic}
                    onChange={(e) => setFacelessTopic(e.target.value)}
                    placeholder="e.g. 5 growth tactics that generated $1M ARR for micro-SaaS startups in 2026 without running paid ads..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-1 focus:ring-brand-500 bg-white"
                  />
                </div>
              )}
            </section>

            {/* ========================================================================= */}
            {/* SECTION 2: PICK A STYLE (ALL 26 VIDEO STYLES GRID)                        */}
            {/* ========================================================================= */}
            <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900 font-mono">
                      2. Pick a style
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
                      {selectedStyleIds.length} of 6 selected
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200/60 text-xs font-mono font-medium">
                      {filteredTemplates.length} styles available
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose up to 6 styles at once. Each variation is edited in parallel so you can pick the best performer.
                  </p>
                </div>

                {/* Filter tags & Search */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {["all", "trending", "new", "bold", "polished", "minimal"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-colors ${
                          selectedTag === tag
                            ? "bg-slate-900 text-white font-semibold"
                            : "text-slate-500 hover:text-slate-800 bg-slate-100"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search styles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-36 focus:outline-hidden focus:ring-1 focus:ring-brand-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Grid of All Styles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => {
                  const isSelected = selectedStyleIds.includes(template.id);
                  const isPlaying = playingVideoId === template.id;

                  return (
                    <div
                      key={template.id}
                      onClick={() => toggleStyleSelection(template.id)}
                      onMouseEnter={() => setPlayingVideoId(template.id)}
                      onMouseLeave={() => setPlayingVideoId(null)}
                      className={`group relative rounded-2xl border-2 overflow-hidden transition-all duration-150 cursor-pointer flex flex-col justify-between select-none ${
                        isSelected
                          ? "border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/10 shadow-sm"
                          : "border-slate-200/90 hover:border-slate-300 bg-white hover:shadow-xs"
                      }`}
                    >
                      {/* Video / Poster Stage */}
                      <div className="relative aspect-[9/16] bg-slate-950 overflow-hidden pointer-events-none">
                        {isPlaying ? (
                          <video
                            src={template.preview}
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={template.poster}
                            alt={template.name}
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}

                        {/* Badges on top-left */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                          <span className="px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-[10px] font-mono font-semibold text-white">
                            {template.aspect}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-[10px] font-mono text-slate-200">
                            {template.length}
                          </span>
                        </div>

                        {/* Top-Right Selection Checkmark Pill (Exact Makerzz design) */}
                        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-brand-500 text-white shadow-md ring-2 ring-white/90 scale-105"
                                : "bg-black/40 text-transparent border border-white/60 backdrop-blur-xs"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        </div>

                        {/* Audio Mute / Preview indicator */}
                        {isPlaying && (
                          <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-auto">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsMuted(!isMuted);
                              }}
                              className="p-1.5 rounded-lg bg-black/70 text-white hover:bg-black transition-colors"
                              title={isMuted ? "Unmute sound" : "Mute sound"}
                            >
                              {isMuted ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Meta Content */}
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <h3 className="font-bold text-slate-900 text-xs tracking-tight line-clamp-1">
                              {template.name}
                            </h3>
                            {template.pickerTags?.[0] && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase bg-slate-100 text-slate-600">
                                {template.pickerTags[0]}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {template.pitch}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {template.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-mono"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 3: MORE OPTIONS (ACCORDION)                                       */}
            {/* ========================================================================= */}
            <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsMoreOptionsOpen(!isMoreOptionsOpen)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Sliders className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-mono">
                      More options
                    </h3>
                    <p className="text-xs text-slate-500">
                      Look & sound, language, platforms, comment-to-DM, format
                    </p>
                  </div>
                </div>
                {isMoreOptionsOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isMoreOptionsOpen && (
                <div className="p-5 sm:p-6 pt-1 border-t border-slate-100 space-y-6">
                  {/* Look & Sound */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Look Preset */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 font-mono">
                        Color Grading Look
                      </label>
                      <select
                        value={lookPreset}
                        onChange={(e) => setLookPreset(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="clean">Clean (Natural Rec.709 studio grade)</option>
                        <option value="podcast">Podcast (High-contrast warm look)</option>
                        <option value="cinematic">Cinematic (Teal and orange film grade)</option>
                      </select>
                    </div>

                    {/* Look Strength Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 font-mono">
                        <span>Look Strength</span>
                        <span>{Math.round(lookStrength * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={lookStrength}
                        onChange={(e) =>
                          setLookStrength(parseFloat(e.target.value))
                        }
                        className="w-full accent-brand-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-4 border-t border-slate-100">
                    <input
                      id="avatar-cutout"
                      type="checkbox"
                      checked={avatarCutout}
                      onChange={(e) => setAvatarCutout(e.target.checked)}
                      className="mt-0.5 rounded text-brand-500 accent-brand-500"
                    />
                    <div className="space-y-1">
                      <label htmlFor="avatar-cutout" className="text-xs font-semibold text-slate-700 font-mono">
                        Remove speaker background
                      </label>
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        Optional. When enabled, the full source clip is sent to Replicate for a transparent cutout (up to 60 seconds). Requires REPLICATE_API_TOKEN on the server.
                      </p>
                    </div>
                  </div>

                  {/* Sound Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    {/* Music Toggle */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 font-mono">
                          Background Music
                        </label>
                        <input
                          type="checkbox"
                          checked={musicEnabled}
                          onChange={(e) => setMusicEnabled(e.target.checked)}
                          className="rounded text-brand-500 accent-brand-500"
                        />
                      </div>
                      {musicEnabled && (
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-400 font-mono">
                            Volume
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={musicVolume}
                            onChange={(e) =>
                              setMusicVolume(parseFloat(e.target.value))
                            }
                            className="w-full accent-brand-500"
                          />
                          <span className="text-[11px] font-mono text-slate-600 w-8">
                            {Math.round(musicVolume * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* SFX Toggle */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 font-mono">
                          Sound Effects (Punches, Whooshes)
                        </label>
                        <input
                          type="checkbox"
                          checked={sfxEnabled}
                          onChange={(e) => setSfxEnabled(e.target.checked)}
                          className="rounded text-brand-500 accent-brand-500"
                        />
                      </div>
                      {sfxEnabled && (
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-400 font-mono">
                            Volume
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={sfxVolume}
                            onChange={(e) =>
                              setSfxVolume(parseFloat(e.target.value))
                            }
                            className="w-full accent-brand-500"
                          />
                          <span className="text-[11px] font-mono text-slate-600 w-8">
                            {Math.round(sfxVolume * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Language and Format */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 font-mono">
                        Spoken Language
                      </label>
                      <select
                        value={spokenLanguage}
                        onChange={(e) => setSpokenLanguage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      >
                        {SPOKEN_LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 font-mono">
                        Output Format
                      </label>
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      >
                        {OUTPUT_FORMATS.map((fmt) => (
                          <option key={fmt.value} value={fmt.value}>
                            {fmt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-semibold text-slate-700 font-mono block">
                      Target Platforms
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS_LIST.map((plat) => {
                        const isPlatSelected = selectedPlatforms.includes(
                          plat.id
                        );
                        return (
                          <button
                            key={plat.id}
                            type="button"
                            onClick={() => {
                              if (isPlatSelected) {
                                if (selectedPlatforms.length > 1) {
                                  setSelectedPlatforms(
                                    selectedPlatforms.filter((p) => p !== plat.id)
                                  );
                                }
                              } else {
                                setSelectedPlatforms([
                                  ...selectedPlatforms,
                                  plat.id,
                                ]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isPlatSelected
                                ? "bg-slate-900 text-white shadow-2xs font-semibold"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {plat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comment-to-DM Automation */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-900 font-mono flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
                          DM everyone who comments a keyword
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          We add “Comment KEYWORD …” to the Instagram caption and reply in DMs automatically.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={commentToDmEnabled}
                        onChange={(e) => setCommentToDmEnabled(e.target.checked)}
                        className="rounded text-brand-500 accent-brand-500"
                      />
                    </div>

                    {commentToDmEnabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Keyword
                          </label>
                          <input
                            type="text"
                            value={commentKeyword}
                            onChange={(e) =>
                              setCommentKeyword(
                                e.target.value.replace(/\s+/g, "").toUpperCase()
                              )
                            }
                            placeholder="GUIDE"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs uppercase font-mono font-bold bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            What they get
                          </label>
                          <input
                            type="text"
                            value={dmOffer}
                            onChange={(e) => setDmOffer(e.target.value)}
                            placeholder="my free prompt pack"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* ========================================================================= */}
            {/* SECTION 4: CUSTOMISE / BRAND KIT (WITH LIVE CANVAS PREVIEW)              */}
            {/* ========================================================================= */}
            <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setIsCustomiseOpen(!isCustomiseOpen)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center">
                    <Palette className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-mono">
                      Customise
                    </h3>
                    <p className="text-xs text-slate-500">
                      Colours, fonts, speed, captions, sound — optional
                    </p>
                  </div>
                </div>
                {isCustomiseOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isCustomiseOpen && (
                <div className="p-5 sm:p-6 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Controls on Left */}
                    <div className="lg:col-span-8 space-y-6">
                      {/* Color Themes */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 font-mono">
                          Color Theme Presets
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {COLOR_PRESETS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleApplyColorPreset(p)}
                              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                                selectedColorPreset === p.id
                                  ? "border-brand-500 bg-brand-50/30 ring-1 ring-brand-500"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: p.colors.accent }}
                              />
                              <span className="text-xs font-medium text-slate-800 truncate">
                                {p.name}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Hex Pickers */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div>
                            <label className="text-[11px] text-slate-500 block mb-1 font-mono">
                              Accent
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={brandKit.accent || "#AE0006"}
                                onChange={(e) =>
                                  setBrandKit({
                                    ...brandKit,
                                    accent: e.target.value,
                                  })
                                }
                                className="w-7 h-7 rounded border-0 cursor-pointer p-0"
                              />
                              <span className="font-mono text-xs">
                                {brandKit.accent}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-500 block mb-1 font-mono">
                              Highlight
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={brandKit.accentHi || "#FF3B4E"}
                                onChange={(e) =>
                                  setBrandKit({
                                    ...brandKit,
                                    accentHi: e.target.value,
                                  })
                                }
                                className="w-7 h-7 rounded border-0 cursor-pointer p-0"
                              />
                              <span className="font-mono text-xs">
                                {brandKit.accentHi}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-500 block mb-1 font-mono">
                              Background
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={brandKit.bg || "#000000"}
                                onChange={(e) =>
                                  setBrandKit({
                                    ...brandKit,
                                    bg: e.target.value,
                                  })
                                }
                                className="w-7 h-7 rounded border-0 cursor-pointer p-0"
                              />
                              <span className="font-mono text-xs">
                                {brandKit.bg}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Font Presets */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="text-xs font-semibold text-slate-700 font-mono">
                          Typography Pairing
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {FONT_PRESETS.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => handleApplyFontPreset(f)}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                selectedFontPreset === f.id
                                  ? "border-brand-500 bg-brand-50/30 ring-1 ring-brand-500"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <span className="block font-bold text-xs text-slate-900">
                                {f.name}
                              </span>
                              <span className="text-[11px] text-slate-500 truncate block">
                                {f.display} / {f.body}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Captions Style & Speed */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-mono">
                            Captions Animation
                          </label>
                          <select
                            value={
                              brandKit.captionStyle ||
                              brandKit.caption?.style ||
                              "word"
                            }
                            onChange={(e) =>
                              setBrandKit({
                                ...brandKit,
                                captionStyle: e.target.value as any,
                                caption: {
                                  ...brandKit.caption,
                                  style: e.target.value as any,
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                          >
                            <option value="word">Word by word</option>
                            <option value="karaoke">Karaoke</option>
                            <option value="line">Line by line</option>
                            <option value="none">No captions</option>
                          </select>
                        </div>

                        {/* Speed Pacing */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 font-mono">
                            Pacing Speed
                          </label>
                          <div className="flex gap-2">
                            {[1, 1.1, 1.2, 1.3].map((spd) => (
                              <button
                                key={spd}
                                type="button"
                                onClick={() =>
                                  setBrandKit({ ...brandKit, speed: spd as any })
                                }
                                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                  brandKit.speed === spd
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Caption Size, Box, Case */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Size</span>
                            <span className="font-mono">
                              {brandKit.caption?.size || 58}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="30"
                            max="110"
                            value={brandKit.caption?.size || 58}
                            onChange={(e) =>
                              setBrandKit({
                                ...brandKit,
                                caption: {
                                  ...brandKit.caption,
                                  size: parseInt(e.target.value, 10),
                                },
                              })
                            }
                            className="w-full accent-brand-500"
                          />
                        </div>

                        <div className="flex items-center justify-between sm:justify-center gap-2 pt-2 sm:pt-4">
                          <label className="text-xs font-medium text-slate-700">
                            UPPERCASE
                          </label>
                          <input
                            type="checkbox"
                            checked={brandKit.caption?.case === "upper"}
                            onChange={(e) =>
                              setBrandKit({
                                ...brandKit,
                                caption: {
                                  ...brandKit.caption,
                                  case: e.target.checked ? "upper" : "natural",
                                },
                              })
                            }
                            className="rounded text-brand-500 accent-brand-500"
                          />
                        </div>

                        <div className="flex items-center justify-between sm:justify-center gap-2 pt-2 sm:pt-4">
                          <label className="text-xs font-medium text-slate-700">
                            Contrast Box
                          </label>
                          <input
                            type="checkbox"
                            checked={!!brandKit.caption?.box}
                            onChange={(e) =>
                              setBrandKit({
                                ...brandKit,
                                caption: {
                                  ...brandKit.caption,
                                  box: e.target.checked,
                                },
                              })
                            }
                            className="rounded text-brand-500 accent-brand-500"
                          />
                        </div>
                      </div>

                      {/* Save Brand Kit Button */}
                      <div className="flex justify-end pt-3">
                        <button
                          type="button"
                          onClick={handleSaveBrandKit}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Save as Brand Kit Defaults
                        </button>
                      </div>
                    </div>

                    {/* Live Preview on Right */}
                    <div className="lg:col-span-4 flex flex-col items-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <div className="w-full flex items-center justify-between mb-3">
                        <span className="font-bold text-xs text-slate-800 font-mono flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                          Live Preview
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {outputFormat}
                        </span>
                      </div>
                      <VideoCanvasPreview
                        settings={brandKit}
                        videoSrc={uploadedFiles[0]?.path}
                        styleId={selectedStyleIds[0] || "cap-paper"}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : activePreviewProject ? (
          <MakerzzProjectReviewView
            project={activePreviewProject}
            onBack={() => setActivePreviewProject(null)}
            onProjectUpdated={(updated) => {
              setActivePreviewProject(updated);
              setProjects((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
              );
            }}
            onOpenComposer={onOpenComposer}
          />
        ) : (
          /* ========================================================================= */
          /* RENDERED VIDEOS QUEUE / BATCH LIST                                        */
          /* ========================================================================= */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-mono">
                  Projects
                </h2>
                <p className="text-xs text-slate-500">
                  Click any project to open the Makerzz Studio Review, quality checks, scene editor, and Behind the edit sources.
                </p>
              </div>
              <button
                onClick={() => fetchProjects(true)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                title="Refresh videos"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoadingProjects ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <FileVideo className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800">
                  No videos created yet
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Pick a template style or upload your raw take to generate your first reel.
                </p>
                <button
                  onClick={() => setViewTab("studio")}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-500 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create a Video Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((proj) => {
                  const isReady = proj.status === "READY";
                  return (
                    <div
                      key={proj.id}
                      onClick={() => setActivePreviewProject(proj)}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md overflow-hidden flex flex-col justify-between cursor-pointer transition-all"
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-base text-slate-900 line-clamp-1">
                            {proj.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              isReady
                                ? "bg-[#FFF1EB] text-[#E85C33] border border-[#F7CFC0]"
                                : "bg-amber-100 text-amber-800 animate-pulse"
                            }`}
                          >
                            {isReady ? "• READY TO REVIEW" : proj.status}
                          </span>
                        </div>

                        {!isReady && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                              <span>Editing in parallel...</span>
                              <span>{proj.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#E85C33] h-full transition-all duration-500"
                                style={{ width: `${proj.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="relative aspect-[9/16] bg-[#F4F1EA] rounded-xl overflow-hidden group">
                          {proj.thumbnailUrl &&
                          !proj.thumbnailUrl.includes("makerzz.space/showcase") ? (
                            <img
                              src={proj.thumbnailUrl.replace(
                                "/uploads/videos/",
                                "/api/studio/video/"
                              )}
                              alt={proj.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : proj.outputVideoUrl ? (
                            <video
                              src={proj.outputVideoUrl.replace(
                                "/uploads/videos/",
                                "/api/studio/video/"
                              )}
                              preload="metadata"
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          ) : (
                            <img
                              src={
                                proj.thumbnailUrl ||
                                "https://makerzz.space/showcase/face/classified-yt/poster.jpg"
                              }
                              alt={proj.title}
                              className="w-full h-full object-cover opacity-85"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                            <div className="w-11 h-11 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                            {proj.primaryStyleId === "cap-paper"
                              ? "Paper Studio"
                              : proj.primaryStyleId || "Paper Studio"}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100">
                            {proj.scenes?.length || 6} scenes
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            6 pass · 1 warn
                          </span>
                        </div>
                      </div>

                      <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">
                          {new Date(proj.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleDeleteProject(proj);
                            }}
                            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            aria-label={`Delete ${proj.title}`}
                            title="Delete video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 rounded-lg bg-[#E85C33] text-white font-semibold text-xs">
                            Review Edit →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM FLOATING ACTION BAR (EXACT MAKERZZ DOCK)                     */}
      {/* ========================================================================= */}
      {viewTab === "studio" && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 p-3 sm:p-3.5 pl-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl pointer-events-auto">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">
                {selectedStyleIds.length}{" "}
                {selectedStyleIds.length === 1 ? "version" : "versions"} selected ·
                edited in parallel
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Failed edits refund your credits automatically.
              </p>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCreateVideo}
              className="shrink-0 py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Rendering...
                </>
              ) : (
                <>
                  <span>Create my video</span>
                  <span className="font-normal font-mono opacity-80 text-xs">
                    · {estimatedCredits} cr
                  </span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
