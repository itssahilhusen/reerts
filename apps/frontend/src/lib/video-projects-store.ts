import fs from "fs";
import path from "path";
import { BrandKitSettings, DEFAULT_BRAND_KIT } from "@/data/videoTemplates";
import type { LimeSceneBeat } from "./lime-director-schema";

export interface VideoProjectRecord {
  id: string;
  title: string;
  mode: "edit" | "post" | "faceless" | "longform" | "music" | "story";
  status: "QUEUED" | "TRANSCRIBING" | "COMPOSING_GRAPHICS" | "COLOR_GRADING" | "READY" | "FAILED";
  progress: number;
  styleIds: string[];
  platforms: string[];
  approvalStatus?: "pending" | "approved" | "changes_requested";
  timelineNotes?: Array<{
    id: string;
    timestampSec: number;
    note: string;
    createdAt: string;
  }>;
  automation?: {
    keyword?: string;
    offer?: string;
  };
  options?: {
    avatarCutout?: boolean;
    look?: string;
    lookStrength?: number;
  };
  settings?: BrandKitSettings;
  brief?: {
    direction?: string;
    outputFormat?: string;
    topic?: string;
  };
  source: {
    kind: string;
    uploadPaths?: string[];
    brollPaths?: string[];
    durationSec?: number;
    trendId?: string;
    topic?: string;
    language?: string;
  };
  outputVideoUrl?: string;
  errorMessage?: string;
  userRawVideoUrl?: string;
  primaryStyleId?: string;
  thumbnailUrl?: string;
  captionText?: string;
  transcript?: string;
  transcriptWords?: Array<{ word: string; start: number; end: number }>;
  limeBeats?: LimeSceneBeat[];
  researchVisits?: Array<{ url: string; title: string; facts: string[]; status: string }>;
  assets?: Array<{ assetId: string; badge: string; title: string; sourceUrl: string; sceneIds: string[] }>;
  checks?: Array<{ id: string; label: string; status: string; detail?: string }>;
  scenes?: Array<{
    sceneId: string;
    start: number;
    end: number;
    headline: string;
    subAccent: string;
    objective: string;
    visualType: string;
    badgeText?: string;
    onScreenText: string[];
  }>;
  scenePlan?: {
    headline: string;
    subAccent: string;
    metricLabel: string;
    metricCount: number;
    steps: [string, string, string];
    platformCaption: string;
  };
  createdAt: string;
  updatedAt: string;
}

function resolveStoreFile(filename: string): string {
  const candidate1 = path.join(process.cwd(), "apps", "frontend", "src", "lib", filename);
  if (fs.existsSync(candidate1)) return candidate1;
  const candidate2 = path.join(process.cwd(), "src", "lib", filename);
  if (fs.existsSync(candidate2)) return candidate2;
  return fs.existsSync(path.join(process.cwd(), "apps", "frontend")) ? candidate1 : candidate2;
}

const STORE_PATH = resolveStoreFile("video-projects.json");
const BRANDKIT_PATH = resolveStoreFile("video-brandkit.json");

function ensureFile(filePath: string, defaultData: any) {
  try {
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Failed to ensure store file:", err);
  }
}

export function getAllVideoProjects(): VideoProjectRecord[] {
  ensureFile(STORE_PATH, []);
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const list: VideoProjectRecord[] = JSON.parse(raw);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function getVideoProjectById(id: string): VideoProjectRecord | null {
  const projects = getAllVideoProjects();
  return projects.find((p) => p.id === id) || null;
}

export function saveVideoProject(project: VideoProjectRecord): VideoProjectRecord {
  const projects = getAllVideoProjects();
  const existingIdx = projects.findIndex((p) => p.id === project.id);
  if (existingIdx >= 0) {
    projects[existingIdx] = { ...projects[existingIdx], ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.unshift(project);
  }

  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(projects, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing video projects store:", err);
  }
  return project;
}

export function deleteVideoProject(id: string): boolean {
  const projects = getAllVideoProjects();
  const filtered = projects.filter((p) => p.id !== id);
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export function getSavedBrandKit(): BrandKitSettings {
  ensureFile(BRANDKIT_PATH, DEFAULT_BRAND_KIT);
  try {
    const raw = fs.readFileSync(BRANDKIT_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BRAND_KIT;
  }
}

export function saveBrandKit(kit: BrandKitSettings): BrandKitSettings {
  ensureFile(BRANDKIT_PATH, DEFAULT_BRAND_KIT);
  try {
    fs.writeFileSync(BRANDKIT_PATH, JSON.stringify(kit, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing brandkit store:", err);
  }
  return kit;
}
