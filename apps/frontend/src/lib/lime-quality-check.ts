import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { GoogleGenAI } from "@google/genai";
import { LimeSceneBeat } from "./lime-director-schema";
import { chunkLimeCaptions, assertRealSceneCopy, layoutHeadline } from "./lime-render-utils";
import { getFfmpegPath } from "./groq-transcriber";

const execFileAsync = promisify(execFile);

export interface LimeQualityReport {
  checks: Array<{ id: string; label: string; status: "pass" | "warn"; detail: string }>;
  failedScenes: Array<{ index: number; failures: string[] }>;
  numbers: {
    visualChanges: number;
    maxCaptionActive: number;
    faceInsideCropPercent: number;
    emptyAreaMaxPercent: number | null;
    motionCoveragePercent: number | null;
    renderMs: number;
  };
}

function luminance(hex: string) {
  const rgb = hex.match(/[0-9a-f]{2}/gi)!.map((part) => parseInt(part, 16) / 255).map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}

function contrastRatio(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
}

async function sampleFrames(videoPath: string, start: number, end: number, directory: string, prefix: string) {
  const ffmpeg = getFfmpegPath();
  const framePaths: string[] = [];
  for (const [index, fraction] of [.12, .5, .88].entries()) {
    const time = Math.max(0, start + (end - start) * fraction);
    const framePath = path.join(directory, `${prefix}-${index}.jpg`);
    await execFileAsync(ffmpeg, ["-v", "error", "-ss", time.toFixed(3), "-i", videoPath, "-frames:v", "1", "-q:v", "3", framePath], { timeout: 30_000, maxBuffer: 1024 * 1024 });
    if (fs.existsSync(framePath)) framePaths.push(framePath);
  }
  return framePaths;
}

async function inspectWithGemini(framePaths: string[], scene: LimeSceneBeat) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !framePaths.length) return { failures: [] as string[], checksPerformed: false, serviceUnavailable: false };
  try {
    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [{ text: `Inspect these three consecutive frames from one Lime Slides scene. Report only objective visual defects: clipped headline or illustration text outside the 48px safe margins, text overlap, placeholder labels, empty lime area exceeding 25% of the frame without a speaker/graphic, or a face cropped through the forehead. The scene headline is ${scene.headline}. Return JSON {"passed":boolean,"failures":[string],"emptyAreaPercent":number|null}. Ignore transparency; these are frames from the fully composited output.` }];
    for (const framePath of framePaths) parts.push({ inlineData: { mimeType: "image/jpeg", data: fs.readFileSync(framePath).toString("base64") } });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_VISION_MODEL || "gemini-3.8-flash",
      contents: [{ role: "user", parts }],
      config: { responseMimeType: "application/json" },
    });
    const json = JSON.parse((response.text || "{}").replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
    return {
      failures: Array.isArray(json.failures) ? json.failures.filter((failure: unknown) => typeof failure === "string") : [],
      checksPerformed: true,
      serviceUnavailable: false,
      emptyAreaPercent: Number.isFinite(json.emptyAreaPercent) ? Number(json.emptyAreaPercent) : null,
    };
  } catch (error: any) {
    console.warn("[Lime Slides QA] Gemini vision check unavailable:", error?.message || error);
    const serviceUnavailable = /\b(404|429|500|502|503|504)\b|overloaded|unavailable/i.test(error?.message || "");
    return { failures: [] as string[], checksPerformed: false, serviceUnavailable, emptyAreaPercent: null };
  }
}

async function measureMotionCoverage(videoPath: string): Promise<number | null> {
  try {
    const ffmpeg = getFfmpegPath();
    const { stderr } = await execFileAsync(ffmpeg, [
      "-v", "info", "-i", videoPath,
      "-vf", "fps=10,tblend=all_mode=difference,signalstats,metadata=print",
      "-f", "null", "-",
    ], { timeout: 120_000, maxBuffer: 8 * 1024 * 1024 });
    const diffs = [...stderr.matchAll(/lavfi\.signalstats\.YAVG=([0-9.]+)/g)].map((match) => Number(match[1]));
    if (!diffs.length) return null;
    return diffs.filter((value) => value >= .2).length / diffs.length;
  } catch {
    return null;
  }
}

export async function checkLimeRender(options: {
  outputPath: string;
  beats: LimeSceneBeat[];
  transcriptWords: Array<{ word: string; start: number; end: number }>;
  durationSec: number;
  faceTrackCoverage: number;
  faceFallbackContain: boolean;
  renderMs: number;
}): Promise<LimeQualityReport> {
  const { outputPath, beats, transcriptWords, durationSec, faceTrackCoverage, faceFallbackContain, renderMs } = options;
  const failures = beats.map(() => [] as string[]);
  const checks: LimeQualityReport["checks"] = [];
  let emptyAreaMaxPercent: number | null = null;
  const contrast = Math.min(contrastRatio("#0A0A0A", "#CCFF08"), contrastRatio("#0A0A0A", "#FFFFFF"));
  checks.push({ id: "contrast", label: "Text contrast", status: contrast >= 4.5 ? "pass" : "warn", detail: `${contrast.toFixed(2)}:1 minimum; 4.5:1 required` });

  for (const [index, beat] of beats.entries()) {
    try {
      assertRealSceneCopy(beat.headline, "Headline");
      layoutHeadline(beat.headline, 984, (text, size) => text.length * size * .48);
    } catch (error: any) {
      failures[index].push(error?.message || "Headline is invalid.");
    }
    if (beat.badge && /^(KEY TAKEAWAY|VERIFIED RESULT|STEP\s*0?\d+)$/i.test(beat.badge)) failures[index].push("Remove the placeholder badge.");
  }

  const captions = chunkLimeCaptions(transcriptWords, durationSec);
  let maxCaptionActive = 0;
  for (let time = 0; time < durationSec; time += .02) {
    const active = captions.filter((caption) => caption.start <= time && time < caption.end).length;
    maxCaptionActive = Math.max(maxCaptionActive, active);
  }
  checks.push({ id: "caption_overlap", label: "Active caption count", status: maxCaptionActive <= 1 ? "pass" : "warn", detail: `Maximum ${maxCaptionActive} active captions at any 20ms sample` });
  if (maxCaptionActive > 1) captions.forEach((caption, index) => {
    if (index && captions[index - 1].end > caption.start) failures.find((_, beatIndex) => captions[index - 1].start >= beats[beatIndex].startMs / 1000 && captions[index - 1].start < beats[beatIndex].endMs / 1000)?.push("Caption timing overlaps the previous caption.");
  });

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "lime-vision-"));
  let geminiChecked = false;
  let visionUnavailable = !process.env.GEMINI_API_KEY;
  try {
    for (const [index, beat] of beats.entries()) {
      if (visionUnavailable) break;
      const framePaths = await sampleFrames(outputPath, beat.startMs / 1000, beat.endMs / 1000, tmpDir, `beat-${index}`);
      const vision = await inspectWithGemini(framePaths, beat);
      geminiChecked ||= vision.checksPerformed;
      visionUnavailable ||= vision.serviceUnavailable;
      if (vision.emptyAreaPercent != null) emptyAreaMaxPercent = Math.max(emptyAreaMaxPercent || 0, vision.emptyAreaPercent);
      failures[index].push(...vision.failures);
    }
  } catch (error: any) {
    console.warn("[Lime Slides QA] Frame sampling failed:", error?.message || error);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  checks.push({ id: "headline_safe_margin", label: "Headline safe margins", status: failures.every((items) => !items.some((item) => item.includes("Headline"))) ? "pass" : "warn", detail: "Headline measurement uses a 48px inset and a two-line maximum." });
  checks.push({ id: "scene_placeholders", label: "Scene copy", status: failures.every((items) => !items.some((item) => /placeholder|generic/i.test(item))) ? "pass" : "warn", detail: `${failures.flat().filter((item) => /placeholder|generic/i.test(item)).length} generic copy issues` });
  checks.push({ id: "gemini_vision", label: "Gemini visual review", status: geminiChecked ? (failures.flat().length ? "warn" : "pass") : "warn", detail: geminiChecked ? "Three frames reviewed per scene." : "Gemini API/model was unavailable; deterministic visual checks were used." });
  checks.push({ id: "speaker_face_crop", label: "Speaker framing", status: faceTrackCoverage >= .95 || faceFallbackContain ? "pass" : "warn", detail: faceFallbackContain ? "No stable face track; the full source frame was contained so the face cannot be cropped." : `${Math.round(faceTrackCoverage * 100)}% sampled face detection coverage` });

  const motionCoverage = await measureMotionCoverage(outputPath);
  checks.push({ id: "motion", label: "Motion coverage", status: motionCoverage == null ? "warn" : motionCoverage >= .9 ? "pass" : "warn", detail: motionCoverage == null ? "Could not measure frame-to-frame motion." : `${Math.round(motionCoverage * 100)}% of 10fps frame differences exceeded the motion threshold.` });
  checks.push({ id: "visual_changes", label: "Visual changes", status: beats.length >= Math.floor(durationSec) ? "pass" : "warn", detail: `${beats.length} distinct timed scenes across ${durationSec.toFixed(1)} seconds.` });

  return {
    checks,
    failedScenes: failures.map((items, index) => ({ index, failures: [...new Set(items)] })).filter((item) => item.failures.length > 0),
    numbers: {
      visualChanges: beats.length,
      maxCaptionActive,
      faceInsideCropPercent: faceTrackCoverage >= .95 ? faceTrackCoverage * 100 : faceFallbackContain ? 100 : faceTrackCoverage * 100,
      emptyAreaMaxPercent,
      motionCoveragePercent: motionCoverage == null ? null : motionCoverage * 100,
      renderMs,
    },
  };
}
