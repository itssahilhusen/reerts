"use client";

import React, { useState } from "react";
import {
  X,
  Rss,
  Plus,
  Trash2,
  Pause,
  Play,
  RotateCw,
  AlertTriangle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  SOURCE_PLATFORMS,
  PLATFORM_KIND_BRAND_LABELS,
  PlatformKind,
  PlatformBrandIcon,
  FeedSourceIcon,
  buildSourceUrl,
  getFeedSourceKind,
  getFeedSourceLabel,
} from "./PlatformIconMap";

export interface ContentSourceItem {
  id: string;
  url: string;
  title?: string | null;
  platform?: string | null;
  status: "active" | "paused" | "failed";
  last_fetched_at?: string | null;
  last_error?: string | null;
  favicon_url?: string | null;
  created_at?: string;
}

interface SourceManagerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: ContentSourceItem[];
  onAddSource: (url: string) => Promise<boolean>;
  onUpdateStatus: (sourceId: string, status: "active" | "paused") => Promise<void>;
  onDeleteSource: (sourceId: string) => Promise<void>;
  isAdding?: boolean;
}

export function SourceManager({
  isOpen,
  onClose,
  sources,
  onAddSource,
  onUpdateStatus,
  onDeleteSource,
  isAdding = false,
}: SourceManagerProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKind>("web");
  const [inputValue, setInputValue] = useState("");
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [deleteTarget, setDeleteTarget] = useState<ContentSourceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busySourceId, setBusySourceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlatformConfig =
    SOURCE_PLATFORMS.find((p) => p.value === selectedPlatform) || SOURCE_PLATFORMS[0];

  const handleAdd = async () => {
    const fullUrl = buildSourceUrl(selectedPlatform, inputValue);
    if (!fullUrl.trim() || isAdding) return;

    const ok = await onAddSource(fullUrl);
    if (ok) {
      setInputValue("");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await onDeleteSource(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete source");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (source: ContentSourceItem) => {
    const newStatus = source.status === "active" ? "paused" : "active";
    setBusySourceId(source.id);
    try {
      await onUpdateStatus(source.id, newStatus);
    } finally {
      setBusySourceId(null);
    }
  };

  // Group sources by platform kind
  const sourcesByKind: Record<string, ContentSourceItem[]> = {};
  sources.forEach((s) => {
    const k = getFeedSourceKind(s);
    if (!sourcesByKind[k]) sourcesByKind[k] = [];
    sourcesByKind[k].push(s);
  });
  const kindEntries = Object.entries(sourcesByKind);

  const toggleAccordion = (kind: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [kind]: prev[kind] === undefined ? false : !prev[kind],
    }));
  };

  const renderSourceCard = (source: ContentSourceItem) => {
    const label = getFeedSourceLabel(source);
    const isBusy = busySourceId === source.id;

    return (
      <div
        key={source.id}
        className="flex items-center gap-3 rounded-md border border-border bg-card/60 p-3 shadow-2xs transition-all hover:bg-card"
      >
        <div className="size-8 shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border">
          <FeedSourceIcon source={source} className="size-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">
            {source.last_fetched_at
              ? `Last fetched: ${formatDistanceToNow(new Date(source.last_fetched_at), { addSuffix: true })}`
              : "Not fetched yet"}
          </p>
          {source.status === "failed" && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-destructive">
              <AlertTriangle className="size-3.5 shrink-0" />
              <span>Fetch failing: {source.last_error || "Check source URL or access."}</span>
            </div>
          )}
        </div>

        {source.status === "paused" && (
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
            Paused
          </span>
        )}
        {source.status === "failed" && (
          <span className="rounded-md bg-destructive/15 px-2 py-0.5 text-xs font-semibold text-destructive">
            Fetch failing
          </span>
        )}

        <div className="flex shrink-0 items-center gap-1">
          {source.status === "active" && (
            <button
              type="button"
              onClick={() => handleToggleStatus(source)}
              disabled={isBusy}
              title="Pause collecting new posts"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Pause className="size-4" />}
            </button>
          )}

          {source.status === "paused" && (
            <button
              type="button"
              onClick={() => handleToggleStatus(source)}
              disabled={isBusy}
              title="Resume collecting new posts"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            </button>
          )}

          {source.status === "failed" && (
            <button
              type="button"
              onClick={() => handleToggleStatus(source)}
              disabled={isBusy}
              title="Retry fetching source"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RotateCw className={cn("size-4", isBusy && "animate-spin")} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setDeleteTarget(source)}
            title="Delete this source"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-150"
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
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Rss className="size-5 text-primary/90" />
              <span>Manage content sources</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Register blog, YouTube, or X channel URLs to collect new posts periodically.
            </p>
          </div>

          {/* Source Add Row */}
          <div className="space-y-1.5">
            <div className="flex gap-2">
              {/* Platform Selector Combobox */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input bg-muted px-2.5 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
                  aria-label="Select platform"
                >
                  <PlatformBrandIcon url={currentPlatformConfig.iconUrl} className="size-4" />
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>

                {isPlatformMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsPlatformMenuOpen(false)}
                    />
                    <div className="absolute top-full left-0 z-50 mt-1 w-52 max-h-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in zoom-in-95">
                      {SOURCE_PLATFORMS.map((platform) => (
                        <button
                          key={platform.value}
                          type="button"
                          onClick={() => {
                            setSelectedPlatform(platform.value);
                            setIsPlatformMenuOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-accent hover:text-accent-foreground text-left transition-colors",
                            selectedPlatform === platform.value && "bg-accent font-semibold"
                          )}
                        >
                          <PlatformBrandIcon url={platform.iconUrl} className="size-4 shrink-0" />
                          <span>{platform.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Dynamic Prefix & Input */}
              <div className="flex flex-1 items-center rounded-md border border-input bg-muted shadow-2xs focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50 dark:bg-input/30">
                {currentPlatformConfig.prefix && (
                  <span className="select-none whitespace-nowrap pl-3 text-xs text-muted-foreground">
                    {currentPlatformConfig.prefix}
                  </span>
                )}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  disabled={isAdding}
                  placeholder={currentPlatformConfig.placeholder}
                  className={cn(
                    "w-full border-0 bg-transparent px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-hidden focus:ring-0",
                    currentPlatformConfig.prefix && "pl-1"
                  )}
                />
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={!inputValue.trim() || isAdding}
                className="inline-flex h-9 items-center justify-center gap-1 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5 mr-1" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-pretty text-[11px] text-muted-foreground">
              {currentPlatformConfig.description}
            </p>
          </div>

          {/* Sources List */}
          <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
            {sources.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                No sources registered yet. Add blogs, YouTube, X, or Reddit channels above!
              </p>
            ) : kindEntries.length >= 2 ? (
              kindEntries.map(([kind, groupSources]) => {
                const isExpanded = expandedCategories[kind] !== false;
                const platformLabel = PLATFORM_KIND_BRAND_LABELS[kind] || kind;
                const sampleIconUrl =
                  SOURCE_PLATFORMS.find((p) => p.value === kind)?.iconUrl || "https://example.com";

                return (
                  <div key={kind} className="rounded-lg border border-border/70 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(kind)}
                      className="flex w-full items-center justify-between bg-muted/40 px-3 py-2 text-left hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <PlatformBrandIcon url={sampleIconUrl} className="size-4" />
                        <span>{platformLabel}</span>
                        <span className="font-normal text-muted-foreground">
                          ({groupSources.length})
                        </span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-3.5 text-muted-foreground transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>

                    {isExpanded && (
                      <div className="space-y-2 p-2 bg-card/30">
                        {groupSources.map(renderSourceCard)}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              sources.map(renderSourceCard)
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="space-y-1">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Trash2 className="size-4.5 text-destructive" />
                <span>Delete this source?</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                This source and all collected posts will be deleted from your workspace. Continue?
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
