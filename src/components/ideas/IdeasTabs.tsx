"use client";

import React, { useState } from "react";
import {
  Rss,
  Settings,
  Flame,
  FileSpreadsheet,
  RotateCw,
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentSourceItem } from "./SourceManager";
import {
  PLATFORM_KIND_BRAND_LABELS,
  PlatformKind,
  FeedSourceIcon,
  FeedSourceKindIcon,
  getFeedSourceKind,
  getFeedSourceLabel,
} from "./PlatformIconMap";

interface IdeasTabsProps {
  sources: ContentSourceItem[];
  selectedFilter: string; // "all", "platform:<kind>", or sourceId
  onSelectFilter: (val: string) => void;
  onOpenManageSources: () => void;
  onOpenRecommended: () => void;
  onTriggerOpml: () => void;
  viewMode: "grid" | "table";
  onChangeViewMode: (mode: "grid" | "table") => void;
  lastRefreshedText: string | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function IdeasTabs({
  sources,
  selectedFilter,
  onSelectFilter,
  onOpenManageSources,
  onOpenRecommended,
  onTriggerOpml,
  viewMode,
  onChangeViewMode,
  lastRefreshedText,
  onRefresh,
  isRefreshing = false,
}: IdeasTabsProps) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Group sources by kind for filter dropdown
  const grouped: Record<string, ContentSourceItem[]> = {};
  sources.forEach((s) => {
    const k = getFeedSourceKind(s);
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(s);
  });
  const groupedEntries = Object.entries(grouped);

  // Label for active filter
  const getActiveFilterLabel = () => {
    if (selectedFilter === "all") return "All sources";
    if (selectedFilter.startsWith("platform:")) {
      const p = selectedFilter.replace("platform:", "");
      return PLATFORM_KIND_BRAND_LABELS[p] || p;
    }
    const found = sources.find((s) => s.id === selectedFilter);
    return found ? getFeedSourceLabel(found) : "All sources";
  };

  return (
    <div className="space-y-4">
      {/* 1. Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        {/* Source Filter Dropdown (if sources exist) */}
        {sources.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="inline-flex h-9 w-48 sm:w-56 items-center justify-between rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors shadow-2xs"
            >
              <span className="truncate">{getActiveFilterLabel()}</span>
              <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
            </button>

            {isFilterDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFilterDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 z-50 mt-1 w-56 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-lg text-left animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectFilter("all");
                      setIsFilterDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                      selectedFilter === "all" && "bg-accent font-semibold"
                    )}
                  >
                    <span>All sources</span>
                  </button>

                  {groupedEntries.map(([kind, kSources]) => (
                    <div key={kind} className="pt-1">
                      {kSources.length >= 2 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectFilter(`platform:${kind}`);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold text-popover-foreground hover:bg-accent",
                              selectedFilter === `platform:${kind}` && "bg-accent"
                            )}
                          >
                            <FeedSourceKindIcon kind={kind as PlatformKind} className="size-4 shrink-0" />
                            <span>{PLATFORM_KIND_BRAND_LABELS[kind] || kind}</span>
                          </button>
                          {kSources.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                onSelectFilter(s.id);
                                setIsFilterDropdownOpen(false);
                              }}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md pl-6 pr-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
                                selectedFilter === s.id && "bg-accent text-foreground font-semibold"
                              )}
                            >
                              <FeedSourceIcon source={s} className="size-3.5 shrink-0" />
                              <span className="truncate">{getFeedSourceLabel(s)}</span>
                            </button>
                          ))}
                        </>
                      ) : (
                        kSources.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              onSelectFilter(s.id);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-accent",
                              selectedFilter === s.id && "bg-accent font-semibold"
                            )}
                          >
                            <FeedSourceIcon source={s} className="size-4 shrink-0" />
                            <span className="truncate">{getFeedSourceLabel(s)}</span>
                          </button>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab Action 1: Manage Sources Button */}
        <button
          type="button"
          onClick={onOpenManageSources}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-2xs"
        >
          <Settings className="size-3.5" />
          <span>Manage sources</span>
        </button>

        {/* Tab Action 2: Recommended Sources Button */}
        <button
          type="button"
          onClick={onOpenRecommended}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted transition-all shadow-2xs"
        >
          <Flame className="size-3.5 text-amber-500 fill-amber-500" />
          <span>Recommended Sources</span>
        </button>

        {/* Tab Action 3: Import from OPML Button */}
        <button
          type="button"
          onClick={onTriggerOpml}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted transition-all shadow-2xs"
        >
          <FileSpreadsheet className="size-3.5 text-primary" />
          <span>Import from OPML</span>
        </button>

        {/* Right Status & Refresh Section */}
        <div className="order-first flex w-full items-center justify-end gap-3 sm:order-none sm:ml-auto sm:w-auto">
          <div className="flex flex-col items-end text-[11px] text-muted-foreground">
            <span>Last refreshed</span>
            <span className="font-semibold text-foreground">
              {lastRefreshedText || "No record"}
            </span>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted transition-all shadow-2xs disabled:opacity-50"
            title="Fetch latest posts from all active sources"
          >
            <RotateCw className={cn("size-3.5", isRefreshing && "animate-spin")} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* 3. View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="grid w-fit grid-cols-2 rounded-lg bg-muted/80 p-1 border border-border">
          <button
            type="button"
            onClick={() => onChangeViewMode("grid")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="size-3.5" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode("table")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
              viewMode === "table"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TableIcon className="size-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>
    </div>
  );
}
