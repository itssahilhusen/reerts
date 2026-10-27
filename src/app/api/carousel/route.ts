import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const carousels = await prisma.carousel.findMany({
      where: { workspaceId: workspace.id },
      include: {
        slides: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ carousels });
  } catch (err: any) {
    console.error("GET /api/carousel error:", err);
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
    const { title, theme, aspectRatio, sourceUrl, slides } = body;

    const newCarousel = await prisma.carousel.create({
      data: {
        workspaceId: workspace.id,
        title: title || "Untitled Carousel",
        theme: theme || "dark",
        aspectRatio: aspectRatio || "4:5",
        sourceUrl: sourceUrl || null,
        slides: {
          create: (slides || []).map((s: any, idx: number) => ({
            order: s.order || idx + 1,
            slideType: s.slideType || "CONTENT",
            headline: s.headline || "",
            body: s.body || "",
            tag: s.tag || null,
            bgGradient: s.bgGradient || null,
            imageUrl: s.imageUrl || null,
          })),
        },
      },
      include: {
        slides: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ carousel: newCarousel });
  } catch (err: any) {
    console.error("POST /api/carousel error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
