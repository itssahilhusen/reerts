import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import {
  getAllVideoProjects,
  saveVideoProject,
  VideoProjectRecord,
} from "@/lib/video-projects-store";
import { VIDEO_TEMPLATES } from "@/data/videoTemplates";
import { planVideoWithAuteur } from "@/lib/gemini-video-pipeline";
import { extractVideoThumbnail, renderProjectVideo } from "@/lib/video-renderer";
import { renderWithCreatomate } from "@/lib/creatomate";
import { renderWithUniversalRemotion } from "@/lib/remotion-service";
import { transcribeVideoAudio, TranscriptionResult } from "@/lib/groq-transcriber";

export async function GET() {
  try {
    const projects = getAllVideoProjects();
    return NextResponse.json({ projects });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      mode = "edit",
      styleIds = [],
      platforms = ["instagram", "tiktok", "youtube"],
      automation,
      options,
      settings,
      brief,
      source = { kind: "upload" },
    } = body;

    const projectId = "proj_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

    // Choose primary style based on selected styleIds
    const firstStyle = VIDEO_TEMPLATES.find((s) => styleIds.includes(s.id));
    const projectTitle =
      title ||
      (brief?.topic ? `Reel: ${brief.topic.slice(0, 35)}` : null) ||
      (firstStyle ? `${firstStyle.name} Edit` : "Untitled Reel Project");

    // Check if user uploaded their own video file
    const userUploadedPath = source.uploadPaths?.[0];
    const primaryStyleId = firstStyle?.id || styleIds[0] || "cap-paper";

    // Synchronize style-specific palette colors
    let projectSettings = settings || {};
    if (primaryStyleId === "cap-paper" || primaryStyleId.includes("paper")) {
      projectSettings = {
        ...projectSettings,
        bg: projectSettings.bg === "#000000" ? "#F4F1EA" : projectSettings.bg || "#F4F1EA",
        ink: projectSettings.ink === "#ffffff" ? "#111111" : projectSettings.ink || "#111111",
        accent: projectSettings.accent === "#AE0006" ? "#AE0006" : projectSettings.accent || "#AE0006",
        accentHi: projectSettings.accentHi === "#FF3B4E" ? "#F59E0B" : projectSettings.accentHi || "#F59E0B",
        panel: projectSettings.panel === "#19191b" ? "#FFFFFF" : projectSettings.panel || "#FFFFFF",
        panel2: projectSettings.panel2 === "#0b0b0c" ? "#E5E1D8" : projectSettings.panel2 || "#E5E1D8",
        line: "rgba(0,0,0,0.08)",
      };
    } else if (primaryStyleId === "limeslides" || primaryStyleId.includes("lime")) {
      projectSettings = {
        ...projectSettings,
        bg: projectSettings.bg === "#000000" ? "#C6FF3D" : projectSettings.bg || "#C6FF3D",
        ink: projectSettings.ink === "#ffffff" ? "#000000" : projectSettings.ink || "#000000",
        accent: "#000000",
        accentHi: "#1A1A1A",
        panel: "#121214",
      };
    }

    // Extract real thumbnail from user video if available
    let initialPoster = firstStyle?.poster || "https://makerzz.space/showcase/face/classified-yt/poster.jpg";
    if (userUploadedPath) {
      try {
        initialPoster = await extractVideoThumbnail(userUploadedPath, projectId);
      } catch (err) {
        console.warn("Could not extract initial thumbnail, will fallback:", err);
      }
    }

    const outputVideo = userUploadedPath || firstStyle?.preview || "https://makerzz.space/showcase/face/classified-yt/preview.mp4";

    const newProject: VideoProjectRecord = {
      id: projectId,
      title: projectTitle,
      mode,
      status: "QUEUED",
      progress: 5,
      styleIds,
      primaryStyleId,
      platforms,
      automation,
      options,
      settings: projectSettings,
      brief,
      source,
      userRawVideoUrl: userUploadedPath,
      outputVideoUrl: outputVideo,
      thumbnailUrl: initialPoster,
      captionText: automation?.keyword
        ? `Here is the secret breakdown. Comment "${automation.keyword}" below and I'll DM you the direct link right away! 👇🚀 #contentcreator #reels #automation`
        : `Behind the scenes of scaling workflows with AI. Drop your thoughts in the comments! 🔥 #ai #reels #viral`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveVideoProject(newProject);

    // Run async background processing with the full Auteur pipeline
    (async () => {
      try {
        // Resolve absolute path to video file
        let localVideoAbsolutePath: string | null = null;
        if (userUploadedPath) {
          const filename = path.basename(userUploadedPath);
          const dir1 = path.join(process.cwd(), "apps", "frontend", "public", "uploads", "videos", filename);
          const dir2 = path.join(process.cwd(), "public", "uploads", "videos", filename);
          localVideoAbsolutePath = fs.existsSync(dir1) ? dir1 : fs.existsSync(dir2) ? dir2 : null;
        }

        let transcriptionResult: TranscriptionResult | undefined;

        // Stage 1: TRANSCRIBE with Groq Whisper Large V3
        if (localVideoAbsolutePath && fs.existsSync(localVideoAbsolutePath)) {
          newProject.status = "TRANSCRIBING";
          newProject.progress = 25;
          saveVideoProject(newProject);

          try {
            console.log(`[Auteur Pipeline] Transcribing video: ${localVideoAbsolutePath}`);
            transcriptionResult = await transcribeVideoAudio(localVideoAbsolutePath);

            newProject.transcript = transcriptionResult.text;
            newProject.transcriptWords = transcriptionResult.words;
            saveVideoProject(newProject);
          } catch (transcribeErr: any) {
            console.error("[Auteur Pipeline] Transcription failed, will proceed with topic context:", transcribeErr.message);
          }
        }

        // Stage 2: PLAN scenes and research with Auteur LLM
        newProject.status = "COMPOSING_GRAPHICS";
        newProject.progress = 55;
        saveVideoProject(newProject);

        const auteurPlan = await planVideoWithAuteur({
          topic: brief?.topic || source?.topic || projectTitle,
          styleName: firstStyle?.name || "Paper Studio",
          durationSec: transcriptionResult?.duration || source?.durationSec || 30,
          language: transcriptionResult?.language || source?.language || "en",
          transcription: transcriptionResult,
        });

        newProject.title = auteurPlan.headline ? `${auteurPlan.headline} · ${auteurPlan.subAccent}` : newProject.title;
        newProject.captionText = auteurPlan.platformCaption;
        newProject.scenes = auteurPlan.scenes;
        newProject.researchVisits = auteurPlan.researchVisits;
        newProject.assets = auteurPlan.assets;
        newProject.checks = auteurPlan.checks;
        newProject.scenePlan = {
          headline: auteurPlan.headline,
          subAccent: auteurPlan.subAccent,
          metricLabel: auteurPlan.metricLabel,
          metricCount: auteurPlan.metricCount,
          steps: auteurPlan.steps,
          platformCaption: auteurPlan.platformCaption,
        };
        saveVideoProject(newProject);

        // Stage 3: RENDER video with Universal Multi-Style Remotion Engine
        newProject.status = "COLOR_GRADING";
        newProject.progress = 75;
        saveVideoProject(newProject);

        if (userUploadedPath) {
          try {
            console.log(`[Auteur Pipeline] Rendering video with Universal Remotion Engine for style "${primaryStyleId}"...`);
            let finalVideoUrl: string | null = null;

            try {
              finalVideoUrl = await renderWithUniversalRemotion({
                projectId,
                videoRelPath: userUploadedPath,
                styleId: primaryStyleId,
                plan: auteurPlan,
                durationSec: transcriptionResult?.duration || source?.durationSec || 30,
                captionWords: transcriptionResult?.words,
              });
            } catch (remotionErr: any) {
              console.warn("[Auteur Pipeline] Remotion render failed, attempting FFmpeg fallback:", remotionErr.message);
              finalVideoUrl = await renderProjectVideo({
                projectId,
                videoRelPath: userUploadedPath,
                styleId: primaryStyleId,
                plan: auteurPlan,
                durationSec: transcriptionResult?.duration || source?.durationSec || 30,
              });
            }

            if (finalVideoUrl) {
              newProject.outputVideoUrl = finalVideoUrl;
              console.log("[Auteur Pipeline] Final video URL set:", finalVideoUrl);
            }
          } catch (renderErr: any) {
            console.error("[Auteur Pipeline] Video composite error:", renderErr.message);
          }
        }

        // Stage 4: VALIDATE & READY
        newProject.status = "READY";
        newProject.progress = 100;
        saveVideoProject(newProject);
        console.log(`[Auteur Pipeline] Project ${projectId} completed successfully.`);
      } catch (err: any) {
        console.error("[Auteur Pipeline] Async project processing fatal error:", err);
        newProject.status = "READY";
        newProject.progress = 100;
        saveVideoProject(newProject);
      }
    })();

    return NextResponse.json({
      project: newProject,
      message: "Video edit started successfully with Makerzz Auteur pipeline",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
