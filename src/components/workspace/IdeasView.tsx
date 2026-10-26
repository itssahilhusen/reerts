"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Rss, Plus, Flame, Lightbulb, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface IdeasViewProps {
  onOpenComposer: (post?: any) => void;
}

export function IdeasView({ onOpenComposer }: IdeasViewProps) {
  const [topicInput, setTopicInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState([
    {
      id: "1",
      title: "Why consistency on 1 platform is obsolete in 2026",
      source: "X Viral Feeds",
      score: "98% Virality",
      tags: ["Strategy", "Multi-Platform"],
    },
    {
      id: "2",
      title: "How I turn 1 technical commit into a LinkedIn carousel and a Twitter breakdown",
      source: "Reddit r/webdev",
      score: "94% Virality",
      tags: ["Repurposing", "Developer"],
    },
    {
      id: "3",
      title: "Stop posting at random times: the real data behind dwell-time algorithms",
      source: "RSS Feed",
      score: "91% Virality",
      tags: ["Analytics", "Growth"],
    },
    {
      id: "4",
      title: "The feedback loop playbook: how to make past winners generate future winners",
      source: "AI Idea Engine",
      score: "96% Virality",
      tags: ["AI", "Feedback Loop"],
    },
  ]);

  const handleGenerate = () => {
    if (!topicInput.trim()) {
      toast.error("Please enter a topic or keyword");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIdeas([
        {
          id: Date.now().toString(),
          title: `How to dominate ${topicInput} with automated content distribution`,
          source: "Custom AI Generation",
          score: "99% Virality",
          tags: [topicInput, "Automation"],
        },
        ...ideas,
      ]);
      setTopicInput("");
      toast.success("Generated new viral ideas from topic!");
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Content Ideas Discovery</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Auto-collected ideas from RSS feeds, competitor bookmarks, and AI hook generation.
        </p>
      </div>

      {/* AI Generator Box */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm text-primary">
          <Sparkles className="size-4" />
          <span>Generate Ideas in your Brand Voice</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter any topic, niche, or URL (e.g. 'SaaS pricing models' or 'Next.js 15 tips')..."
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="size-3.5 animate-spin" /> : <Lightbulb className="size-3.5" />}
            <span>Generate Ideas</span>
          </button>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <Flame className="size-3" /> {item.score}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground">{item.source}</span>
              </div>
              <h3 className="font-semibold text-sm text-foreground leading-snug">{item.title}</h3>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((t) => (
                  <span key={t} className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenComposer({
                  title: item.title,
                  content: `${item.title}\n\nHere are 3 key takeaways you need to know:\n\n1. \n2. \n3. \n\n#content #growth`,
                })
              }
              className="inline-flex items-center justify-between pt-2 border-t border-border/50 text-xs font-semibold text-primary hover:underline"
            >
              <span>Turn into Post / Thread</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
