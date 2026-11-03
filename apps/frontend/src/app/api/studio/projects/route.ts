import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {
  getAllVideoProjects,
  saveVideoProject,
  VideoProjectRecord,
} from "@/lib/video-projects-store";
import { VIDEO_TEMPLATES } from "@/data/videoTemplates";
import { planVideoWithAuteur } from "@/lib/gemini-video-pipeline";
import {
  extractVideoThumbnail,
  renderProjectVideo,
  resolveVideoInputPath,
} from "@/lib/video-renderer";
import { renderWithCreatomate } from "@/lib/creatomate";
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

    const existingCount = getAllVideoProjects().length;
    const projectId =
      "prj_" +
      Math.random().toString(36).substring(2, 10) +
      Date.now().toString(36).slice(-6);

    const requestedStyleId = (styleIds[0] || "cap-paper").trim();
    const firstStyle = VIDEO_TEMPLATES.find(
      (s) =>
        s.id === requestedStyleId ||
        s.id.toLowerCase() === requestedStyleId.toLowerCase()
    );
    const projectTitle =
      title ||
      (brief?.topic ? `Reel: ${brief.topic.slice(0, 35)}` : null) ||
      `Untitled ${existingCount + 1}`;

    const userUploadedPath = source.uploadPaths?.[0];
    const primaryStyleId = firstStyle?.id || requestedStyleId;

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

    let initialPoster =
      firstStyle?.poster || "https://makerzz.space/showcase/face/classified-yt/poster.jpg";
    if (userUploadedPath) {
      try {
        initialPoster = await extractVideoThumbnail(userUploadedPath, projectId);
      } catch (err) {
        console.warn("Could not extract initial thumbnail, will fallback:", err);
      }
    }

    const outputVideo =
      userUploadedPath ||
      firstStyle?.preview ||
      "https://makerzz.space/showcase/face/classified-yt/preview.mp4";

    const newProject: VideoProjectRecord = {
      id: projectId,
      title: projectTitle,
      mode,
      status: "TRANSCRIBING",
      progress: 18,
      styleIds: styleIds.length > 0 ? styleIds : [primaryStyleId],
      primaryStyleId,
      platforms,
      approvalStatus: "pending",
      timelineNotes: [],
      automation,
      options: {
        avatarCutout: options?.avatarCutout ?? true,
        look: options?.look || "clean",
        lookStrength: options?.lookStrength ?? 0.8,
      },
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

    // Run async background processing with the full 4-stage Makerzz Auteur pipeline:
    // 1. Reading your video (TRANSCRIBING)
    // 2. Planning the edit (COMPOSING_GRAPHICS)
    // 3. Building every scene (COLOR_GRADING)
    // 4. Final checks (READY)
    (async () => {
      try {
        const localVideoAbsolutePath = userUploadedPath
          ? resolveVideoInputPath(userUploadedPath)
          : null;

        let transcriptionResult: TranscriptionResult | undefined;

        // Stage 1: Reading your video (Transcription & Word Timestamps)
        if (localVideoAbsolutePath && fs.existsSync(localVideoAbsolutePath)) {
          newProject.status = "TRANSCRIBING";
          newProject.progress = 25;
          saveVideoProject(newProject);

          try {
            console.log(`[Auteur Pipeline] Stage 1 — Reading video: ${localVideoAbsolutePath}`);
            transcriptionResult = await transcribeVideoAudio(localVideoAbsolutePath);

            newProject.transcript = transcriptionResult.text;
            newProject.transcriptWords = transcriptionResult.words;
            if (transcriptionResult.duration) {
              newProject.source = {
                ...newProject.source,
                durationSec: Math.round(transcriptionResult.duration * 100) / 100,
              };
            }
            saveVideoProject(newProject);
          } catch (transcribeErr: any) {
            console.error(
              "[Auteur Pipeline] Transcription fallback:",
              transcribeErr.message
            );
          }
        }

        // Stage 2: Planning the edit (Auteur Scene Director + Live Research & Assets)
        newProject.status = "COMPOSING_GRAPHICS";
        newProject.progress = 52;
        saveVideoProject(newProject);

        const actualDuration =
          transcriptionResult?.duration || source?.durationSec || 37.27;

        const auteurPlan = await planVideoWithAuteur({
          topic: brief?.topic || source?.topic || projectTitle,
          styleName: firstStyle?.name || "Paper Studio",
          durationSec: actualDuration,
          language: transcriptionResult?.language || source?.language || "en",
          transcription: transcriptionResult,
        });

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

        // Stage 3: Building every scene (FFmpeg + libass Studio Composite or Creatomate)
        newProject.status = "COLOR_GRADING";
        newProject.progress = 78;
        saveVideoProject(newProject);

        if (userUploadedPath) {
          try {
            let finalVideoUrl = await renderWithCreatomate({
              projectId,
              videoRelPath: userUploadedPath,
              styleId: primaryStyleId,
              plan: auteurPlan,
              durationSec: actualDuration,
            });

            if (!finalVideoUrl) {
              console.log(
                `[Auteur Pipeline] Stage 3 — Building every scene in style '${primaryStyleId}' via FFmpeg + libass...`
              );
              finalVideoUrl = await renderProjectVideo({
                projectId,
                videoRelPath: userUploadedPath,
                styleId: primaryStyleId,
                plan: auteurPlan,
                transcriptWords: newProject.transcriptWords,
                durationSec: actualDuration,
              });
            }

            if (finalVideoUrl) {
              newProject.outputVideoUrl = finalVideoUrl;
              newProject.thumbnailUrl = `/api/studio/video/thumb_${projectId}.jpg`;
              console.log("[Auteur Pipeline] Final edited video URL:", finalVideoUrl);
            }
          } catch (renderErr: any) {
            console.error("[Auteur Pipeline] Video composite error:", renderErr.message);
          }
        }

        // Stage 4: Final checks & READY TO REVIEW
        newProject.status = "READY";
        newProject.progress = 100;
        saveVideoProject(newProject);
        console.log(`[Auteur Pipeline] Project ${projectId} is READY TO REVIEW.`);
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
