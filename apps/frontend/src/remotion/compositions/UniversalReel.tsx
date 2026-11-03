import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  OffthreadVideo,
  staticFile,
} from "remotion";
import type { ReelProps } from "../types";
import { SPRING_CONFIG } from "../types";
import { getStyleConfig, StyleConfig } from "../styles";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function resolveVideoSrc(src: string): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  // If it's a local public path e.g. "/uploads/videos/file.mp4"
  const clean = src.replace(/^[\\\/]+/, "");
  return staticFile(clean);
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/** Dynamic Grid Dots background */
const GridDots: React.FC<{ color?: string }> = ({ color = "rgba(0,0,0,0.06)" }) => {
  const dots: React.ReactNode[] = [];
  const spacing = 52;
  for (let y = 0; y < 1920; y += spacing) {
    for (let x = 0; x < 1080; x += spacing) {
      dots.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 3,
            height: 3,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      );
    }
  }
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{dots}</AbsoluteFill>;
};

/** Universal dynamic captions */
const CaptionsTrack: React.FC<{
  words?: Array<{ word: string; start: number; end: number }>;
  currentTimeSec: number;
  config: StyleConfig;
}> = ({ words, currentTimeSec, config }) => {
  if (!words || words.length === 0) return null;

  const P = config.palette;

  // Mode 1: Slap (one giant word centered on beat)
  if (config.captionAnimation === "slap") {
    const currentWord = words.find(
      (w) => currentTimeSec >= w.start && currentTimeSec <= w.end + 0.15
    );
    if (!currentWord) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: 0,
          right: 0,
          textAlign: "center",
          transform: "translateY(-50%)",
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: config.fontFamily,
            fontSize: 88,
            fontWeight: 900,
            color: P.accentText || "#FFFFFF",
            backgroundColor: P.accent,
            padding: "8px 24px",
            borderRadius: 16,
            textTransform: "uppercase",
            letterSpacing: 2,
            boxShadow: `0 12px 36px ${P.accent}66`,
          }}
        >
          {currentWord.word}
        </span>
      </div>
    );
  }

  // Mode 2: Glow / Box / Karaoke lines
  const lineSize = 4;
  const lines: Array<Array<{ word: string; start: number; end: number }>> = [];
  for (let i = 0; i < words.length; i += lineSize) {
    lines.push(words.slice(i, i + lineSize));
  }

  const currentLine = lines.find(
    (line) =>
      currentTimeSec >= line[0].start &&
      currentTimeSec <= line[line.length - 1].end + 0.35
  );

  if (!currentLine) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 36,
        left: 24,
        right: 24,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {currentLine.map((w, i) => {
        const isActive = currentTimeSec >= w.start && currentTimeSec <= w.end;
        return (
          <span
            key={`${w.start}-${i}`}
            style={{
              fontFamily: config.fontFamily,
              fontSize: 34,
              fontWeight: 800,
              color: isActive ? P.accentText : "rgba(255,255,255,0.45)",
              backgroundColor: isActive
                ? P.accent
                : "rgba(0,0,0,0.65)",
              padding: "4px 14px",
              borderRadius: 8,
              textTransform: "uppercase",
              boxShadow: isActive ? `0 4px 16px ${P.accent}55` : "none",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

export const UniversalReel: React.FC<ReelProps> = ({
  videoSrc,
  styleId,
  headline,
  subAccent,
  metricLabel,
  metricCount,
  steps,
  captionWords,
  durationInSeconds = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = getStyleConfig(styleId);
  const P = cfg.palette;

  // Hook scene duration: 3.5s = 105 frames at 30fps
  const hookDurationFrames = 3.5 * fps;
  const isHookScene = frame < hookDurationFrames;
  const currentTimeSec = frame / fps;

  // Spring animations for Scene 1
  const badgeScale = spring({ fps, frame, config: SPRING_CONFIG });
  const headlineY = interpolate(
    spring({ fps, frame: Math.max(0, frame - 8), config: { damping: 14, stiffness: 100 } }),
    [0, 1],
    [100, 0],
    clamp
  );
  const headlineOpacity = interpolate(frame, [6, 18], [0, 1], clamp);
  const subY = interpolate(
    spring({ fps, frame: Math.max(0, frame - 18), config: SPRING_CONFIG }),
    [0, 1],
    [70, 0],
    clamp
  );
  const subOpacity = interpolate(frame, [18, 30], [0, 1], clamp);

  // Scene 2 animations
  const scene2Frame = Math.max(0, frame - hookDurationFrames);
  const rawCount = interpolate(scene2Frame, [10, 55], [0, metricCount], clamp);
  const displayCount = formatCount(Math.round(rawCount));

  const cardEntranceY = interpolate(
    spring({ fps, frame: scene2Frame, config: SPRING_CONFIG }),
    [0, 1],
    [60, 0],
    clamp
  );

  return (
    <AbsoluteFill style={{ backgroundColor: P.bg, overflow: "hidden" }}>
      {/* Background Dots */}
      {P.gridDot && <GridDots color={P.gridDot} />}

      {/* ───────────────── SCENE 1: KINETIC HOOK (0 - 3.5s) ───────────────── */}
      <Sequence from={0} durationInFrames={hookDurationFrames}>
        <AbsoluteFill style={{ backgroundColor: P.bg }}>
          {P.gridDot && <GridDots color={P.gridDot} />}

          {/* Top metadata strip */}
          <div
            style={{
              position: "absolute",
              top: 80,
              width: "100%",
              textAlign: "center",
              fontFamily: cfg.fontFamily,
              fontSize: 22,
              fontWeight: 600,
              color: P.textMuted,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            A-ROLL | TAKE 01 • {cfg.name.toUpperCase()}
          </div>

          {/* Badges */}
          <div
            style={{
              position: "absolute",
              top: 580,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: 16,
              transform: `scale(${badgeScale})`,
            }}
          >
            {[cfg.badgeLabel, cfg.subLabel].map((label) => (
              <div
                key={label}
                style={{
                  backgroundColor: P.accent,
                  color: P.accentText,
                  fontFamily: cfg.fontFamily,
                  fontSize: 22,
                  fontWeight: 900,
                  padding: "10px 28px",
                  borderRadius: 999,
                  letterSpacing: 2,
                  boxShadow: `0 8px 24px ${P.accent}44`,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Giant Headline */}
          <div
            style={{
              position: "absolute",
              top: 720,
              width: "100%",
              textAlign: "center",
              transform: `translateY(${headlineY}px)`,
              opacity: headlineOpacity,
            }}
          >
            <div
              style={{
                fontFamily: cfg.fontFamily,
                fontSize: 90,
                fontWeight: 900,
                color: P.text,
                lineHeight: 1.05,
                padding: "0 60px",
                letterSpacing: -1,
                textTransform: "uppercase",
              }}
            >
              {headline}
            </div>
          </div>

          {/* Sub-Accent Headline */}
          <div
            style={{
              position: "absolute",
              top: 1020,
              width: "100%",
              textAlign: "center",
              transform: `translateY(${subY}px)`,
              opacity: subOpacity,
            }}
          >
            <div
              style={{
                fontFamily: cfg.fontFamily,
                fontSize: 78,
                fontWeight: 900,
                color: P.accent,
                lineHeight: 1.1,
                letterSpacing: -1,
                textTransform: "uppercase",
              }}
            >
              {subAccent}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ───────────────── SCENE 2+: MAIN EDIT BODY (3.5s - END) ───────────── */}
      <Sequence from={hookDurationFrames}>
        <AbsoluteFill>
          {/* ARCHETYPE 1: SPLIT-BOTTOM (Paper Studio, Glitch, Lime, Forest, Editorial, Swiss) */}
          {(cfg.archetype === "split-bottom" || cfg.archetype === "frame-bento") && (
            <>
              {/* TOP STAT / METRIC CARD */}
              <div
                style={{
                  position: "absolute",
                  top: 60,
                  left: 45,
                  right: 45,
                  height: "36%",
                  backgroundColor: P.card,
                  borderRadius: 24,
                  border: `3px solid ${P.cardBorder}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `translateY(${cardEntranceY}px)`,
                  padding: "30px 20px",
                  boxShadow: "0 20px 48px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  style={{
                    fontFamily: cfg.fontFamily,
                    fontSize: 22,
                    fontWeight: 600,
                    color: P.textMuted,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {metricLabel}
                </div>

                <div
                  style={{
                    fontFamily: cfg.fontFamily,
                    fontSize: 104,
                    fontWeight: 900,
                    color: P.text === "#000000" && P.card === "#000000" ? "#FFFFFF" : P.text,
                    lineHeight: 1,
                  }}
                >
                  {displayCount}
                </div>

                <div
                  style={{
                    width: 240,
                    height: 5,
                    backgroundColor: P.accent,
                    borderRadius: 3,
                    marginTop: 16,
                    marginBottom: 20,
                  }}
                />

                <div style={{ display: "flex", gap: 12 }}>
                  {steps.map((step) => (
                    <div
                      key={step}
                      style={{
                        backgroundColor: P.tagBg,
                        color: P.tagText,
                        fontFamily: cfg.fontFamily,
                        fontSize: 17,
                        fontWeight: 700,
                        padding: "7px 18px",
                        borderRadius: 999,
                        letterSpacing: 1,
                      }}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM TALKING HEAD VIDEO CARD */}
              <div
                style={{
                  position: "absolute",
                  bottom: 50,
                  left: 45,
                  right: 45,
                  height: "54%",
                  backgroundColor: "#000000",
                  borderRadius: 24,
                  border: `4px solid ${P.cardBorder}`,
                  overflow: "hidden",
                  boxShadow: "0 24px 50px rgba(0,0,0,0.3)",
                }}
              >
                <OffthreadVideo
                  src={resolveVideoSrc(videoSrc)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <CaptionsTrack
                  words={captionWords}
                  currentTimeSec={currentTimeSec}
                  config={cfg}
                />
              </div>
            </>
          )}

          {/* ARCHETYPE 2: FLOATING CORNER PIP (Rank Rush, Corner Cam, Dashboard, Demo) */}
          {cfg.archetype === "pip-corner" && (
            <>
              {/* Giant Fullscreen Graphics Background */}
              <div
                style={{
                  position: "absolute",
                  top: 140,
                  left: 60,
                  right: 60,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: P.accent,
                    color: P.accentText,
                    display: "inline-block",
                    fontFamily: cfg.fontFamily,
                    fontSize: 26,
                    fontWeight: 900,
                    padding: "10px 32px",
                    borderRadius: 999,
                    letterSpacing: 2,
                    marginBottom: 30,
                  }}
                >
                  {cfg.badgeLabel}
                </div>

                <div
                  style={{
                    fontFamily: cfg.fontFamily,
                    fontSize: 140,
                    fontWeight: 900,
                    color: P.text,
                    lineHeight: 1,
                  }}
                >
                  {displayCount}
                </div>

                <div
                  style={{
                    fontFamily: cfg.fontFamily,
                    fontSize: 32,
                    fontWeight: 700,
                    color: P.textMuted,
                    textTransform: "uppercase",
                    marginTop: 16,
                  }}
                >
                  {metricLabel}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 14,
                    marginTop: 36,
                  }}
                >
                  {steps.map((step, idx) => (
                    <div
                      key={step}
                      style={{
                        backgroundColor: P.tagBg,
                        color: P.tagText,
                        fontFamily: cfg.fontFamily,
                        fontSize: 20,
                        fontWeight: 800,
                        padding: "10px 24px",
                        borderRadius: 14,
                      }}
                    >
                      {`0${idx + 1}. ${step}`}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating PIP Corner Cam Video Card */}
              <div
                style={{
                  position: "absolute",
                  bottom: 70,
                  right: 50,
                  width: 440,
                  height: 640,
                  borderRadius: 24,
                  border: `4px solid ${P.accent}`,
                  overflow: "hidden",
                  boxShadow: `0 24px 60px ${P.accent}44`,
                  backgroundColor: "#000000",
                }}
              >
                <OffthreadVideo
                  src={resolveVideoSrc(videoSrc)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Captions spanning bottom left */}
              <div style={{ position: "absolute", bottom: 120, left: 60, width: 480 }}>
                <CaptionsTrack
                  words={captionWords}
                  currentTimeSec={currentTimeSec}
                  config={cfg}
                />
              </div>
            </>
          )}

          {/* ARCHETYPE 3: FULL BLEED KINETIC (Slapword, Glowline, Velvet, Chrome, Kinetic) */}
          {(cfg.archetype === "full-bleed" || cfg.archetype === "split-phone") && (
            <AbsoluteFill>
              {/* Fullscreen Video */}
              <OffthreadVideo
                src={videoSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Optional Glow Outline Border */}
              {cfg.id === "cap-glowline" && (
                <div
                  style={{
                    position: "absolute",
                    inset: 30,
                    border: `6px solid ${P.accent}`,
                    borderRadius: 36,
                    boxShadow: `inset 0 0 40px ${P.accent}, 0 0 50px ${P.accent}`,
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Top Badge Strip */}
              <div
                style={{
                  position: "absolute",
                  top: 80,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  zIndex: 40,
                }}
              >
                <div
                  style={{
                    backgroundColor: P.accent,
                    color: P.accentText,
                    fontFamily: cfg.fontFamily,
                    fontSize: 22,
                    fontWeight: 900,
                    padding: "8px 26px",
                    borderRadius: 999,
                    letterSpacing: 2,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  {cfg.badgeLabel}
                </div>
              </div>

              {/* Captions (Slap or Karaoke) */}
              <CaptionsTrack
                words={captionWords}
                currentTimeSec={currentTimeSec}
                config={cfg}
              />
            </AbsoluteFill>
          )}

          {/* ARCHETYPE 4: DUAL-PANE SPLIT (Side by Side, Three Act, Myth Buster) */}
          {cfg.archetype === "split-duo" && (
            <AbsoluteFill style={{ display: "flex", flexDirection: "column" }}>
              {/* Top Half: Video */}
              <div
                style={{
                  height: "50%",
                  borderBottom: `4px solid ${P.accent}`,
                  overflow: "hidden",
                  backgroundColor: "#000000",
                }}
              >
                <OffthreadVideo
                  src={resolveVideoSrc(videoSrc)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Bottom Half: Motion Graphics & Stats */}
              <div
                style={{
                  height: "50%",
                  backgroundColor: P.card,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 40px",
                }}
              >
                <div
                  style={{
                    backgroundColor: P.accent,
                    color: P.accentText,
                    fontFamily: cfg.fontFamily,
                    fontSize: 22,
                    fontWeight: 900,
                    padding: "8px 24px",
                    borderRadius: 999,
                    marginBottom: 20,
                  }}
                >
                  {cfg.badgeLabel}
                </div>

                <div
                  style={{
                    fontFamily: cfg.fontFamily,
                    fontSize: 96,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    lineHeight: 1,
                  }}
                >
                  {displayCount}
                </div>

                <div
                  style={{
                    fontFamily: cfg.fontFamily,
                    fontSize: 24,
                    color: P.textMuted,
                    textTransform: "uppercase",
                    marginTop: 12,
                    marginBottom: 24,
                  }}
                >
                  {metricLabel}
                </div>

                <CaptionsTrack
                  words={captionWords}
                  currentTimeSec={currentTimeSec}
                  config={cfg}
                />
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
