"use client";

import React, { useState } from "react";
import { ExternalLink, BookOpen, Shuffle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { FeedSourceIcon, getFeedSourceLabel } from "./PlatformIconMap";

export interface IdeaItem {
  id: string;
  source_id?: string;
  title: string;
  url: string;
  published_at: string;
  source_title?: string | null;
  source_favicon_url?: string | null;
  thumbnail_url?: string | null;
  excerpt?: string | null;
  content?: string | null;
  author?: string | null;
}

interface IdeaItemCardProps {
  item: IdeaItem;
  onCreateContent: (item: IdeaItem) => void;
  onViewDetail?: (item: IdeaItem) => void;
  className?: string;
  badge?: React.ReactNode;
}

export function IdeaItemCard({
  item,
  onCreateContent,
  onViewDetail,
  className,
  badge,
}: IdeaItemCardProps) {
  const [imgError, setImgError] = useState(false);
  const channelLabel = getFeedSourceLabel({ url: item.url, title: item.source_title });
  const hasValidThumbnail = !!item.thumbnail_url && !imgError;
  const displayTitle = item.title || item.url;

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail(item);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-sidebar/50 shadow-2xs hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer select-none",
        className
      )}
    >
      {/* 16:9 Thumbnail Header */}
      {hasValidThumbnail ? (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={item.thumbnail_url!}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-xs">
              <BookOpen className="size-3.5 text-primary" />
              <span>Read story</span>
            </span>
          </div>
        </div>
      ) : (
        <div
          role="img"
          aria-label={channelLabel}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-muted/60 px-4 text-muted-foreground border-b border-border/50 group-hover:bg-muted/80 transition-colors"
        >
          <FeedSourceIcon source={{ url: item.url, favicon_url: null }} className="size-10" />
          <span className="line-clamp-1 text-xs font-semibold text-foreground/80">{channelLabel}</span>
          <span className="text-[11px] text-primary/80 font-medium flex items-center gap-1">
            <BookOpen className="size-3" />
            Click to read
          </span>
        </div>
      )}

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {/* Channel & Timestamp Metadata */}
        <div className="flex items-center gap-2">
          {item.source_favicon_url && (
            <img
              src={item.source_favicon_url}
              alt=""
              className="size-4 shrink-0 rounded-xs object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <span className="min-w-0 truncate text-xs font-semibold text-muted-foreground">
            {channelLabel}
          </span>
          <span aria-hidden="true" className="shrink-0 text-xs text-muted-foreground">
            ·
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}
          </span>
          {badge && <span className="ml-auto shrink-0">{badge}</span>}
        </div>

        {/* Title */}
        <div className="mt-1 flex items-start justify-between gap-1">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
            {displayTitle}
          </h3>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Open original website in new tab"
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>

        {/* Excerpt / Summary */}
        {item.excerpt && (
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground mt-0.5">
            {item.excerpt}
          </p>
        )}

        {/* Action Buttons Footer */}
        <div className="mt-auto flex items-center gap-2 pt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetail) onViewDetail(item);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted hover:border-foreground/30 transition-all shadow-2xs"
          >
            <BookOpen className="size-3.5 text-primary" />
            <span>Read Article</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCreateContent(item);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-2xs"
            title="Turn into draft post"
          >
            <Shuffle className="size-3.5" />
            <span className="hidden sm:inline">Repurpose</span>
          </button>
        </div>
      </div>
    </div>
  );
}
