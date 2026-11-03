"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Layers,
  Bot,
  Pencil,
  Rss,
  Calendar as CalendarIcon,
  CheckSquare,
  FolderOpen,
  UserCheck,
  Sliders,
  HelpCircle,
  Video,
  CreditCard,
  User,
  MoreVertical,
  LogIn,
  Sparkles,
  Clock,
  Send,
  Images as ImagesIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StudioView } from "./StudioView";
import { IdeasView } from "./IdeasView";
import { CalendarView } from "./CalendarView";
import { PostsView } from "./PostsView";
import { AccountsView } from "./AccountsView";
import { AutoDmView } from "./AutoDmView";
import { CarouselView } from "./CarouselView";
import { MediaLibraryView } from "./MediaLibraryView";
import { SettingsView } from "./SettingsView";
import { VideosView } from "./VideosView";
import { ComposerSheet } from "./ComposerSheet";
import { AuthForm } from "@/components/auth/AuthForm";
import { toast } from "sonner";

export type WorkspaceTab =
  | "studio"
  | "ideas"
  | "calendar"
  | "posts"
  | "personas"
  | "analytics"
  | "accounts"
  | "spy"
  | "pipelines"
  | "carousel"
  | "videos"
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

interface NavItem {
  id: WorkspaceTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: "soon" | "new";
  href: string;
  soon?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const TAB_ROUTES: Record<WorkspaceTab, string> = {
  studio: "/studio",
  ideas: "/ideas",
  calendar: "/calendar",
  posts: "/posts",
  personas: "/personas",
  analytics: "/analytics",
  accounts: "/accounts",
  spy: "/spy",
  carousel: "/carousel",
  "media-library": "/media-library",
  "engagement-automation": "/engagement-automation",
  pipelines: "/pipelines",
  videos: "/videos",
  schedule: "/schedule",
  publish: "/publish",
  conversations: "/conversations",
  affiliate: "/affiliate",
  guide: "/guide",
  support: "/support",
  settings: "/settings",
};

export function WorkspaceShell({
  initialView = "studio",
  children,
  showAuthModal = false,
  authModalMode: initialAuthModalMode = "signup",
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const getTabFromPath = (path: string): WorkspaceTab => {
    if (path.startsWith("/login") || path.startsWith("/signup")) return initialView;
    if (path.startsWith("/ideas")) return "ideas";
    if (path.startsWith("/calendar")) return "calendar";
    if (path.startsWith("/posts")) return "posts";
    if (path.startsWith("/accounts")) return "accounts";
    if (path.startsWith("/engagement-automation") || path.startsWith("/auto-dm")) return "engagement-automation";
    if (path.startsWith("/carousel") || path.startsWith("/images")) return "carousel";
    if (path.startsWith("/media-library")) return "media-library";
    if (path.startsWith("/pipelines")) return "pipelines";
    if (path.startsWith("/videos")) return "videos";
    if (path.startsWith("/schedule")) return "schedule";
    if (path.startsWith("/publish")) return "publish";
    if (path.startsWith("/settings")) return "settings";
    if (path.startsWith("/dashboard")) return "studio";
    if (path.startsWith("/studio")) return "studio";
    return initialView;
  };

  const activeTab = getTabFromPath(pathname || "") || initialView;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(showAuthModal || false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">(initialAuthModalMode);
  const [composerPost, setComposerPost] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: ⌘K to focus search, Esc to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openComposerWithData = (data?: any) => {
    setComposerPost(data || null);
    setIsComposerOpen(true);
  };

  // Sidebar Menu Sections matching exact Raycall AI Dashboard design + our active tabs
  const NAV_SECTIONS: NavSection[] = [
    {
      title: "Automation",
      items: [
        { id: "pipelines", label: "Pipelines", icon: Layers, badge: "Soon", badgeType: "soon", href: "/pipelines", soon: true },
        { id: "engagement-automation", label: "Auto DM", icon: Bot, href: "/engagement-automation" },
      ],
    },
    {
      title: "Create",
      items: [
        { id: "studio", label: "Studio", icon: Pencil, href: "/studio" },
        { id: "ideas", label: "Ideas", icon: Rss, href: "/ideas" },
        { id: "carousel", label: "Images", icon: ImagesIcon, badge: "new", badgeType: "new", href: "/carousel" },
        { id: "videos", label: "Videos", icon: Video, badge: "new", badgeType: "new", href: "/videos" },
        { id: "schedule", label: "Schedule", icon: Clock, href: "/schedule" },
        { id: "publish", label: "Publish", icon: Send, href: "/publish" },
      ],
    },
    {
      title: "Operation",
      items: [
        { id: "calendar", label: "Calendar", icon: CalendarIcon, href: "/calendar" },
        { id: "posts", label: "Posts", icon: CheckSquare, href: "/posts" },
        { id: "media-library", label: "Media Library", icon: FolderOpen, href: "/media-library" },
      ],
    },
  ];

  const SETTINGS_ITEMS: NavItem[] = [
    { id: "accounts", label: "Accounts", icon: UserCheck, href: "/accounts" },
    { id: "settings", label: "Settings", icon: Sliders, href: "/settings" },
  ];

  const userInitial = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AM";
  const userName = session?.user?.name || "Alex Martis";
  const userEmail = session?.user?.email || "alex.dev@studio.io";

  return (
    <div className="bg-surface font-sans text-slate-900 antialiased h-screen flex overflow-hidden selection:bg-brand-100 selection:text-brand-700 w-full select-none">
      {/* 1. Left Sidebar matching exact Stitch Raycall design */}
      <aside
        className={cn(
          "bg-surface-subtle border-r border-surface-border flex flex-col justify-between h-full select-none flex-shrink-0 z-20 transition-all duration-200",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
        data-purpose="sidebar-navigation"
      >
        {/* Top Area: Logo, Search, Nav Items */}
        <div className="flex flex-col flex-1 overflow-y-auto px-3.5 py-3.5 space-y-4">
          {/* Brand & Collapse Row */}
          <div className="flex items-center justify-between pb-1">
            <Link href="/" className="flex items-center space-x-2.5 group overflow-hidden">
              {/* Stepped geometric brand logo */}
              <div className="w-7 h-7 bg-brand-500 rounded-md flex items-center justify-center text-white font-bold text-sm tracking-tighter shadow-xs group-hover:bg-brand-600 transition-colors flex-shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4 4h4v6h8V4h4v16h-4v-6H8v6H4V4z" />
                </svg>
              </div>
              {!isSidebarCollapsed && (
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Reerts
                </span>
              )}
            </Link>
            <button
              aria-label="Collapse Sidebar"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
              type="button"
            >
              <svg className="w-4 h-4 stroke-[1.75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Quick Search Bar */}
          {!isSidebarCollapsed && (
            <div className="relative" data-purpose="search-box">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-9 py-1.5 bg-white border border-surface-border text-xs sm:text-[13px] rounded-md shadow-2xs placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all font-mono"
                placeholder="Search..."
                type="text"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <kbd className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>
          )}

          {/* Navigation Sections */}
          {NAV_SECTIONS.map((section) => {
            const filteredItems = searchQuery
              ? section.items.filter((item) =>
                  item.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : section.items;

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                {!isSidebarCollapsed && (
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-2 mb-1.5">
                    {section.title}
                  </h3>
                )}
                {filteredItems.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  const href = item.soon ? "#" : item.href;

                  if (isActive) {
                    return (
                      <div key={item.id} className="relative tech-bracket-container tech-corner-tl">
                        <Link
                          href={href}
                          className={cn(
                            "w-full flex items-center py-2 text-xs sm:text-[13px] font-semibold text-brand-600 bg-white shadow-2xs border border-brand-500/30 rounded-md cursor-pointer",
                            isSidebarCollapsed ? "justify-center px-1" : "px-2.5"
                          )}
                          title={item.label}
                        >
                          <Icon className={cn("w-4 h-4 text-brand-500 flex-shrink-0", !isSidebarCollapsed && "mr-2.5")} />
                          {!isSidebarCollapsed && (
                            <span className="truncate flex-1 text-left">{item.label}</span>
                          )}
                          {!isSidebarCollapsed && item.badge && (
                            <span
                              className={cn(
                                "ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border",
                                item.badgeType === "soon"
                                  ? "text-amber-700 bg-amber-50 border-amber-200/60"
                                  : "text-brand-600 bg-brand-50 border-brand-200/60"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      href={href}
                      onClick={(e) => {
                        if (item.soon) {
                          e.preventDefault();
                          toast.info(`${item.label} module is coming soon!`);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center py-2 text-xs sm:text-[13px] font-medium text-slate-600 rounded-md hover:bg-white hover:text-slate-900 transition-colors group cursor-pointer",
                        isSidebarCollapsed ? "justify-center px-1" : "px-2.5",
                        item.soon && "opacity-75"
                      )}
                      title={item.label}
                    >
                      <Icon className={cn("w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0", !isSidebarCollapsed && "mr-2.5")} />
                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={cn(
                            "ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border",
                            item.badgeType === "soon"
                              ? "text-amber-700 bg-amber-50 border-amber-200/60"
                              : "text-brand-600 bg-brand-50 border-brand-200/60"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Auxiliary Settings */}
          <div className="space-y-1 pt-2 border-t border-surface-border" data-purpose="nav-section-settings">
            {SETTINGS_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (isActive) {
                return (
                  <div key={item.id} className="relative tech-bracket-container tech-corner-tl">
                    <Link
                      href={item.href}
                      className={cn(
                        "w-full flex items-center py-2 text-xs sm:text-[13px] font-semibold text-brand-600 bg-white shadow-2xs border border-brand-500/30 rounded-md cursor-pointer",
                        isSidebarCollapsed ? "justify-center px-1" : "px-2.5"
                      )}
                      title={item.label}
                    >
                      <Icon className={cn("w-4 h-4 text-brand-500 flex-shrink-0", !isSidebarCollapsed && "mr-2.5")} />
                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "w-full flex items-center py-2 text-xs sm:text-[13px] font-medium text-slate-600 rounded-md hover:bg-white hover:text-slate-900 transition-colors group cursor-pointer",
                    isSidebarCollapsed ? "justify-center px-1" : "px-2.5"
                  )}
                  title={item.label}
                >
                  <Icon className={cn("w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0", !isSidebarCollapsed && "mr-2.5")} />
                  {!isSidebarCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Sidebar Card & User Profile */}
        <div className="p-3 border-t border-surface-border bg-surface-subtle/80 space-y-3">
          {/* Balance & Credits Technical Card */}
          {!isSidebarCollapsed ? (
            <div className="bg-white border border-surface-border rounded-lg p-3 shadow-2xs" data-purpose="credit-metric-box">
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <div className="text-[10px] font-mono uppercase font-semibold text-slate-400">Balance</div>
                  <div className="text-sm font-bold font-mono text-slate-900 tracking-tight">$24.80</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase font-semibold text-slate-400">Credits</div>
                  <div className="text-sm font-bold font-mono text-brand-600 tracking-tight">12.4%</div>
                </div>
              </div>
              {/* Technical segmented progress bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex mb-2.5">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: "12.4%" }} />
                <div className="h-full bg-slate-200" style={{ width: "87.6%" }} />
              </div>
              <button
                type="button"
                onClick={() => toast.info("Opening credit purchase modal...")}
                className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 text-xs font-mono font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <path d="M12 8v8m-4-4h8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>Buy Credits</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <button
                type="button"
                onClick={() => toast.info("Balance: $24.80 | Credits: 12.4%")}
                className="p-1.5 rounded-lg bg-white border border-surface-border text-brand-500 hover:bg-brand-50 transition-colors"
                title="Balance: $24.80 | Credits: 12.4%"
              >
                <CreditCard className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* User Profile Identifier */}
          <div className="relative">
            <div className="flex items-center justify-between pt-1 px-1" data-purpose="user-profile-badge">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2.5 overflow-hidden cursor-pointer"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={userName}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-white"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 ring-1 ring-white">
                    {userInitial}
                  </div>
                )}
                {!isSidebarCollapsed && (
                  <div className="truncate leading-tight text-left">
                    <div className="text-xs font-semibold text-slate-900 truncate">{userName}</div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">{userEmail}</div>
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && (
                <button
                  aria-label="Switch workspace"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  type="button"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              )}
            </div>

            {/* User Profile Popup Menu */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-surface-border bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-2 border-b border-surface-border mb-1">
                  <span className="text-xs font-semibold text-slate-900 block truncate">
                    {userName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 block truncate">
                    {userEmail}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode("signin");
                    setIsAuthModalOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                >
                  <User className="w-4.5 h-4.5 text-slate-400" />
                  <span>Switch account</span>
                </button>
                <Link
                  href="/accounts"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <UserCheck className="w-4.5 h-4.5 text-slate-400" />
                  <span>Connected Accounts</span>
                </Link>
                {session?.user && (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await signOut({ callbackUrl: "/login" });
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <span>Log out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area matching Stitch Raycall design */}
      <main className="flex-1 flex flex-col h-full bg-white relative overflow-y-auto">
        {/* Top Right Utility Header */}
        <header className="w-full flex justify-end items-center px-6 py-3 gap-2 border-b border-surface-border/50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <button
            type="button"
            onClick={() => router.push("/conversations")}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-700 bg-white hover:bg-slate-50 border border-surface-border rounded-md shadow-2xs transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Threads</span>
          </button>
          <button
            aria-label="New thread"
            type="button"
            onClick={() => {
              openComposerWithData();
            }}
            className="p-1.5 text-slate-700 bg-white hover:bg-slate-50 border border-surface-border rounded-md shadow-2xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </header>

        {/* Dynamic Center Canvas based on activeTab */}
        <div className="flex-1 flex flex-col relative min-w-0">
          {activeTab === "studio" && <StudioView onOpenComposer={openComposerWithData} />}
          {activeTab === "engagement-automation" && <AutoDmView />}
          {activeTab === "ideas" && <IdeasView onOpenComposer={openComposerWithData} />}
          {activeTab === "calendar" && <CalendarView onOpenComposer={openComposerWithData} />}
          {activeTab === "posts" && <PostsView onOpenComposer={openComposerWithData} />}
          {activeTab === "accounts" && <AccountsView />}
          {activeTab === "carousel" && <CarouselView onOpenComposer={openComposerWithData} />}
          {activeTab === "media-library" && <MediaLibraryView onOpenComposer={openComposerWithData} />}
          {activeTab === "schedule" && <CalendarView onOpenComposer={openComposerWithData} />}
          {activeTab === "publish" && <PostsView onOpenComposer={openComposerWithData} />}
          {activeTab === "settings" && <SettingsView />}

          {activeTab === "videos" && <VideosView onOpenComposer={openComposerWithData} />}

          {activeTab === "pipelines" && (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 capitalize font-mono">{activeTab.replace(/-/g, " ")} Module</h2>
              <p className="text-sm text-slate-500 max-w-sm font-mono">
                This module is scheduled in the Reerts roadmap. Visual orchestration and agent pipelines are being integrated.
              </p>
              <Link
                href="/studio"
                className="rounded-lg bg-brand-500 hover:bg-brand-600 px-4 py-2 text-xs font-semibold text-white font-mono shadow-xs transition-colors"
              >
                Back to Studio
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Slide-out Composer Sheet */}
      <ComposerSheet
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        initialPost={composerPost}
      />

      {/* Auth Modal overlay */}
      {isAuthModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAuthModalOpen(false);
              if (pathname === "/login" || pathname === "/signup") {
                router.push("/studio");
              }
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div className="cursor-default w-full max-w-[420px] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <AuthForm
              initialMode={authModalMode}
              onClose={() => {
                setIsAuthModalOpen(false);
                if (pathname === "/login" || pathname === "/signup") {
                  router.push("/studio");
                }
              }}
              isModal={true}
            />
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
