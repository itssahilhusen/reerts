import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const uploadId = "upl_" + Math.random().toString(36).substring(2, 9);
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const savedFileName = `${uploadId}_${cleanName}`;

      const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(uploadDir, savedFileName);
      fs.writeFileSync(filePath, buffer);

      const publicPath = `/uploads/videos/${savedFileName}`;

      return NextResponse.json({
        upload: {
          id: uploadId,
          path: publicPath,
          filename: file.name,
          size: file.size,
          duration: 38.4,
          width: 1080,
          height: 1920,
        },
      });
    }

    // JSON upload request
    const body = await req.json().catch(() => ({}));
    const uploadId = "upl_" + Math.random().toString(36).substring(2, 9);
    return NextResponse.json({
      upload: {
        id: uploadId,
        path: body.path || `/uploads/videos/${uploadId}.mp4`,
        duration: body.duration || 45.0,
      },
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
