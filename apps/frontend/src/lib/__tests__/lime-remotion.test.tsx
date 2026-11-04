import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
import { getLimeWipeState } from "../lime-remotion/LimeScene";
import { renderLimeSceneClips } from "../lime-remotion/render-scenes";
import { getFfmpegPath } from "../media-tool-paths";

const execFileAsync = promisify(execFile);

describe("Lime Slides wipe", () => {
  it("fully clears both wipe bars after frame 8", () => {
    for (let frame = 8; frame < 45; frame++) {
      const state = getLimeWipeState(frame);
      assert.equal(state.opacity, 0, `wipe bars must be invisible at frame ${frame}`);
      assert.ok(state.x > 1080 + 2160 * Math.tan(18 * Math.PI / 180));
    }
  });

  it("keeps the slash moving during the first eight frames", () => {
    const positions = Array.from({ length: 8 }, (_, frame) => getLimeWipeState(frame).x);
    assert.ok(positions.every((position, index) => index === 0 || position > positions[index - 1]));
    assert.ok(positions[7] > 1080);
  });

  it("renders frame 8 without black or white wipe pixels in the right edge strip", async () => {
    const result = await renderLimeSceneClips([{
      sceneType: "HALO_SPEAKER",
      speakerMode: "halo",
      headline: "FRAME EDGE",
      illustration: "phone",
      illustrationProps: {},
      emphasisWords: [],
      start: 0,
      end: 0.4,
      durationInFrames: 12,
    }], "wipe-pixel-test");
    try {
      const { stdout } = await execFileAsync(getFfmpegPath(), [
        "-v", "error", "-i", result.clips[0].path,
        "-vf", "select=eq(n\\,8),crop=20:1920:1060:0",
        "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgba", "-",
      ], { encoding: "buffer", maxBuffer: 1024 * 1024, timeout: 30_000 } as any);
      const pixels = stdout as unknown as Buffer;
      assert.equal(pixels.length, 20 * 1920 * 4);
      let offendingPixels = 0;
      for (let offset = 0; offset < pixels.length; offset += 4) {
        if (pixels[offset + 3] === 0) continue;
        const isBlack = pixels[offset] < 24 && pixels[offset + 1] < 24 && pixels[offset + 2] < 24;
        const isWhite = pixels[offset] > 245 && pixels[offset + 1] > 245 && pixels[offset + 2] > 245;
        if (isBlack || isWhite) offendingPixels++;
      }
      assert.equal(offendingPixels, 0, "frame 8 must not retain the black or white wipe bars at x > 1060");
    } finally {
      fs.rmSync(result.directory, { recursive: true, force: true });
    }
  });
});
