import fs from "fs";
import os from "os";
import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { LimeSceneProps } from "./LimeScene";

export interface TimedLimeScene extends LimeSceneProps {
  start: number;
  end: number;
}

export interface RenderedLimeScene {
  path: string;
  start: number;
  end: number;
  scene: TimedLimeScene;
}

async function runPool<T>(items: T[], concurrency: number, work: (item: T, index: number) => Promise<void>) {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await work(items[index], index);
    }
  });
  await Promise.all(workers);
}

export async function renderLimeSceneClips(
  scenes: TimedLimeScene[],
  projectId: string
): Promise<{ clips: RenderedLimeScene[]; directory: string; renderMs: number }> {
  const startedAt = Date.now();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), `lime-remotion-${projectId}-`));
  const entryPoint = path.join(process.cwd(), "apps", "frontend", "src", "lib", "lime-remotion", "Root.tsx");
  // Scene visuals are inline SVG. Avoid copying the app's upload-heavy public
  // directory into each temporary Remotion bundle.
  const publicDir = path.join(directory, "public");
  fs.mkdirSync(publicDir, { recursive: true });
  const serveUrl = await bundle({ entryPoint, outDir: path.join(directory, "bundle"), publicDir });
  const clips: RenderedLimeScene[] = new Array(scenes.length);

  try {
    await runPool(scenes, 2, async (scene, index) => {
      const durationInFrames = Math.max(1, Math.round((scene.end - scene.start) * 30));
      const inputProps: LimeSceneProps = { ...scene, durationInFrames };
      const composition = await selectComposition({ serveUrl, id: "LimeScene", inputProps: inputProps as any });
      const outputPath = path.join(directory, `scene-${String(index).padStart(3, "0")}.mov`);
      await renderMedia({
        composition,
        serveUrl,
        codec: "prores",
        pixelFormat: "yuva444p10le",
        proResProfile: "4444",
        outputLocation: outputPath,
        imageFormat: "png",
        inputProps: inputProps as any,
        concurrency: 2,
        chromiumOptions: { gl: "angle" },
        logLevel: "error",
      });
      clips[index] = { path: outputPath, start: scene.start, end: scene.end, scene };
    });
  } catch (error) {
    fs.rmSync(directory, { recursive: true, force: true });
    throw error;
  }

  const renderMs = Date.now() - startedAt;
  console.info(`[Lime Slides] Rendered ${clips.length} transparent Remotion scenes in ${(renderMs / 1000).toFixed(2)} s (2 parallel workers).`);
  return { clips, directory, renderMs };
}
