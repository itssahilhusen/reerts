import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const assets = await prisma.mediaAsset.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assets });
  } catch (err: any) {
    console.error("GET /api/media error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, url, mimeType, sizeBytes, folder } = body;

    if (!name || !url) {
      return NextResponse.json({ error: "Name and URL are required" }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        workspaceId: workspace.id,
        name,
        url,
        mimeType: mimeType || "image/png",
        sizeBytes: sizeBytes || 1024,
        folder: folder || "default",
      },
    });

    return NextResponse.json({ asset });
  } catch (err: any) {
    console.error("POST /api/media error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
