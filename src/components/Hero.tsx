"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";

interface HeroProps {
  onOpenTrial: () => void;
}

export function Hero({ onOpenTrial }: HeroProps) {
  const avatars = [
    { label: "OL", bg: "bg-blue-500/20 text-blue-700 dark:text-blue-300" },
    { label: "IN", bg: "bg-purple-500/20 text-purple-700 dark:text-purple-300" },
    { label: "MA", bg: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" },
    { label: "JE", bg: "bg-amber-500/20 text-amber-700 dark:text-amber-300" },
    { label: "UN", bg: "bg-pink-500/20 text-pink-700 dark:text-pink-300" },
    { label: "FI", bg: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" },
    { label: "IN", bg: "bg-rose-500/20 text-rose-700 dark:text-rose-300" },
    { label: "IO", bg: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300" },
    { label: "HO", bg: "bg-teal-500/20 text-teal-700 dark:text-teal-300" },
  ];

  return (
    <section id="hero" className="flex flex-col items-center px-4 pt-16 pb-12 md:pt-20 md:pb-16 lg:min-h-[calc(100vh-4rem)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4">
        <div className="flex w-full flex-col items-center text-center">
          {/* Release Badge */}
          <Link
            href="#showcase-demos"
            className="group mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1 text-sm font-medium text-foreground shadow-xs transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="flex items-center rounded-full bg-primary/10 py-0.5 font-semibold px-2 text-[11px]">
              <span
                style={{
                  backgroundImage: "linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#a855f7)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                new
              </span>
            </span>
            <span>AI Carousel Maker is live</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Main Headline */}
          <h1 className="text-primary text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
            <span className="sr-only">Social media marketing automation tool for founders and agencies.</span>
            <span className="block">Automate social media</span>
            <span className="block">in 10 minutes a day.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-base whitespace-pre-line text-muted-foreground sm:text-lg md:mt-6 md:text-xl">
            From finding ideas to posts, carousels, scheduling and analytics —
            reerts takes over the social media work that used to eat your day.
          </p>

          {/* CTA & Social Proof */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onOpenTrial}
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg px-8 text-lg font-semibold gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                Start your 7-day free trial
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>

              <Link
                href="/studio"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring border border-border bg-card/80 hover:bg-muted text-foreground h-12 rounded-lg px-6 text-base font-semibold gap-2 shadow-xs"
              >
                Open Studio
              </Link>
            </div>

            <div className="flex flex-col items-center sm:h-12 sm:justify-center">
              <div className="flex items-center -space-x-3 h-8">
                {avatars.map((av, idx) => (
                  <div
                    key={idx}
                    className="relative transition-transform hover:scale-110 hover:z-20 cursor-default"
                    style={{ zIndex: 10 - idx }}
                  >
                    <span className="relative flex shrink-0 overflow-hidden rounded-full size-8 border-2 border-background grayscale hover:grayscale-0 transition-all">
                      <span className={`flex size-full items-center justify-center rounded-full text-[10px] font-bold ${av.bg}`}>
                        {av.label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <span className="mt-1 text-sm text-muted-foreground">
                Trusted by 829 founders and agencies
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Platform Bar */}
        <div className="mt-8 lg:hidden">
          <div className="flex flex-wrap items-center justify-center gap-4 py-2">
            <Image src="/images/platforms/threads.svg" alt="Threads" width={26} height={26} className="dark:invert" />
            <Image src="/images/platforms/linkedin.svg" alt="LinkedIn" width={26} height={26} />
            <Image src="/images/platforms/x-light.svg" alt="X" width={26} height={26} />
            <Image src="/images/platforms/instagram.svg" alt="Instagram" width={26} height={26} />
            <Image src="/images/platforms/tiktok-light.svg" alt="TikTok" width={26} height={26} />
            <Image src="/images/platforms/youtube.svg" alt="YouTube" width={26} height={19} />
            <Rss className="size-6 text-foreground" />
            <Image src="/images/platforms/facebook.svg" alt="Facebook" width={26} height={26} />
          </div>
        </div>

        {/* Desktop Rotating Platform Wheel */}
        <div className="relative hidden aspect-square w-80 lg:block mt-6">
          <div className="absolute inset-0 motion-safe:animate-[spin_40s_linear_infinite]">
            {/* Center Logo */}
            <div className="absolute inset-[15%] flex items-center justify-center">
              <Image
                src="/images/logos/logo-light-svg.svg"
                alt=""
                width={320}
                height={320}
                className="rounded-[3px] dark:hidden h-full w-full object-contain"
              />
              <Image
                src="/images/logos/logo-dark-svg.svg"
                alt=""
                width={320}
                height={320}
                className="hidden rounded-[3px] dark:block h-full w-full object-contain"
              />
            </div>

            {/* Orbiting Platforms with counter-rotation */}
            {/* Top (50%, 5%) - Threads */}
            <div className="absolute w-max -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "5%" }}>
              <div className="motion-safe:animate-[spin-reverse_40s_linear_infinite]">
                <Image src="/images/platforms/threads.svg" alt="Threads" width={40} height={40} className="dark:invert" />
              </div>
            </div>

            {/* Top Right (81.8%, 18.2%) - LinkedIn */}
            <div className="absolute w-max -translate-x-1/2 -translate-y-1/2" style={{ left: "81.82%", top: "18.18%" }}>
              <div className="motion-safe:animate-[spin-reverse_40s_linear_infinite]">
                <Image src="/images/platforms/linkedin.svg" alt="LinkedIn" width={40} height={40} />
              </div>
            </div>

            {/* Right (95%, 50%) - X */}
            <div className="absolute w-max -translate-x-1/2 -translate-y-1/2" style={{ left: "95%", top: "50%" }}>
              <div className="motion-safe:animate-[spin-reverse_40s_linear_infinite]">
                <Image src="/images/platforms/x-light.svg" alt="X" width={40} height={40} />
              </div>
            </div>

            {/* Bottom Right (81.8%, 81.8%) - Instagram */}
            <div className="absolute w-max -translate-x-1/2 -translate-y-1/2" style={{ left: "81.82%", top: "81.82%" }}>
              <div className="motion-safe:animate-[spin-reverse_40s_linear_infinite]">
                <Image src="/images/platforms/instagram.svg" alt="Instagram" width={40} height={40} />
              </div>
            </div>

            {/* Bottom (50%, 95%) - TikTok */}
            <div className="absolute w-max -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "95%" }}>
              <div className="motion-safe:animate-[spin-reverse_40s_linear_infinite]">
                <Image src="/images/platforms/tiktok-light.svg" alt="TikTok" width={40} height={40} />
              </div>
            </div>

            {/* Bottom Left (18.2%, 81.8%) - YouTube */}
            <div className="absolute w-max -translate-x-1/2 -translate-y-1/2" style={{ left: "18.18%", top: "81.82%" }}>
              <div className="motion-safe:animate-[spin-reverse_40s_linear_infinite]">
                <Image src="/images/platforms/youtube.svg" alt="YouTube" width={40} height={28} />
              </div>
            </div>

            {/* Left (5%, 50%) - RSS / Blog */}
            <div className="absolute w-max -translate-x-1/2 -translate-y-1/2" style={{ left: "5%", top: "50%" }}>
              <div className="motion-safe:animate-[spin-reverse_40s_linear_infinite] flex items-center justify-center p-2 rounded-full bg-card border border-border shadow-xs">
                <Rss className="size-6 text-foreground" />
              </div>
            </div>

            {/* Top Left (18.2%, 18.2%) - Facebook */}
            <div className="absolute w-max -translate-x-1/2 -translate-y-1/2" style={{ left: "18.18%", top: "18.18%" }}>
              <div className="motion-safe:animate-[spin-reverse_40s_linear_infinite]">
                <Image src="/images/platforms/facebook.svg" alt="Facebook" width={40} height={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
