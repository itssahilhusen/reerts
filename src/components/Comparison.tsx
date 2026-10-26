"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, X, Sparkles, ChevronDown } from "lucide-react";
import { ReertsLogo } from "@/components/ReertsLogo";

export function Comparison() {
  const competitors = [
    { id: "buffer", name: "Buffer", logo: "/images/competitors/buffer.svg" },
    { id: "manychat", name: "Manychat", logo: "/images/competitors/manychat.svg" },
    { id: "opusclip", name: "Opusclip", logo: "/images/competitors/opusclip.png" },
    { id: "hootsuite", name: "Hootsuite", logo: "/images/competitors/hootsuite.png" },
    { id: "later", name: "Later", logo: "/images/competitors/later.png" },
    { id: "metricool", name: "Metricool", logo: "/images/competitors/metricool.png" },
    { id: "postiz", name: "Postiz", logo: "/images/competitors/postiz.png" },
    { id: "typefully", name: "Typefully", logo: "/images/competitors/typefully.png" },
    { id: "postbridge", name: "Postbridge", logo: "/images/competitors/postbridge.png" },
  ];

  const [selectedCompetitor, setSelectedCompetitor] = useState("buffer");

  const comparisonRows = [
    {
      feature: "Automated Marketing Pipeline",
      description: "Auto-collects ideas, drafts posts, schedules, and feeds back insights",
      reerts: true,
      competitors: { buffer: false, manychat: false, opusclip: false, hootsuite: false, later: false, metricool: false, postiz: false, typefully: false, postbridge: false },
    },
    {
      feature: "Trained Brand-Voice Writing",
      description: "AI that speaks exactly like your personal style or brand persona",
      reerts: true,
      competitors: { buffer: false, manychat: false, opusclip: false, hootsuite: false, later: false, metricool: false, postiz: false, typefully: true, postbridge: false },
    },
    {
      feature: "AI Carousel Maker",
      description: "Turns URLs, thoughts, or articles into styled multi-slide carousels",
      reerts: true,
      competitors: { buffer: false, manychat: false, opusclip: false, hootsuite: false, later: false, metricool: false, postiz: false, typefully: false, postbridge: false },
    },
    {
      feature: "Comment-to-DM & Auto-reply Automation",
      description: "Send lead magnets, links, and replies automatically when followers comment",
      reerts: true,
      competitors: { buffer: false, manychat: true, opusclip: false, hootsuite: false, later: false, metricool: false, postiz: false, typefully: false, postbridge: false },
    },
    {
      feature: "Multi-Platform Scheduling",
      description: "Native scheduling for X, LinkedIn, Threads, Instagram, TikTok, YouTube & Facebook",
      reerts: true,
      competitors: { buffer: true, manychat: false, opusclip: false, hootsuite: true, later: true, metricool: true, postiz: true, typefully: false, postbridge: true },
    },
    {
      feature: "1-Click Saved Links to Drafts",
      description: "Share any webpage directly to your queue and get an AI draft in seconds",
      reerts: true,
      competitors: { buffer: false, manychat: false, opusclip: false, hootsuite: false, later: false, metricool: false, postiz: false, typefully: false, postbridge: false },
    },
    {
      feature: "Competitor Tracking & Content Remixing",
      description: "Follow competitor accounts and remix high-performing frameworks",
      reerts: true,
      competitors: { buffer: false, manychat: false, opusclip: false, hootsuite: false, later: false, metricool: false, postiz: false, typefully: false, postbridge: false },
    },
    {
      feature: "Passwordless Client Account Invites",
      description: "Invite clients to connect their social channels without sharing passwords",
      reerts: true,
      competitors: { buffer: false, manychat: false, opusclip: false, hootsuite: false, later: false, metricool: false, postiz: false, typefully: false, postbridge: false },
    },
  ];

  return (
    <section id="comparison" aria-labelledby="comparison-title" className="border-t border-border bg-muted/20 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <ReertsLogo iconClassName="size-8" showText={false} />
          </div>
          <h2 id="comparison-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See why reerts is the best choice.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Compare content creation, scheduling, engagement, automation, and analytics—all in one unified platform.
          </p>
        </div>

        {/* Mobile View: Competitor selector */}
        <div className="mb-6 flex flex-col gap-2 lg:hidden">
          <label className="text-sm font-medium text-foreground">Select Competitor to Compare:</label>
          <div className="relative">
            <select
              value={selectedCompetitor}
              onChange={(e) => setSelectedCompetitor(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground outline-none shadow-xs"
            >
              {competitors.map((c) => (
                <option key={c.id} value={c.id}>
                  Compare vs {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Mobile Cards */}
          <div className="mt-4 space-y-3">
            {comparisonRows.map((row, idx) => {
              const compValue = (row.competitors as Record<string, boolean>)[selectedCompetitor];
              return (
                <div key={idx} className="rounded-xl border border-border bg-card p-4 shadow-2xs">
                  <div className="font-semibold text-sm text-foreground mb-1">{row.feature}</div>
                  <p className="text-xs text-muted-foreground mb-3">{row.description}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      reerts: Yes
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full ${compValue ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground/60"}`}>
                        {compValue ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      </div>
                      {competitors.find((c) => c.id === selectedCompetitor)?.name}: {compValue ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop View: Full Grid Matrix */}
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-border bg-card shadow-sm scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 pl-6 text-sm font-semibold text-foreground w-[320px]">
                  Feature Capability
                </th>
                <th className="p-4 text-center bg-primary/10 border-x border-primary/20 w-[140px]">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5">
                      <ReertsLogo iconClassName="size-4" showText={false} />
                      <span className="font-bold text-sm text-primary">reerts</span>
                    </div>
                    <span className="text-[10px] rounded-full bg-primary text-primary-foreground px-2 py-0.5 font-medium">All-in-one</span>
                  </div>
                </th>
                {competitors.map((c) => (
                  <th key={c.id} className="p-4 text-center text-xs font-medium text-muted-foreground">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex h-7 w-7 items-center justify-center">
                        <Image src={c.logo} alt={c.name} width={22} height={22} className="object-contain" />
                      </div>
                      <span>{c.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-semibold text-foreground text-sm">{row.feature}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{row.description}</div>
                  </td>
                  <td className="p-4 text-center bg-primary/5 border-x border-primary/20">
                    <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    </div>
                  </td>
                  {competitors.map((c) => {
                    const hasFeature = (row.competitors as Record<string, boolean>)[c.id];
                    return (
                      <td key={c.id} className="p-4 text-center">
                        <div className="flex justify-center">
                          {hasFeature ? (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/30">
                              <X className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
