"use client";

import React, { useState } from "react";
import { X, ExternalLink, Shuffle, Copy, Check, BookOpen, Clock, User } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
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
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const channelLabel = getFeedSourceLabel({ url: item.url, title: item.source_title });
  const rawBody = (item.content || item.excerpt || "").trim();
  const paragraphs = rawBody
    ? rawBody.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const wordCount = rawBody ? rawBody.split(/\s+/).length : 0;
  const estimatedReadMinutes = Math.max(1, Math.ceil(wordCount / 200));

  let formattedDate = "";
  let relativeTime = "";
  try {
    const d = new Date(item.published_at);
    formattedDate = format(d, "MMM d, yyyy · h:mm a");
    relativeTime = formatDistanceToNow(d, { addSuffix: true });
  } catch {
    formattedDate = item.published_at;
  }

  const handleCopy = () => {
    const textToCopy = `${item.title}\n\n${rawBody}\n\nSource: ${item.url}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Article copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRepurpose = () => {
    onCreateContent(item);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-2xl sm:max-w-3xl max-h-[90vh] rounded-2xl border border-border bg-background shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-2.5 min-w-0">
            {item.source_favicon_url ? (
              <img
                src={item.source_favicon_url}
                alt=""
                className="size-5 shrink-0 rounded-xs object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <BookOpen className="size-4.5 text-primary shrink-0" />
            )}
            <div className="min-w-0">
              <span className="font-semibold text-sm text-foreground truncate block">
                {channelLabel}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span>{formattedDate}</span>
                {relativeTime && <span>({relativeTime})</span>}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs"
              title="Copy article text"
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Headline Title */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
              {item.author && (
                <span className="flex items-center gap-1 text-foreground/80 font-medium">
                  <User className="size-3.5" />
                  <span>{item.author}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                <span>{estimatedReadMinutes} min read</span>
              </span>
            </div>
          </div>

          {/* Featured Image Banner */}
          {item.thumbnail_url && (
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              <img
                src={item.thumbnail_url}
                alt=""
                className="w-full max-h-[380px] object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Article Text Content */}
          <div className="space-y-4 pt-1">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-sm sm:text-base leading-relaxed text-foreground/90 font-sans tracking-normal"
                >
                  {para}
                </p>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
                <p className="text-sm">No text preview available for this story.</p>
                <p className="text-xs mt-1">Click &quot;Read full original&quot; below to view the story on the source website.</p>
              </div>
            )}
          </div>

          {/* Source Link Banner */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground">Original Article Source</p>
              <p className="text-xs text-muted-foreground truncate max-w-md">{item.url}</p>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <span>Read original website</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-muted/20">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            <span>View original</span>
            <ExternalLink className="ml-1 size-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleRepurpose}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
            >
              <Shuffle className="size-3.5" />
              <span>Repurpose into Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
