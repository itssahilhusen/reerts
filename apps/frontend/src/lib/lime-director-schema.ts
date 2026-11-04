import { z } from "zod";
import type { TranscriptionResult } from "./groq-transcriber";
import type { AuteurEditPlan, PlannedScene } from "./gemini-video-pipeline";

export const LIME_SCENE_TYPES = ["HALO_SPEAKER", "FULL_GRAPHIC", "SPLIT_SPEAKER", "SPEAKER_STICKER", "NUMBERED_STEP", "CTA"] as const;
export const LIME_ILLUSTRATIONS = ["phone", "carousel", "line_chart", "gear_diagram", "swatches", "calendar", "video_player", "editor_window", "primitive"] as const;
export const LIME_SPEAKER_MODES = ["halo", "split", "full", "hidden"] as const;

export const limeBeatSchema = z.object({
  startMs: z.number().int().nonnegative(),
  endMs: z.number().int().positive(),
  sceneType: z.enum(LIME_SCENE_TYPES),
  headline: z.string().trim().min(1).max(40).refine((text) => text === text.toUpperCase(), "Headline must be ALL CAPS.").refine((text) => text.split(/\s+/).length <= 3, "Headline must use at most three words."),
  badge: z.string().trim().max(28).optional(),
  illustration: z.enum(LIME_ILLUSTRATIONS),
  illustrationProps: z.record(z.unknown()).default({}),
  speakerMode: z.enum(LIME_SPEAKER_MODES),
  emphasisWords: z.array(z.string().trim().min(1)).max(4).default([]),
  assetIntent: z.string().trim().max(140).optional(),
}).refine((beat) => beat.endMs > beat.startMs, { message: "Beat endMs must be after startMs." });

export const limeDirectorSchema = z.object({
  beats: z.array(limeBeatSchema).min(1).max(160),
});

export type LimeSceneBeat = z.infer<typeof limeBeatSchema>;
export type LimeDirectorPlan = z.infer<typeof limeDirectorSchema>;
export type LimeAuteurEditPlan = AuteurEditPlan & { limeBeats?: LimeSceneBeat[] };

export function toAuteurEditPlan(plan: LimeDirectorPlan): LimeAuteurEditPlan {
  const scenes: PlannedScene[] = plan.beats.map((beat, index) => ({
    sceneId: `lime_beat_${index + 1}`,
    start: beat.startMs / 1000,
    end: beat.endMs / 1000,
    headline: beat.headline,
    subAccent: beat.badge || beat.headline,
    objective: beat.assetIntent || beat.illustration,
    visualType: beat.sceneType === "CTA" ? "cta"
      : beat.sceneType === "NUMBERED_STEP" ? "steps"
      : beat.sceneType === "FULL_GRAPHIC" ? "diagram"
      : "split-hook",
    badgeText: beat.badge,
    onScreenText: [beat.headline],
  }));
  const first = plan.beats[0];
  const headlines = plan.beats.map((beat) => beat.headline);
  return {
    headline: first?.headline || "MAKE BETTER CONTENT",
    subAccent: first?.badge || first?.headline || "MAKE BETTER CONTENT",
    metricLabel: "",
    metricCount: 0,
    steps: [headlines[0] || "", headlines[1] || "", headlines[2] || ""],
    platformCaption: "",
    scenes,
    researchVisits: [],
    assets: [],
    checks: [],
    cadenceWordsPerMin: 145,
    limeBeats: plan.beats,
  };
}

export function conceptHeadline(text: string): string {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  const conceptMap: Array<[RegExp, string]> = [
    [/conversation|talk|speak|say|chat|network/, "START BETTER CONVERSATIONS"],
    [/autom|workflow|agent|bot|process/, "AUTOMATE CREATOR WORKFLOWS"],
    [/grow|growth|revenue|sales|profit|scale/, "BUILD SUSTAINABLE GROWTH"],
    [/audience|follower|community|creator/, "BUILD A COMMUNITY"],
    [/design|color|colour|brand|visual/, "BUILD VISUAL BRANDS"],
    [/calendar|schedule|publish|post|consisten/, "PLAN CONTENT AHEAD"],
    [/video|edit|clip|reel|content/, "CREATE BETTER VIDEOS"],
    [/phone|mobile|app|screen/, "IMPROVE MOBILE EXPERIENCES"],
    [/email|newsletter|inbox/, "GROW THROUGH EMAIL"],
    [/money|cost|budget|price|spend/, "CONTROL CONTENT COSTS"],
    [/time|hour|minute|fast|quick/, "SAVE CREATION TIME"],
  ];
  return conceptMap.find(([pattern]) => pattern.test(normalized))?.[1]
    || "MAKE BETTER CONTENT";
}

export function illustrationForConcept(text: string): LimeSceneBeat["illustration"] {
  const value = text.toLowerCase();
  if (/conversation|talk|speak|say|chat|network|social/.test(value)) return "phone";
  if (/phone|mobile|app|social|heart|like/.test(value)) return "phone";
  if (/carousel|swipe|slide|story/.test(value)) return "carousel";
  if (/chart|grow|growth|increase|metric|revenue|sales/.test(value)) return "line_chart";
  if (/workflow|autom|process|system|tool/.test(value)) return "gear_diagram";
  if (/brand|color|colour|font|design|style/.test(value)) return "swatches";
  if (/calendar|schedule|date|publish/.test(value)) return "calendar";
  if (/video|edit|clip|reel/.test(value)) return "video_player";
  if (/error|mistake|avoid|bad|wrong/.test(value)) return "editor_window";
  return "primitive";
}

function wordAt(words: TranscriptionResult["words"], timeSec: number) {
  return words.find((word) => word.start <= timeSec && word.end >= timeSec)
    || words.reduce<typeof words[number] | undefined>((best, word) => !best || Math.abs(word.end - timeSec) < Math.abs(best.end - timeSec) ? word : best, undefined);
}

export function buildFallbackLimePlan(
  transcript: string,
  words: TranscriptionResult["words"],
  durationSec: number
): LimeDirectorPlan {
  const totalMs = Math.max(800, Math.round(durationSec * 1000));
  const beats: LimeSceneBeat[] = [];
  const layoutCycle: LimeSceneBeat["sceneType"][] = ["HALO_SPEAKER", "FULL_GRAPHIC", "SPLIT_SPEAKER", "FULL_GRAPHIC", "SPEAKER_STICKER", "NUMBERED_STEP"];
  for (let startMs = 0, index = 0; startMs < totalMs; index++) {
    const nextTarget = Math.min(totalMs, startMs + 1000);
    const nearest = words.filter((word) => word.end * 1000 >= startMs + 700 && word.end * 1000 <= startMs + 1300)
      .reduce<typeof words[number] | undefined>((best, word) => !best || Math.abs(word.end * 1000 - nextTarget) < Math.abs(best.end * 1000 - nextTarget) ? word : best, undefined);
    const endMs = index === Math.ceil(totalMs / 1000) - 1 ? totalMs : Math.max(startMs + 800, Math.min(totalMs, Math.round((nearest?.end || nextTarget / 1000) * 1000)));
    const context = words.filter((word) => word.start * 1000 < endMs && word.end * 1000 > startMs).map((word) => word.word).join(" ") || transcript;
    const sceneType = endMs >= totalMs ? "CTA" : layoutCycle[index % layoutCycle.length];
    const localHeadline = conceptHeadline(context);
    const localIllustration = illustrationForConcept(context);
    const speakerMode: LimeSceneBeat["speakerMode"] = sceneType === "HALO_SPEAKER" ? "halo"
      : sceneType === "SPLIT_SPEAKER" ? "split"
      : sceneType === "SPEAKER_STICKER" ? "full" : "hidden";
    beats.push({
      startMs,
      endMs,
      sceneType,
      headline: localHeadline === "MAKE BETTER CONTENT" ? conceptHeadline(transcript) : localHeadline,
      badge: sceneType === "CTA" ? "LINK IN BIO" : undefined,
      illustration: sceneType === "CTA" ? "primitive" : localIllustration === "primitive" ? illustrationForConcept(transcript) : localIllustration,
      illustrationProps: { concept: conceptHeadline(context) },
      speakerMode,
      emphasisWords: [],
      assetIntent: context.slice(0, 120),
    });
    startMs = endMs;
  }
  if (beats.length) {
    const remainder = totalMs - beats[beats.length - 1].startMs;
    if (remainder < 700 && beats.length > 1) {
      beats[beats.length - 2].endMs = totalMs;
      beats.pop();
    }
  }
  return limeDirectorSchema.parse({ beats });
}

function normalizeBeats(plan: LimeDirectorPlan, words: TranscriptionResult["words"], durationSec: number, transcript: string): LimeDirectorPlan {
  const totalMs = Math.round(durationSec * 1000);
  const count = Math.max(1, Math.round(durationSec));
  const source = [...plan.beats].sort((a, b) => a.startMs - b.startMs);
  const boundaries = [0];
  for (let index = 1; index < count; index++) {
    const target = totalMs * index / count;
    const previous = boundaries[index - 1];
    const min = previous + 800;
    const max = Math.min(totalMs - (count - index) * 800, previous + 1200);
    const candidates = words.filter((word) => word.end * 1000 >= min && word.end * 1000 <= max);
    const nearest = candidates.reduce<typeof words[number] | undefined>((best, word) => !best || Math.abs(word.end * 1000 - target) < Math.abs(best.end * 1000 - target) ? word : best, undefined);
    boundaries.push(Math.round(nearest?.end ? nearest.end * 1000 : Math.max(min, Math.min(max, target))));
  }
  boundaries.push(totalMs);
  const layouts: LimeSceneBeat["sceneType"][] = ["HALO_SPEAKER", "FULL_GRAPHIC", "SPLIT_SPEAKER", "FULL_GRAPHIC", "SPEAKER_STICKER", "NUMBERED_STEP"];
  const speakerModes: Record<LimeSceneBeat["sceneType"], LimeSceneBeat["speakerMode"]> = {
    HALO_SPEAKER: "halo", FULL_GRAPHIC: "hidden", SPLIT_SPEAKER: "split",
    SPEAKER_STICKER: "full", NUMBERED_STEP: "hidden", CTA: "hidden",
  };
  const beats = Array.from({ length: count }, (_, index) => {
    const startMs = boundaries[index];
    const endMs = boundaries[index + 1];
    const midpoint = (startMs + endMs) / 2;
    const sourceBeat = source.find((beat) => beat.startMs <= midpoint && beat.endMs >= midpoint) || source[index % source.length];
    const sceneType = index === count - 1 ? "CTA" : layouts[index % layouts.length];
    const sourceText = sourceBeat.assetIntent || sourceBeat.headline;
    const localHeadline = conceptHeadline(sourceText);
    const derivedHeadline = localHeadline === "MAKE BETTER CONTENT" ? conceptHeadline(transcript) : localHeadline;
    const headline = derivedHeadline;
    return {
      ...sourceBeat,
      startMs,
      endMs,
      sceneType,
      headline,
      illustration: sourceBeat.illustration === "primitive" ? illustrationForConcept(transcript || sourceText) : sourceBeat.illustration,
      speakerMode: speakerModes[sceneType],
      badge: sceneType === "CTA" ? "LINK IN BIO" : (sourceBeat.badge && !/^(KEY TAKEAWAY|VERIFIED RESULT|STEP\s*0?\d+)$/i.test(sourceBeat.badge) ? sourceBeat.badge : undefined),
    };
  });
  return limeDirectorSchema.parse({ beats });
}

export async function planLimeSlides(params: {
  transcript: string;
  transcriptionWords: TranscriptionResult["words"];
  durationSec: number;
  topic?: string;
}): Promise<LimeDirectorPlan> {
  const { transcript, transcriptionWords, durationSec } = params;
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.LIME_DIRECTOR_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!apiKey) return normalizeBeats(buildFallbackLimePlan(transcript || params.topic || "creator workflow", transcriptionWords, durationSec), transcriptionWords, durationSec, transcript || params.topic || "creator workflow");

  const source = transcript || params.topic || "creator workflow";
  let previousError = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.35,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You are a short-form motion design director. Return JSON with beats. Each beat lasts 800-1200ms except the final beat. Alternate speaker and graphic layouts. Headlines are ALL CAPS, at most three concept words, and must summarize rather than copy spoken transcript fragments. Use an illustration enum from phone, carousel, line_chart, gear_diagram, swatches, calendar, video_player, editor_window, primitive. Never use placeholder labels." },
            { role: "user", content: JSON.stringify({ transcript: source, durationMs: Math.round(durationSec * 1000), wordTimestamps: transcriptionWords.map((word) => ({ ...word, startMs: Math.round(word.start * 1000), endMs: Math.round(word.end * 1000) })), previousValidationError: previousError, requiredBeatShape: "{beats:[{startMs,endMs,sceneType,headline,badge?,illustration,illustrationProps,speakerMode,emphasisWords,assetIntent?}]}" }) },
          ],
        }),
        signal: AbortSignal.timeout(60_000),
      });
      if (!response.ok) throw new Error(`OpenAI scene authoring failed (${response.status}).`);
      const data = await response.json();
      const parsed = limeDirectorSchema.parse(JSON.parse(data.choices?.[0]?.message?.content || "{}"));
      return normalizeBeats(parsed, transcriptionWords, durationSec, transcript || params.topic || "creator workflow");
    } catch (error: any) {
      previousError = error?.message || "Invalid director output.";
      if (attempt === 0) continue;
    }
  }
  return normalizeBeats(buildFallbackLimePlan(source, transcriptionWords, durationSec), transcriptionWords, durationSec, source);
}

export async function reviseLimeBeat(beat: LimeSceneBeat, failures: string[]): Promise<LimeSceneBeat> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const alternatives: LimeSceneBeat["illustration"][] = ["phone", "carousel", "line_chart", "gear_diagram", "swatches", "calendar", "video_player", "editor_window"];
    const replacement = alternatives[(alternatives.indexOf(beat.illustration) + 1) % alternatives.length];
    return limeBeatSchema.parse({ ...beat, headline: conceptHeadline(beat.assetIntent || beat.headline), illustration: replacement });
  }
  const model = process.env.LIME_DIRECTOR_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Revise one motion-design beat. Preserve startMs and endMs. Return a JSON object for one beat with ALL-CAPS headline at most three words, a meaningful original illustration choice, no placeholders, and the same sceneType/speakerMode unless the reported issue requires a layout change." },
        { role: "user", content: JSON.stringify({ currentBeat: beat, failures, requiredFields: ["startMs", "endMs", "sceneType", "headline", "illustration", "illustrationProps", "speakerMode", "emphasisWords"] }) },
      ],
    }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`OpenAI scene revision failed (${response.status}).`);
  const data = await response.json();
  const revised = limeBeatSchema.parse(JSON.parse(data.choices?.[0]?.message?.content || "{}"));
  return limeBeatSchema.parse({ ...revised, startMs: beat.startMs, endMs: beat.endMs });
}
