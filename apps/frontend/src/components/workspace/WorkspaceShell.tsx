"use client";

import React from "react";
import { SwiperaStudioWorkspace, StudioTab } from "./SwiperaStudioWorkspace";

export type WorkspaceTab =
  | "studio"
  | "ideas"
  | "videos"
  | "create"
  | "templates"
  | "design"
  | "brand"
  | "calendar"
  | "posts"
  | "personas"
  | "analytics"
  | "accounts"
  | "spy"
  | "pipelines"
  | "carousel"
  | "schedule"
  | "publish"
  | "conversations"
  | "media-library"
  | "engagement-automation"
  | "affiliate"
  | "guide"
  | "support"
  | "settings";

interface WorkspaceShellProps {
  initialView?: WorkspaceTab;
  children?: React.ReactNode;
  showAuthModal?: boolean;
  authModalMode?: "signin" | "signup";
}

export function WorkspaceShell({
  initialView = "studio",
  children,
  showAuthModal = false,
  authModalMode = "signup",
}: WorkspaceShellProps) {
  let mappedTab: StudioTab = "templates";
  if (initialView === "ideas") {
    mappedTab = "ideas";
  } else if (initialView === "videos") {
    mappedTab = "videos";
  } else if (initialView === "create") {
    mappedTab = "create";
  } else if (initialView === "design") {
    mappedTab = "design";
  } else if (initialView === "brand") {
    mappedTab = "brand";
  } else {
    mappedTab = "templates";
  }

  return (
    <SwiperaStudioWorkspace
      initialTab={mappedTab}
      showAuthModal={showAuthModal}
      authModalMode={authModalMode}
    />
  );
}
