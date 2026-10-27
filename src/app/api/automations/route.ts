import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const automations = await prisma.automation.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
    });

    const parsed = automations.map((a) => ({
      ...a,
      replyVariants: JSON.parse(a.replyVariants || "[]"),
    }));

    return NextResponse.json({ automations: parsed });
  } catch (err: any) {
    console.error("GET /api/automations error:", err);
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
    const {
      name,
      triggerType,
      keywords,
      actionType,
      dmContent,
      buttonLabel,
      buttonUrl,
      replyVariants,
      requireFollow,
      followGateText,
      captureEmail,
      emailGateText,
      active,
    } = body;

    const newAuto = await prisma.automation.create({
      data: {
        workspaceId: workspace.id,
        name: name || "Lead DM Campaign",
        triggerType: triggerType || "comment",
        keywords: keywords || "All DMs",
        actionType: actionType || "dm",
        dmContent: dmContent || "Hey {{username}}! Thanks for reaching out.",
        buttonLabel: buttonLabel || "Open Link",
        buttonUrl: buttonUrl || "https://reerts.in",
        replyVariants: JSON.stringify(replyVariants || ["Sent you a DM!"]),
        requireFollow: Boolean(requireFollow),
        followGateText: followGateText || null,
        captureEmail: Boolean(captureEmail),
        emailGateText: emailGateText || null,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json({
      automation: {
        ...newAuto,
        replyVariants: JSON.parse(newAuto.replyVariants),
      },
    });
  } catch (err: any) {
    console.error("POST /api/automations error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
