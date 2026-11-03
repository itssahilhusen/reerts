import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
  words: WordTimestamp[];
  segments: TranscriptionSegment[];
}

function getFfmpegPath(): string {
  const localBin = path.join(process.cwd(), "bin", "ffmpeg.exe");
  if (fs.existsSync(localBin)) return `"${localBin}"`;

  const appBin = path.join(process.cwd(), "apps", "frontend", "bin", "ffmpeg.exe");
  if (fs.existsSync(appBin)) return `"${appBin}"`;

  const pnpmPath1 = path.join(
    process.cwd(),
    "node_modules",
    ".pnpm",
    "@ffmpeg-installer+win32-x64@4.1.0",
    "node_modules",
    "@ffmpeg-installer",
    "win32-x64",
    "ffmpeg.exe"
  );
  if (fs.existsSync(pnpmPath1)) return `"${pnpmPath1}"`;

  return "ffmpeg";
}

/**
 * Extract audio from a local video file and transcribe it via Groq Whisper Large V3
 * Returns word-level timestamps and segment markers
 */
export async function transcribeVideoAudio(videoFilePath: string): Promise<TranscriptionResult> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error("[Groq Transcriber] GROQ_API_KEY is not defined in environment variables");
  }

  if (!fs.existsSync(videoFilePath)) {
    throw new Error(`[Groq Transcriber] Video file not found: ${videoFilePath}`);
  }

  // Temporary audio output path
  const tempAudioDir = path.dirname(videoFilePath);
  const tempAudioFile = path.join(
    tempAudioDir,
    `temp_audio_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.m4a`
  );

  try {
    console.log(`[Groq Transcriber] Extracting audio from ${path.basename(videoFilePath)}...`);
    const ffmpegPath = getFfmpegPath();
    const extractCmd = `${ffmpegPath} -y -i "${videoFilePath}" -vn -acodec aac -b:a 128k "${tempAudioFile}"`;
    await execAsync(extractCmd);

    console.log(`[Groq Transcriber] Audio extracted to ${tempAudioFile}. Sending to Groq Whisper...`);
    const audioBuffer = fs.readFileSync(tempAudioFile);
    const blob = new Blob([audioBuffer], { type: "audio/m4a" });
    const formData = new FormData();
    formData.append("file", blob, "audio.m4a");
    formData.append("model", "whisper-large-v3-turbo");
    formData.append("response_format", "verbose_json");
    formData.append("timestamp_granularities[]", "word");
    formData.append("timestamp_granularities[]", "segment");

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq Whisper API responded with status ${response.status}: ${errText}`);
    }

    const data: any = await response.json();

    const result: TranscriptionResult = {
      text: data.text || "",
      language: data.language || "en",
      duration: data.duration || 0,
      words: Array.isArray(data.words)
        ? data.words.map((w: any) => ({
            word: w.word,
            start: Number(w.start),
            end: Number(w.end),
          }))
        : [],
      segments: Array.isArray(data.segments)
        ? data.segments.map((s: any) => ({
            id: s.id,
            start: Number(s.start),
            end: Number(s.end),
            text: s.text,
          }))
        : [],
    };

    console.log(
      `[Groq Transcriber] Successfully transcribed ${result.words.length} words (${result.language}, ${result.duration.toFixed(1)}s)`
    );

    return result;
  } finally {
    // Clean up temporary audio file
    if (fs.existsSync(tempAudioFile)) {
      try {
        fs.unlinkSync(tempAudioFile);
      } catch (cleanupErr) {
        console.warn("[Groq Transcriber] Could not remove temp audio file:", cleanupErr);
      }
    }
  }
}

