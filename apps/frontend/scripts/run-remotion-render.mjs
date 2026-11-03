import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  let propsFile = null;
  let outputFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--props-file" && args[i + 1]) {
      propsFile = args[i + 1];
    } else if (args[i] === "--output" && args[i + 1]) {
      outputFile = args[i + 1];
    }
  }

  if (!propsFile || !outputFile) {
    console.error("Usage: node run-remotion-render.mjs --props-file <path> --output <path>");
    process.exit(1);
  }

  const props = JSON.parse(fs.readFileSync(propsFile, "utf8"));
  const projectRoot = path.resolve(__dirname, "..");
  const entryPoint = path.join(projectRoot, "src", "remotion", "index.ts");
  const publicDir = path.join(projectRoot, "public");

  console.log(`[Remotion Worker] Bundling composition for style "${props.styleId}"...`);
  const bundleLocation = await bundle({
    entryPoint,
    publicDir,
  });

  const durationSec = Math.min(Math.max(props.durationInSeconds || 30, 5), 60);
  const fps = 30;
  const totalFrames = Math.round(durationSec * fps);

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "UniversalStudio",
    inputProps: props,
  });

  console.log(`[Remotion Worker] Rendering ${totalFrames} frames to ${outputFile}...`);
  await renderMedia({
    composition: {
      ...composition,
      durationInFrames: totalFrames,
    },
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputFile,
    inputProps: props,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct % 25 === 0) {
        console.log(`[Remotion Worker] Render: ${pct}%`);
      }
    },
  });

  console.log("[Remotion Worker] Render completed successfully!");
}

main().catch((err) => {
  console.error("[Remotion Worker] Fatal render error:", err);
  process.exit(1);
});
