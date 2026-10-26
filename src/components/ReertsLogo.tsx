"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ReertsLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  uppercase?: boolean;
  brandName?: string;
}

export function ReertsLogo({
  className,
  iconClassName = "size-5",
  textClassName = "font-bold text-base tracking-tight font-sans",
  showText = true,
  uppercase = false,
  brandName,
}: ReertsLogoProps) {
  const blade = "M 50 41.5 C 52 34 58 23 72 17.5 C 82 13.5 88.5 19 87 28 C 85.5 37 77 47 64 51.5 C 56 54 50.5 47 50 41.5 Z";

  return (
    <div className={cn("flex items-center gap-2 select-none text-foreground", className)}>
      {/* 8-Blade Kinetic Vortex Symbol */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 100 100"
        fill="currentColor"
        className={cn("size-5 shrink-0 text-foreground transition-transform duration-500 hover:rotate-90", iconClassName)}
        aria-hidden="true"
      >
        <g fill="currentColor">
          <path d={blade} />
          <path d={blade} transform="rotate(45 50 50)" />
          <path d={blade} transform="rotate(90 50 50)" />
          <path d={blade} transform="rotate(135 50 50)" />
          <path d={blade} transform="rotate(180 50 50)" />
          <path d={blade} transform="rotate(225 50 50)" />
          <path d={blade} transform="rotate(270 50 50)" />
          <path d={blade} transform="rotate(315 50 50)" />
        </g>
      </svg>
      {showText && (
        <span className={cn("text-foreground font-bold tracking-tight", textClassName)}>
          {brandName ? brandName : uppercase ? "REERTS" : "reerts"}
        </span>
      )}
    </div>
  );
}
