"use client";

import React from "react";
import { X, ExternalLink, Shuffle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IdeaItem } from "./IdeaItemCard";
import { getFeedSourceLabel } from "./PlatformIconMap";

interface IdeaDetailDialogProps {
  item: IdeaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateContent: (item: IdeaItem) => void;
}

export function IdeaDetailDialog({
  item,
  isOpen,
  onClose,
  onCreateContent,
}: IdeaDetailDialogProps) {
  if (!isOpen || !item) return null;

  const channelLabel = getFeedSourceLabel({ url: item.url, title: item.source_title });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-6">
          <h2 className="text-lg font-bold leading-snug text-foreground">
            {item.title || item.url}
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            <span className="font-semibold text-foreground">{channelLabel}</span>
            <span>·</span>
            <span>{formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Thumbnail */}
        {item.thumbnail_url && (
          <img
            src={item.thumbnail_url}
            alt=""
            className="aspect-video w-full rounded-lg object-cover border border-border"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

        {/* Excerpt Body */}
        <div className="py-2">
          {item.excerpt ? (
            <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-foreground">
              {item.excerpt}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No saved content preview. Please check the original post.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            <span>View original</span>
            <ExternalLink className="ml-1 size-3.5" />
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              onCreateContent(item);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Shuffle className="size-3.5" />
            <span>Repurpose</span>
          </button>
        </div>
      </div>
    </div>
  );
}
