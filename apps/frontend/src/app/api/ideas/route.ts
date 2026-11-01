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
    console.warn("GET /api/ideas falling back to mock data:", err.message);
    const mockIdeas = [
      {
        id: "idea_sample_1",
        title: "Why developers are abandoning bloated cloud microservices for single binaries",
        excerpt: "An analysis of deployment velocity, cost reduction, and architecture simplification trends in 2026.",
        sourceType: "AI Engine",
        viralityScore: 98,
        tags: ["Architecture", "Engineering", "BuildInPublic"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "idea_sample_2",
        title: "The $0 to $50k MRR Playbook: Why PLG is beating outbound sales",
        excerpt: "Breaking down how self-serve activation loops drive lower CAC and higher LTV for modern developer tools.",
        sourceType: "X Viral",
        viralityScore: 92,
        tags: ["Growth", "SaaS", "Strategy"],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
    return NextResponse.json({ ideas: mockIdeas });
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
