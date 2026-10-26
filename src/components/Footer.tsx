"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Sun, Moon, Languages } from "lucide-react";
import { ReertsLogo } from "@/components/ReertsLogo";

interface FooterProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Footer({ isDark, onToggleTheme }: FooterProps) {
  const productLinks = [
    { label: "Pricing", href: "#pricing" },
    { label: "API & MCP", href: "/docs/developers" },
  ];

  const featureLinks = [
    { label: "All features", href: "#showcase-demos" },
    { label: "Brand Voice Learning", href: "#workflow-demo" },
    { label: "Auto Idea Search", href: "#automation-flow" },
    { label: "Content Sources", href: "#showcase-demos" },
    { label: "Auto Content Generation", href: "#automation-flow" },
    { label: "AI Carousel Maker", href: "#showcase-demos" },
    { label: "Best Content Remix", href: "#showcase-demos" },
    { label: "Multi-channel scheduling", href: "#automation-flow" },
    { label: "Recurring posts", href: "#showcase-demos" },
    { label: "Analytics", href: "#workflow-demo" },
    { label: "Mobile Share → Content", href: "#showcase-demos" },
    { label: "Competitor Spy", href: "#showcase-demos" },
    { label: "Auto DM, comments & email", href: "#showcase-demos" },
    { label: "Client account connection", href: "#showcase-demos" },
    { label: "API", href: "/docs/api" },
    { label: "MCP", href: "/docs/mcp" },
    { label: "Figma", href: "/docs/figma" },
  ];

  const freeToolLinks = [
    { label: "All free tools", href: "/tools" },
    { label: "Threads Brand Voice Analyzer", href: "/tools/threads-brand-voice-analyzer" },
    { label: "LinkedIn Brand Voice Analyzer", href: "/tools/linkedin-brand-voice-analyzer" },
    { label: "X Brand Voice Analyzer", href: "/tools/x-brand-voice-analyzer" },
  ];

  const resourceLinks = [
    { label: "About", href: "/about" },
    { label: "Affiliate program", href: "/affiliates" },
    { label: "Help Center", href: "/support" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ];

  return (
    <footer
      className="w-full pt-14 pb-8 px-6 md:px-12 lg:px-16 transition-colors"
      style={{ backgroundColor: "var(--primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
          {/* Brand info */}
          <div className="flex flex-col gap-4 shrink-0 lg:w-[240px]">
            <Link href="/" className="flex items-center">
              <ReertsLogo forceDarkBackground={true} variant="full" iconClassName="h-8 sm:h-9 w-auto object-contain" />
            </Link>

            <p
              className="text-sm whitespace-pre-line leading-relaxed"
              style={{
                color: "color-mix(in srgb, var(--primary-foreground) 70%, transparent)",
              }}
            >
              <span className="inline-flex items-center gap-1 font-medium text-primary-foreground">
                Post Steady, Grow Steady
                <TrendingUp className="size-4" />
              </span>
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--primary-foreground) 12%, transparent)",
                  color: "var(--primary-foreground)",
                }}
              >
                {isDark ? <Sun className="h-3.5 w-3.5 text-amber-300" /> : <Moon className="h-3.5 w-3.5" />}
                <span>{isDark ? "Dark" : "Light"}</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--primary-foreground) 12%, transparent)",
                  color: "var(--primary-foreground)",
                }}
              >
                <Languages className="h-3.5 w-3.5" />
                <span>EN</span>
              </button>
            </div>
          </div>

          {/* 5 Footer Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 flex-1">
            {/* Column 1: Product */}
            <div className="flex flex-col gap-4">
              <h3
                className="text-sm font-semibold tracking-wide"
                style={{ color: "var(--primary-foreground)" }}
              >
                Product
              </h3>
              <ul className="flex flex-col gap-2.5">
                {productLinks.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className="text-sm hover:underline transition-colors"
                      style={{
                        color:
                          "color-mix(in srgb, var(--primary-foreground) 75%, transparent)",
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Features */}
            <div className="flex flex-col gap-4">
              <h3
                className="text-sm font-semibold tracking-wide"
                style={{ color: "var(--primary-foreground)" }}
              >
                Features
              </h3>
              <ul className="flex flex-col gap-2.5">
                {featureLinks.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className="text-sm hover:underline transition-colors"
                      style={{
                        color:
                          "color-mix(in srgb, var(--primary-foreground) 75%, transparent)",
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Free Tools */}
            <div className="flex flex-col gap-4">
              <h3
                className="text-sm font-semibold tracking-wide"
                style={{ color: "var(--primary-foreground)" }}
              >
                Free Tools
              </h3>
              <ul className="flex flex-col gap-2.5">
                {freeToolLinks.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className="text-sm hover:underline transition-colors"
                      style={{
                        color:
                          "color-mix(in srgb, var(--primary-foreground) 75%, transparent)",
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="flex flex-col gap-4">
              <h3
                className="text-sm font-semibold tracking-wide"
                style={{ color: "var(--primary-foreground)" }}
              >
                Resources
              </h3>
              <ul className="flex flex-col gap-2.5">
                {resourceLinks.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className="text-sm hover:underline transition-colors"
                      style={{
                        color:
                          "color-mix(in srgb, var(--primary-foreground) 75%, transparent)",
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Legal */}
            <div className="flex flex-col gap-4">
              <h3
                className="text-sm font-semibold tracking-wide"
                style={{ color: "var(--primary-foreground)" }}
              >
                Legal
              </h3>
              <ul className="flex flex-col gap-2.5">
                {legalLinks.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className="text-sm hover:underline transition-colors"
                      style={{
                        color:
                          "color-mix(in srgb, var(--primary-foreground) 75%, transparent)",
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-12 pt-8 border-t"
          style={{
            borderColor:
              "color-mix(in srgb, var(--primary-foreground) 15%, transparent)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color:
                "color-mix(in srgb, var(--primary-foreground) 60%, transparent)",
            }}
          >
            © {new Date().getFullYear()} reerts, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
