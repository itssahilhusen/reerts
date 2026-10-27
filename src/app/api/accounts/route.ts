import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const accounts = await prisma.socialAccount.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
    });

    const parsed = accounts.map((a) => ({
      ...a,
      metadata: JSON.parse(a.metadata || "{}"),
    }));

    return NextResponse.json({ accounts: parsed });
  } catch (err: any) {
    console.error("GET /api/accounts error:", err);
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
    const { provider, name, handle, avatar, status } = body;

    if (!provider || !handle) {
      return NextResponse.json({ error: "Provider and handle are required" }, { status: 400 });
    }

    const account = await prisma.socialAccount.upsert({
      where: {
        workspaceId_provider_handle: {
          workspaceId: workspace.id,
          provider,
          handle,
        },
      },
      update: {
        name: name || handle,
        avatar: avatar || null,
        status: status || "active",
      },
      create: {
        workspaceId: workspace.id,
        provider,
        name: name || handle,
        handle,
        avatar: avatar || null,
        status: status || "active",
      },
    });

    return NextResponse.json({
      account: {
        ...account,
        metadata: JSON.parse(account.metadata || "{}"),
      },
    });
  } catch (err: any) {
    console.error("POST /api/accounts error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.socialAccount.deleteMany({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/accounts error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
