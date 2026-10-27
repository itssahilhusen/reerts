"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Menu, 
  X, 
  Sparkles, 
  Plus, 
  Sun, 
  Moon, 
  PanelLeft, 
  ChevronDown, 
  ChevronsUpDown,
  Filter, 
  Send, 
  Pencil, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  BarChart2, 
  Layers, 
  UserCheck, 
  Bot, 
  ArrowLeft, 
  Compass, 
  Sliders, 
  Flame, 
  Share2, 
  Gift,
  BookOpen,
  FolderOpen,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  MoreVertical,
  User,
  CreditCard,
  Languages,
  Rss,
  LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StudioView } from "./StudioView";
import { IdeasView } from "./IdeasView";
import { CalendarView } from "./CalendarView";
import { PostsView } from "./PostsView";
import { BrandVoiceView } from "./BrandVoiceView";
import { AnalyticsView } from "./AnalyticsView";
import { AccountsView } from "./AccountsView";
import { AutoDmView } from "./AutoDmView";
import { CarouselView } from "./CarouselView";
import { SpyView } from "./SpyView";
import { MediaLibraryView } from "./MediaLibraryView";
import { ConversationsView } from "./ConversationsView";
import { ComposerSheet } from "./ComposerSheet";
import { ReertsLogo } from "@/components/ReertsLogo";
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
  | "conversations"
  | "media-library"
  | "engagement-automation"
  | "affiliate"
  | "guide"
  | "support";

interface WorkspaceShellProps {
  initialView?: WorkspaceTab;
  children?: React.ReactNode;
  showAuthModal?: boolean;
  authModalMode?: "signin" | "signup";
}

interface NavItem {
  id: WorkspaceTab;
  label: string;
  badge?: string;
  badgeCustom?: React.ReactNode;
  icon: any;
  soon?: boolean;
}

interface NavSection {
  group: string;
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
  conversations: "/conversations",
  affiliate: "/affiliate",
  guide: "/guide",
  support: "/support",
};

export function WorkspaceShell({ 
  initialView = "studio",
  children,
  showAuthModal = false,
  authModalMode: initialAuthModalMode = "signup",
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getTabFromPath = (path: string): WorkspaceTab => {
    if (path.startsWith("/login") || path.startsWith("/signup")) return initialView;
    if (path.startsWith("/ideas")) return "ideas";
    if (path.startsWith("/personas")) return "personas";
    if (path.startsWith("/calendar")) return "calendar";
    if (path.startsWith("/posts")) return "posts";
    if (path.startsWith("/accounts")) return "accounts";
    if (path.startsWith("/analytics")) return "analytics";
    if (path.startsWith("/engagement-automation") || path.startsWith("/auto-dm")) return "engagement-automation";
    if (path.startsWith("/carousel")) return "carousel";
    if (path.startsWith("/spy")) return "spy";
    if (path.startsWith("/media-library")) return "media-library";
    if (path.startsWith("/conversations")) return "conversations";
    if (path.startsWith("/pipelines")) return "pipelines";
    if (path.startsWith("/videos")) return "videos";
    if (path.startsWith("/affiliate")) return "affiliate";
    if (path.startsWith("/guide")) return "guide";
    if (path.startsWith("/support")) return "support";
    if (path.startsWith("/studio")) return "studio";
    return initialView;
  };

  const activeTab = getTabFromPath(pathname || "") || initialView;
  const { data: session, status } = useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(showAuthModal || false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">(initialAuthModalMode);
  const [composerPost, setComposerPost] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);

  // Sync theme - default to dark unless explicitly saved as light
  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

  useIsomorphicLayoutEffect(() => {
    const saved = localStorage.getItem("reerts-theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("reerts-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("reerts-theme", "dark");
      setIsDark(true);
    }
  };

  const openComposerWithData = (data?: any) => {
    setComposerPost(data || null);
    setIsComposerOpen(true);
  };

  // Sidebar Menu Sections
  const NAV_SECTIONS: NavSection[] = [
    {
      group: "Automation",
      items: [
        { id: "pipelines", label: "Pipelines", badge: "Soon", icon: Layers, soon: true },
        { id: "engagement-automation", label: "Auto DM", icon: Bot },
      ],
    },
    {
      group: "Create",
      items: [
        { id: "personas", label: "Brand Voice", icon: Sliders },
        { id: "ideas", label: "Ideas", icon: Rss },
        { id: "studio", label: "Studio", icon: Pencil },
        { id: "carousel", label: "Carousel", badge: "new", icon: Layers },
        { id: "videos", label: "Videos", badge: "Soon", icon: Layers, soon: true },
      ],
    },
    {
      group: "Operation",
      items: [
        { 
          id: "conversations", 
          label: "Conversations", 
          icon: MessageSquare,
          badgeCustom: (
            <span className="flex size-4 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold">
              2
            </span>
          )
        },
        { id: "calendar", label: "Calendar", icon: CalendarIcon },
        { id: "posts", label: "Posts", icon: CheckSquare },
        { id: "media-library", label: "Media Library", icon: FolderOpen },
      ],
    },
    {
      group: "Discovery",
      items: [
        { id: "analytics", label: "Analytics", icon: BarChart2 },
        { 
          id: "spy", 
          label: "Spy", 
          icon: Flame,
          badgeCustom: (
            <div className="flex items-center -space-x-1">
              <span className="size-3.5 rounded-full overflow-hidden bg-black flex items-center justify-center border border-background">
                <Image src="/images/platforms/threads.svg" alt="" width={10} height={10} className="invert" />
              </span>
              <span className="size-3.5 rounded-full overflow-hidden border border-background">
                <Image src="/images/platforms/instagram.svg" alt="" width={14} height={14} />
              </span>
              <span className="size-3.5 rounded-full overflow-hidden bg-black flex items-center justify-center border border-background">
                <Image src="/images/platforms/tiktok-light.svg" alt="" width={10} height={10} className="invert" />
              </span>
            </div>
          )
        },
      ],
    },
  ];

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      {/* 1. Left Persistent Sidebar matching reference screenshot */}
      <aside
        className={cn(
          "relative z-30 flex flex-col border-r border-border bg-sidebar transition-[width] duration-200 ease-linear select-none shrink-0",
          isSidebarCollapsed ? "w-16" : "w-[224px]",
          "hidden md:flex"
        )}
      >
        {/* Brand Logo Header: REERTS */}
        <div
          className={cn(
            "flex h-12 shrink-0 items-center border-b border-border/40 transition-all",
            isSidebarCollapsed ? "justify-center px-0" : "justify-start px-4"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            {isSidebarCollapsed ? (
              <ReertsLogo
                variant="symbol"
                iconClassName="size-7 object-contain"
              />
            ) : (
              <ReertsLogo
                variant="full"
                iconClassName="h-7 w-auto object-contain"
              />
            )}
          </Link>
        </div>

        {/* Workspace Switcher: Red user outline icon + My Workspace + ↕ */}
        {!isSidebarCollapsed ? (
          <div className="px-3 py-2 border-b border-border/40">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-border/70 bg-card px-3 py-2 text-xs font-semibold hover:bg-muted/60 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <User className="size-3.5 text-rose-500" />
                <span className="text-foreground">My Workspace</span>
              </div>
              <ChevronsUpDown className="size-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center py-2 border-b border-border/40">
            <div className="size-8 rounded-lg border border-border/60 flex items-center justify-center">
              <User className="size-3.5 text-rose-500" />
            </div>
          </div>
        )}

        {/* Sidebar Navigation Items with dedicated scrollbar */}
        <div className="flex-1 overflow-y-scroll sidebar-scrollbar px-2.5 py-2 space-y-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.group} className="space-y-0.5">
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground/80">
                  <span>{section.group}</span>
                  <ChevronDown className="size-3.5 opacity-60" />
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  const href = item.soon ? "#" : TAB_ROUTES[item.id] || "/studio";
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
                        "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all text-left select-none",
                        isActive
                          ? "bg-neutral-200/80 dark:bg-neutral-800 text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        item.soon && "opacity-60 cursor-not-allowed hover:bg-transparent"
                      )}
                      title={item.label}
                    >
                      <Icon className={cn("size-4 shrink-0", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}
                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0",
                            item.badge === "Soon" && "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
                            item.badge === "new" && "bg-sky-100 text-sky-900 border border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {!isSidebarCollapsed && item.badgeCustom && (
                        item.badgeCustom
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Lower Nav Links matching reference */}
          <div className="pt-2 border-t border-border/50 space-y-0.5">
            {/* Accounts */}
            <Link
              href="/accounts"
              className={cn(
                "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all text-left",
                activeTab === "accounts"
                  ? "bg-neutral-200/80 dark:bg-neutral-800 text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <UserCheck className="size-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Accounts</span>}
            </Link>

            {/* Affiliate Program */}
            <button
              type="button"
              onClick={() => toast.info("Affiliate Program details")}
              className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all text-left text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            >
              <Gift className="size-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Affiliate program</span>}
            </button>

            {/* User Guide */}
            <button
              type="button"
              onClick={() => toast.info("User guide documentation")}
              className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all text-left text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            >
              <BookOpen className="size-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">User guide</span>}
            </button>

            {/* Support ⋅ Feedback */}
            <button
              type="button"
              onClick={() => toast.info("Support and Feedback center")}
              className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all text-left text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            >
              <HelpCircle className="size-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Support ⋅ Feedback</span>}
            </button>
          </div>
        </div>

        {/* Free Trial Widget Card matching reference screenshot */}
        {!isSidebarCollapsed && (
          <div className="px-3 py-2 border-t border-border/50">
            <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-sm bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                  TRIAL
                </span>
                <div className="flex items-center gap-1 text-xs font-mono font-medium text-foreground">
                  <CreditCard className="size-3 text-muted-foreground" />
                  <span>389 / 500</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Free trial</span>
                <button 
                  type="button" 
                  onClick={() => toast.info("Upgrade to Pro plan")}
                  className="text-muted-foreground hover:text-foreground text-[11px] underline font-medium"
                >
                  Choose plan
                </button>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full" style={{ width: "77.8%" }} />
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Footer: Start for free button or User profile */}
        <div className="p-2 border-t border-border/60 relative">
          {!session?.user ? (
            <button
              id="sidebar-start-for-free"
              type="button"
              onClick={() => {
                setAuthModalMode("signup");
                setIsAuthModalOpen(true);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs py-2.5 px-3 transition-all shadow-md cursor-pointer group select-none",
                isSidebarCollapsed && "px-0 justify-center"
              )}
              title="Start for free"
            >
              <LogIn className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              {!isSidebarCollapsed && <span className="font-semibold">Start for free</span>}
            </button>
          ) : (
            <>
              <div 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-8 rounded-full overflow-hidden bg-primary/10 border border-border shrink-0 flex items-center justify-center">
                    {session?.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        width={32} 
                        height={32} 
                        className="size-8 object-cover rounded-full" 
                        unoptimized 
                      />
                    ) : (
                      <div className="size-full bg-gradient-to-br from-neutral-800 to-neutral-950 text-white font-bold text-xs flex items-center justify-center">
                        {(session?.user?.name || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="flex-1 min-w-0 leading-tight">
                      <span className="font-semibold text-xs text-foreground block truncate">
                        {session?.user?.name || "Alex Rivers"}
                      </span>
                      <span className="text-[11px] text-muted-foreground block truncate">
                        {session?.user?.email || "alex@posteady.com"}
                      </span>
                    </div>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <MoreVertical className="size-4 text-muted-foreground shrink-0" />
                )}
              </div>

              {/* User Profile Popup Menu */}
              {isUserMenuOpen && (
                <div className="absolute bottom-full left-2 right-2 mb-2 rounded-xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-2 border-b border-border/60 mb-1">
                    <span className="text-xs font-semibold text-foreground block truncate">{session?.user?.name || "Alex Rivers"}</span>
                    <span className="text-[11px] text-muted-foreground block truncate">{session?.user?.email || "alex@posteady.com"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode("signin");
                      setIsAuthModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
                  >
                    <User className="size-3.5 text-muted-foreground" />
                    <span>Switch account</span>
                  </button>
                  <Link
                    href="/accounts"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <span>Connected Accounts</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                  >
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* 2. Main Workspace View */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header Navbar matching reference screenshot */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card/80 px-4 lg:px-6 backdrop-blur-xs z-20">
          {/* Left: [ | ] Collapse toggle, Vertical line, + New Post, D - 2 */}
          <div className="flex items-center gap-2.5">
            {/* Sidebar Toggle Button [ | ] */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
              title="Toggle sidebar"
            >
              <PanelLeft className="size-3.5" />
            </button>

            {/* Vertical Separator Line matching reference */}
            <div className="h-4 w-px bg-border mx-1 shrink-0" />

            {/* + New Post Pill */}
            <button
              type="button"
              onClick={() => openComposerWithData()}
              className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-all shadow-xs"
            >
              <Pencil className="size-3" />
              <span>New Post</span>
            </button>

            {/* D - 2 Badge */}
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 px-2 py-0.5 text-[11px] font-bold font-mono">
              D - 2
            </span>
          </div>

          {/* Right: Asia/Calcutta, 389/500, Languages, Theme */}
          <div className="flex items-center gap-3">
            {/* Timezone */}
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Asia/Calcutta
            </span>

            {/* Credits Status Pill: 🗂 389 / 500 */}
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-2xs">
              <CreditCard className="size-3.5 text-muted-foreground" />
              <span className="text-xs">389 / 500</span>
            </div>

            {/* Language Icon 文A */}
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              title="Change Language"
            >
              <Languages className="size-4" />
            </button>

            {/* Theme Toggle (Moon / Sun) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4" />}
            </button>
          </div>
        </header>

        {/* Content View Canvas */}
        <main className="flex-1 overflow-hidden flex flex-col relative min-w-0">
          {activeTab === "engagement-automation" && <AutoDmView />}
          {activeTab === "studio" && <StudioView onOpenComposer={openComposerWithData} />}
          {activeTab === "ideas" && <IdeasView onOpenComposer={openComposerWithData} />}
          {activeTab === "calendar" && <CalendarView onOpenComposer={openComposerWithData} />}
          {activeTab === "posts" && <PostsView onOpenComposer={openComposerWithData} />}
          {activeTab === "personas" && <BrandVoiceView />}
          {activeTab === "analytics" && <AnalyticsView />}
          {activeTab === "accounts" && <AccountsView />}

          {activeTab === "carousel" && <CarouselView onOpenComposer={openComposerWithData} />}
          {activeTab === "spy" && <SpyView onOpenComposer={openComposerWithData} />}
          {activeTab === "media-library" && <MediaLibraryView onOpenComposer={openComposerWithData} />}
          {activeTab === "conversations" && <ConversationsView />}

          {(activeTab === "pipelines" || activeTab === "videos" || activeTab === "affiliate" || activeTab === "guide" || activeTab === "support") && (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="size-6" />
              </div>
              <h2 className="text-lg font-bold text-foreground capitalize">{activeTab.replace(/-/g, " ")} Module</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                This workspace module is currently integrated with your brand voice and content pipeline. Full visual orchestration is scheduled in the roadmap.
              </p>
              <Link
                href="/studio"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Back to Studio
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Floating Support Chat Widget matching screenshot */}
      <button
        type="button"
        onClick={() => toast.info("Support assistant is ready to help!")}
        className="fixed bottom-5 right-5 z-40 size-11 rounded-full bg-neutral-800 text-white flex items-center justify-center shadow-lg hover:bg-neutral-900 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Support Chat"
      >
        <MessageSquare className="size-5" />
      </button>

      {/* 3. Composer Slide-out Sheet */}
      <ComposerSheet
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        initialPost={composerPost}
      />

      {/* 4. Auth Modal overlay */}
      {isAuthModalOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAuthModalOpen(false);
              if (pathname === "/login" || pathname === "/signup") {
                router.push("/conversations");
              }
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div className="cursor-default w-full max-w-[420px] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <AuthForm
              initialMode={authModalMode}
              onClose={() => {
                setIsAuthModalOpen(false);
                if (pathname === "/login" || pathname === "/signup") {
                  router.push("/conversations");
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
