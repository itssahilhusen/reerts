import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const competitors = await prisma.competitor.findMany({
      where: { workspaceId: workspace.id },
      include: {
        posts: {
          orderBy: { likes: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json({ competitors });
  } catch (err: any) {
    console.error("GET /api/spy error:", err);
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
    const { platform = "threads", handle, name } = body;

    if (!handle) {
      return NextResponse.json({ error: "Handle is required" }, { status: 400 });
    }

    const cleanHandle = handle.startsWith("@") ? handle : `@${handle}`;
    const compName = name || handle.replace("@", "");

    const newComp = await prisma.competitor.create({
      data: {
        workspaceId: workspace.id,
        platform,
        handle: cleanHandle,
        name: compName,
        followers: Math.floor(Math.random() * 40000) + 12000,
        growthRate: `+${(Math.random() * 15 + 2).toFixed(1)}%`,
        posts: {
          create: [
            {
              content: `Most people overcomplicate ${compName}'s niche. The real hack is consistent 80/20 execution.`,
              likes: Math.floor(Math.random() * 800) + 200,
              replies: Math.floor(Math.random() * 90) + 20,
              shares: Math.floor(Math.random() * 50) + 10,
            },
            {
              content: `If you want to scale to 100k views, stop chasing algorithms and focus on retention on the first 3 lines.`,
              likes: Math.floor(Math.random() * 1500) + 400,
              replies: Math.floor(Math.random() * 140) + 35,
              shares: Math.floor(Math.random() * 120) + 25,
            },
          ],
        },
      },
      include: {
        posts: true,
      },
    });

    return NextResponse.json({ competitor: newComp });
  } catch (err: any) {
    console.error("POST /api/spy error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
