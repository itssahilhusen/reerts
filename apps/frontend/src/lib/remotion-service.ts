import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import type { ReelProps } from "@/remotion/types";
import { AuteurEditPlan } from "./gemini-video-pipeline";

export interface RenderRemotionOptions {
  projectId: string;
  videoRelPath: string;
  styleId: string;
  plan?: AuteurEditPlan;
  durationSec?: number;
  captionWords?: Array<{ word: string; start: number; end: number }>;
}

/**
 * Universal video renderer supporting all 56 Makerzz styles:
 * - Runs Remotion via isolated worker process (zero Webpack conflicts)
 * - Dynamically picks archetype: split-bottom, pip-corner, full-bleed, frame-bento, split-duo, split-phone
 * - Applies exact palette tokens and font styling
 * - Synchronizes word-by-word karaoke / slap captions
 * - Renders to 1080x1920 MP4 locally without third-party API credits
 */
export async function renderWithUniversalRemotion(
  options: RenderRemotionOptions
): Promise<string> {
  const { projectId, videoRelPath, styleId, plan, durationSec = 30, captionWords } = options;

  const filename = path.basename(videoRelPath);
  const publicDir = fs.existsSync(path.join(process.cwd(), "apps", "frontend", "public"))
    ? path.join(process.cwd(), "apps", "frontend", "public")
    : path.join(process.cwd(), "public");

  const outputDir = path.join(publicDir, "uploads", "videos");
  fs.mkdirSync(outputDir, { recursive: true });

  const outputFilename = `rendered_${projectId}.mp4`;
  const outputPath = path.join(outputDir, outputFilename);

  const clampedDuration = Math.min(Math.max(durationSec, 5), 60);

  // Web-relative path from public folder
  const webRelativePath = `/uploads/videos/${filename}`;

  const reelProps: ReelProps = {
    videoSrc: webRelativePath,
    durationInSeconds: clampedDuration,
    styleId: styleId || "cap-paper",
    headline: (plan?.headline || "VIRAL REEL").slice(0, 32),
    subAccent: (plan?.subAccent || "WATCH TILL END").slice(0, 28),
    metricLabel: plan?.metricLabel || "views this week",
    metricCount: plan?.metricCount || 84200,
    steps: (plan?.steps && plan.steps.length === 3
      ? plan.steps
      : ["Hook", "Deliver", "Action"]) as [string, string, string],
    captionWords: captionWords || [],
  };

  // Write temporary props JSON file for the worker
  const tempPropsFile = path.join(outputDir, `props_${projectId}.json`);
  fs.writeFileSync(tempPropsFile, JSON.stringify(reelProps, null, 2), "utf8");

  const workerScript = path.join(
    fs.existsSync(path.join(process.cwd(), "apps", "frontend", "scripts", "run-remotion-render.mjs"))
      ? path.join(process.cwd(), "apps", "frontend", "scripts", "run-remotion-render.mjs")
      : path.join(process.cwd(), "scripts", "run-remotion-render.mjs")
  );

  return new Promise((resolve, reject) => {
    console.log(`[Remotion Service] Spawning render worker for style "${styleId}"...`);
    const child = spawn(
      process.execPath,
      [workerScript, "--props-file", tempPropsFile, "--output", outputPath],
      {
        cwd: fs.existsSync(path.join(process.cwd(), "apps", "frontend"))
          ? path.join(process.cwd(), "apps", "frontend")
          : process.cwd(),
        stdio: "inherit",
      }
    );

    child.on("close", (code) => {
      // Clean up temporary props file
      try {
        if (fs.existsSync(tempPropsFile)) fs.unlinkSync(tempPropsFile);
      } catch {}

      if (code === 0 && fs.existsSync(outputPath)) {
        console.log(`[Remotion Service] Render succeeded: ${outputPath}`);
        resolve(`/uploads/videos/${outputFilename}`);
      } else {
        reject(new Error(`Remotion worker exited with code ${code}`));
      }
    });

    child.on("error", (err) => {
      try {
        if (fs.existsSync(tempPropsFile)) fs.unlinkSync(tempPropsFile);
      } catch {}
      reject(err);
    });
  });
}
