"use client";

import React, { useState } from "react";
import { X, Flame, Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedSourceIcon } from "./PlatformIconMap";

export interface RecommendedSource {
  id: string;
  label: string;
  url: string;
  subscribed?: boolean;
  contentSourceId?: string | null;
}

export interface RecommendedCategory {
  id: string;
  nameEn: string;
  nameKo?: string;
  sources: RecommendedSource[];
}

interface RecommendedSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: RecommendedCategory[];
  isLoading?: boolean;
  onToggleSource: (source: RecommendedSource) => Promise<void>;
}

export function RecommendedSourcesModal({
  isOpen,
  onClose,
  categories,
  isLoading = false,
  onToggleSource,
}: RecommendedSourcesModalProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || "tech");
  const [busySourceId, setBusySourceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCategory =
    categories.find((c) => c.id === activeCategoryId) || categories[0] || { sources: [] };

  const handleAction = async (source: RecommendedSource) => {
    setBusySourceId(source.id);
    try {
      await onToggleSource(source);
    } finally {
      setBusySourceId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center rounded-md bg-primary p-1.5 text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <Flame className="size-6 text-amber-500 fill-amber-500" />
            <span>Recommended Sources</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Hand-curated top-performing newsletters, YouTube creators, industry blogs, and subreddits.
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="mt-2 min-w-0 border-b border-border pb-1">
          <div className="overflow-x-auto">
            <div className="mx-auto flex w-max gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={cn(
                    "shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
                    activeCategoryId === cat.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {cat.nameEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-4">
          {isLoading ? (
            <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : currentCategory.sources.length === 0 ? (
            <div className="flex h-[60vh] items-center justify-center text-center text-xs text-muted-foreground">
              No recommended sources available for this category.
            </div>
          ) : (
            <div className="grid h-[60vh] grid-cols-1 content-start gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
              {currentCategory.sources.map((source) => {
                const isSubscribed = source.subscribed;
                const isBusy = busySourceId === source.id;

                return (
                  <div
                    key={source.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3 shadow-2xs hover:bg-card transition-all"
                  >
                    <div className="size-8 shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border">
                      <FeedSourceIcon source={{ url: source.url }} className="size-4.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{source.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{source.url}</p>
                    </div>

                    {isSubscribed ? (
                      <button
                        type="button"
                        onClick={() => handleAction(source)}
                        disabled={isBusy}
                        aria-label="Remove source"
                        title="Remove source"
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      >
                        {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAction(source)}
                        disabled={isBusy}
                        aria-label="Add source"
                        title="Add source"
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-50"
                      >
                        {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
