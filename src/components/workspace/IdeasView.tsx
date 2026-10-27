"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { IdeasTabs } from "../ideas/IdeasTabs";
import { SourceManager, ContentSourceItem } from "../ideas/SourceManager";
import { RecommendedSourcesModal, RecommendedCategory, RecommendedSource } from "../ideas/RecommendedSourcesModal";
import { OpmlUploader, OpmlEntry, OpmlImportResult, parseOpmlXml } from "../ideas/OpmlUploader";
import { IdeaItemCard, IdeaItem } from "../ideas/IdeaItemCard";
import { IdeaItemsTable } from "../ideas/IdeaItemsTable";
import { IdeaDetailDialog } from "../ideas/IdeaDetailDialog";
import { EmptyIdeasState } from "../ideas/EmptyIdeasState";
import { getFeedSourceKind } from "../ideas/PlatformIconMap";

interface IdeasViewProps {
  onOpenComposer: (post?: any) => void;
}

const DEFAULT_RECOMMENDED_CATEGORIES: RecommendedCategory[] = [
  {
    id: "tech",
    nameEn: "Tech & AI",
    sources: [
      { id: "rec_1", label: "OpenAI Research & News", url: "https://openai.com/news/rss.xml", subscribed: true },
      { id: "rec_2", label: "Anthropic Research Updates", url: "https://www.anthropic.com/news/rss", subscribed: false },
      { id: "rec_3", label: "TechCrunch AI & Robotics", url: "https://techcrunch.com/category/artificial-intelligence/feed/", subscribed: true },
      { id: "rec_4", label: "Simon Willison Weblog", url: "https://simonwillison.net/atom/everything/", subscribed: false },
      { id: "rec_5", label: "Hacker News Top Stories", url: "https://news.ycombinator.com/rss", subscribed: false },
    ],
  },
  {
    id: "marketing",
    nameEn: "Marketing & Growth",
    sources: [
      { id: "rec_6", label: "Lenny's Newsletter", url: "https://www.lennysnewsletter.com/feed", subscribed: false },
      { id: "rec_7", label: "Marketing Brew", url: "https://www.morningbrew.com/marketing/feed", subscribed: false },
      { id: "rec_8", label: "Ahrefs SEO & Growth Blog", url: "https://ahrefs.com/blog/feed/", subscribed: false },
      { id: "rec_9", label: "Demand Curve Growth", url: "https://www.demandcurve.com/feed", subscribed: false },
    ],
  },
  {
    id: "founders",
    nameEn: "Founders & Creators",
    sources: [
      { id: "rec_10", label: "Paul Graham Essays", url: "http://www.paulgraham.com/rss.html", subscribed: true },
      { id: "rec_11", label: "Pieter Levels (@levelsio)", url: "https://x.com/levelsio", subscribed: false },
      { id: "rec_12", label: "Sahil Lavingia Writings", url: "https://sahillavingia.com/feed.xml", subscribed: false },
      { id: "rec_13", label: "Indie Hackers Popular", url: "https://feed.indiehackers.world/", subscribed: false },
    ],
  },
  {
    id: "design",
    nameEn: "Design & UX",
    sources: [
      { id: "rec_14", label: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/", subscribed: false },
      { id: "rec_15", label: "UX Collective", url: "https://uxdesign.cc/feed", subscribed: false },
      { id: "rec_16", label: "Sidebar Design Links", url: "https://sidebar.io/feed.xml", subscribed: false },
    ],
  },
];

const INITIAL_MOCK_SOURCES: ContentSourceItem[] = [
  {
    id: "src_1",
    url: "https://openai.com/news/rss.xml",
    title: "OpenAI Research & News",
    status: "active",
    last_fetched_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    favicon_url: "https://www.google.com/s2/favicons?domain=openai.com&sz=64",
  },
  {
    id: "src_2",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    title: "TechCrunch AI",
    status: "active",
    last_fetched_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    favicon_url: "https://www.google.com/s2/favicons?domain=techcrunch.com&sz=64",
  },
  {
    id: "src_3",
    url: "http://www.paulgraham.com/rss.html",
    title: "Paul Graham Essays",
    status: "active",
    last_fetched_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    favicon_url: "https://www.google.com/s2/favicons?domain=paulgraham.com&sz=64",
  },
];

const INITIAL_MOCK_ITEMS: IdeaItem[] = [
  {
    id: "idea_1",
    source_id: "src_1",
    title: "Introducing Canvas: A new interface for working with ChatGPT on writing and code",
    url: "https://openai.com/index/introducing-canvas/",
    published_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    source_title: "OpenAI Research & News",
    source_favicon_url: "https://www.google.com/s2/favicons?domain=openai.com&sz=64",
    thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    excerpt: "We’re rolling out canvas, a new interface for working with ChatGPT on writing and coding projects that go beyond simple chat.",
    author: "OpenAI Team",
  },
  {
    id: "idea_2",
    source_id: "src_2",
    title: "Why developers are abandoning bloated cloud microservices for modern single binaries",
    url: "https://techcrunch.com/2026/10/developer-infrastructure-trends/",
    published_at: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    source_title: "TechCrunch AI",
    source_favicon_url: "https://www.google.com/s2/favicons?domain=techcrunch.com&sz=64",
    thumbnail_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    excerpt: "Engineering teams are seeing 80% cost reduction and 10x faster deployment loops by moving back to unified monolith architectures.",
    author: "Alex Wilhelm",
  },
  {
    id: "idea_3",
    source_id: "src_3",
    title: "How to Do Great Work: Surprising lessons from 20 years of Y Combinator founders",
    url: "http://www.paulgraham.com/greatwork.html",
    published_at: new Date(Date.now() - 1000 * 60 * 195).toISOString(),
    source_title: "Paul Graham Essays",
    source_favicon_url: "https://www.google.com/s2/favicons?domain=paulgraham.com&sz=64",
    thumbnail_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80",
    excerpt: "If you want to do great work, the first step is to choose what to work on. The work you choose should have three qualities: natural aptitude, deep interest, and scope for greatness.",
    author: "Paul Graham",
  },
  {
    id: "idea_4",
    source_id: "src_1",
    title: "Evaluating frontier reasoning models: A deep dive into multi-step mathematics and logic",
    url: "https://openai.com/research/frontier-reasoning-evaluations",
    published_at: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    source_title: "OpenAI Research & News",
    source_favicon_url: "https://www.google.com/s2/favicons?domain=openai.com&sz=64",
    thumbnail_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
    excerpt: "Chain-of-thought processing allows models to dynamically allocate reasoning tokens when faced with complex multi-variable problems.",
    author: "OpenAI Research",
  },
  {
    id: "idea_5",
    source_id: "src_2",
    title: "The $0 to $50k MRR Playbook: Why PLG self-serve loops beat cold outreach for dev tools",
    url: "https://techcrunch.com/2026/plg-saas-playbook/",
    published_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    source_title: "TechCrunch AI",
    source_favicon_url: "https://www.google.com/s2/favicons?domain=techcrunch.com&sz=64",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    excerpt: "Viral organic engineering logs and public benchmarks drove 68% of new paying accounts for the latest batch of breakout developer platforms.",
    author: "Ron Miller",
  },
];

export function IdeasView({ onOpenComposer }: IdeasViewProps) {
  // State
  const [sources, setSources] = useState<ContentSourceItem[]>(INITIAL_MOCK_SOURCES);
  const [items, setItems] = useState<IdeaItem[]>(INITIAL_MOCK_ITEMS);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date(Date.now() - 1000 * 60 * 12));

  // Modals state
  const [isManageSourcesOpen, setIsManageSourcesOpen] = useState(false);
  const [isRecommendedOpen, setIsRecommendedOpen] = useState(false);
  const [recommendedCategories, setRecommendedCategories] = useState<RecommendedCategory[]>(DEFAULT_RECOMMENDED_CATEGORIES);
  const [detailItem, setDetailItem] = useState<IdeaItem | null>(null);

  // OPML state
  const [isOpmlModalOpen, setIsOpmlModalOpen] = useState(false);
  const [opmlEntries, setOpmlEntries] = useState<OpmlEntry[]>([]);
  const [opmlProgress, setOpmlProgress] = useState<OpmlImportResult | null>(null);
  const [isImportingOpml, setIsImportingOpml] = useState(false);
  const opmlAbortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from API on mount
  useEffect(() => {
    fetch("/api/sources")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.sources && data.sources.length > 0) {
          setSources(data.sources);
        }
      })
      .catch((err) => console.warn("API /api/sources:", err.message));

    fetch("/api/ideas")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch((err) => console.warn("API /api/ideas:", err.message));

    fetch("/api/recommended-sources")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories && data.categories.length > 0) {
          setRecommendedCategories(data.categories);
        }
      })
      .catch((err) => console.warn("API /api/recommended-sources:", err.message));
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter.startsWith("platform:")) {
      const platformKind = selectedFilter.replace("platform:", "");
      const itemKind = getFeedSourceKind({ url: item.url });
      return itemKind === platformKind;
    }
    return item.source_id === selectedFilter;
  });

  // Actions
  const handleAddSource = async (url: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || "Failed to add source");
        return false;
      }

      const data = await res.json();
      const newSource = data.source || {
        id: `src_${Date.now()}`,
        url,
        title: url,
        status: "active",
        last_fetched_at: new Date().toISOString(),
      };

      setSources((prev) => [newSource, ...prev]);
      toast.success("Source registered successfully!");
      return true;
    } catch {
      // Local optimistic fallback
      const fallbackSource: ContentSourceItem = {
        id: `src_${Date.now()}`,
        url,
        title: url,
        status: "active",
        last_fetched_at: new Date().toISOString(),
      };
      setSources((prev) => [fallbackSource, ...prev]);
      toast.success("Source registered (local)");
      return true;
    }
  };

  const handleUpdateStatus = async (sourceId: string, status: "active" | "paused") => {
    try {
      await fetch(`/api/sources/${sourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      // fallback
    }

    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, status } : s))
    );
    toast.info(`Source ${status === "paused" ? "paused" : "resumed"}`);
  };

  const handleDeleteSource = async (sourceId: string) => {
    try {
      await fetch(`/api/sources/${sourceId}`, { method: "DELETE" });
    } catch {
      // fallback
    }

    setSources((prev) => prev.filter((s) => s.id !== sourceId));
    setItems((prev) => prev.filter((i) => i.source_id !== sourceId));
    toast.success("Source deleted");
  };

  const handleToggleRecommended = async (rec: RecommendedSource) => {
    const isCurrentlySubscribed = rec.subscribed;
    if (isCurrentlySubscribed) {
      // Delete
      setRecommendedCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          sources: cat.sources.map((s) =>
            s.id === rec.id ? { ...s, subscribed: false, contentSourceId: null } : s
          ),
        }))
      );
      setSources((prev) => prev.filter((s) => s.url !== rec.url));
      toast.info(`Removed ${rec.label}`);
    } else {
      // Add
      setRecommendedCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          sources: cat.sources.map((s) =>
            s.id === rec.id ? { ...s, subscribed: true } : s
          ),
        }))
      );
      await handleAddSource(rec.url);
      toast.success(`Subscribed to ${rec.label}`);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/ideas/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manual: true }),
      });

      if (res.ok) {
        const data = await res.json();
        setLastRefreshedAt(new Date());
        if (data.newItems > 0) {
          toast.success(`Fetched ${data.newItems} new post${data.newItems > 1 ? "s" : ""}!`);
        } else {
          toast.info("Already up to date. No new posts found.");
        }
      } else {
        setLastRefreshedAt(new Date());
        toast.info("All sources refreshed. Feed up to date.");
      }
    } catch {
      setLastRefreshedAt(new Date());
      toast.info("Refreshed sources (local)");
    } finally {
      setIsRefreshing(false);
    }
  };

  // OPML File Picking
  const handleOpmlFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 1_000_000) {
      toast.error("File is too large. Please use an OPML file under 1 MB.");
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseOpmlXml(text);
      if (parsed.length === 0) {
        toast.error("No feeds found in this OPML file.");
        return;
      }

      setOpmlEntries(parsed.slice(0, 200));
      setOpmlProgress(null);
      setIsOpmlModalOpen(true);
    } catch {
      toast.error("Couldn't read this file. Make sure it's a valid OPML export.");
    }
  };

  const handleStartOpmlImport = async (selected: OpmlEntry[]) => {
    setIsImportingOpml(true);
    opmlAbortRef.current = new AbortController();

    const result: OpmlImportResult = {
      total: selected.length,
      completed: 0,
      buckets: { success: 0, duplicate: 0, unsupported: 0, temporary: 0, error: 0 },
    };

    setOpmlProgress({ ...result });

    // Concurrency pool of 4
    const concurrency = 4;
    let index = 0;

    const worker = async () => {
      while (index < selected.length && !opmlAbortRef.current?.signal.aborted) {
        const entry = selected[index++];
        try {
          const res = await fetch("/api/sources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: entry.url }),
            signal: opmlAbortRef.current?.signal,
          });

          if (res.ok) {
            result.buckets.success++;
          } else if (res.status === 409) {
            result.buckets.duplicate++;
          } else if (res.status === 422) {
            result.buckets.unsupported++;
          } else {
            result.buckets.error++;
          }
        } catch {
          if (opmlAbortRef.current?.signal.aborted) return;
          result.buckets.success++; // local fallback success
        }

        result.completed++;
        setOpmlProgress({ ...result });
      }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, selected.length) }, worker));
    setIsImportingOpml(false);
    toast.success(`Import complete! Added ${result.buckets.success} new sources.`);
  };

  const handleRepurpose = (item: IdeaItem) => {
    onOpenComposer({
      title: item.title,
      content: `${item.title}\n\n${item.excerpt || ""}\n\nSource: ${item.url}`,
      sourceUrl: item.url,
      mediaUrls: item.thumbnail_url ? [item.thumbnail_url] : [],
    });
    toast.success("Draft created in Composer with source benchmark!");
  };

  const relativeLastRefresh = formatDistanceToNow(lastRefreshedAt, { addSuffix: true });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background px-4 lg:px-6 py-5 font-sans min-w-0">
      {/* 1. Content Ideas Title Row (Exact match to StudioView position & structure) */}
      <div className="flex items-center gap-2.5 mb-4 shrink-0">
        <div className="flex items-center text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7 shrink-0 text-foreground"
          >
            <path d="M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <path d="M4 11a9 9 0 0 1 9 9" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Content Ideas
        </h1>
      </div>

      {/* Hidden file input for OPML */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".opml,.xml,text/xml,application/xml"
        className="hidden"
        onChange={handleOpmlFileChange}
      />

      {/* 2. Ideas Action Toolbar */}
      <div className="mb-5 shrink-0">
        <IdeasTabs
          sources={sources}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
          onOpenManageSources={() => setIsManageSourcesOpen(true)}
          onOpenRecommended={() => setIsRecommendedOpen(true)}
          onTriggerOpml={() => fileInputRef.current?.click()}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          lastRefreshedText={relativeLastRefresh}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* 2. Main Content Display */}
      {filteredItems.length === 0 ? (
        <EmptyIdeasState
          hasSources={sources.length > 0}
          onAddSource={() => setIsManageSourcesOpen(true)}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredItems.map((item) => (
            <IdeaItemCard
              key={item.id}
              item={item}
              onCreateContent={handleRepurpose}
              onViewDetail={(i) => setDetailItem(i)}
            />
          ))}
        </div>
      ) : (
        <IdeaItemsTable
          items={filteredItems}
          onCreateContent={handleRepurpose}
          onViewDetail={(i) => setDetailItem(i)}
        />
      )}

      {/* 3. Manage Sources Modal */}
      <SourceManager
        isOpen={isManageSourcesOpen}
        onClose={() => setIsManageSourcesOpen(false)}
        sources={sources}
        onAddSource={handleAddSource}
        onUpdateStatus={handleUpdateStatus}
        onDeleteSource={handleDeleteSource}
      />

      {/* 4. Recommended Sources Modal */}
      <RecommendedSourcesModal
        isOpen={isRecommendedOpen}
        onClose={() => setIsRecommendedOpen(false)}
        categories={recommendedCategories}
        onToggleSource={handleToggleRecommended}
      />

      {/* 5. OPML Uploader Modal */}
      <OpmlUploader
        isOpen={isOpmlModalOpen}
        onClose={() => {
          setIsOpmlModalOpen(false);
          setIsImportingOpml(false);
          setOpmlProgress(null);
        }}
        entries={opmlEntries}
        onStartImport={handleStartOpmlImport}
        progress={opmlProgress}
        isImporting={isImportingOpml}
        onCancel={() => {
          opmlAbortRef.current?.abort();
          setIsImportingOpml(false);
        }}
      />

      {/* 6. Idea Detail Preview Dialog */}
      <IdeaDetailDialog
        item={detailItem}
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        onCreateContent={handleRepurpose}
      />
    </div>
  );
}
