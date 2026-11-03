export type ArchetypeLayout =
  | "split-bottom"
  | "pip-corner"
  | "full-bleed"
  | "frame-bento"
  | "split-duo"
  | "split-phone";

export type CaptionAnimation = "karaoke" | "slap" | "glow" | "box";

export interface StyleConfig {
  id: string;
  name: string;
  badgeLabel: string;
  subLabel: string;
  archetype: ArchetypeLayout;
  captionAnimation: CaptionAnimation;
  fontFamily: string;
  serif?: boolean;
  mono?: boolean;
  palette: {
    bg: string;
    card: string;
    cardBorder: string;
    accent: string;
    accentText: string;
    text: string;
    textMuted: string;
    gridDot?: string;
    tagBg: string;
    tagText: string;
  };
}

/** Complete 56-style registry mapping every Makerzz template to its visual configuration */
export const STYLE_REGISTRY: Record<string, StyleConfig> = {
  // 1. Glitch
  "classified-yt": {
    id: "classified-yt",
    name: "Glitch",
    badgeLabel: "GLITCH",
    subLabel: "CLASSIFIED",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', 'Inter', monospace",
    mono: true,
    palette: {
      bg: "#0B0B0C",
      card: "#141416",
      cardBorder: "#27272A",
      accent: "#FF3B4E",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#71717A",
      gridDot: "rgba(255,59,78,0.12)",
      tagBg: "#222226",
      tagText: "#00FF66",
    },
  },

  // 2. Lime Slides
  "limeslides": {
    id: "limeslides",
    name: "Lime Slides",
    badgeLabel: "LIME SLIDES",
    subLabel: "BRUTALIST",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#C6FF3D",
      card: "#000000",
      cardBorder: "#000000",
      accent: "#000000",
      accentText: "#C6FF3D",
      text: "#000000",
      textMuted: "#374151",
      gridDot: "rgba(0,0,0,0.15)",
      tagBg: "#111111",
      tagText: "#C6FF3D",
    },
  },

  // 3. Forest Edit
  "cap-forest": {
    id: "cap-forest",
    name: "Forest Edit",
    badgeLabel: "FOREST EDIT",
    subLabel: "EDITORIAL",
    archetype: "split-bottom",
    captionAnimation: "box",
    fontFamily: "'Playfair Display', Georgia, serif",
    serif: true,
    palette: {
      bg: "#0D2818",
      card: "#071A0E",
      cardBorder: "#1B4328",
      accent: "#D4AF37",
      accentText: "#071A0E",
      text: "#E8F0E6",
      textMuted: "#8DA391",
      gridDot: "rgba(212,175,55,0.15)",
      tagBg: "#143320",
      tagText: "#D4AF37",
    },
  },

  // 4. Paper Studio
  "cap-paper": {
    id: "cap-paper",
    name: "Paper Studio",
    badgeLabel: "PAPER STUDIO",
    subLabel: "DESIGN SYSTEM",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', 'Inter', sans-serif",
    palette: {
      bg: "#F4F1EA",
      card: "#18181B",
      cardBorder: "#27272A",
      accent: "#AE0006",
      accentText: "#FFFFFF",
      text: "#18181B",
      textMuted: "#71717A",
      gridDot: "rgba(0,0,0,0.06)",
      tagBg: "#27272A",
      tagText: "#F4F1EA",
    },
  },

  // 5. Rank Rush
  "fmt-countdown": {
    id: "fmt-countdown",
    name: "Rank Rush",
    badgeLabel: "RANK RUSH",
    subLabel: "TOP 5 COUNTDOWN",
    archetype: "pip-corner",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0A0A0A",
      card: "#161616",
      cardBorder: "#FFDD00",
      accent: "#FFDD00",
      accentText: "#000000",
      text: "#FFFFFF",
      textMuted: "#A3A3A3",
      gridDot: "rgba(255,221,0,0.12)",
      tagBg: "#262626",
      tagText: "#FFDD00",
    },
  },

  // 6. Three Act
  "split-act": {
    id: "split-act",
    name: "Three Act",
    badgeLabel: "THREE ACT",
    subLabel: "SHUTTER RHYTHM",
    archetype: "split-duo",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0F0F12",
      card: "#18181F",
      cardBorder: "#FF007A",
      accent: "#FF007A",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#9CA3AF",
      tagBg: "#252530",
      tagText: "#FF007A",
    },
  },

  // 7. Kinetic Type
  "kinetic": {
    id: "kinetic",
    name: "Kinetic Type",
    badgeLabel: "KINETIC",
    subLabel: "WORDS ON BEAT",
    archetype: "full-bleed",
    captionAnimation: "slap",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#000000",
      card: "#111111",
      cardBorder: "#FFE600",
      accent: "#FFE600",
      accentText: "#000000",
      text: "#FFFFFF",
      textMuted: "#888888",
      tagBg: "#1C1C1E",
      tagText: "#FFE600",
    },
  },

  // 8. Sketchbook
  "frame-sketch": {
    id: "frame-sketch",
    name: "Sketchbook",
    badgeLabel: "SKETCHBOOK",
    subLabel: "HAND-DRAWN",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Inter', sans-serif",
    palette: {
      bg: "#F7F4EA",
      card: "#2B2B2B",
      cardBorder: "#4A4A4A",
      accent: "#E5A910",
      accentText: "#2B2B2B",
      text: "#2B2B2B",
      textMuted: "#6B7280",
      gridDot: "rgba(0,0,0,0.05)",
      tagBg: "#3A3A3A",
      tagText: "#F7F4EA",
    },
  },

  // 9. Case File
  "frame-dossier": {
    id: "frame-dossier",
    name: "Case File",
    badgeLabel: "CASE FILE",
    subLabel: "EVIDENCE DOSSIER",
    archetype: "split-bottom",
    captionAnimation: "box",
    fontFamily: "'Courier New', Courier, monospace",
    mono: true,
    palette: {
      bg: "#E5DAC4",
      card: "#211F1D",
      cardBorder: "#B22222",
      accent: "#B22222",
      accentText: "#FFFFFF",
      text: "#211F1D",
      textMuted: "#59534E",
      gridDot: "rgba(178,34,34,0.1)",
      tagBg: "#312E2B",
      tagText: "#E5DAC4",
    },
  },

  // 10. Swiss Grid
  "swiss": {
    id: "swiss",
    name: "Swiss Grid",
    badgeLabel: "SWISS GRID",
    subLabel: "HELVETICA MINIMAL",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Inter', sans-serif",
    palette: {
      bg: "#FFFFFF",
      card: "#000000",
      cardBorder: "#E30613",
      accent: "#E30613",
      accentText: "#FFFFFF",
      text: "#000000",
      textMuted: "#4B5563",
      gridDot: "rgba(0,0,0,0.08)",
      tagBg: "#111111",
      tagText: "#FFFFFF",
    },
  },

  // 11. Paper Collage
  "collage": {
    id: "collage",
    name: "Paper Collage",
    badgeLabel: "PAPER COLLAGE",
    subLabel: "SCRAPBOOK",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#EBE7DF",
      card: "#222222",
      cardBorder: "#D9531E",
      accent: "#D9531E",
      accentText: "#FFFFFF",
      text: "#222222",
      textMuted: "#666666",
      tagBg: "#333333",
      tagText: "#EBE7DF",
    },
  },

  // 12. Graphics First
  "kallaway-broll": {
    id: "kallaway-broll",
    name: "Graphics First",
    badgeLabel: "GRAPHICS FIRST",
    subLabel: "TECH EXPLAINER",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#101318",
      card: "#191D24",
      cardBorder: "#00E5FF",
      accent: "#00E5FF",
      accentText: "#000000",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      gridDot: "rgba(0,229,255,0.12)",
      tagBg: "#222731",
      tagText: "#00E5FF",
    },
  },

  // 13. Split Stack
  "splitstack": {
    id: "splitstack",
    name: "Split Stack",
    badgeLabel: "SPLIT STACK",
    subLabel: "TRIPLE CARD",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#111215",
      card: "#1A1B20",
      cardBorder: "#FF6B00",
      accent: "#FF6B00",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#9CA3AF",
      tagBg: "#24262E",
      tagText: "#FF6B00",
    },
  },

  // 14. Side by Side
  "split-duo": {
    id: "split-duo",
    name: "Side by Side",
    badgeLabel: "SIDE BY SIDE",
    subLabel: "DUAL TRACK",
    archetype: "split-duo",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0B0C10",
      card: "#14161F",
      cardBorder: "#2563EB",
      accent: "#2563EB",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      tagBg: "#1F2332",
      tagText: "#60A5FA",
    },
  },

  // 15. Blueprint
  "frame-blueprint": {
    id: "frame-blueprint",
    name: "Blueprint",
    badgeLabel: "BLUEPRINT",
    subLabel: "CAD ARCHITECTURE",
    archetype: "split-bottom",
    captionAnimation: "box",
    fontFamily: "'Courier New', monospace",
    mono: true,
    palette: {
      bg: "#002B49",
      card: "#001B2E",
      cardBorder: "#00D2FF",
      accent: "#00D2FF",
      accentText: "#002B49",
      text: "#FFFFFF",
      textMuted: "#7DD3FC",
      gridDot: "rgba(0,210,255,0.2)",
      tagBg: "#003A61",
      tagText: "#00D2FF",
    },
  },

  // 16. Prism Glass
  "frame-prism": {
    id: "frame-prism",
    name: "Prism Glass",
    badgeLabel: "PRISM GLASS",
    subLabel: "FROSTED GLASS",
    archetype: "frame-bento",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#13111C",
      card: "#1E1A2D",
      cardBorder: "#A855F7",
      accent: "#A855F7",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#C084FC",
      gridDot: "rgba(168,85,247,0.12)",
      tagBg: "#2C2642",
      tagText: "#E9D5FF",
    },
  },

  // 17. Bento Box
  "frame-bento": {
    id: "frame-bento",
    name: "Bento Box",
    badgeLabel: "BENTO BOX",
    subLabel: "MODULAR GRID",
    archetype: "frame-bento",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#101012",
      card: "#1C1C21",
      cardBorder: "#2E2E38",
      accent: "#10B981",
      accentText: "#000000",
      text: "#FFFFFF",
      textMuted: "#9CA3AF",
      gridDot: "rgba(16,185,129,0.1)",
      tagBg: "#282830",
      tagText: "#10B981",
    },
  },

  // 18. Card Deck
  "split-deck": {
    id: "split-deck",
    name: "Card Deck",
    badgeLabel: "CARD DECK",
    subLabel: "SWIPING CARDS",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0B132B",
      card: "#1C2541",
      cardBorder: "#48E5C2",
      accent: "#48E5C2",
      accentText: "#0B132B",
      text: "#FFFFFF",
      textMuted: "#8892B0",
      tagBg: "#2B3A67",
      tagText: "#48E5C2",
    },
  },

  // 19. Phone in Frame
  "split-phone": {
    id: "split-phone",
    name: "Phone in Frame",
    badgeLabel: "PHONE IN FRAME",
    subLabel: "DEVICE MOCKUP",
    archetype: "split-phone",
    captionAnimation: "karaoke",
    fontFamily: "'Inter', sans-serif",
    palette: {
      bg: "#E8ECF1",
      card: "#0F172A",
      cardBorder: "#1E293B",
      accent: "#3B82F6",
      accentText: "#FFFFFF",
      text: "#0F172A",
      textMuted: "#64748B",
      gridDot: "rgba(59,130,246,0.1)",
      tagBg: "#1E293B",
      tagText: "#93C5FD",
    },
  },

  // 20. Launch Demo
  "fmt-demo": {
    id: "fmt-demo",
    name: "Launch Demo",
    badgeLabel: "LAUNCH DEMO",
    subLabel: "PRODUCT HIGHLIGHT",
    archetype: "pip-corner",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#F8FAFC",
      card: "#0F172A",
      cardBorder: "#7C3AED",
      accent: "#7C3AED",
      accentText: "#FFFFFF",
      text: "#0F172A",
      textMuted: "#64748B",
      gridDot: "rgba(124,58,237,0.08)",
      tagBg: "#1E293B",
      tagText: "#C4B5FD",
    },
  },

  // 21. Chalk Talk
  "fmt-chalk": {
    id: "fmt-chalk",
    name: "Chalk Talk",
    badgeLabel: "CHALK TALK",
    subLabel: "BLACKBOARD DIAGRAMS",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#1A2220",
      card: "#263230",
      cardBorder: "#A3E635",
      accent: "#A3E635",
      accentText: "#1A2220",
      text: "#F0FDF4",
      textMuted: "#86EFAC",
      gridDot: "rgba(163,230,53,0.12)",
      tagBg: "#334340",
      tagText: "#A3E635",
    },
  },

  // 22. Dry Erase
  "cap-marker": {
    id: "cap-marker",
    name: "Dry Erase",
    badgeLabel: "DRY ERASE",
    subLabel: "WHITEBOARD NOTES",
    archetype: "full-bleed",
    captionAnimation: "box",
    fontFamily: "'Inter', sans-serif",
    palette: {
      bg: "#F8FAFC",
      card: "#1E293B",
      cardBorder: "#2563EB",
      accent: "#2563EB",
      accentText: "#FFFFFF",
      text: "#0F172A",
      textMuted: "#64748B",
      tagBg: "#2563EB",
      tagText: "#FFFFFF",
    },
  },

  // 23. Sticker Talk
  "sticker": {
    id: "sticker",
    name: "Sticker Talk",
    badgeLabel: "STICKER TALK",
    subLabel: "CREATOR EMOJIS",
    archetype: "full-bleed",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#FDF2F8",
      card: "#831843",
      cardBorder: "#EC4899",
      accent: "#EC4899",
      accentText: "#FFFFFF",
      text: "#831843",
      textMuted: "#BE185D",
      tagBg: "#9D174D",
      tagText: "#FBCFE8",
    },
  },

  // 24. Editorial Cards
  "editorial": {
    id: "editorial",
    name: "Editorial Cards",
    badgeLabel: "EDITORIAL",
    subLabel: "LONGFORM CARDS",
    archetype: "split-bottom",
    captionAnimation: "box",
    fontFamily: "'Playfair Display', Georgia, serif",
    serif: true,
    palette: {
      bg: "#FAF8F5",
      card: "#1A2B4C",
      cardBorder: "#C85A32",
      accent: "#C85A32",
      accentText: "#FFFFFF",
      text: "#1A2B4C",
      textMuted: "#6B7280",
      gridDot: "rgba(200,90,50,0.08)",
      tagBg: "#2A3C60",
      tagText: "#FCE7DF",
    },
  },

  // 25. Documentary
  "documentary": {
    id: "documentary",
    name: "Documentary",
    badgeLabel: "DOCUMENTARY",
    subLabel: "CINEMATIC NARRATIVE",
    archetype: "split-bottom",
    captionAnimation: "box",
    fontFamily: "'Playfair Display', Georgia, serif",
    serif: true,
    palette: {
      bg: "#161514",
      card: "#242220",
      cardBorder: "#F59E0B",
      accent: "#F59E0B",
      accentText: "#161514",
      text: "#E5E5E5",
      textMuted: "#A3A3A3",
      gridDot: "rgba(245,158,11,0.1)",
      tagBg: "#33302D",
      tagText: "#FCD34D",
    },
  },

  // 26. SaaS Dashboard
  "dashboard": {
    id: "dashboard",
    name: "SaaS Dashboard",
    badgeLabel: "SAAS DASHBOARD",
    subLabel: "METRICS & CHARTS",
    archetype: "pip-corner",
    captionAnimation: "karaoke",
    fontFamily: "'Inter', sans-serif",
    palette: {
      bg: "#0B0F19",
      card: "#151C2C",
      cardBorder: "#6366F1",
      accent: "#6366F1",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      gridDot: "rgba(99,102,241,0.12)",
      tagBg: "#1E293B",
      tagText: "#818CF8",
    },
  },

  // 27. Faceless Explainer
  "faceless-explainer": {
    id: "faceless-explainer",
    name: "Faceless Explainer",
    badgeLabel: "EXPLAINER",
    subLabel: "FULL GRAPHICS",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0B1120",
      card: "#162036",
      cardBorder: "#38BDF8",
      accent: "#38BDF8",
      accentText: "#0B1120",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      gridDot: "rgba(56,189,248,0.12)",
      tagBg: "#1E2D4A",
      tagText: "#BAE6FD",
    },
  },

  // 28. Doodle Story
  "doodle-story": {
    id: "doodle-story",
    name: "Doodle Story",
    badgeLabel: "DOODLE STORY",
    subLabel: "NOTEBOOK SKETCH",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Inter', sans-serif",
    palette: {
      bg: "#FBFBF2",
      card: "#1C1C1C",
      cardBorder: "#FACC15",
      accent: "#FACC15",
      accentText: "#1C1C1C",
      text: "#1C1C1C",
      textMuted: "#525252",
      gridDot: "rgba(0,0,0,0.06)",
      tagBg: "#2C2C2C",
      tagText: "#FEF08A",
    },
  },

  // 29. Geoglobe
  "geoglobe": {
    id: "geoglobe",
    name: "Geoglobe",
    badgeLabel: "GEOGLOBE",
    subLabel: "MAPS & BORDERS",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#050814",
      card: "#0D152D",
      cardBorder: "#00A3FF",
      accent: "#00A3FF",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#7DD3FC",
      gridDot: "rgba(0,163,255,0.15)",
      tagBg: "#172554",
      tagText: "#38BDF8",
    },
  },

  // 30. Countryballs
  "countryballs": {
    id: "countryballs",
    name: "Countryballs",
    badgeLabel: "COUNTRYBALLS",
    subLabel: "HISTORY COMIC",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#082F49",
      card: "#0C4A6E",
      cardBorder: "#EF4444",
      accent: "#EF4444",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#BAE6FD",
      tagBg: "#164E63",
      tagText: "#FCA5A5",
    },
  },

  // 31. Catcharium
  "catcharium": {
    id: "catcharium",
    name: "Field Guide 3D",
    badgeLabel: "FIELD GUIDE",
    subLabel: "NATURAL HISTORY",
    archetype: "split-bottom",
    captionAnimation: "box",
    fontFamily: "'Playfair Display', Georgia, serif",
    serif: true,
    palette: {
      bg: "#EFE8D8",
      card: "#2B3A30",
      cardBorder: "#658B6F",
      accent: "#658B6F",
      accentText: "#EFE8D8",
      text: "#2B3A30",
      textMuted: "#617066",
      tagBg: "#3D4F43",
      tagText: "#EFE8D8",
    },
  },

  // 32. Story from clips
  "story": {
    id: "story",
    name: "Story from clips",
    badgeLabel: "STORY",
    subLabel: "CINEMATIC MONTAGE",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#111113",
      card: "#1C1C20",
      cardBorder: "#F43F5E",
      accent: "#F43F5E",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#A1A1AA",
      tagBg: "#282830",
      tagText: "#FDA4AF",
    },
  },

  // 33. Desk Collage
  "deskcollage": {
    id: "deskcollage",
    name: "Desk Collage",
    badgeLabel: "DESK COLLAGE",
    subLabel: "CREATOR DESK",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Inter', sans-serif",
    palette: {
      bg: "#E8DEC8",
      card: "#292524",
      cardBorder: "#78716C",
      accent: "#D97706",
      accentText: "#FFFFFF",
      text: "#292524",
      textMuted: "#57534E",
      gridDot: "rgba(0,0,0,0.06)",
      tagBg: "#44403C",
      tagText: "#FDE68A",
    },
  },

  // 34. Neon Glitch
  "neon": {
    id: "neon",
    name: "Neon Glitch",
    badgeLabel: "NEON GLITCH",
    subLabel: "CYBERPUNK",
    archetype: "full-bleed",
    captionAnimation: "glow",
    fontFamily: "'Montserrat', monospace",
    mono: true,
    palette: {
      bg: "#05050A",
      card: "#10101C",
      cardBorder: "#00F0FF",
      accent: "#FF0055",
      accentText: "#FFFFFF",
      text: "#00F0FF",
      textMuted: "#A855F7",
      gridDot: "rgba(0,240,255,0.15)",
      tagBg: "#18182E",
      tagText: "#00F0FF",
    },
  },

  // 35. Breaking News
  "newsroom": {
    id: "newsroom",
    name: "Breaking News",
    badgeLabel: "BREAKING NEWS",
    subLabel: "LIVE REPORT",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0B192C",
      card: "#112239",
      cardBorder: "#FF0000",
      accent: "#FF0000",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      tagBg: "#1E3554",
      tagText: "#FFAAAA",
    },
  },

  // 36. Tutorial
  "tutorial": {
    id: "tutorial",
    name: "Tutorial",
    badgeLabel: "TUTORIAL",
    subLabel: "DEV WALKTHROUGH",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'JetBrains Mono', monospace",
    mono: true,
    palette: {
      bg: "#181825",
      card: "#1E1E2E",
      cardBorder: "#89B4FA",
      accent: "#CBA6F7",
      accentText: "#181825",
      text: "#CDD6F4",
      textMuted: "#A6ADC8",
      gridDot: "rgba(137,180,250,0.12)",
      tagBg: "#313244",
      tagText: "#89B4FA",
    },
  },

  // 37. Retro VHS
  "vhs": {
    id: "vhs",
    name: "Retro VHS",
    badgeLabel: "REC ● PLAY",
    subLabel: "1994 ANALOG",
    archetype: "full-bleed",
    captionAnimation: "karaoke",
    fontFamily: "'Courier New', monospace",
    mono: true,
    palette: {
      bg: "#0A0A0A",
      card: "#151515",
      cardBorder: "#00FFCC",
      accent: "#00FFCC",
      accentText: "#000000",
      text: "#00FFCC",
      textMuted: "#FFCC00",
      tagBg: "#222222",
      tagText: "#FFCC00",
    },
  },

  // 38. Hot Seat
  "fmt-hottake": {
    id: "fmt-hottake",
    name: "Hot Seat",
    badgeLabel: "HOT SEAT",
    subLabel: "CONTROVERSY",
    archetype: "pip-corner",
    captionAnimation: "slap",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#100806",
      card: "#1F0E0A",
      cardBorder: "#FF4500",
      accent: "#FF4500",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#FCA5A5",
      tagBg: "#331610",
      tagText: "#FED7AA",
    },
  },

  // 39. Chapter Book
  "fmt-storytime": {
    id: "fmt-storytime",
    name: "Chapter Book",
    badgeLabel: "CHAPTER BOOK",
    subLabel: "NARRATIVE ARC",
    archetype: "split-bottom",
    captionAnimation: "box",
    fontFamily: "'Playfair Display', Georgia, serif",
    serif: true,
    palette: {
      bg: "#F5F2EB",
      card: "#2E241E",
      cardBorder: "#8C5835",
      accent: "#8C5835",
      accentText: "#F5F2EB",
      text: "#2E241E",
      textMuted: "#6B584E",
      tagBg: "#42342C",
      tagText: "#EAD7C7",
    },
  },

  // 40. Myth Buster
  "fmt-mythfact": {
    id: "fmt-mythfact",
    name: "Myth Buster",
    badgeLabel: "MYTH vs FACT",
    subLabel: "DEBUNKED",
    archetype: "split-duo",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0C0D12",
      card: "#151722",
      cardBorder: "#10B981",
      accent: "#EF4444",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#9CA3AF",
      tagBg: "#1F2332",
      tagText: "#10B981",
    },
  },

  // 41. Just Landed
  "fmt-deal": {
    id: "fmt-deal",
    name: "Just Landed",
    badgeLabel: "JUST LANDED",
    subLabel: "NEW PRODUCT",
    archetype: "pip-corner",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0A0A0C",
      card: "#141418",
      cardBorder: "#EAB308",
      accent: "#EAB308",
      accentText: "#000000",
      text: "#FFFFFF",
      textMuted: "#A1A1AA",
      tagBg: "#222228",
      tagText: "#EAB308",
    },
  },

  // 42. Glowline
  "cap-glowline": {
    id: "cap-glowline",
    name: "Glowline",
    badgeLabel: "GLOWLINE",
    subLabel: "NEON EDGES",
    archetype: "full-bleed",
    captionAnimation: "glow",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#05070B",
      card: "#0E131F",
      cardBorder: "#00FFB2",
      accent: "#00FFB2",
      accentText: "#000000",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      tagBg: "#162032",
      tagText: "#00FFB2",
    },
  },

  // 43. Slapword
  "cap-slap": {
    id: "cap-slap",
    name: "Slapword",
    badgeLabel: "SLAPWORD",
    subLabel: "KINETIC SLAM",
    archetype: "full-bleed",
    captionAnimation: "slap",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#000000",
      card: "#121212",
      cardBorder: "#FFE500",
      accent: "#FFE500",
      accentText: "#000000",
      text: "#FFFFFF",
      textMuted: "#888888",
      tagBg: "#222222",
      tagText: "#FFE500",
    },
  },

  // 44. Velvet
  "cap-velvet": {
    id: "cap-velvet",
    name: "Velvet",
    badgeLabel: "VELVET",
    subLabel: "LUXURY EDITORIAL",
    archetype: "full-bleed",
    captionAnimation: "box",
    fontFamily: "'Playfair Display', Georgia, serif",
    serif: true,
    palette: {
      bg: "#12051C",
      card: "#1F0A30",
      cardBorder: "#F3E5AB",
      accent: "#F3E5AB",
      accentText: "#12051C",
      text: "#FFFFFF",
      textMuted: "#D8B4E2",
      tagBg: "#2E1045",
      tagText: "#F3E5AB",
    },
  },

  // 45. Receipt Roll
  "cap-receipt": {
    id: "cap-receipt",
    name: "Receipt Roll",
    badgeLabel: "RECEIPT ROLL",
    subLabel: "THERMAL TICKER",
    archetype: "split-bottom",
    captionAnimation: "box",
    fontFamily: "'Courier New', monospace",
    mono: true,
    palette: {
      bg: "#F2EFE9",
      card: "#201F1D",
      cardBorder: "#333333",
      accent: "#1A1A1A",
      accentText: "#F2EFE9",
      text: "#1A1A1A",
      textMuted: "#555555",
      gridDot: "rgba(0,0,0,0.08)",
      tagBg: "#333333",
      tagText: "#F2EFE9",
    },
  },

  // 46. Nightline
  "cap-nightline": {
    id: "cap-nightline",
    name: "Nightline",
    badgeLabel: "NIGHTLINE",
    subLabel: "BROADCAST NEWS",
    archetype: "split-bottom",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0A1128",
      card: "#121E42",
      cardBorder: "#00E8C6",
      accent: "#00E8C6",
      accentText: "#0A1128",
      text: "#FFFFFF",
      textMuted: "#8AA2D4",
      gridDot: "rgba(0,232,198,0.12)",
      tagBg: "#1A2B5C",
      tagText: "#00E8C6",
    },
  },

  // 47. Price Drop
  "cap-dealtag": {
    id: "cap-dealtag",
    name: "Price Drop",
    badgeLabel: "PRICE DROP",
    subLabel: "DEAL ALERT",
    archetype: "full-bleed",
    captionAnimation: "box",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0E0E10",
      card: "#18181C",
      cardBorder: "#FBBF24",
      accent: "#FBBF24",
      accentText: "#0E0E10",
      text: "#FFFFFF",
      textMuted: "#A1A1AA",
      tagBg: "#27272A",
      tagText: "#FBBF24",
    },
  },

  // 48. Chrome Candy
  "cap-chrome": {
    id: "cap-chrome",
    name: "Chrome Candy",
    badgeLabel: "CHROME CANDY",
    subLabel: "METALLIC Y2K",
    archetype: "full-bleed",
    captionAnimation: "glow",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#08080C",
      card: "#14141E",
      cardBorder: "#D946EF",
      accent: "#D946EF",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#C084FC",
      tagBg: "#222234",
      tagText: "#F0ABFC",
    },
  },

  // 49. Orbit
  "frame-orbit": {
    id: "frame-orbit",
    name: "Orbit",
    badgeLabel: "ORBIT",
    subLabel: "RADIAL FOCUS",
    archetype: "frame-bento",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#070A14",
      card: "#10162B",
      cardBorder: "#38BDF8",
      accent: "#38BDF8",
      accentText: "#070A14",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      gridDot: "rgba(56,189,248,0.12)",
      tagBg: "#172344",
      tagText: "#38BDF8",
    },
  },

  // 50. Cover Story
  "frame-elevate": {
    id: "frame-elevate",
    name: "Cover Story",
    badgeLabel: "COVER STORY",
    subLabel: "MAGAZINE COVER",
    archetype: "split-bottom",
    captionAnimation: "box",
    fontFamily: "'Playfair Display', Georgia, serif",
    serif: true,
    palette: {
      bg: "#FAF8F5",
      card: "#1C1917",
      cardBorder: "#BE123C",
      accent: "#BE123C",
      accentText: "#FFFFFF",
      text: "#1C1917",
      textMuted: "#78716C",
      tagBg: "#292524",
      tagText: "#FDA4AF",
    },
  },

  // 51. Sliding Seam
  "split-seam": {
    id: "split-seam",
    name: "Sliding Seam",
    badgeLabel: "SLIDING SEAM",
    subLabel: "SEAM TRANSITION",
    archetype: "split-duo",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#121316",
      card: "#1C1E23",
      cardBorder: "#F97316",
      accent: "#F97316",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      tagBg: "#2A2D35",
      tagText: "#F97316",
    },
  },

  // 52. Diagonal Cut
  "split-slash": {
    id: "split-slash",
    name: "Diagonal Cut",
    badgeLabel: "DIAGONAL CUT",
    subLabel: "ANGLED SLICE",
    archetype: "split-duo",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0F1115",
      card: "#181B22",
      cardBorder: "#84CC16",
      accent: "#84CC16",
      accentText: "#0F1115",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      tagBg: "#242833",
      tagText: "#84CC16",
    },
  },

  // 53. Corner Cam
  "split-pip": {
    id: "split-pip",
    name: "Corner Cam",
    badgeLabel: "CORNER CAM",
    subLabel: "GRAPHIC PIP",
    archetype: "pip-corner",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#0B0E17",
      card: "#141A29",
      cardBorder: "#8B5CF6",
      accent: "#8B5CF6",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#94A3B8",
      gridDot: "rgba(139,92,246,0.12)",
      tagBg: "#1F283E",
      tagText: "#C4B5FD",
    },
  },

  // 54. Magazine Spread
  "split-mag": {
    id: "split-mag",
    name: "Magazine Spread",
    badgeLabel: "MAGAZINE SPREAD",
    subLabel: "DUAL COLUMN",
    archetype: "split-duo",
    captionAnimation: "box",
    fontFamily: "'Playfair Display', Georgia, serif",
    serif: true,
    palette: {
      bg: "#F9F8F6",
      card: "#1F1F1F",
      cardBorder: "#333333",
      accent: "#C2410C",
      accentText: "#FFFFFF",
      text: "#1F1F1F",
      textMuted: "#666666",
      tagBg: "#333333",
      tagText: "#F9F8F6",
    },
  },

  // 55. UGC Sticker Talk
  "ugc": {
    id: "ugc",
    name: "AI-UGC in Sticker Talk",
    badgeLabel: "CREATOR UGC",
    subLabel: "TIKTOK REEL",
    archetype: "full-bleed",
    captionAnimation: "karaoke",
    fontFamily: "'Montserrat', sans-serif",
    palette: {
      bg: "#000000",
      card: "#121212",
      cardBorder: "#FE2C55",
      accent: "#FE2C55",
      accentText: "#FFFFFF",
      text: "#FFFFFF",
      textMuted: "#888888",
      tagBg: "#222222",
      tagText: "#25F4EE",
    },
  },

  // 56. UGC Editorial
  "ugc-2": {
    id: "ugc-2",
    name: "AI-UGC in Editorial Cards",
    badgeLabel: "UGC EDITORIAL",
    subLabel: "VIRAL HOOK",
    archetype: "full-bleed",
    captionAnimation: "karaoke",
    fontFamily: "'Inter', sans-serif",
    palette: {
      bg: "#080808",
      card: "#181818",
      cardBorder: "#FFFFFF",
      accent: "#22C55E",
      accentText: "#000000",
      text: "#FFFFFF",
      textMuted: "#A3A3A3",
      tagBg: "#2A2A2A",
      tagText: "#22C55E",
    },
  },
};

/**
 * Resolve any style ID to its StyleConfig, with fallback to Paper Studio
 */
export function getStyleConfig(styleId?: string): StyleConfig {
  if (!styleId) return STYLE_REGISTRY["cap-paper"];

  // Direct match
  if (STYLE_REGISTRY[styleId]) return STYLE_REGISTRY[styleId];

  // Alias / partial matches
  const lower = styleId.toLowerCase();
  for (const [key, cfg] of Object.entries(STYLE_REGISTRY)) {
    if (lower.includes(key) || key.includes(lower)) return cfg;
  }

  if (lower.includes("lime")) return STYLE_REGISTRY["limeslides"];
  if (lower.includes("glitch")) return STYLE_REGISTRY["classified-yt"];
  if (lower.includes("forest")) return STYLE_REGISTRY["cap-forest"];
  if (lower.includes("countdown") || lower.includes("rank")) return STYLE_REGISTRY["fmt-countdown"];
  if (lower.includes("bento")) return STYLE_REGISTRY["frame-bento"];
  if (lower.includes("pip")) return STYLE_REGISTRY["split-pip"];
  if (lower.includes("slap")) return STYLE_REGISTRY["cap-slap"];
  if (lower.includes("glow")) return STYLE_REGISTRY["cap-glowline"];
  if (lower.includes("phone")) return STYLE_REGISTRY["split-phone"];

  return STYLE_REGISTRY["cap-paper"];
}
