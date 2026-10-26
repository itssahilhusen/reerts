"use client";

import React, { useState } from "react";
import { Sparkles, Save, Sliders, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function BrandVoiceView() {
  const [personaName, setPersonaName] = useState("Alex Rivers - AI Tech Founder");
  const [formality, setFormality] = useState(30);
  const [humor, setHumor] = useState(45);
  const [directness, setDirectness] = useState(85);
  const [targetAudience, setTargetAudience] = useState("Founders, content creators, engineers, and digital entrepreneurs looking to scale with automation.");
  const [bannedWords, setBannedWords] = useState("delve, tapestry, synergy, revolutionize, unleash, testament");

  const handleSave = () => {
    toast.success("Brand Voice Persona updated successfully!");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Brand Voice Setup</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure how your AI models write, format, and structure content across all platforms.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
        >
          <Save className="size-3.5" />
          <span>Save Persona</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Personality & Sliders */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sliders className="size-4 text-primary" />
            <span>Tone & Personality Sliders</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Persona Title</label>
            <input
              type="text"
              value={personaName}
              onChange={(e) => setPersonaName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Formality</span>
                <span className="text-muted-foreground">{formality}% ({formality < 50 ? "Casual & Relatable" : "Professional & Academic"})</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formality}
                onChange={(e) => setFormality(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Directness / Punchiness</span>
                <span className="text-muted-foreground">{directness}% (Bullet-driven & Actionable)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={directness}
                onChange={(e) => setDirectness(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Humor & Wit</span>
                <span className="text-muted-foreground">{humor}% (Subtle tech humor)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={humor}
                onChange={(e) => setHumor(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Audience & Rules */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles className="size-4 text-primary" />
            <span>Audience & Guardrails</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Target Audience</label>
            <textarea
              rows={3}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground outline-none focus:border-primary leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Banned AI Cliches & Buzzwords</label>
            <input
              type="text"
              value={bannedWords}
              onChange={(e) => setBannedWords(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
            />
            <p className="text-[10px] text-muted-foreground">The AI engine will strictly avoid these words in generated copy.</p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
            <span>Active persona is synced with Claude 3.5 Sonnet and GPT-4o models in Content Studio.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
