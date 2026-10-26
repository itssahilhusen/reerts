"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Search, Filter, MoreHorizontal, CheckCircle2, Clock, FileText, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostsViewProps {
  onOpenComposer: (post?: any) => void;
}

export function PostsView({ onOpenComposer }: PostsViewProps) {
  const [filterTab, setFilterTab] = useState<"all" | "published" | "scheduled" | "drafts">("all");

  const posts = [
    {
      id: "1",
      title: "reerts 2.0 is officially live! 🚀",
      snippet: "Autonomous multi-platform publishing with your unique brand voice.",
      status: "published",
      date: "Oct 24, 2026",
      platforms: ["x", "linkedin", "threads", "instagram"],
      views: "14.2K",
      engagement: "4.8%",
    },
    {
      id: "2",
      title: "Why carousel posts get 3x higher dwell time on LinkedIn",
      snippet: "Data breakdown from over 10,000 posts analyzed with our analytics engine.",
      status: "published",
      date: "Oct 22, 2026",
      platforms: ["linkedin"],
      views: "28.5K",
      engagement: "6.2%",
    },
    {
      id: "3",
      title: "5 AI tools that will save you 20 hours this week",
      snippet: "From autonomous content engines to automatic lead DM responses.",
      status: "scheduled",
      date: "Oct 27, 09:30 AM",
      platforms: ["x", "threads", "linkedin"],
      views: "-",
      engagement: "-",
    },
    {
      id: "4",
      title: "Behind the scenes of building reerts in public",
      snippet: "Here is the exact tech stack we used to achieve 100% UI fidelity in record time.",
      status: "drafts",
      date: "Edited 2h ago",
      platforms: ["x", "linkedin"],
      views: "-",
      engagement: "-",
    },
  ];

  const filtered = posts.filter((p) => filterTab === "all" || p.status === filterTab);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Posts Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview of all your drafted, scheduled, and published social content.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenComposer()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {(["all", "published", "scheduled", "drafts"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilterTab(tab)}
            className={cn(
              "capitalize px-3 py-1 text-xs font-semibold rounded-lg transition-all",
              filterTab === tab ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase">
            <tr>
              <th className="p-3.5">Post Title</th>
              <th className="p-3.5">Platforms</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Impressions</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((post) => (
              <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-3.5">
                  <span className="font-semibold text-foreground block">{post.title}</span>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">{post.snippet}</span>
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-1">
                    {post.platforms.map((p) => (
                      <Image key={p} src={`/images/platforms/${p === "x" ? "x-light.svg" : p + ".svg"}`} alt={p} width={14} height={14} className={p === "x" ? "dark:invert" : ""} />
                    ))}
                  </div>
                </td>
                <td className="p-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      post.status === "published" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                      post.status === "scheduled" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      post.status === "drafts" && "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="p-3.5 text-muted-foreground">{post.date}</td>
                <td className="p-3.5 font-semibold text-foreground">{post.views}</td>
                <td className="p-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onOpenComposer({ title: post.title, content: post.snippet, platforms: post.platforms })}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
