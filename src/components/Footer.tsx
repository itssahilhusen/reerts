"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Sun, Moon, Languages } from "lucide-react";
import { ReertsLogo } from "@/components/ReertsLogo";

interface FooterProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Footer({ isDark, onToggleTheme }: FooterProps) {
  return (
    <footer className="w-full pt-16 pb-12 px-6 md:px-12 lg:px-16 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Brand info */}
          <div className="flex flex-col gap-4 shrink-0 lg:w-[280px]">
            <Link href="/" className="flex items-center gap-2">
              <ReertsLogo iconClassName="size-7" textClassName="text-2xl font-bold tracking-tight text-foreground lowercase" />
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                Post Steady, Grow Steady
                <TrendingUp className="size-4 text-emerald-500" />
              </span>
              <br />
              The all-in-one AI social media marketing engine built for founders, creators, and agencies.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
                <span>{isDark ? "Dark Theme" : "Light Theme"}</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Languages className="h-3.5 w-3.5" />
                <span>EN</span>
              </button>
            </div>
          </div>

          {/* 5 Footer Navigation Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 flex-1 text-xs">
            {/* Column 1: Product */}
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#hero" className="hover:text-foreground transition-colors">Overview</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#showcase-demos" className="hover:text-foreground transition-colors">AI Carousels</a></li>
                <li><a href="#automation-flow" className="hover:text-foreground transition-colors">Pipeline</a></li>
                <li><a href="#reviews" className="hover:text-foreground transition-colors">Wall of Love</a></li>
              </ul>
            </div>

            {/* Column 2: Features */}
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm text-foreground">Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#workflow-demo" className="hover:text-foreground transition-colors">Brand Voice AI</a></li>
                <li><a href="#showcase-demos" className="hover:text-foreground transition-colors">Auto-DM Keywords</a></li>
                <li><a href="#showcase-demos" className="hover:text-foreground transition-colors">Competitor Radar</a></li>
                <li><a href="#automation-flow" className="hover:text-foreground transition-colors">Multi-Platform Queue</a></li>
                <li><a href="#showcase-demos" className="hover:text-foreground transition-colors">Client Invites</a></li>
              </ul>
            </div>

            {/* Column 3: Free Tools */}
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm text-foreground">Free Tools</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#showcase-demos" className="hover:text-foreground transition-colors">Viral Hook Scorer</a></li>
                <li><a href="#showcase-demos" className="hover:text-foreground transition-colors">Carousel Maker</a></li>
                <li><a href="#showcase-demos" className="hover:text-foreground transition-colors">Caption Generator</a></li>
                <li><a href="#showcase-demos" className="hover:text-foreground transition-colors">Twitter Thread Slicer</a></li>
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm text-foreground">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#faq" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">API &amp; Webhooks</a></li>
                <li><a href="#comparison" className="hover:text-foreground transition-colors">Comparisons</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Column 5: Legal */}
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm text-foreground">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#faq" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">Security &amp; OAuth</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">Cookie Preferences</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} reerts, Inc. All rights reserved.</p>
          <p>Engineered for high-performing modern founders.</p>
        </div>
      </div>
    </footer>
  );
}
