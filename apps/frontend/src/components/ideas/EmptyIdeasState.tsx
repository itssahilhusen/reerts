"use client";

import React from "react";
import { Rss, Inbox, Plus } from "lucide-react";

interface EmptyIdeasStateProps {
  hasSources: boolean;
  onAddSource: () => void;
}

export function EmptyIdeasState({ hasSources, onAddSource }: EmptyIdeasStateProps) {
  if (hasSources) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 px-4 py-16 text-center">
        <div className="rounded-full bg-muted/80 p-6 border border-border/50 shadow-inner">
          <Inbox className="size-12 text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-foreground">No posts collected yet</h3>
          <p className="max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Once your sources publish new posts, we'll gather them here automatically. You can also click Refresh to fetch immediately.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 px-4 py-16 text-center">
      <div className="rounded-full bg-muted/80 p-6 border border-border/50 shadow-inner">
        <Rss className="size-12 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-foreground">No content sources yet</h3>
        <p className="max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Add the blogs, YouTube, Instagram, X, Threads, Reddit, and Telegram you check regularly. We'll automatically collect their latest posts, and you can turn anything worth benchmarking into a draft right away.
        </p>
      </div>
      <button
        type="button"
        onClick={onAddSource}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
      >
        <Plus className="size-4" />
        <span>Add a source</span>
      </button>
    </div>
  );
}
