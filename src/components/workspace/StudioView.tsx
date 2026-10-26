"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Pencil, 
  Copy, 
  Link2, 
  Calendar as CalendarIcon, 
  ChevronsUpDown,
  Filter, 
  ArrowUpDown, 
  Maximize2,
  Globe,
  Tv,
  Newspaper
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface IdeaCard {
  id: string;
  sourceType: "Web" | "YouTube" | "News";
  brandVoice: string;
  title: string;
  excerpt: string;
  date: string;
  sources: string[];
}

export interface PublishedCard {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
}

const IDEA_CARDS: IdeaCard[] = [
  {
    id: "idea-1",
    sourceType: "YouTube",
    brandVoice: "Brand Voice A",
    title: "I Explored the Top AI Tools in Every Category",
    excerpt: "... tools that can work with multiple AI models for research and answering questions. This is a spontaneous live discovery session, not a controlled benchmark ...",
    date: "2026-10-23",
    sources: [
      "YouTube - I Explored the Top AI Tools in Every Category",
    ],
  },
  {
    id: "idea-2",
    sourceType: "News",
    brandVoice: "Brand Voice A",
    title: "Pharma leaders should embed AI into business goals",
    excerpt: "Leaders can help their teams shift from survive mode to thrive mode by positioning AI as a tool that can expand the drug discovery capabilities and open new ...",
    date: "2026-10-25",
    sources: [
      "News - Pharma leaders should embed AI into business ...",
    ],
  },
  {
    id: "idea-3",
    sourceType: "YouTube",
    brandVoice: "Brand Voice A",
    title: "AirPods 5 vs AirPods Pro 3: The Better Deal Isn't Obvious",
    excerpt: "AirPods 5 Tips, Tricks & Hidden Features! AirPods Pro 3, exploring acoustic transparency and next-gen computational audio for active creators.",
    date: "2026-10-25",
    sources: [
      "YouTube - AirPods 5 vs AirPods Pro 3: The Better Deal Is...",
    ],
  },
  {
    id: "idea-4",
    sourceType: "Web",
    brandVoice: "Brand Voice A",
    title: "AI Agent Discovery and Security Posture Management",
    excerpt: "Technical articles exploring methods to discover, index, and secure autonomous AI agents across SaaS, cloud, and federated environments.",
    date: "2026-10-24",
    sources: [
      "media.mit.edu - NandaIndex: Making AI Agents Discove...",
      "docs.cyberark.com - Introduction to Secure AI agents | ...",
      "kowr.com - AI Security Posture Management (AI SPM)",
    ],
  },
];

const PUBLISHED_CARDS: PublishedCard[] = [
  {
    id: "pub-1",
    tag: "Manually created",
    title: "The humanoid robots of the future are here today. Tesla is ...",
    excerpt: "Tesla is officially accelerating production on its Optimus humanoid robots, moving general-purpose bipedal machines straight from research labs to factory floors. 🦾 Designed...",
    date: "2026-10-25 AM 12:08",
  },
  {
    id: "pub-2",
    tag: "Manually created",
    title: "Time Magazine's best inventions of 2026 list",
    excerpt: "TIME's annual Best Inventions of 2026 list has officially arrived, spotlighting the most impactful breakthroughs shaping the next era of global technology. 🚀 From cutting-edge...",
    date: "2026-10-23 PM 6:47",
  },
];

interface StudioViewProps {
  onOpenComposer: (post?: any) => void;
}

export function StudioView({ onOpenComposer }: StudioViewProps) {
  const [account, setAccount] = useState("theaiseed");

  const handleCopy = (card: IdeaCard) => {
    navigator.clipboard?.writeText?.(`${card.title}\n\n${card.excerpt}`);
    toast.success("Content copied to clipboard");
  };

  const handleGenerateDraft = (card: IdeaCard) => {
    onOpenComposer({
      title: card.title,
      content: card.excerpt,
    });
    toast.info("Draft generated in composer");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background px-4 lg:px-6 py-5 font-sans min-w-0">
      {/* 1. Content Studio Title Row matching reference screenshot */}
      <div className="flex items-center gap-2.5 mb-4 shrink-0">
        <div className="flex items-center text-foreground">
          {/* Wand Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7 shrink-0 text-foreground"
          >
            <path d="M6 21l15 -15l-3 -3l-15 15l3 3" />
            <path d="M15 6l3 3" />
            <path d="M9 3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
            <path d="M19 13a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Content Studio</h1>
      </div>

      {/* 2. Action Controls Row: Account + Discover Ideas + Create Content */}
      <div className="flex flex-wrap items-center gap-3 mb-5 shrink-0">
        {/* Instagram Account Pill */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 shadow-2xs text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <Image src="/images/platforms/instagram.svg" alt="Instagram" width={16} height={16} className="size-4 rounded-full shrink-0 object-cover" />
          <span className="text-foreground">{account}</span>
          <ChevronsUpDown className="size-4 text-muted-foreground ml-1" />
        </button>

        {/* Discover Content Ideas Button */}
        <button
          type="button"
          onClick={() => toast.info("Scanning idea sources for high-engagement topics...")}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 shadow-2xs text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          <Sparkles className="size-4 text-muted-foreground" />
          <span>Discover Content Ideas</span>
        </button>

        {/* Create Content Black Pill Button */}
        <button
          type="button"
          onClick={() => onOpenComposer()}
          className="flex items-center gap-2 rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-2 shadow-xs text-sm font-semibold hover:opacity-90 transition-all"
        >
          <Pencil className="size-4 stroke-[2.2]" />
          <span>Create Content</span>
        </button>
      </div>

      {/* 3. Four Equal Kanban Columns with responsive scroll containment */}
      <div className="flex-1 min-h-0 overflow-x-auto pb-2">
        <div className="grid grid-cols-4 gap-5 h-full min-w-[1120px] xl:min-w-0">
          {/* Column 1: Content Ideas (10) */}
          <div className="flex flex-col h-full rounded-2xl border border-border bg-[#fafafb] dark:bg-[#1f1f23] shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card/50">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-neutral-400 shrink-0" />
                <h2 className="text-sm font-semibold text-foreground">Content Ideas</h2>
                <span className="text-sm text-muted-foreground font-normal">(10)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Filter">
                  <Filter className="size-4" />
                </button>
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Sort">
                  <ArrowUpDown className="size-4" />
                </button>
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Expand">
                  <Maximize2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Cards List with Dashed Borders */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 sidebar-scrollbar">
              {IDEA_CARDS.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#26262b] p-4 space-y-3 shadow-2xs hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/80 px-2.5 py-1 text-xs font-semibold text-foreground">
                      {card.sourceType === "Web" && <Globe className="size-3.5 text-muted-foreground" />}
                      {card.sourceType === "YouTube" && <Tv className="size-3.5 text-red-500" />}
                      {card.sourceType === "News" && <Newspaper className="size-3.5 text-muted-foreground" />}
                      <span>{card.sourceType}</span>
                    </span>
                    <span className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {card.brandVoice}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm leading-snug text-foreground">
                    {card.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.excerpt}
                  </p>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <CalendarIcon className="size-3.5" />
                    <span>{card.date}</span>
                  </div>

                  {/* Sources list */}
                  {card.sources.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-border/50">
                      {card.sources.map((src, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer truncate">
                          <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{src}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Strip */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => handleCopy(card)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Copy text"
                    >
                      <Copy className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenerateDraft(card)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 text-xs font-semibold hover:opacity-90 shadow-2xs transition-all"
                    >
                      <Sparkles className="size-3.5 stroke-[2.2]" />
                      <span>Generate Draft</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Drafts (0) */}
          <div className="flex flex-col h-full rounded-2xl border border-amber-200/70 dark:border-amber-900/40 bg-[#fbf3e1] dark:bg-[#252018] shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200/60 dark:border-amber-900/30">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-amber-400 shrink-0" />
                <h2 className="text-sm font-semibold text-foreground">Drafts</h2>
                <span className="text-sm text-muted-foreground font-normal">(0)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Filter">
                  <Filter className="size-4" />
                </button>
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Sort">
                  <ArrowUpDown className="size-4" />
                </button>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground/60 font-medium select-none">
              No items yet
            </div>
          </div>

          {/* Column 3: Scheduled (0) */}
          <div className="flex flex-col h-full rounded-2xl border border-emerald-200/70 dark:border-emerald-900/40 bg-[#e8f9eb] dark:bg-[#1a261d] shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-200/60 dark:border-emerald-900/30">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
                <h2 className="text-sm font-semibold text-foreground">Scheduled</h2>
                <span className="text-sm text-muted-foreground font-normal">(0)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Sort">
                  <ArrowUpDown className="size-4" />
                </button>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground/60 font-medium select-none">
              No items yet
            </div>
          </div>

          {/* Column 4: Published (2) */}
          <div className="flex flex-col h-full rounded-2xl border border-blue-200/70 dark:border-blue-900/40 bg-[#e9f2ff] dark:bg-[#192233] shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-blue-200/60 dark:border-blue-900/30">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-blue-500 shrink-0" />
                <h2 className="text-sm font-semibold text-foreground">Published</h2>
                <span className="text-sm text-muted-foreground font-normal">(2)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Sort">
                  <ArrowUpDown className="size-4" />
                </button>
              </div>
            </div>

            {/* Solid White Cards */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 sidebar-scrollbar">
              {PUBLISHED_CARDS.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border border-border/80 bg-white dark:bg-[#26262b] p-4 space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  {/* Tag */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Pencil className="size-3" />
                    <span>{card.tag}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm leading-snug text-foreground">
                    {card.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.excerpt}
                  </p>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono pt-1">
                    <CalendarIcon className="size-3.5" />
                    <span>{card.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
