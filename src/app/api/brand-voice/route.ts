import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    let voice = await prisma.brandVoice.findFirst({
      where: { workspaceId: workspace.id, isDefault: true },
    });

    if (!voice) {
      voice = await prisma.brandVoice.create({
        data: {
          workspaceId: workspace.id,
          name: "Alex Rivers - AI Tech Founder",
          formality: 30,
          directness: 85,
          humor: 45,
          targetAudience: "Founders, creators, and engineers looking to scale.",
          bannedWords: "delve, tapestry, synergy, revolutionize, unleash",
          isDefault: true,
        },
      });
    }

    return NextResponse.json({ brandVoice: voice });
  } catch (err: any) {
    console.error("GET /api/brand-voice error:", err);
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
    const { name, formality, directness, humor, targetAudience, bannedWords } = body;

    const voice = await prisma.brandVoice.findFirst({
      where: { workspaceId: workspace.id, isDefault: true },
    });

    let updated;
    if (voice) {
      updated = await prisma.brandVoice.update({
        where: { id: voice.id },
        data: {
          name: name ?? voice.name,
          formality: formality ?? voice.formality,
          directness: directness ?? voice.directness,
          humor: humor ?? voice.humor,
          targetAudience: targetAudience ?? voice.targetAudience,
          bannedWords: bannedWords ?? voice.bannedWords,
        },
      });
    } else {
      updated = await prisma.brandVoice.create({
        data: {
          workspaceId: workspace.id,
          name: name || "Default Brand Voice",
          formality: formality ?? 30,
          directness: directness ?? 85,
          humor: humor ?? 45,
          targetAudience: targetAudience || "",
          bannedWords: bannedWords || "",
          isDefault: true,
        },
      });
    }

    return NextResponse.json({ brandVoice: updated });
  } catch (err: any) {
    console.error("POST /api/brand-voice error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
