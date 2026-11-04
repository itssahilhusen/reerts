import fs from "fs";
import path from "path";

function resolveInstallerPath(packageName: string): string | null {
  try {
    const installer = require(packageName);
    return installer?.path && fs.existsSync(installer.path) ? installer.path : null;
  } catch {
    return null;
  }
}

export function getFfmpegPath(): string {
  const installed = resolveInstallerPath("@ffmpeg-installer/ffmpeg");
  if (installed) return installed;
  if (process.platform === "win32") {
    const candidates = [
      path.join(process.cwd(), "bin", "ffmpeg.exe"),
      path.join(process.cwd(), "apps", "frontend", "bin", "ffmpeg.exe"),
    ];
    const local = candidates.find((candidate) => fs.existsSync(candidate));
    if (local) return local;
  }
  return "ffmpeg";
}

export function getFfprobePath(): string {
  const installed = resolveInstallerPath("@ffprobe-installer/ffprobe");
  if (installed) return installed;
  if (process.platform === "win32") {
    const candidates = [
      path.join(process.cwd(), "bin", "ffprobe.exe"),
      path.join(process.cwd(), "apps", "frontend", "bin", "ffprobe.exe"),
    ];
    const local = candidates.find((candidate) => fs.existsSync(candidate));
    if (local) return local;
  }
  return "ffprobe";
}
