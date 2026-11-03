import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import {
  AuteurEditPlan,
  PlannedScene,
  buildMakerzzReferenceScenes,
} from "./gemini-video-pipeline";
import { buildAuteurAssScript, getStyleVisualConfig } from "./auteur-ass-composer";
import { renderScenePlatePng } from "./auteur-scene-plates";

function getFfmpegPath(): string {
  if (fs.existsSync("/usr/bin/ffmpeg")) return "/usr/bin/ffmpeg";

  const localBin = path.join(process.cwd(), "bin", "ffmpeg.exe");
  if (fs.existsSync(localBin)) return localBin;

  const appBin = path.join(process.cwd(), "apps", "frontend", "bin", "ffmpeg.exe");
  if (fs.existsSync(appBin)) return appBin;

  return "ffmpeg";
}

const ffmpegBinary = getFfmpegPath();
if (ffmpegBinary && fs.existsSync(ffmpegBinary)) {
  ffmpeg.setFfmpegPath(ffmpegBinary);
}

export function getVideosDir(): string {
  const candidate1 = path.join(
    process.cwd(),
    "apps",
    "frontend",
    "public",
    "uploads",
    "videos"
  );
  if (fs.existsSync(candidate1)) return candidate1;

  const candidate2 = path.join(process.cwd(), "public", "uploads", "videos");
  if (fs.existsSync(candidate2)) return candidate2;

  const chosen = fs.existsSync(path.join(process.cwd(), "apps", "frontend"))
    ? candidate1
    : candidate2;
  fs.mkdirSync(chosen, { recursive: true });
  return chosen;
}

export function resolveVideoInputPath(videoRelPath: string): string | null {
  if (!videoRelPath) return null;
  const filename = path.basename(videoRelPath);
  const candidates = [
    path.join(getVideosDir(), filename),
    path.join(process.cwd(), "public", "uploads", "videos", filename),
    path.join(
      process.cwd(),
      "apps",
      "frontend",
      "public",
      "uploads",
      "videos",
      filename
    ),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

/**
 * Extract a frame from a video as thumbnail JPEG
 */
export async function extractVideoThumbnail(
  videoRelPath: string,
  projectId: string,
  timestampSec = "1.5"
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const videosDir = getVideosDir();
      const inputPath = resolveVideoInputPath(videoRelPath);

      if (!inputPath || !fs.existsSync(inputPath)) {
        return resolve(videoRelPath);
      }

      const thumbFilename = `thumb_${projectId}.jpg`;

      ffmpeg(inputPath)
        .screenshots({
          timestamps: [timestampSec],
          filename: thumbFilename,
          folder: videosDir,
          size: "720x1280",
        })
        .on("end", () => {
          const directFile = path.join(videosDir, thumbFilename);
          const suffixedFile = path.join(videosDir, `thumb_${projectId}_1.jpg`);
          if (!fs.existsSync(directFile) && fs.existsSync(suffixedFile)) {
            try {
              fs.copyFileSync(suffixedFile, directFile);
            } catch {}
          }
          resolve(`/api/studio/video/${thumbFilename}`);
        })
        .on("error", (err) => {
          console.error("FFmpeg thumbnail error:", err);
          resolve(videoRelPath);
        });
    } catch (e: any) {
      console.error("Thumbnail extraction exception:", e);
      resolve(videoRelPath);
    }
  });
}

export interface RenderProjectOptions {
  projectId: string;
  videoRelPath: string;
  styleId: string;
  plan?: AuteurEditPlan;
  transcriptWords?: Array<{ word: string; start: number; end: number }>;
  headline?: string;
  subAccent?: string;
  durationSec?: number;
}

/**
 * Normalizes and stretches/tiles the scene list so that every second from 0..limitSec
 * has an active multi-scene graphic plate (split-screen browser proof, full-screen 01/02/03 list,
 * full-screen 3-Node architecture diagram, Dry Erase whiteboard, etc.).
 */
function prepareRenderScenes(
  rawScenes: PlannedScene[] | undefined,
  limitSec: number
): PlannedScene[] {
  const baseScenes =
    rawScenes && rawScenes.length >= 6
      ? rawScenes.map((s) => ({ ...s }))
      : buildMakerzzReferenceScenes(limitSec);

  // Cap at 10 distinct plates for fast FFmpeg filtergraph execution while covering 0..limitSec
  const maxPlates = 10;
  const selected = baseScenes.slice(0, maxPlates);
  const lastEnd = selected[selected.length - 1]?.end || 37.3;

  // If the video is longer than lastEnd (e.g. 78s), scale scene timestamps proportionally across limitSec
  // if they were planned for 37.3s, OR if limitSec <= 42s keep exact timestamps and extend final scene to limitSec.
  if (limitSec > lastEnd + 2) {
    const scale = limitSec / lastEnd;
    return selected.map((sc, idx) => {
      const start = idx === 0 ? 0 : Math.round(sc.start * scale * 100) / 100;
      const end =
        idx === selected.length - 1
          ? limitSec
          : Math.round(sc.end * scale * 100) / 100;
      return {
        ...sc,
        start,
        end: Math.max(start + 0.8, end),
      };
    });
  }

  return selected.map((sc, idx) => {
    const start = idx === 0 ? 0 : Math.min(limitSec - 0.5, Math.max(0, sc.start));
    const end =
      idx === selected.length - 1
        ? limitSec
        : Math.min(limitSec, Math.max(start + 0.5, sc.end));
    return {
      ...sc,
      start,
      end,
    };
  });
}

/**
 * Composite and render the video into the exact selected Makerzz Studio style (all 56 styles supported)
 * using:
 * 1. `next/og` (`ImageResponse`) 1080x1920 RGBA PNG scene plates for:
 *    - Top Hook Header (Condensed Bold Title + Colored Highlight Box with Italic Serif)
 *    - Split-Screen Browser Proof Cards (`binance.com/zh-CN`, `335,387,860 用户的共同选择`, warning modals, Bitcoin CC BY-SA 4.0 cards)
 *    - Full-Screen `01 / 02 / 03` Numbered Breakdown Lists + Red Stamp Badges (`PAISA GAYA`, `SIRF ITNA`)
 *    - Full-Screen 3-Node Connected Architecture Diagram (`[Binance] -> [FI registered], [Deposit], [Safety]`)
 *    - Style-Specific Chin Boards (Aluminium-framed Dry Erase Whiteboard with blue/red marker text & checkmarks, Receipt Roll thermal tape)
 * 2. FFmpeg multi-input `overlay=enable='between(t,start,end)'` + `libass` synchronized word-by-word seam captions
 * 3. Broadcast audio loudness normalization (-14.1 LUFS, 44.1kHz stereo AAC, H.264 Main Profile Level 4.0)
 */
export async function renderProjectVideo(
  options: RenderProjectOptions
): Promise<string> {
  const {
    projectId,
    videoRelPath,
    styleId,
    plan,
    transcriptWords,
    durationSec = 37.3,
  } = options;

  const videosDir = getVideosDir();
  const inputPath = resolveVideoInputPath(videoRelPath);

  if (!inputPath || !fs.existsSync(inputPath)) {
    throw new Error(`Input video not found for: ${videoRelPath}`);
  }

  const outputFilename = `rendered_${projectId}.mp4`;
  const outputPath = path.join(videosDir, outputFilename);

  const limitSec = Math.min(Math.max(durationSec, 5), 90);
  const theme = getStyleVisualConfig(styleId);
  const safeId = projectId.replace(/[^a-zA-Z0-9_-]/g, "");

  // 1. Prepare multi-scene timeline and render 1080x1920 RGBA PNG plates via next/og
  const renderScenes = prepareRenderScenes(plan?.scenes, limitSec);
  const plateFiles: Array<{ path: string; start: number; end: number }> = [];

  for (let i = 0; i < renderScenes.length; i++) {
    const sc = renderScenes[i];
    const platePath = `/tmp/plate_${safeId}_${i}.png`;
    try {
      const pngBuf = await renderScenePlatePng({
        scene: sc,
        sceneIndex: i,
        totalScenes: renderScenes.length,
        theme,
      });
      fs.writeFileSync(platePath, pngBuf);
      plateFiles.push({
        path: platePath,
        start: sc.start,
        end: sc.end,
      });
    } catch (plateErr: any) {
      console.warn(
        `[FFmpeg Renderer] Could not render scene plate ${i}, skipping plate:`,
        plateErr?.message || plateErr
      );
    }
  }

  // 2. Write ASS subtitle script to /tmp for synchronized word-by-word seam captions
  const assFilePath = `/tmp/auteur_${safeId}.ass`;
  const usePlates = plateFiles.length > 0;
  const assContent = buildAuteurAssScript({
    styleId,
    durationSec: limitSec,
    plan: plan ? { ...plan, scenes: renderScenes } : undefined,
    transcriptWords,
    headlineFallback: options.headline || plan?.headline || "DUNIYA KA SABSE",
    subAccentFallback:
      options.subAccent || plan?.subAccent || "Bada Exchange Hack",
    includeSceneHeaders: !usePlates,
  });
  fs.writeFileSync(assFilePath, assContent, "utf8");

  // 3. Speaker framing geometry based on style layoutFamily:
  // - For Dry Erase (whiteboard_marker) & Receipt Roll (receipt_roll):
  //   Speaker is framed in the TOP window (x=54, y=130, w=972, h=1020) and the Whiteboard / Receipt Roll sits under their chin (y=1140..1830)!
  // - For Split-Screen Explainer / Glitch / Paper Studio / Lime Slides / Chalk Talk / etc.:
  //   Speaker is framed in the BOTTOM window (x=80, y=1275, w=920, h=590) while the top half (y=0..1260) hosts the Hook Header + Browser Proof Card / Coin Card, and full-screen scenes cover 100% of the 1080x1920 frame!
  const isChinBoard =
    theme.layoutFamily === "whiteboard_marker" ||
    theme.layoutFamily === "receipt_roll";

  const spkW = isChinBoard ? 972 : 920;
  const spkH = isChinBoard ? 1020 : 590;
  const spkX = isChinBoard ? 54 : 80;
  const spkY = isChinBoard ? 130 : 1275;

  const colorFilter =
    theme.isDarkCanvas
      ? ",eq=contrast=1.08:saturation=1.04"
      : ",eq=contrast=1.04:saturation=1.05";

  return new Promise((resolve, reject) => {
    try {
      const cmd = ffmpeg().input(inputPath);
      plateFiles.forEach((pf) => {
        cmd.input(pf.path);
      });

      const complexFilter: string[] = [
        // Base 1080x1920 @ 30fps canvas in the style's background color
        `color=c=${theme.canvasBgHex}:s=1080x1920:r=30[bg0]`,
        // Subtle architectural grid lines on the background canvas
        `[bg0]drawbox=x=0:y=1260:w=1080:h=2:color=${theme.gridLineHex}@0.45:t=fill[bg1]`,
        `[bg1]drawbox=x=54:y=0:w=2:h=1920:color=${theme.gridLineHex}@0.35:t=fill[bg2]`,
        `[bg2]drawbox=x=1026:y=0:w=2:h=1920:color=${theme.gridLineHex}@0.35:t=fill[bg]`,
        // Scale and crop speaker video into the style's speaker window
        `[0:v]scale=${spkW}:${spkH}:force_original_aspect_ratio=increase,crop=${spkW}:${spkH},setsar=1${colorFilter}[spk]`,
        // Overlay speaker window onto canvas
        `[bg][spk]overlay=${spkX}:${spkY}:shortest=1[base0]`,
        // Crisp border around the speaker window
        `[base0]drawbox=x=${spkX - 2}:y=${spkY - 2}:w=${spkW + 4}:h=${spkH + 4}:color=${theme.cardBorderHex}@0.85:t=3[p0]`,
      ];

      // Chain each scene's 1080x1920 RGBA PNG plate with time-gated overlay
      plateFiles.forEach((pf, idx) => {
        const inputIdx = idx + 1;
        const prevLabel = `p${idx}`;
        const nextLabel = `p${idx + 1}`;
        const sTime = pf.start.toFixed(2);
        const eTime = pf.end.toFixed(2);
        complexFilter.push(
          `[${prevLabel}][${inputIdx}:v]overlay=0:0:enable='between(t,${sTime},${eTime})'[${nextLabel}]`
        );
      });

      const lastPlateLabel = `p${plateFiles.length}`;
      // Burn in synchronized word-by-word karaoke captions + SMPTE timecode via libass
      complexFilter.push(`[${lastPlateLabel}]ass=${assFilePath}[outv]`);

      cmd
        .complexFilter(complexFilter)
        .audioFilters("loudnorm=I=-14.1:TP=-2.0:LRA=11,aresample=44100")
        .outputOptions([
          "-map [outv]",
          "-map 0:a?",
          "-c:v libx264",
          "-profile:v main",
          "-level 4.0",
          "-preset veryfast",
          "-crf 26",
          "-maxrate 1600k",
          "-bufsize 3200k",
          "-r 30",
          "-pix_fmt yuv420p",
          "-c:a aac",
          "-ar 44100",
          "-ac 2",
          "-b:a 128k",
          "-movflags +faststart",
          `-t ${limitSec}`,
        ])
        .output(outputPath)
        .on("start", (commandLine) => {
          console.log(
            `[FFmpeg Renderer] Running multi-scene composite (${theme.styleName} / ${theme.layoutFamily}, ${plateFiles.length} plates):`,
            commandLine
          );
        })
        .on("end", async () => {
          console.log(
            `[FFmpeg Renderer] Studio composite finished: ${outputPath}`
          );
          // Clean up temporary PNG plates
          for (const pf of plateFiles) {
            try {
              if (fs.existsSync(pf.path)) fs.unlinkSync(pf.path);
            } catch {}
          }
          try {
            // Capture thumbnail at 1.8s from the newly rendered composite video
            await extractVideoThumbnail(
              `/uploads/videos/${outputFilename}`,
              projectId,
              "1.8"
            );
          } catch {}
          resolve(`/api/studio/video/${outputFilename}`);
        })
        .on("error", (err) => {
          console.error("[FFmpeg Renderer] FFmpeg studio render error:", err);
          reject(err);
        })
        .run();
    } catch (e: any) {
      console.error("[FFmpeg Renderer] Video rendering exception:", e);
      reject(e);
    }
  });
}
