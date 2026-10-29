"use client";

import React, { useState, useEffect } from "react";
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
  Newspaper,
  Loader2,
  Trash2,
  CheckCircle2,
  Clock,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PostRecord, IdeaRecord } from "@/types";

interface StudioViewProps {
  onOpenComposer: (post?: any) => void;
}

const INITIAL_STUDIO_IDEAS: IdeaRecord[] = [
  {
    id: "idea_sample_1",
    workspaceId: "ws_default",
    title: "Why developers are abandoning bloated cloud microservices for single binaries",
    excerpt: "An analysis of deployment velocity, cost reduction, and architecture simplification trends in 2026.",
    sourceType: "AI Engine",
    viralityScore: 98,
    tags: ["Architecture", "Engineering", "BuildInPublic"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "idea_sample_2",
    workspaceId: "ws_default",
    title: "The $0 to $50k MRR Playbook: Why PLG is beating outbound sales",
    excerpt: "Breaking down how self-serve activation loops drive lower CAC and higher LTV for modern developer tools.",
    sourceType: "X Viral",
    viralityScore: 92,
    tags: ["Growth", "SaaS", "Strategy"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const INITIAL_STUDIO_POSTS: PostRecord[] = [
  {
    id: "post_sample_1",
    workspaceId: "ws_default",
    title: "The Agentic Engineering Stack",
    content: "Here is what 6 months of shipping autonomous sub-agents taught our engineering team:\n\n1. Deterministic scaffolds beat infinite generation loops.\n2. Bounded AST inspection catches 90% of regressions before deploy.\n3. Keep your data layer typed and isolated.",
    status: "PUBLISHED",
    platforms: ["threads", "x", "linkedin"],
    rawThreads: [],
    mediaUrls: [],
    scheduledAt: null,
    failureReason: null,
    impressions: 4820,
    engagements: 312,
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "post_sample_2",
    workspaceId: "ws_default",
    title: "PostgreSQL Concurrency at High QPS",
    content: "Optimistic locking vs row-level advisory locks for queue dispatchers. A quick breakdown of why connection pooling failed us first.",
    status: "DRAFT",
    platforms: ["threads", "linkedin"],
    rawThreads: [],
    mediaUrls: [],
    scheduledAt: null,
    failureReason: null,
    impressions: 0,
    engagements: 0,
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function StudioView({ onOpenComposer }: StudioViewProps) {
  const [account, setAccount] = useState("theaiseed");
  const [ideas, setIdeas] = useState<IdeaRecord[]>(INITIAL_STUDIO_IDEAS);
  const [posts, setPosts] = useState<PostRecord[]>(INITIAL_STUDIO_POSTS);
  const [loading, setLoading] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const fetchStudioData = async () => {
    try {
      const [ideasRes, postsRes] = await Promise.all([
        fetch("/api/ideas"),
        fetch("/api/posts"),
      ]);
      const ideasData = await ideasRes.json();
      const postsData = await postsRes.json();

      if (ideasData.ideas && ideasData.ideas.length > 0) setIdeas(ideasData.ideas);
      if (postsData.posts && postsData.posts.length > 0) setPosts(postsData.posts);
    } catch (err) {
      // Non-blocking background sync
    }
  };

  useEffect(() => {
    fetchStudioData();
  }, []);

  const handleCopy = (card: { title: string; excerpt?: string | null }) => {
    navigator.clipboard?.writeText?.(`${card.title}\n\n${card.excerpt || ""}`);
    toast.success("Content copied to clipboard");
  };

  const handleGenerateDraft = (card: IdeaRecord) => {
    onOpenComposer({
      title: card.title,
      content: `${card.title}\n\n${card.excerpt || ""}\n\nHere are 3 key takeaways you need to know:\n\n1. \n2. \n3. \n\n#socialmedia #growth`,
    });
    toast.info("Draft generated in composer");
  };

  const handlePublishNow = async (post: PostRecord) => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED" }),
      });
      const data = await res.json();
      if (data.post) {
        setPosts(posts.map((p) => (p.id === post.id ? data.post : p)));
        toast.success(`Published "${post.title}" successfully!`);
      }
    } catch (err) {
      toast.error("Failed to publish post");
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
        toast.info("Post deleted");
      }
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  const handleDiscoverIdeas = async () => {
    setIsDiscovering(true);
    try {
      const res = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "Scaling with AI agents in 2026" }),
      });
      const data = await res.json();
      if (data.ideas) {
        setIdeas([...data.ideas, ...ideas]);
        toast.success("Discovered 4 new viral content ideas!");
      }
    } catch (err) {
      toast.error("Failed to generate ideas");
    } finally {
      setIsDiscovering(false);
    }
  };

  // Group posts by status
  const drafts = posts.filter((p) => p.status === "DRAFT");
  const scheduled = posts.filter((p) => p.status === "SCHEDULED");
  const published = posts.filter((p) => p.status === "PUBLISHED");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background px-4 lg:px-6 py-5 font-sans min-w-0">
      {/* 1. Content Studio Title Row */}
      <div className="flex items-center gap-2.5 mb-4 shrink-0">
        <div className="flex items-center text-foreground">
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
          className="inline-flex shrink-0 items-center justify-between gap-2 rounded-md border border-border shadow-xs hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-9 px-4 py-2 text-sm font-normal bg-accent hover:bg-background transition-all"
        >
          <Image src="/images/platforms/instagram.svg" alt="Instagram" width={16} height={16} className="size-4 rounded-full shrink-0 object-cover" />
          <span className="text-foreground">{account}</span>
          <ChevronsUpDown className="size-4 text-muted-foreground ml-1" />
        </button>

        {/* Discover Content Ideas Button */}
        <button
          type="button"
          disabled={isDiscovering}
          onClick={handleDiscoverIdeas}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-9 px-4 py-2 text-sm font-medium text-foreground transition-all disabled:opacity-50"
        >
          {isDiscovering ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 text-muted-foreground" />}
          <span>{isDiscovering ? "Scanning Sources..." : "Discover Content Ideas"}</span>
        </button>

        {/* Create Content Black Pill Button */}
        <button
          type="button"
          onClick={() => onOpenComposer()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs h-9 px-4 py-2 text-sm font-medium transition-all"
        >
          <Pencil className="size-4 stroke-[2.2]" />
          <span>Create Content</span>
        </button>
      </div>

      {/* 3. Four Equal Kanban Columns */}
      <div className="flex-1 min-h-0 overflow-x-auto pb-2">
        <div className="grid grid-cols-4 gap-5 h-full min-w-[1120px] xl:min-w-0">
          {/* Column 1: Content Ideas */}
          <div className="flex flex-col h-full rounded-xl border border-border/80 bg-muted/30 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card/50">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-neutral-400 shrink-0" />
                <h2 className="text-sm font-semibold text-foreground">Content Ideas</h2>
                <span className="text-sm text-muted-foreground font-normal">({ideas.length})</span>
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

            {/* Ideas Cards List with Dashed Borders */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 sidebar-scrollbar">
              {ideas.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#26262b] p-4 space-y-3 shadow-2xs hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/80 px-2.5 py-1 text-xs font-semibold text-foreground">
                      {card.sourceType.toLowerCase().includes("web") && <Globe className="size-3.5 text-muted-foreground" />}
                      {card.sourceType.toLowerCase().includes("youtube") && <Tv className="size-3.5 text-red-500" />}
                      {card.sourceType.toLowerCase().includes("news") && <Newspaper className="size-3.5 text-muted-foreground" />}
                      {!["web", "youtube", "news"].some((k) => card.sourceType.toLowerCase().includes(k)) && (
                        <Sparkles className="size-3.5 text-primary" />
                      )}
                      <span>{card.sourceType}</span>
                    </span>
                    <span className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {card.viralityScore}% Virality
                    </span>
                  </div>

                  <h3 className="font-bold text-sm leading-snug text-foreground">
                    {card.title}
                  </h3>

                  {card.excerpt && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {card.excerpt}
                    </p>
                  )}

                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {card.tags.map((t) => (
                        <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

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

          {/* Column 2: Drafts */}
          <div className="flex flex-col h-full rounded-2xl border border-amber-200/70 dark:border-amber-900/40 bg-[#fbf3e1] dark:bg-[#252018] shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200/60 dark:border-amber-900/30">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-amber-400 shrink-0" />
                <h2 className="text-sm font-semibold text-foreground">Drafts</h2>
                <span className="text-sm text-muted-foreground font-normal">({drafts.length})</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Sort">
                  <ArrowUpDown className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 sidebar-scrollbar">
              {drafts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground/60 font-medium select-none">
                  No drafts yet
                </div>
              ) : (
                drafts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-border/80 bg-white dark:bg-[#26262b] p-4 space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">Draft</span>
                      <div className="flex items-center gap-1">
                        {post.platforms.map((plat) => (
                          <Image key={plat} src={`/images/platforms/${plat === "x" ? "x-light.svg" : plat + ".svg"}`} alt={plat} width={12} height={12} className={plat === "x" ? "dark:invert" : ""} />
                        ))}
                      </div>
                    </div>

                    <h3 className="font-bold text-sm leading-snug text-foreground">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        title="Delete draft"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenComposer({ id: post.id, title: post.title, content: post.content, platforms: post.platforms })}
                        className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                      >
                        <span>Edit Post</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Scheduled */}
          <div className="flex flex-col h-full rounded-2xl border border-emerald-200/70 dark:border-emerald-900/40 bg-[#e8f9eb] dark:bg-[#1a261d] shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-200/60 dark:border-emerald-900/30">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
                <h2 className="text-sm font-semibold text-foreground">Scheduled</h2>
                <span className="text-sm text-muted-foreground font-normal">({scheduled.length})</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Sort">
                  <ArrowUpDown className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 sidebar-scrollbar">
              {scheduled.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground/60 font-medium select-none">
                  No scheduled items
                </div>
              ) : (
                scheduled.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-border/80 bg-white dark:bg-[#26262b] p-4 space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <Clock className="size-3" /> Scheduled
                      </span>
                      <div className="flex items-center gap-1">
                        {post.platforms.map((plat) => (
                          <Image key={plat} src={`/images/platforms/${plat === "x" ? "x-light.svg" : plat + ".svg"}`} alt={plat} width={12} height={12} className={plat === "x" ? "dark:invert" : ""} />
                        ))}
                      </div>
                    </div>

                    <h3 className="font-bold text-sm leading-snug text-foreground">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                      <button
                        type="button"
                        onClick={() => handlePublishNow(post)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <Send className="size-3" /> Publish Now
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenComposer({ id: post.id, title: post.title, content: post.content, platforms: post.platforms })}
                        className="font-bold text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 4: Published */}
          <div className="flex flex-col h-full rounded-2xl border border-blue-200/70 dark:border-blue-900/40 bg-[#e9f2ff] dark:bg-[#192233] shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-blue-200/60 dark:border-blue-900/30">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-blue-500 shrink-0" />
                <h2 className="text-sm font-semibold text-foreground">Published</h2>
                <span className="text-sm text-muted-foreground font-normal">({published.length})</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <button type="button" className="hover:text-foreground transition-colors p-0.5" title="Sort">
                  <ArrowUpDown className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 sidebar-scrollbar">
              {published.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground/60 font-medium select-none">
                  No published items
                </div>
              ) : (
                published.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-border/80 bg-white dark:bg-[#26262b] p-4 space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                        <CheckCircle2 className="size-3" /> Published
                      </span>
                      <span className="font-mono text-[11px] font-bold text-foreground">
                        {post.impressions ? `${(post.impressions / 1000).toFixed(1)}K views` : "Live"}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm leading-snug text-foreground">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Just now"}</span>
                      <button
                        type="button"
                        onClick={() => onOpenComposer({ title: post.title, content: post.content, platforms: post.platforms })}
                        className="font-bold text-primary hover:underline"
                      >
                        Remix Post
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
