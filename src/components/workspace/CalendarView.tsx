"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar as CalendarIcon } from "lucide-react";

interface CalendarViewProps {
  onOpenComposer: (post?: any) => void;
}

export function CalendarView({ onOpenComposer }: CalendarViewProps) {
  const [selectedWeek, setSelectedWeek] = useState("Oct 26 - Nov 01, 2026");
  const [livePosts, setLivePosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setLivePosts(data.posts);
      })
      .catch((err) => console.error(err));
  }, []);

  const days = [
    { 
      day: "Mon", 
      date: "26", 
      posts: livePosts.filter((p) => p.status === "PUBLISHED").map((p) => ({
        title: p.title,
        time: "09:30 AM",
        platforms: p.platforms || ["x", "linkedin"],
      }))
    },
    { day: "Tue", date: "27", posts: [] },
    { 
      day: "Wed", 
      date: "28", 
      posts: livePosts.filter((p) => p.status === "SCHEDULED").map((p) => ({
        title: p.title,
        time: "02:00 PM",
        platforms: p.platforms || ["x", "threads"],
      }))
    },
    { day: "Thu", date: "29", posts: [{ title: "5 AI tools for creators", time: "11:00 AM", platforms: ["linkedin", "threads"] }] },
    { day: "Fri", date: "30", posts: [{ title: "Building in public weekly recap", time: "04:30 PM", platforms: ["x", "linkedin", "threads"] }] },
    { day: "Sat", date: "31", posts: [] },
    { day: "Sun", date: "01", posts: [{ title: "Sunday deep dive & reflection", time: "08:00 PM", platforms: ["threads", "instagram"] }] },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background px-4 lg:px-6 py-5 font-sans min-w-0 space-y-5">
      {/* 1. Content Calendar Title Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center text-foreground">
            <CalendarIcon className="size-7 shrink-0 text-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Content Calendar
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold gap-3 shadow-xs">
            <button type="button" className="hover:text-primary"><ChevronLeft className="size-4" /></button>
            <span>{selectedWeek}</span>
            <button type="button" className="hover:text-primary"><ChevronRight className="size-4" /></button>
          </div>
          <button
            type="button"
            onClick={() => onOpenComposer()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Schedule Slot</span>
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 flex-1 min-h-[500px]">
        {days.map((d) => (
          <div key={d.day} className="rounded-xl border border-border bg-card/60 p-3 flex flex-col space-y-2">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <span className="text-xs font-bold text-foreground">{d.day}</span>
              <span className="text-xs font-mono text-muted-foreground">{d.date}</span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto min-h-[120px]">
              {d.posts.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenComposer({ title: p.title, content: p.title, platforms: p.platforms })}
                  className="group cursor-pointer rounded-lg border border-border bg-card p-2.5 shadow-xs hover:border-primary/60 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <Clock className="size-2.5" /> {p.time}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {p.platforms.map((plat: string) => (
                        <Image key={plat} src={`/images/platforms/${plat === "x" ? "x-light.svg" : plat + ".svg"}`} alt={plat} width={10} height={10} className={plat === "x" ? "dark:invert" : ""} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-foreground group-hover:text-primary line-clamp-2 leading-tight">
                    {p.title}
                  </p>
                </div>
              ))}

              <button
                type="button"
                onClick={() => onOpenComposer({ date: `${d.day}, Oct ${d.date}` })}
                className="w-full rounded-lg border border-dashed border-border/70 py-2 text-[10px] font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all flex items-center justify-center gap-1"
              >
                <Plus className="size-3" /> Add Slot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
