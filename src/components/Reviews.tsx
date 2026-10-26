"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Star } from "lucide-react";

export function Reviews() {
  const reviews = [
    {
      handle: "manyjjju_yaksa",
      avatar: "/images/testimonials/manyjjju_yaksa.jpg",
      url: "https://www.threads.com/@manyjjju_yaksa",
      platform: "Threads",
      text: "Threads fam, have you tried REERTS? I had no clue how to look back through my old Threads posts and organize them — this tool was a total lifesaver. Posts, views, shares, comments — all in one place. Seriously so convenient. Not an ad! I just love it.",
    },
    {
      handle: "oliviandtilly",
      avatar: "/images/testimonials/oliviandtilly.jpg",
      url: "https://www.threads.com/@oliviandtilly",
      platform: "LinkedIn / Threads",
      text: "As an indie brand owner, posting consistently on 4 channels every day felt like a second full-time job. With reerts, I queue my week in 30 minutes on Sunday. Game changer.",
    },
    {
      handle: "undertow-io",
      avatar: "/images/testimonials/undertow-io.jpg",
      url: "https://www.threads.com/@undertow.io",
      platform: "X / LinkedIn",
      text: "The carousel maker alone is worth 10x the price. I paste my release notes and get a sleek 6-slide deck ready for LinkedIn. Saved us at least 15 design hours this month.",
    },
    {
      handle: "wolhavest",
      avatar: "/images/testimonials/wolhavest.jpg",
      url: "https://www.threads.com/@wolhavest",
      platform: "Threads",
      text: "Hook scoring is spooky accurate. The posts it rates 90+ consistently get 3-5x the impressions of my manual drafts. The brand voice adaptation is unmatched.",
    },
    {
      handle: "iooo_ttt",
      avatar: "/images/testimonials/iooo_ttt.jpg",
      url: "https://www.threads.com/@iooo_ttt",
      platform: "Instagram / X",
      text: "Finally a social tool that doesn't trigger reach penalties. Uses official APIs and the auto-DM keyword feature brought in 400+ email signups on our last launch alone.",
    },
    {
      handle: "homebodify",
      avatar: "/images/testimonials/homebodify.jpg",
      url: "https://www.threads.com/@homebodify",
      platform: "Agency Owner",
      text: "Connecting client social accounts without asking for their passwords changed our agency workflow completely. Client onboarding went from 3 days to 2 minutes.",
    },
    {
      handle: "figuwang",
      avatar: "/images/testimonials/figuwang.jpg",
      url: "https://www.threads.com/@figuwang",
      platform: "Founder",
      text: "Best social marketing automation tool on the market right now. Clean UI, fast, dark mode is pristine, and it does exactly what it promises without fluff.",
    },
  ];

  return (
    <section id="reviews" className="relative w-full border-t border-border bg-muted/30 py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-12 text-center">
        <div className="flex items-center gap-2 mb-3 justify-center">
          <Image
            src="/images/logos/logo-light.png"
            alt="reerts"
            width={32}
            height={32}
            className="rounded-md dark:hidden"
          />
          <Image
            src="/images/logos/logo-dark.png"
            alt="reerts"
            width={32}
            height={32}
            className="rounded-md hidden dark:block"
          />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          User Reviews
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          What active founders and growth marketers say about automating their pipeline.
        </p>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex shrink-0 animate-marquee gap-4 py-2 hover:[animation-play-state:paused]">
          {reviews.concat(reviews).map((rev, i) => (
            <div
              key={i}
              className="w-[280px] sm:w-[360px] shrink-0 rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={rev.avatar}
                      alt={rev.handle}
                      width={40}
                      height={40}
                      className="rounded-full bg-muted object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{rev.handle}</h4>
                      <p className="text-[11px] text-muted-foreground">{rev.platform}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="h-3 w-3 fill-amber-500" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-primary font-medium">
                <span>Verified user</span>
                <span className="flex items-center gap-1 hover:underline">
                  View post <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
