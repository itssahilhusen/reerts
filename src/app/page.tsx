"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AutomationFlow } from "@/components/AutomationFlow";
import { MultiPlatformReach } from "@/components/MultiPlatformReach";
import { Comparison } from "@/components/Comparison";
import { WorkflowDemo } from "@/components/WorkflowDemo";
import { ShowcaseDemos } from "@/components/ShowcaseDemos";
import { Reviews } from "@/components/Reviews";
import { MidCta } from "@/components/MidCta";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { ClosingCta } from "@/components/ClosingCta";
import { Footer } from "@/components/Footer";
import { TrialModal } from "@/components/TrialModal";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [trialOpen, setTrialOpen] = useState(false);
  const [trialPlan, setTrialPlan] = useState("Pro");

  useEffect(() => {
    // Check saved theme: default to dark unless explicitly set to light
    const saved = localStorage.getItem("reerts-theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("reerts-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("reerts-theme", "dark");
      setIsDark(true);
    }
  };

  const handleOpenTrial = (plan = "Pro") => {
    setTrialPlan(plan);
    setTrialOpen(true);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Background ambient radial glow matching original */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-20 transition-opacity"
        aria-hidden="true"
        style={{
          background: "radial-gradient(150% 150% at 50% 10%, transparent 60%, var(--primary) 100%)",
        }}
      />

      <Header
        onOpenTrial={() => handleOpenTrial("Pro")}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">
        <Hero onOpenTrial={() => handleOpenTrial("Pro")} />
        <AutomationFlow />
        <MultiPlatformReach />
        <Comparison />
        <WorkflowDemo isDark={isDark} />
        <Reviews />
        <MidCta onOpenTrial={() => handleOpenTrial("Pro")} />
        <ShowcaseDemos />
        <Pricing onOpenTrial={handleOpenTrial} />
        <Faq />
        <ClosingCta onOpenTrial={() => handleOpenTrial("Pro")} />
      </main>

      <Footer isDark={isDark} onToggleTheme={toggleTheme} />

      <TrialModal
        isOpen={trialOpen}
        onClose={() => setTrialOpen(false)}
        selectedPlan={trialPlan}
      />
    </div>
  );
}
