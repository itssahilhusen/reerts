import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AiEngine } from "@/lib/ai";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Fetch workspace
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const where: any = { workspaceId: workspace.id };
    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const parsed = posts.map((p) => ({
      ...p,
      rawThreads: JSON.parse(p.rawThreads || "[]"),
      mediaUrls: JSON.parse(p.mediaUrls || "[]"),
      platforms: JSON.parse(p.platforms || "[]"),
    }));

    return NextResponse.json({ posts: parsed });
  } catch (err: any) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, rawThreads, mediaUrls, platforms, status, scheduledAt } = body;

    if (!content && (!rawThreads || rawThreads.length === 0)) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const postTitle = title || (content ? content.slice(0, 40) + "..." : "Untitled Post");
    const targetPlatforms = platforms || ["x", "linkedin"];

    const newPost = await prisma.post.create({
      data: {
        workspaceId: workspace.id,
        title: postTitle,
        content: content || (rawThreads && rawThreads[0]?.content) || "",
        rawThreads: JSON.stringify(rawThreads || []),
        mediaUrls: JSON.stringify(mediaUrls || []),
        platforms: JSON.stringify(targetPlatforms),
        status: status || (scheduledAt ? "SCHEDULED" : "DRAFT"),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    // Create tailored variants for each platform
    for (const plat of targetPlatforms) {
      const tailored = AiEngine.tailorForPlatform(newPost.content, plat);
      await prisma.postVariant.create({
        data: {
          postId: newPost.id,
          platform: plat,
          tailoredText: tailored,
          status: newPost.status === "PUBLISHED" ? "PUBLISHED" : "PENDING",
          publishedAt: newPost.status === "PUBLISHED" ? new Date() : null,
        },
      });
    }

    const createdVariants = await prisma.postVariant.findMany({
      where: { postId: newPost.id },
    });

    return NextResponse.json({
      post: {
        ...newPost,
        rawThreads: JSON.parse(newPost.rawThreads),
        mediaUrls: JSON.parse(newPost.mediaUrls),
        platforms: JSON.parse(newPost.platforms),
        variants: createdVariants,
      },
    });
  } catch (err: any) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
