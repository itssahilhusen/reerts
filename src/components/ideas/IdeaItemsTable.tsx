"use client";

import React, { useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Shuffle,
  FileText,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { IdeaItem } from "./IdeaItemCard";
import { FeedSourceIcon, getFeedSourceLabel } from "./PlatformIconMap";

interface IdeaItemsTableProps {
  items: IdeaItem[];
  isLoading?: boolean;
  onCreateContent: (item: IdeaItem) => void;
  onViewDetail?: (item: IdeaItem) => void;
}

export function IdeaItemsTable({
  items,
  isLoading = false,
  onCreateContent,
  onViewDetail,
}: IdeaItemsTableProps) {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Sorting
  const sortedItems = [...items].sort((a, b) => {
    const timeA = new Date(a.published_at).getTime();
    const timeB = new Date(b.published_at).getTime();
    return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
  });

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const paginatedItems = sortedItems.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="space-y-4">
      {/* Table Card Container */}
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] table-fixed text-left text-xs">
            <thead className="bg-muted/80 border-b border-border text-muted-foreground uppercase text-[11px] font-semibold sticky top-0">
              <tr>
                <th className="w-10 text-center py-3 px-2"></th>
                <th className="w-24 py-3 px-3">
                  <button
                    type="button"
                    onClick={toggleSort}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span>Date</span>
                    {sortOrder === "asc" ? (
                      <ArrowUp className="size-3" />
                    ) : (
                      <ArrowDown className="size-3" />
                    )}
                  </button>
                </th>
                <th className="w-44 py-3 px-3">Channel</th>
                <th className="w-10 text-center py-3 px-2">Link</th>
                <th className="py-3 px-3">Title</th>
                <th className="w-1/4 hidden sm:table-cell py-3 px-3">Content</th>
                <th className="w-28 text-center py-3 px-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-4 bg-muted rounded-md w-full" />
                    </td>
                  </tr>
                ))
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No items collected yet.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const channelLabel = getFeedSourceLabel({ url: item.url, title: item.source_title });
                  const dateObj = new Date(item.published_at);
                  const isMenuOpen = activeMenuId === item.id;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onViewDetail && onViewDetail(item)}
                      className="hover:bg-muted/40 cursor-pointer transition-colors group"
                    >
                      {/* Action Dropdown Menu */}
                      <td
                        className="text-center py-3 px-2 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Actions"
                        >
                          <MoreVertical className="size-3.5" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute left-2 top-8 z-50 w-40 rounded-lg border border-border bg-popover p-1 shadow-lg text-left animate-in fade-in zoom-in-95">
                              {item.excerpt && onViewDetail && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onViewDetail(item);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                                >
                                  <FileText className="size-3.5" />
                                  <span>Preview</span>
                                </button>
                              )}
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setActiveMenuId(null)}
                                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                              >
                                <ExternalLink className="size-3.5" />
                                <span>View original</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onCreateContent(item);
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                              >
                                <Shuffle className="size-3.5" />
                                <span>Repurpose</span>
                              </button>
                            </div>
                          </>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3">
                        <div className="truncate text-xs font-semibold text-foreground">
                          {format(dateObj, "MMM d")}
                        </div>
                        <div className="truncate text-[10px] text-muted-foreground">
                          {format(dateObj, "h:mm a")}
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 truncate">
                          <FeedSourceIcon
                            source={{ url: item.url, favicon_url: item.source_favicon_url }}
                            className="size-4 shrink-0"
                          />
                          <span className="truncate text-xs font-medium text-foreground">
                            {channelLabel}
                          </span>
                        </div>
                      </td>

                      {/* Link */}
                      <td
                        className="text-center py-3 px-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                          title="Open original"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </td>

                      {/* Title */}
                      <td className="py-3 px-3">
                        <p className="line-clamp-1 font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title || item.url}
                        </p>
                      </td>

                      {/* Content Preview */}
                      <td className="py-3 px-3 hidden sm:table-cell">
                        <p className="line-clamp-1 text-muted-foreground text-xs">
                          {item.excerpt || "—"}
                        </p>
                      </td>

                      {/* Repurpose Button */}
                      <td
                        className="py-3 px-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onCreateContent(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-2xs"
                        >
                          <Shuffle className="size-3" />
                          <span>Repurpose</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedItems.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-1 text-xs text-muted-foreground">
          <div>{sortedItems.length} items collected</div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageIndex(0);
                }}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-hidden"
              >
                {[10, 20, 30, 40, 50].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="font-medium text-foreground">
              {pageIndex + 1} / {totalPages}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={pageIndex === 0}
                className="inline-flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                disabled={pageIndex >= totalPages - 1}
                className="inline-flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
