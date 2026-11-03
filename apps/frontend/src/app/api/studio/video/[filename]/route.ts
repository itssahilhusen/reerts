import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { resolveVideoInputPath } from "@/lib/video-renderer";

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } | Promise<{ filename: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const rawFilename = decodeURIComponent(resolvedParams.filename || "");
    const safeFilename = path.basename(rawFilename);

    const filePath = resolveVideoInputPath(safeFilename);
    if (!filePath || !fs.existsSync(filePath)) {
      return new NextResponse("Media file not found", { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    if (safeFilename.endsWith(".jpg") || safeFilename.endsWith(".jpeg") || safeFilename.endsWith(".png")) {
      const imgBuffer = fs.readFileSync(filePath);
      return new NextResponse(imgBuffer, {
        status: 200,
        headers: {
          "Content-Type": safeFilename.endsWith(".png") ? "image/png" : "image/jpeg",
          "Content-Length": String(fileSize),
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    const isDownload = req.nextUrl.searchParams.get("download") === "1";
    const downloadName =
      req.nextUrl.searchParams.get("name") || safeFilename;

    const rangeHeader = req.headers.get("range");

    // Handle HTTP Range requests (keeps chunks well below Cloud Run 32MB limit)
    if (rangeHeader && !isDownload) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      // Cap chunk size to 4MB so Cloud Run proxy never drops large video chunks
      const maxChunk = 4 * 1024 * 1024;
      const requestedEnd = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const end = Math.min(requestedEnd, start + maxChunk - 1, fileSize - 1);

      if (start >= fileSize || start < 0) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const buffer = Buffer.alloc(chunkSize);
      const fd = fs.openSync(filePath, "r");
      try {
        fs.readSync(fd, buffer, 0, chunkSize, start);
      } finally {
        fs.closeSync(fd);
      }

      return new NextResponse(buffer, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Content-Type": "video/mp4",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Full file response (for download or non-range request)
    const fileBuffer = fs.readFileSync(filePath);
    const headers: Record<string, string> = {
      "Content-Type": "video/mp4",
      "Content-Length": String(fileSize),
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache",
    };

    if (isDownload) {
      const cleanDownloadName = downloadName.replace(/[^a-zA-Z0-9._-]/g, "_");
      headers["Content-Disposition"] = `attachment; filename="${
        cleanDownloadName.endsWith(".mp4")
          ? cleanDownloadName
          : `${cleanDownloadName}.mp4`
      }"`;
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error("[Video Stream API] Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
