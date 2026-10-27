import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const ideas = await prisma.idea.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
    });

    const parsed = ideas.map((item) => ({
      ...item,
      tags: JSON.parse(item.tags || "[]"),
    }));

    return NextResponse.json({ ideas: parsed });
  } catch (err: any) {
    console.error("GET /api/ideas error:", err);
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
    const { title, excerpt, sourceType, viralityScore, tags } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newIdea = await prisma.idea.create({
      data: {
        workspaceId: workspace.id,
        title,
        excerpt: excerpt || "",
        sourceType: sourceType || "AI Engine",
        viralityScore: viralityScore || 95,
        tags: JSON.stringify(tags || ["Strategy"]),
      },
    });

    return NextResponse.json({
      idea: {
        ...newIdea,
        tags: JSON.parse(newIdea.tags),
      },
    });
  } catch (err: any) {
    console.error("POST /api/ideas error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
