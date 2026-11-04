import { NextRequest, NextResponse } from "next/server";
import {
  getVideoProjectById,
  saveVideoProject,
  deleteVideoProject,
} from "@/lib/video-projects-store";
import { renderProjectVideo } from "@/lib/video-renderer";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);
    const project = getVideoProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);
    const project = getVideoProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await req.json();

    if (typeof body.title === "string" && body.title.trim()) {
      project.title = body.title.trim();
    }

    if (body.approvalStatus) {
      project.approvalStatus = body.approvalStatus;
    }

    if (body.styleId && typeof body.styleId === "string") {
      project.primaryStyleId = body.styleId;
      project.styleIds = [body.styleId];
    }

    if (Array.isArray(body.scenes)) {
      project.scenes = body.scenes;
      if (body.scenes[0] && project.scenePlan) {
        project.scenePlan.headline = body.scenes[0].headline || project.scenePlan.headline;
        project.scenePlan.subAccent = body.scenes[0].subAccent || project.scenePlan.subAccent;
      }
    }

    if (body.timelineNote && typeof body.timelineNote.note === "string") {
      const notes = project.timelineNotes || [];
      notes.push({
        id: "note_" + Date.now().toString(36),
        timestampSec: Number(body.timelineNote.timestampSec || 0),
        note: body.timelineNote.note.trim(),
        createdAt: new Date().toISOString(),
      });
      project.timelineNotes = notes;
    }

    saveVideoProject(project);

    // If caller requested re-rendering scenes or style change
    if (body.reRender && project.userRawVideoUrl) {
      project.status = "COLOR_GRADING";
      project.progress = 72;
      delete project.errorMessage;
      if (typeof body.avatarCutout === "boolean") {
        project.options = { ...project.options, avatarCutout: body.avatarCutout };
      }
      saveVideoProject(project);

      try {
        const topH1 = project.scenePlan?.headline || project.scenes?.[0]?.headline || project.title?.toUpperCase() || "KEY INSIGHT";
        const topH2 = project.scenePlan?.subAccent || project.scenes?.[0]?.subAccent || "THE BREAKDOWN";

        const renderedUrl = await renderProjectVideo({
          projectId: project.id,
          videoRelPath: project.userRawVideoUrl,
          styleId: project.primaryStyleId || project.styleIds?.[0] || "cap-paper",
          plan: {
            headline: topH1,
            subAccent: topH2,
            metricLabel: project.scenePlan?.metricLabel || "verified insights",
            metricCount: project.scenePlan?.metricCount || 3,
            steps: project.scenePlan?.steps || [
              `01 / ${project.scenes?.[0]?.headline || "Hook"}`,
              `02 / ${project.scenes?.[1]?.headline || "Insight"}`,
              `03 / ${project.scenes?.[2]?.headline || "Takeaway"}`,
            ],
            platformCaption: project.captionText || "",
            scenes: (project.scenes as any) || [],
            researchVisits: (project.researchVisits as any) || [],
            assets: (project.assets as any) || [],
            checks: (project.checks as any) || [],
            cadenceWordsPerMin: 145,
            limeBeats: project.limeBeats,
          },
          transcriptWords: project.transcriptWords,
          durationSec: project.source?.durationSec || 37.27,
          avatarCutout: project.options?.avatarCutout,
        });
        project.outputVideoUrl = renderedUrl;
        project.thumbnailUrl = `/api/studio/video/thumb_${project.id}.jpg?t=${Date.now()}`;
        project.status = "READY";
        project.progress = 100;
        saveVideoProject(project);
      } catch (e: any) {
        console.error("Re-render failed:", e.message);
        project.status = "FAILED";
        project.progress = 100;
        project.errorMessage = e?.message || "Video render failed.";
        saveVideoProject(project);
        return NextResponse.json({ project, error: project.errorMessage }, { status: 500 });
      }
    }

    return NextResponse.json({ project });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);
    const ok = deleteVideoProject(id);
    if (!ok) {
      return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
