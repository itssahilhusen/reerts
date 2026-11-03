import { AuteurEditPlan, PlannedScene } from "./gemini-video-pipeline";
import { VIDEO_TEMPLATES } from "@/data/videoTemplates";

export type StyleLayoutFamily =
  | "split_explainer"
  | "whiteboard_marker"
  | "chalkboard"
  | "receipt_roll"
  | "paper_studio"
  | "lime_slides"
  | "editorial_magazine"
  | "neon_cyber"
  | "hype_verdict"
  | "blueprint_dashboard";

export interface StyleVisualConfig {
  styleId: string;
  styleName: string;
  layoutFamily: StyleLayoutFamily;
  canvasBgHex: string; // FFmpeg 0xRRGGBB
  cardBorderHex: string; // FFmpeg 0xRRGGBB
  gridLineHex: string; // FFmpeg 0xRRGGBB
  highlightHex: string; // #RRGGBB for top header box & callouts
  highlightTextHex: string; // #RRGGBB text inside highlight box
  metaTextAssColor: string; // ASS &H00BBGGRR
  headlinePrimaryAssColor: string; // ASS &H00BBGGRR
  headlineSecondaryAssColor: string; // ASS &H00BBGGRR
  captionActiveAssColor: string; // ASS &H00BBGGRR
  captionDimAssColor: string; // ASS &H00BBGGRR
  badgeBgAssColor: string; // ASS &H00BBGGRR
  badgeTextAssColor: string; // ASS &H00BBGGRR
  isDarkCanvas: boolean;
}

/**
 * Convert standard #RRGGBB hex into ASS &H00BBGGRR color string
 */
export function hexToAssColor(hex: string, alphaHex = "00"): string {
  const clean = hex.replace("#", "").replace(/^0x/i, "").trim();
  if (clean.length !== 6) return `&H${alphaHex}FFFFFF`;
  const r = clean.slice(0, 2).toUpperCase();
  const g = clean.slice(2, 4).toUpperCase();
  const b = clean.slice(4, 6).toUpperCase();
  return `&H${alphaHex}${b}${g}${r}`;
}

/**
 * Format seconds into ASS timestamp H:MM:SS.cc
 */
export function formatAssTime(seconds: number): string {
  const safe = Math.max(0, seconds);
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = Math.floor(safe % 60);
  const cs = Math.min(99, Math.round((safe - Math.floor(safe)) * 100));
  return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

/**
 * Format seconds into SMPTE timecode 00:00:SS:FF (30 fps)
 */
export function formatSmpteTimecode(seconds: number, fps = 30): string {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  const frames = Math.floor((safe - Math.floor(safe)) * fps);
  return `00:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
}

/**
 * Exact lookup table for all 56 Makerzz studio styles so every single style ID
 * resolves to its authentic name, palette, and layout family.
 */
const EXACT_STYLE_CATALOG: Record<
  string,
  {
    name: string;
    family: StyleLayoutFamily;
    bg: string;
    border: string;
    grid: string;
    highlight: string;
    highlightText: string;
    isDark: boolean;
  }
> = {
  "classified-yt": {
    name: "Glitch",
    family: "split_explainer",
    bg: "0x0B0B0E",
    border: "0xFACC15",
    grid: "0x27272A",
    highlight: "#FACC15",
    highlightText: "#0B0B0E",
    isDark: true,
  },
  limeslides: {
    name: "Lime Slides",
    family: "lime_slides",
    bg: "0xC6FF3D",
    border: "0x111111",
    grid: "0x111111",
    highlight: "#111111",
    highlightText: "#C6FF3D",
    isDark: false,
  },
  "cap-forest": {
    name: "Forest Edit",
    family: "editorial_magazine",
    bg: "0x0F291E",
    border: "0xD4AF37",
    grid: "0x1E4635",
    highlight: "#D4AF37",
    highlightText: "#0F291E",
    isDark: true,
  },
  "cap-paper": {
    name: "Paper Studio",
    family: "paper_studio",
    bg: "0xF4F1EA",
    border: "0x18181B",
    grid: "0xD6D1C4",
    highlight: "#FACC15",
    highlightText: "#111111",
    isDark: false,
  },
  "fmt-countdown": {
    name: "Rank Rush",
    family: "hype_verdict",
    bg: "0x0B0B0E",
    border: "0xFACC15",
    grid: "0x27272A",
    highlight: "#FACC15",
    highlightText: "#0B0B0E",
    isDark: true,
  },
  "split-act": {
    name: "Three Act",
    family: "split_explainer",
    bg: "0x0B0B0E",
    border: "0xEF4444",
    grid: "0x27272A",
    highlight: "#EF4444",
    highlightText: "#FFFFFF",
    isDark: true,
  },
  "cap-obsidian": {
    name: "Obsidian Desk",
    family: "blueprint_dashboard",
    bg: "0x0D0F14",
    border: "0xF59E0B",
    grid: "0x1E293B",
    highlight: "#F59E0B",
    highlightText: "#0D0F14",
    isDark: true,
  },
  "cap-cobalt": {
    name: "Cobalt Sun",
    family: "editorial_magazine",
    bg: "0xFBF7F0",
    border: "0x1D4ED8",
    grid: "0xBFDBFE",
    highlight: "#F97316",
    highlightText: "#FFFFFF",
    isDark: false,
  },
  "fmt-chalk": {
    name: "Chalk Talk",
    family: "chalkboard",
    bg: "0x191B18",
    border: "0xFDE047",
    grid: "0x2D312B",
    highlight: "#FDE047",
    highlightText: "#191B18",
    isDark: true,
  },
  "cap-editorial": {
    name: "Editorial Cut",
    family: "editorial_magazine",
    bg: "0x18181B",
    border: "0xFACC15",
    grid: "0x3F3F46",
    highlight: "#FACC15",
    highlightText: "#111111",
    isDark: true,
  },
  "split-proof": {
    name: "Live Proof",
    family: "split_explainer",
    bg: "0x0B0E14",
    border: "0x38BDF8",
    grid: "0x1E293B",
    highlight: "#38BDF8",
    highlightText: "#0B0E14",
    isDark: true,
  },
  "cap-receipt": {
    name: "Receipt Roll",
    family: "receipt_roll",
    bg: "0xEFECE6",
    border: "0x18181B",
    grid: "0xD4D0C8",
    highlight: "#DC2626",
    highlightText: "#FFFFFF",
    isDark: false,
  },
  "cap-kinetic": {
    name: "Kinetic Word",
    family: "hype_verdict",
    bg: "0x09090B",
    border: "0xA855F7",
    grid: "0x27272A",
    highlight: "#A855F7",
    highlightText: "#FFFFFF",
    isDark: true,
  },
  "cap-marker": {
    name: "Dry Erase",
    family: "whiteboard_marker",
    bg: "0xF8FAFC",
    border: "0x1D4ED8",
    grid: "0xCBD5E1",
    highlight: "#1D4ED8",
    highlightText: "#FFFFFF",
    isDark: false,
  },
  "fmt-myth": {
    name: "Myth vs Fact",
    family: "hype_verdict",
    bg: "0x0F1115",
    border: "0x10B981",
    grid: "0x27272A",
    highlight: "#10B981",
    highlightText: "#06281E",
    isDark: true,
  },
  "split-versus": {
    name: "Versus",
    family: "split_explainer",
    bg: "0x0C0C10",
    border: "0xF97316",
    grid: "0x27272A",
    highlight: "#F97316",
    highlightText: "#FFFFFF",
    isDark: true,
  },
  "frame-sketch": {
    name: "Sketchbook",
    family: "paper_studio",
    bg: "0xF5EFE2",
    border: "0x1E3A8A",
    grid: "0x93C5FD",
    highlight: "#DC2626",
    highlightText: "#FFFFFF",
    isDark: false,
  },
  "fmt-mistakes": {
    name: "Red X / Green Check",
    family: "hype_verdict",
    bg: "0x0B0B0E",
    border: "0xEF4444",
    grid: "0x27272A",
    highlight: "#22C55E",
    highlightText: "#052E16",
    isDark: true,
  },
  "split-react": {
    name: "Watch Together",
    family: "split_explainer",
    bg: "0x0B0B0E",
    border: "0xFACC15",
    grid: "0x27272A",
    highlight: "#FACC15",
    highlightText: "#0B0B0E",
    isDark: true,
  },
  "frame-Blueprint": {
    name: "Blueprint",
    family: "blueprint_dashboard",
    bg: "0x0B2545",
    border: "0xFACC15",
    grid: "0x1D4ED8",
    highlight: "#FACC15",
    highlightText: "#0B2545",
    isDark: true,
  },
  "frame-blueprint": {
    name: "Blueprint",
    family: "blueprint_dashboard",
    bg: "0x0B2545",
    border: "0xFACC15",
    grid: "0x1D4ED8",
    highlight: "#FACC15",
    highlightText: "#0B2545",
    isDark: true,
  },
  "fmt-beforeafter": {
    name: "Before -> After",
    family: "split_explainer",
    bg: "0x0D0F12",
    border: "0x10B981",
    grid: "0x1E293B",
    highlight: "#10B981",
    highlightText: "#042F2E",
    isDark: true,
  },
  "split-story": {
    name: "Story Beat",
    family: "split_explainer",
    bg: "0x141210",
    border: "0xF59E0B",
    grid: "0x292524",
    highlight: "#F59E0B",
    highlightText: "#141210",
    isDark: true,
  },
  "frame-neon": {
    name: "Neon Rim",
    family: "neon_cyber",
    bg: "0x080711",
    border: "0x22D3EE",
    grid: "0x1E1B4B",
    highlight: "#EC4899",
    highlightText: "#FFFFFF",
    isDark: true,
  },
  "fmt-3rules": {
    name: "Three Rules",
    family: "hype_verdict",
    bg: "0x121214",
    border: "0xFACC15",
    grid: "0x27272A",
    highlight: "#FACC15",
    highlightText: "#121214",
    isDark: true,
  },
  "split-chart": {
    name: "Numbers Talk",
    family: "blueprint_dashboard",
    bg: "0x090D16",
    border: "0x38BDF8",
    grid: "0x1E293B",
    highlight: "#38BDF8",
    highlightText: "#090D16",
    isDark: true,
  },
  "frame-press": {
    name: "Press Clip",
    family: "editorial_magazine",
    bg: "0xF4F1EA",
    border: "0x111111",
    grid: "0xD6D3D1",
    highlight: "#FDE047",
    highlightText: "#111111",
    isDark: false,
  },
  "fmt-storytime": {
    name: "Storytime",
    family: "editorial_magazine",
    bg: "0x171412",
    border: "0xFBBF24",
    grid: "0x292524",
    highlight: "#FBBF24",
    highlightText: "#171412",
    isDark: true,
  },
  "split-steps": {
    name: "Step Ladder",
    family: "split_explainer",
    bg: "0x0B0F19",
    border: "0x38BDF8",
    grid: "0x1E293B",
    highlight: "#FACC15",
    highlightText: "#0B0F19",
    isDark: true,
  },
  "frame-terminal": {
    name: "HUD Frame",
    family: "neon_cyber",
    bg: "0x050B07",
    border: "0x22C55E",
    grid: "0x14532D",
    highlight: "#22C55E",
    highlightText: "#050B07",
    isDark: true,
  },
  "fmt-hot-take": {
    name: "Hot Take",
    family: "hype_verdict",
    bg: "0x140808",
    border: "0xEF4444",
    grid: "0x3F1515",
    highlight: "#EF4444",
    highlightText: "#FFFFFF",
    isDark: true,
  },
  "split-quote": {
    name: "Pull Quote",
    family: "editorial_magazine",
    bg: "0x131210",
    border: "0xF59E0B",
    grid: "0x292524",
    highlight: "#F59E0B",
    highlightText: "#131210",
    isDark: true,
  },
  "frame- taped": {
    name: "Taped Print",
    family: "paper_studio",
    bg: "0xEFECE6",
    border: "0x1C1917",
    grid: "0xD6D3D1",
    highlight: "#FACC15",
    highlightText: "#1C1917",
    isDark: false,
  },
  "frame-taped": {
    name: "Taped Print",
    family: "paper_studio",
    bg: "0xEFECE6",
    border: "0x1C1917",
    grid: "0xD6D3D1",
    highlight: "#FACC15",
    highlightText: "#1C1917",
    isDark: false,
  },
  "fmt-case-study": {
    name: "Case File",
    family: "editorial_magazine",
    bg: "0x12110E",
    border: "0xD4AF37",
    grid: "0x2E2B24",
    highlight: "#D4AF37",
    highlightText: "#12110E",
    isDark: true,
  },
  "split-checklist": {
    name: "Live Checklist",
    family: "split_explainer",
    bg: "0x0B0F17",
    border: "0x10B981",
    grid: "0x1E293B",
    highlight: "#10B981",
    highlightText: "#052E16",
    isDark: true,
  },
  "frame-glass": {
    name: "Frosted Card",
    family: "blueprint_dashboard",
    bg: "0x0F172A",
    border: "0x38BDF8",
    grid: "0x1E293B",
    highlight: "#38BDF8",
    highlightText: "#0F172A",
    isDark: true,
  },
  "fmt-tier": {
    name: "Tier List",
    family: "hype_verdict",
    bg: "0x09090B",
    border: "0xEF4444",
    grid: "0x27272A",
    highlight: "#FACC15",
    highlightText: "#09090B",
    isDark: true,
  },
  "split-news": {
    name: "Ticker Desk",
    family: "split_explainer",
    bg: "0x0B0B0E",
    border: "0xEF4444",
    grid: "0x27272A",
    highlight: "#EF4444",
    highlightText: "#FFFFFF",
    isDark: true,
  },
  "frame-vhs": {
    name: "Camcorder '98",
    family: "neon_cyber",
    bg: "0x0B0A0E",
    border: "0xF59E0B",
    grid: "0x27272A",
    highlight: "#F59E0B",
    highlightText: "#0B0A0E",
    isDark: true,
  },
  "fmt-quiz": {
    name: "Pop Quiz",
    family: "hype_verdict",
    bg: "0x0F172A",
    border: "0xFACC15",
    grid: "0x1E293B",
    highlight: "#FACC15",
    highlightText: "#0F172A",
    isDark: true,
  },
  "frame-window": {
    name: "Desktop Window",
    family: "blueprint_dashboard",
    bg: "0x1E1E24",
    border: "0x60A5FA",
    grid: "0x3F3F46",
    highlight: "#60A5FA",
    highlightText: "#09090B",
    isDark: true,
  },
  "fmt-unpopular": {
    name: "Red Stamp",
    family: "hype_verdict",
    bg: "0x110C0C",
    border: "0xDC2626",
    grid: "0x291D1D",
    highlight: "#DC2626",
    highlightText: "#FFFFFF",
    isDark: true,
  },
  "frame-duotone": {
    name: "Duotone Club",
    family: "neon_cyber",
    bg: "0x140B29",
    border: "0xF43F5E",
    grid: "0x2E1065",
    highlight: "#F43F5E",
    highlightText: "#FFFFFF",
    isDark: true,
  },
  "fmt-tl-dr": {
    name: "TL;DR",
    family: "hype_verdict",
    bg: "0x09090B",
    border: "0xFACC15",
    grid: "0x27272A",
    highlight: "#FACC15",
    highlightText: "#09090B",
    isDark: true,
  },
  "frame-minimal": {
    name: "Hairline",
    family: "editorial_magazine",
    bg: "0xF7F5F0",
    border: "0x18181B",
    grid: "0xE4E2DD",
    highlight: "#18181B",
    highlightText: "#F7F5F0",
    isDark: false,
  },
  "fmt-recap": {
    name: "60-Second Recap",
    family: "split_explainer",
    bg: "0x0B0B0E",
    border: "0x38BDF8",
    grid: "0x27272A",
    highlight: "#38BDF8",
    highlightText: "#0B0B0E",
    isDark: true,
  },
  "frame-spotlight": {
    name: "Spotlight",
    family: "editorial_magazine",
    bg: "0x09090B",
    border: "0xFDE047",
    grid: "0x18181B",
    highlight: "#FDE047",
    highlightText: "#09090B",
    isDark: true,
  },
  "fmt-roadmap": {
    name: "Roadmap",
    family: "blueprint_dashboard",
    bg: "0x0B132B",
    border: "0x38BDF8",
    grid: "0x1C2541",
    highlight: "#38BDF8",
    highlightText: "#0B132B",
    isDark: true,
  },
  "frame-comic": {
    name: "Halftone",
    family: "hype_verdict",
    bg: "0xFFFBEB",
    border: "0x111111",
    grid: "0xFDE68A",
    highlight: "#EF4444",
    highlightText: "#FFFFFF",
    isDark: false,
  },
  "fmt-pros-cons": {
    name: "Pros & Cons",
    family: "split_explainer",
    bg: "0x0B0F17",
    border: "0x22C55E",
    grid: "0x1E293B",
    highlight: "#22C55E",
    highlightText: "#052E16",
    isDark: true,
  },
  "frame-polaroid": {
    name: "Instant Film",
    family: "paper_studio",
    bg: "0xF5F2EB",
    border: "0x1C1917",
    grid: "0xE7E5E4",
    highlight: "#EA580C",
    highlightText: "#FFFFFF",
    isDark: false,
  },
  "fmt-glossary": {
    name: "Word of the Day",
    family: "editorial_magazine",
    bg: "0xFAF8F5",
    border: "0x18181B",
    grid: "0xE7E5E4",
    highlight: "#FACC15",
    highlightText: "#18181B",
    isDark: false,
  },
  "frame-ticker": {
    name: "Market Tape",
    family: "blueprint_dashboard",
    bg: "0x070B12",
    border: "0x10B981",
    grid: "0x1E293B",
    highlight: "#10B981",
    highlightText: "#052E16",
    isDark: true,
  },
  "fmt-numbered": {
    name: "Big Numerals",
    family: "hype_verdict",
    bg: "0x09090B",
    border: "0xFACC15",
    grid: "0x27272A",
    highlight: "#FACC15",
    highlightText: "#09090B",
    isDark: true,
  },
  "frame-zine": {
    name: "Cut-Out Zine",
    family: "paper_studio",
    bg: "0xF4EFE6",
    border: "0x111111",
    grid: "0xD6D3D1",
    highlight: "#EC4899",
    highlightText: "#FFFFFF",
    isDark: false,
  },
  "fmt-verdict": {
    name: "Final Verdict",
    family: "hype_verdict",
    bg: "0x0C0A09",
    border: "0xF59E0B",
    grid: "0x292524",
    highlight: "#F59E0B",
    highlightText: "#0C0A09",
    isDark: true,
  },
  "frame-splitband": {
    name: "Cinema Band",
    family: "editorial_magazine",
    bg: "0x09090B",
    border: "0xE4E4E7",
    grid: "0x27272A",
    highlight: "#FACC15",
    highlightText: "#09090B",
    isDark: true,
  },
};

/**
 * Returns the visual theme configuration for any of the 56 Makerzz studio styles
 */
export function getStyleVisualConfig(styleId: string): StyleVisualConfig {
  const rawId = (styleId || "cap-paper").trim();
  const id = rawId.toLowerCase();

  // Direct match from our 56-style catalog (case-insensitive)
  const exact =
    EXACT_STYLE_CATALOG[rawId] ||
    EXACT_STYLE_CATALOG[id] ||
    Object.entries(EXACT_STYLE_CATALOG).find(([k]) => k.toLowerCase() === id)?.[1];

  const tpl = VIDEO_TEMPLATES.find(
    (t) => t.id === rawId || t.id.toLowerCase() === id
  );

  if (exact) {
    const borderClean = "#" + exact.border.replace(/^0x/i, "");
    return {
      styleId: rawId,
      styleName: tpl?.name || exact.name,
      layoutFamily: exact.family,
      canvasBgHex: exact.bg,
      cardBorderHex: exact.border,
      gridLineHex: exact.grid,
      highlightHex: exact.highlight,
      highlightTextHex: exact.highlightText,
      metaTextAssColor: exact.isDark
        ? hexToAssColor("#A1A1AA")
        : hexToAssColor("#334155"),
      headlinePrimaryAssColor: hexToAssColor("#FFFFFF"),
      headlineSecondaryAssColor: hexToAssColor(exact.highlight),
      captionActiveAssColor: exact.isDark
        ? hexToAssColor(exact.highlight)
        : hexToAssColor("#FFFFFF"),
      captionDimAssColor: exact.isDark
        ? hexToAssColor("#94A3B8")
        : hexToAssColor("#CBD5E1"),
      badgeBgAssColor: hexToAssColor(borderClean),
      badgeTextAssColor: exact.isDark
        ? hexToAssColor("#09090B")
        : hexToAssColor("#FFFFFF"),
      isDarkCanvas: exact.isDark,
    };
  }

  // Fallback keyword matching for custom or legacy style IDs — always preserve tpl.name if present
  const preserveName = (baseCfg: StyleVisualConfig): StyleVisualConfig => ({
    ...baseCfg,
    styleId: rawId,
    styleName: tpl?.name || baseCfg.styleName,
  });

  if (id.includes("marker") || id.includes("dry") || id.includes("erase")) {
    return preserveName(getStyleVisualConfig("cap-marker"));
  }
  if (id.includes("chalk")) {
    return preserveName(getStyleVisualConfig("fmt-chalk"));
  }
  if (id.includes("receipt")) {
    return preserveName(getStyleVisualConfig("cap-receipt"));
  }
  if (id.includes("lime")) {
    return preserveName(getStyleVisualConfig("limeslides"));
  }
  if (id.includes("forest")) {
    return preserveName(getStyleVisualConfig("cap-forest"));
  }
  if (id.includes("sketch") || id.includes("collage")) {
    return preserveName(getStyleVisualConfig("frame-sketch"));
  }
  if (id.includes("blueprint")) {
    return preserveName(getStyleVisualConfig("frame-Blueprint"));
  }
  if (id.includes("documentary") || id.includes("case") || id.includes("cinema") || id.includes("gold")) {
    return {
      styleId: rawId,
      styleName: tpl?.name || "Documentary",
      layoutFamily: "editorial_magazine",
      canvasBgHex: "0x12110E",
      cardBorderHex: "0xD4AF37",
      gridLineHex: "0x2E2B24",
      highlightHex: "#D4AF37",
      highlightTextHex: "#12110E",
      metaTextAssColor: hexToAssColor("#D4AF37"),
      headlinePrimaryAssColor: hexToAssColor("#F7F4EB"),
      headlineSecondaryAssColor: hexToAssColor("#F5C542"),
      captionActiveAssColor: hexToAssColor("#F5C542"),
      captionDimAssColor: hexToAssColor("#8C857B"),
      badgeBgAssColor: hexToAssColor("#D4AF37"),
      badgeTextAssColor: hexToAssColor("#12110E"),
      isDarkCanvas: true,
    };
  }
  if (id.includes("classified") || id.includes("glitch") || id.includes("crime")) {
    return {
      ...getStyleVisualConfig("classified-yt"),
      styleId: rawId,
      styleName: rawId === "classified" ? "Classified" : tpl?.name || "Glitch",
    };
  }

  // Default / Paper Studio
  const fallbackPaper = EXACT_STYLE_CATALOG["cap-paper"];
  return {
    styleId: rawId,
    styleName: tpl?.name || fallbackPaper.name,
    layoutFamily: fallbackPaper.family,
    canvasBgHex: fallbackPaper.bg,
    cardBorderHex: fallbackPaper.border,
    gridLineHex: fallbackPaper.grid,
    highlightHex: fallbackPaper.highlight,
    highlightTextHex: fallbackPaper.highlightText,
    metaTextAssColor: hexToAssColor("#4B4843"),
    headlinePrimaryAssColor: hexToAssColor("#FFFFFF"),
    headlineSecondaryAssColor: hexToAssColor("#FFFFFF"),
    captionActiveAssColor: hexToAssColor("#FFFFFF"),
    captionDimAssColor: hexToAssColor("#9CA3AF"),
    badgeBgAssColor: hexToAssColor("#18181B"),
    badgeTextAssColor: hexToAssColor("#F4F1EA"),
    isDarkCanvas: false,
  };
}

function sanitizeAssText(input: string): string {
  return (input || "")
    .replace(/[{}]/g, "")
    .replace(/\r?\n/g, " ")
    .trim();
}

/**
 * Splits a headline/subAccent or spoken hook into two punchy stacked uppercase lines
 */
export function resolveSceneHeadlinePair(
  scene: PlannedScene,
  sceneIndex: number,
  transcriptWords?: Array<{ word: string; start: number; end: number }>
): [string, string] {
  const rawH1 = sanitizeAssText(scene.headline || "").toUpperCase();
  const rawH2 = sanitizeAssText(scene.subAccent || "").toUpperCase();

  if (sceneIndex === 0 && transcriptWords && transcriptWords.length >= 5) {
    const firstWords = transcriptWords
      .slice(0, 6)
      .map((w) => sanitizeAssText(w.word).toUpperCase());
    if (!rawH1 || rawH1 === "PAPER STUDIO") {
      return [
        firstWords.slice(0, 3).join(" "),
        firstWords.slice(3, 6).join(" "),
      ];
    }
  }

  if (rawH1 && rawH2) {
    return [rawH1.slice(0, 22), rawH2.slice(0, 22)];
  }

  const words = rawH1.split(/\s+/).filter(Boolean);
  if (words.length >= 4) {
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }
  return [rawH1 || "BIG NEWS", rawH2 || "TOP UPDATE"];
}

export interface BuildAssOptions {
  styleId: string;
  durationSec: number;
  plan?: AuteurEditPlan;
  transcriptWords?: Array<{ word: string; start: number; end: number }>;
  headlineFallback?: string;
  subAccentFallback?: string;
  /**
   * When true (default), ASS script renders top headlines & proof pills directly.
   * When false (used when 1080x1920 PNG scene plates render the rich browser/diagram/whiteboard stages),
   * ASS renders the synchronized word-by-word seam captions + studio timecode metadata.
   */
  includeSceneHeaders?: boolean;
}

/**
 * Generates an Advanced SubStation Alpha (.ass) file content for FFmpeg libass.
 */
export function buildAuteurAssScript(options: BuildAssOptions): string {
  const {
    styleId,
    durationSec = 37.3,
    plan,
    transcriptWords = [],
    headlineFallback = "SO BHAI SAAP",
    subAccentFallback = "NEWS TOP NE",
    includeSceneHeaders = true,
  } = options;

  const theme = getStyleVisualConfig(styleId);
  const totalDur = Math.max(5, durationSec);
  const endAss = formatAssTime(totalDur);

  const blackAss = hexToAssColor("#09090B");
  const whiteAss = hexToAssColor("#FFFFFF");
  const yellowAss = hexToAssColor("#FACC15");

  // Position of synchronized word-by-word captions depends on the layout family:
  // - split_explainer / neon_cyber / hype_verdict / blueprint_dashboard: centered on the split-screen seam (x=540, y=1230)
  // - whiteboard_marker / receipt_roll: centered on the top speaker lower-third (x=540, y=1115)
  // - paper_studio / editorial_magazine / lime_slides / chalkboard: centered at lower-third (x=540, y=1230 when using plates, or x=92, y=1535 in legacy card mode)
  const isChinBoard =
    theme.layoutFamily === "whiteboard_marker" ||
    theme.layoutFamily === "receipt_roll";

  const captionX = includeSceneHeaders ? 92 : 540;
  const captionY = includeSceneHeaders
    ? 1535
    : isChinBoard
    ? 1110
    : 1235;
  const captionAlign = includeSceneHeaders ? 1 : 5; // 5 = middle-center for seam caption pill, 1 = bottom-left for legacy card

  const header = `[Script Info]
Title: Makerzz Auteur Studio Composite (${theme.styleName})
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: MetaLeft,JetBrains Mono,20,${theme.metaTextAssColor},${theme.metaTextAssColor},&H00000000,&H00000000,-1,0,0,0,100,100,1.5,0,1,0,0,7,0,0,0,1
Style: MetaRight,JetBrains Mono,20,${theme.metaTextAssColor},${theme.metaTextAssColor},&H00000000,&H00000000,-1,0,0,0,100,100,1.5,0,1,0,0,9,0,0,0,1
Style: Crosshair,JetBrains Mono,24,${theme.metaTextAssColor},${theme.metaTextAssColor},&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,5,0,0,0,1
Style: Headline1,Liberation Sans,82,${theme.headlinePrimaryAssColor},${theme.headlinePrimaryAssColor},${blackAss},${blackAss},-1,0,0,0,100,100,1,0,1,4.5,3.5,8,40,40,0,1
Style: Headline2,Liberation Sans,82,${theme.headlineSecondaryAssColor},${theme.headlineSecondaryAssColor},${blackAss},${blackAss},-1,0,0,0,100,100,1,0,1,4.5,3.5,8,40,40,0,1
Style: ProofPill,JetBrains Mono,22,${theme.badgeTextAssColor},${theme.badgeTextAssColor},${theme.badgeBgAssColor},${theme.badgeBgAssColor},-1,0,0,0,100,100,1,0,3,10,0,8,40,40,0,1
Style: KaraokeCap,Liberation Sans,46,${whiteAss},${theme.captionDimAssColor},${blackAss},&H99000000,-1,0,0,0,100,100,1.2,0,1,4.5,2.5,${captionAlign},30,30,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const events: string[] = [];

  if (includeSceneHeaders) {
    // 1. Static Studio Frame Crosshairs (+) at the 4 corners of the paper grid
    events.push(`Dialogue: 2,0:00:00.00,${endAss},Crosshair,,0,0,0,,{\\pos(42,96)}+`);
    events.push(`Dialogue: 2,0:00:00.00,${endAss},Crosshair,,0,0,0,,{\\pos(1038,96)}+`);
    events.push(`Dialogue: 2,0:00:00.00,${endAss},Crosshair,,0,0,0,,{\\pos(42,1668)}+`);
    events.push(`Dialogue: 2,0:00:00.00,${endAss},Crosshair,,0,0,0,,{\\pos(1038,1668)}+`);

    // 2. Top-Right Studio Signature & Bottom-Right Spec Metadata
    events.push(`Dialogue: 2,0:00:00.00,${endAss},MetaRight,,0,0,0,,{\\pos(1020,118)}EDITED BY MAKERZZ`);
    events.push(`Dialogue: 2,0:00:00.00,${endAss},MetaRight,,0,0,0,,{\\pos(1020,1614)}1080 × 1920 · 30 FPS`);

    // 3. Bottom-Left Running SMPTE Timecode
    const stepSec = 0.5;
    for (let t = 0; t < totalDur; t += stepSec) {
      const tEnd = Math.min(totalDur, t + stepSec);
      const tc = formatSmpteTimecode(t + 0.36, 30);
      events.push(
        `Dialogue: 2,${formatAssTime(t)},${formatAssTime(tEnd)},MetaLeft,,0,0,0,,{\\pos(60,1614)}${tc}`
      );
    }

    // 4. Multi-Scene Stacked Headlines & Top-Left Category Tag
    const scenes: PlannedScene[] =
      plan?.scenes && plan.scenes.length > 0
        ? plan.scenes
        : [
            {
              sceneId: "s1",
              start: 0,
              end: totalDur,
              headline: plan?.headline || headlineFallback,
              subAccent: plan?.subAccent || subAccentFallback,
              objective: "Hook",
              visualType: "split-hook",
              badgeText: "BIG NEWS",
              onScreenText: [headlineFallback, subAccentFallback],
            },
          ];

    scenes.forEach((scene, idx) => {
      const sStart = formatAssTime(scene.start);
      const sEnd = formatAssTime(Math.min(totalDur, Math.max(scene.start + 1, scene.end)));
      const topLeftLabel = sanitizeAssText(scene.badgeText || "BIG NEWS").toUpperCase();

      events.push(
        `Dialogue: 3,${sStart},${sEnd},MetaLeft,,0,0,0,,{\\pos(60,118)}${topLeftLabel}`
      );

      const [line1, line2] = resolveSceneHeadlinePair(scene, idx, transcriptWords);
      events.push(
        `Dialogue: 4,${sStart},${sEnd},Headline1,,0,0,0,,{\\pos(540,195)\\fad(120,120)}${line1}`
      );
      if (line2) {
        events.push(
          `Dialogue: 4,${sStart},${sEnd},Headline2,,0,0,0,,{\\pos(540,285)\\fad(120,120)}${line2}`
        );
      }

      if (idx > 0 && scene.onScreenText && scene.onScreenText.length > 0) {
        const proofLabel = sanitizeAssText(scene.onScreenText[0]).toUpperCase();
        if (proofLabel && proofLabel !== line1 && proofLabel !== line2) {
          events.push(
            `Dialogue: 4,${sStart},${sEnd},ProofPill,,0,0,0,,{\\pos(540,392)\\fad(150,150)}  ${proofLabel}  `
          );
        }
      }
    });
  } else {
    // Plate-overlay mode: subtle bottom SMPTE timecode & style signature
    events.push(
      `Dialogue: 2,0:00:00.00,${endAss},MetaRight,,0,0,0,,{\\pos(1035,1886)}${theme.styleName.toUpperCase()} · 1080×1920`
    );
    const stepSec = 0.5;
    for (let t = 0; t < totalDur; t += stepSec) {
      const tEnd = Math.min(totalDur, t + stepSec);
      const tc = formatSmpteTimecode(t + 0.36, 30);
      events.push(
        `Dialogue: 2,${formatAssTime(t)},${formatAssTime(tEnd)},MetaLeft,,0,0,0,,{\\pos(45,1886)}${tc}`
      );
    }
  }

  // 5. Word-by-Word Highlighted Karaoke Captions
  const words =
    transcriptWords.length > 0
      ? transcriptWords
      : [
          { word: "Duniya", start: 0.1, end: 0.5 },
          { word: "ka", start: 0.5, end: 0.7 },
          { word: "sabse", start: 0.7, end: 1.1 },
          { word: "bada", start: 1.1, end: 1.5 },
          { word: "exchange", start: 1.5, end: 2.1 },
          { word: "fir", start: 2.1, end: 2.4 },
          { word: "se", start: 2.4, end: 2.6 },
          { word: "hack", start: 2.6, end: 3.1 },
          { word: "ho", start: 3.1, end: 3.4 },
          { word: "gaya", start: 3.4, end: 3.9 },
        ];

  const chunkSize = includeSceneHeaders ? 5 : 4;
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize);
    const nextChunkFirstWord = words[i + chunkSize];
    for (let wIdx = 0; wIdx < chunk.length; wIdx++) {
      const currentWord = chunk[wIdx];
      const nextWord = chunk[wIdx + 1];
      const wStart = currentWord.start;
      const rawEnd = nextWord
        ? nextWord.start
        : nextChunkFirstWord
        ? Math.min(
            nextChunkFirstWord.start,
            Math.max(currentWord.end, currentWord.start + 0.3)
          )
        : Math.max(currentWord.end, currentWord.start + 0.35);
      const wEnd = Math.max(wStart + 0.05, rawEnd);
      if (wStart >= totalDur) break;

      const styledTokens = chunk.map((token, idx) => {
        const rawWord = sanitizeAssText(token.word);
        const displayWord = includeSceneHeaders ? rawWord : rawWord.toUpperCase();
        if (idx === wIdx) {
          // Currently spoken word highlighted in vibrant yellow/accent
          return `{\\c${includeSceneHeaders ? theme.captionActiveAssColor : yellowAss}\\b1}${displayWord}`;
        } else if (idx < wIdx) {
          // Already spoken words in crisp white bold
          return `{\\c${whiteAss}\\b1}${displayWord}`;
        } else {
          // Upcoming words in the phrase dimmed
          return `{\\c${theme.captionDimAssColor}\\b0}${displayWord}`;
        }
      });

      events.push(
        `Dialogue: 5,${formatAssTime(wStart)},${formatAssTime(Math.min(totalDur, wEnd))},KaraokeCap,,0,0,0,,{\\pos(${captionX},${captionY})}${styledTokens.join(" ")}`
      );
    }
  }

  return header + events.join("\n") + "\n";
}
