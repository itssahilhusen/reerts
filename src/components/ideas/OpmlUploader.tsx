"use client";

import React, { useState, useRef } from "react";
import { X, FileSpreadsheet, Check, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface OpmlEntry {
  url: string;
  title: string | null;
}

export interface OpmlImportResult {
  total: number;
  completed: number;
  buckets: {
    success: number;
    duplicate: number;
    unsupported: number;
    temporary: number;
    error: number;
  };
}

interface OpmlUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  entries: OpmlEntry[];
  onStartImport: (selected: OpmlEntry[]) => Promise<void>;
  progress: OpmlImportResult | null;
  isImporting: boolean;
  onCancel: () => void;
  maxLimit?: number | null;
}

export function parseOpmlXml(text: string): OpmlEntry[] {
  const results: OpmlEntry[] = [];
  const seen = new Set<string>();

  const getAttr = (tag: string, attr: string): string | null => {
    const doubleMatch = tag.match(new RegExp(`\\b${attr}\\s*=\\s*"([^"]*)"`, "i"));
    const singleMatch = doubleMatch ? null : tag.match(new RegExp(`\\b${attr}\\s*=\\s*'([^']*)'`, "i"));
    const raw = doubleMatch?.[1] ?? singleMatch?.[1];
    if (!raw) return null;
    return raw
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
      .replace(/&amp;/g, "&");
  };

  const regex = /<outline\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    const tag = m[0];
    const xmlUrl = (getAttr(tag, "xmlUrl") || getAttr(tag, "url"))?.trim();
    if (!xmlUrl || seen.has(xmlUrl)) continue;
    seen.add(xmlUrl);
    const title = (getAttr(tag, "title") || getAttr(tag, "text") || "")?.trim() || null;
    results.push({ url: xmlUrl, title });
  }

  return results;
}

export function OpmlUploader({
  isOpen,
  onClose,
  entries,
  onStartImport,
  progress,
  isImporting,
  onCancel,
  maxLimit = 200,
}: OpmlUploaderProps) {
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set(entries.map((e) => e.url)));

  // Sync entries on change
  React.useEffect(() => {
    setSelectedUrls(new Set(entries.map((e) => e.url)));
  }, [entries]);

  if (!isOpen) return null;

  const step: "preview" | "progress" | "result" = isImporting
    ? "progress"
    : progress
    ? "result"
    : "preview";

  const allSelected = entries.length > 0 && selectedUrls.size === entries.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(entries.map((e) => e.url)));
    }
  };

  const toggleUrl = (url: string) => {
    const next = new Set(selectedUrls);
    if (next.has(url)) {
      next.delete(url);
    } else {
      next.add(url);
    }
    setSelectedUrls(next);
  };

  const handleImport = () => {
    const selected = entries.filter((e) => selectedUrls.has(e.url));
    if (selected.length === 0) return;
    onStartImport(selected);
  };

  const percent = progress && progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileSpreadsheet className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Import from OPML</h3>
              {step === "preview" && (
                <p className="text-xs text-muted-foreground">
                  {entries.length} feeds found. They'll be added as content sources.
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Step: Preview */}
        {step === "preview" && (
          <div className="space-y-3 pt-3">
            {entries.length > (maxLimit || 200) && (
              <p className="text-xs text-destructive flex items-center gap-1.5">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>Only the first {maxLimit} feeds will be imported.</span>
              </p>
            )}

            <label className="flex cursor-pointer items-center justify-between border-b border-border pb-2 text-xs font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary size-4"
                />
                <span>Select all</span>
              </span>
              <span className="text-muted-foreground">
                ({selectedUrls.size} / {entries.length})
              </span>
            </label>

            <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
              {entries.map((entry, idx) => (
                <label
                  key={`${entry.url}-${idx}`}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md p-1.5 text-xs text-foreground hover:bg-muted/60 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedUrls.has(entry.url)}
                    onChange={() => toggleUrl(entry.url)}
                    className="rounded border-border text-primary focus:ring-primary size-4"
                  />
                  <div className="min-w-0 flex-1 truncate">
                    <p className="truncate font-medium">{entry.title || entry.url}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{entry.url}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedUrls.size === 0}
                onClick={handleImport}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Import {selectedUrls.size} feeds
              </button>
            </div>
          </div>
        )}

        {/* Step: Progress */}
        {step === "progress" && (
          <div className="space-y-4 py-4">
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              {progress ? `${progress.completed} / ${progress.total} imported (${percent}%)` : "Starting import..."}
            </p>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === "result" && progress && (
          <div className="space-y-3 py-3">
            <ul className="space-y-1.5 text-xs">
              <li className="font-semibold text-emerald-600 dark:text-emerald-400">
                Added: {progress.buckets.success}
              </li>
              {progress.buckets.duplicate > 0 && (
                <li className="text-muted-foreground">Already subscribed: {progress.buckets.duplicate}</li>
              )}
              {progress.buckets.unsupported > 0 && (
                <li className="text-muted-foreground">Unsupported: {progress.buckets.unsupported}</li>
              )}
              {progress.buckets.temporary > 0 && (
                <li className="text-muted-foreground">Temporary errors: {progress.buckets.temporary}</li>
              )}
              {progress.buckets.error > 0 && (
                <li className="text-muted-foreground">Failed: {progress.buckets.error}</li>
              )}
            </ul>

            <div className="flex justify-end pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
