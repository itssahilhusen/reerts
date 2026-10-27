"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Check,
  Send,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Info,
  Trash2,
  Plus,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AutomationItem } from "./AutoDmView";

// Tone background classes
const tones = {
  green: "bg-tone-green",
  yellow: "bg-tone-yellow",
  blue: "bg-tone-blue",
  red: "bg-red-50 dark:bg-red-950/30",
  neutral: "bg-muted/80",
};

interface ChoiceBoxProps {
  value: string;
  currentValue: string;
  onSelect: (val: string) => void;
  tone?: "green" | "yellow" | "blue" | "red" | "neutral";
  label: string;
  icon?: React.ReactNode;
  connected?: boolean;
  disabled?: boolean;
  className?: string;
}

function ChoiceBox({
  value,
  currentValue,
  onSelect,
  tone = "green",
  label,
  icon,
  connected = false,
  disabled = false,
  className,
}: ChoiceBoxProps) {
  const isSelected = currentValue === value;
  const toneBg = tones[tone] || "bg-muted";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={label}
      disabled={disabled}
      onClick={() => onSelect(value)}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl border p-3 text-left text-xs sm:text-sm font-semibold transition-all outline-none select-none",
        !isSelected && "bg-card text-foreground/80 border-border/80 hover:bg-muted/50",
        isSelected && cn(toneBg, "border-foreground/30 text-foreground shadow-2xs"),
        connected && isSelected && "relative z-10 -mb-[9px] rounded-b-none border-b-0 pb-[19px]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {/* Checkbox indicator */}
      <span
        aria-hidden={true}
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors shadow-2xs",
          isSelected
            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
            : "border-border bg-background"
        )}
      >
        {isSelected && <Check className="size-3 stroke-[3]" />}
      </span>

      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

interface ChoicePanelProps {
  tone?: "green" | "yellow" | "blue" | "red";
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

function ChoicePanel({
  tone = "yellow",
  side = "right",
  children,
  className,
}: ChoicePanelProps) {
  const toneBg = tones[tone] || "bg-muted";

  return (
    <div
      data-testid="choice-panel"
      className={cn(
        "col-span-2 space-y-3 rounded-xl border border-foreground/30 p-3.5 transition-all",
        side === "right" ? "rounded-tr-none" : "rounded-tl-none",
        toneBg,
        className
      )}
    >
      {children}
    </div>
  );
}

// Sample Instagram posts for "Specific post" selector
const SAMPLE_POSTS = [
  {
    id: "post-1",
    caption: "🚀 Our new AI Automation system is live! Comment 'LINK' below to get free access.",
    thumbnail: "/images/platforms/instagram.svg",
    date: "2 days ago",
  },
  {
    id: "post-2",
    caption: "5 growth tactics every creator needs to scale in 2026. Drop 'GROWTH' for the guide 📈",
    thumbnail: "/images/platforms/threads.svg",
    date: "5 days ago",
  },
  {
    id: "post-3",
    caption: "Behind the scenes building Reerts SaaS. Comment 'CODE' for the full repository stack.",
    thumbnail: "/images/platforms/tiktok-light.svg",
    date: "1 week ago",
  },
  {
    id: "post-4",
    caption: "Stop sending manual DMs. Here is how we automated 12,000 leads in 48 hours. Comment 'AUTODM'",
    thumbnail: "/images/platforms/x-light.svg",
    date: "2 weeks ago",
  },
];

interface NewAutomationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<AutomationItem>, activate: boolean) => void;
  initialData?: AutomationItem | null;
  accountHandle?: string;
}

export function NewAutomationDrawer({
  isOpen,
  onClose,
  onSave,
  initialData,
  accountHandle = "theaiseed",
}: NewAutomationDrawerProps) {
  // Trigger state (null initially, or "comment" / "dm")
  const [triggerType, setTriggerType] = useState<"comment" | "dm" | null>(null);

  // Progressive Disclosure: unlockedStep 1 = Target Post, 2 = Keywords, 3 = Actions, 4 = They will get, 5 = Final DM / Go Live
  const [unlockedStep, setUnlockedStep] = useState<number>(1);

  // Step 1: Target post state
  const [targetPost, setTargetPost] = useState<"any" | "specific">("any");
  const [selectedPostId, setSelectedPostId] = useState<string>("post-1");
  const [isPostPickerOpen, setIsPostPickerOpen] = useState(false);

  // Step 2: Keywords state
  const [keywordsType, setKeywordsType] = useState<"any" | "specific">("any");
  const [keywords, setKeywords] = useState("Price, Link, Shop");
  const [matchType, setMatchType] = useState<"contains" | "exact">("contains");

  // Step 3: Action state
  const [actionType, setActionType] = useState<"dm" | "reply" | "hide" | "delete">("dm");

  // Comment public reply variants
  const [replyToggle, setReplyToggle] = useState(false);
  const [replyVariants, setReplyVariants] = useState<string[]>([
    "xddfd{{username}}",
    "Reply 2",
  ]);

  // Advanced priority
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [priority, setPriority] = useState<number>(0);

  // Step 4: "They will get"
  const [openingDm, setOpeningDm] = useState(true);
  const [openingText, setOpeningText] = useState("gfds");
  const [openingButtonLabel, setOpeningButtonLabel] = useState("gfds");
  const [showOpeningWhy, setShowOpeningWhy] = useState(false);

  // Follow request gate
  const [followGate, setFollowGate] = useState(false);
  const [followGateText, setFollowGateText] = useState(
    "Please follow me first to get the link! Tap the button below once you do 😊"
  );
  const [followGateButtonLabel, setFollowGateButtonLabel] = useState("Following");

  // Collect emails gate
  const [emailGate, setEmailGate] = useState(false);
  const [emailGateText, setEmailGateText] = useState(
    "Drop your email before I send the link! I save the best bits for my email family 💌"
  );
  const [emailDelivery, setEmailDelivery] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);

  // Step 5: Final DM ("And then, they will get")
  const [finalDm, setFinalDm] = useState("gfdsgf");
  const [links, setLinks] = useState<{ label: string; url: string }[]>([
    { label: "Get the link", url: "https://posteady.com" },
  ]);

  // DM-only trigger state (when "When a DM arrives" is selected)
  const [dmReplyText, setDmReplyText] = useState("Hello {{username}}! Thanks for messaging us. How can we help?");

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [previewTab, setPreviewTab] = useState<"post" | "comments" | "dm">("post");
  const [liveTime, setLiveTime] = useState("13:35");

  const formScrollRef = useRef<HTMLDivElement>(null);

  // Live clock for iPhone status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      setLiveTime(`${hrs}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Reset or initialize when opened
  useEffect(() => {
    if (initialData) {
      setTriggerType(initialData.triggerType === "dm" ? "dm" : "comment");
      setFinalDm(initialData.dmContent || "pls check DM!{{username}}");
      setKeywords(initialData.keywords || "Price, Link, Shop");
      setKeywordsType(initialData.keywords === "All DMs" ? "any" : "specific");
      setUnlockedStep(5);
    } else if (isOpen) {
      // Default initial state: open with trigger selection (or comment selected as in Screenshot 1)
      setTriggerType("comment");
      setUnlockedStep(1);
      setTargetPost("any");
      setKeywordsType("any");
      setKeywords("Price, Link, Shop");
      setActionType("dm");
      setReplyToggle(false);
      setOpeningDm(true);
      setOpeningText("gfds");
      setOpeningButtonLabel("gfds");
      setFollowGate(false);
      setEmailGate(false);
      setEmailDelivery(false);
      setFinalDm("gfdsgf");
      setErrorMsg(null);
      setPreviewTab("post");
    }
  }, [initialData, isOpen]);

  // Sync preview tab with current step
  useEffect(() => {
    if (unlockedStep >= 4) {
      setPreviewTab("dm");
    } else if (unlockedStep >= 2) {
      setPreviewTab("comments");
    } else {
      setPreviewTab("post");
    }
  }, [unlockedStep]);

  if (!isOpen) return null;

  // Insert token helper
  const insertToken = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    current: string
  ) => {
    setter(current + "{{username}}");
  };

  const insertTokenToReply = (index: number) => {
    setReplyVariants((prev) => {
      const copy = [...prev];
      copy[index] = (copy[index] || "") + "{{username}}";
      return copy;
    });
  };

  const addReply = () => {
    if (replyVariants.length >= 3) {
      toast.error("You can add up to 3 replies.");
      return;
    }
    setReplyVariants((prev) => [...prev, `Reply ${prev.length + 1}`]);
  };

  const removeReply = (index: number) => {
    setReplyVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const addKeywordExample = (kw: string) => {
    if (keywords.includes(kw)) return;
    setKeywords((prev) => (prev ? `${prev}, ${kw}` : kw));
  };

  // Step advancement handler on clicking "Next"
  const handleNextStep = () => {
    setErrorMsg(null);

    if (triggerType === "dm") {
      if (unlockedStep === 1) {
        setUnlockedStep(2);
      }
      return;
    }

    // Comment automation validation per step
    if (unlockedStep === 1) {
      setUnlockedStep(2);
      setPreviewTab("comments");
      setTimeout(() => {
        formScrollRef.current?.scrollTo({ top: 300, behavior: "smooth" });
      }, 50);
    } else if (unlockedStep === 2) {
      if (keywordsType === "specific" && !keywords.trim()) {
        setErrorMsg("Enter valid keywords.");
        return;
      }
      setUnlockedStep(3);
      setTimeout(() => {
        formScrollRef.current?.scrollTo({ top: 600, behavior: "smooth" });
      }, 50);
    } else if (unlockedStep === 3) {
      setUnlockedStep(4);
      setPreviewTab("dm");
      setTimeout(() => {
        formScrollRef.current?.scrollTo({ top: 900, behavior: "smooth" });
      }, 50);
    } else if (unlockedStep === 4) {
      if (openingDm && (!openingText || openingText.trim() === "")) {
        setErrorMsg("Enter the opening DM message.");
        return;
      }
      if (openingDm && (!openingButtonLabel || openingButtonLabel.trim() === "")) {
        setErrorMsg("Enter a button label for the opening DM.");
        return;
      }
      if (followGate && !followGateText.trim()) {
        setErrorMsg("Enter the follow request message.");
        return;
      }
      if (emailGate && !emailGateText.trim()) {
        setErrorMsg("Enter the email request message.");
        return;
      }
      setUnlockedStep(5);
      setTimeout(() => {
        formScrollRef.current?.scrollTo({ top: 1200, behavior: "smooth" });
      }, 50);
    }
  };

  // Step back handler
  const handleBackStep = () => {
    setErrorMsg(null);
    setUnlockedStep((prev) => Math.max(1, prev - 1));
  };

  // Go live action
  const handleGoLive = () => {
    if (triggerType === "dm") {
      if (!dmReplyText.trim()) {
        setErrorMsg("Please enter the reply message.");
        return;
      }
    } else {
      if (!finalDm.trim()) {
        setErrorMsg("Please enter the DM message.");
        return;
      }
      if (emailDelivery && !emailConsent) {
        setErrorMsg("Confirm the email usage notice before activating.");
        return;
      }
    }

    onSave(
      {
        triggerType: triggerType || "comment",
        actionType: actionType === "dm" ? "DM" : "Reply",
        keywords: keywordsType === "any" ? (triggerType === "dm" ? "All DMs" : "Any word") : keywords,
        dmContent: triggerType === "dm" ? dmReplyText : finalDm,
        targetPost: targetPost === "any" ? "—" : "Specific post",
        opening: openingDm ? (openingText || "Active") : "—",
        followCheck: followGate,
        emailCheck: emailGate,
      },
      true // active = true (Go live)
    );
    toast.success("Automation is now live!");
    onClose();
  };

  // Save Draft action
  const handleSaveDraft = () => {
    onSave(
      {
        triggerType: triggerType || "comment",
        actionType: actionType === "dm" ? "DM" : "Reply",
        keywords: keywordsType === "any" ? (triggerType === "dm" ? "All DMs" : "Any word") : keywords,
        dmContent: (triggerType === "dm" ? dmReplyText : finalDm) || "Draft automation",
        targetPost: targetPost === "any" ? "—" : "Specific post",
        opening: openingDm ? (openingText || "Draft") : "—",
        followCheck: followGate,
        emailCheck: emailGate,
      },
      false // active = false (Draft)
    );
    toast.info("Draft saved successfully.");
    onClose();
  };

  const handleCloseAttempt = () => {
    if (openingText || finalDm !== "gfdsgf" || unlockedStep > 1) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const selectedPost = SAMPLE_POSTS.find((p) => p.id === selectedPostId) || SAMPLE_POSTS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* 1. Dark Backdrop covering the entire window (sidebar and background page are visible underneath) */}
      <div
        onClick={handleCloseAttempt}
        className={cn(
          "fixed inset-0 bg-black/45 backdrop-blur-2xs transition-opacity duration-300 ease-out z-40",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* 2. Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-foreground text-base tracking-tight">
              Discard unsaved changes?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your unsaved changes will be lost.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-semibold hover:bg-muted text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose();
                }}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Specific Post Selector Modal */}
      {isPostPickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h4 className="font-bold text-foreground text-base">Select a Post</h4>
              <button
                type="button"
                onClick={() => setIsPostPickerOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto py-2">
              {SAMPLE_POSTS.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setIsPostPickerOpen(false);
                  }}
                  className={cn(
                    "flex flex-col gap-2 p-3 rounded-xl border text-left cursor-pointer transition-all hover:brightness-95",
                    selectedPostId === post.id
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-background"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative size-6 rounded-full overflow-hidden shrink-0">
                      <Image src={post.thumbnail} alt="thumb" fill className="object-cover" />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground">{post.date}</span>
                  </div>
                  <p className="text-xs text-foreground line-clamp-3 leading-relaxed">
                    {post.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Drawer Container: Positioned above page, starts beside the sidebar (left-0 on mobile, md:left-[224px]) */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 md:left-[224px] z-50 flex items-stretch shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* LEFT COLUMN: Form configuration panel */}
        <div className="w-[390px] sm:w-[420px] shrink-0 border-r border-border bg-card flex flex-col h-full overflow-hidden shadow-2xl">
          {/* Drawer Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 px-6 bg-card/60">
            <div className="flex items-center gap-2">
              <span className="text-base text-foreground font-semibold">✳</span>
              <h2 className="text-base font-bold text-foreground tracking-tight">
                {initialData ? "Edit automation" : "New automation"}
              </h2>
            </div>

            {/* Black rounded square Close button matching reference screenshot */}
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="flex size-7 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
              title="Close"
            >
              <X className="size-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Form Scroll Area */}
          <div
            ref={formScrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-foreground hide-scrollbar"
          >
            {/* Step 0: What should start this automation? */}
            <section data-testid="flow-step-0" className="space-y-3">
              <h3 className="text-sm font-bold text-foreground tracking-tight">
                What should start this automation?
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <ChoiceBox
                  value="comment"
                  currentValue={triggerType || ""}
                  onSelect={(val) => {
                    setTriggerType(val as any);
                    setUnlockedStep(1);
                  }}
                  tone="green"
                  label="When a comment is posted"
                  icon={<MessageSquare className="size-4 shrink-0 text-foreground/80" />}
                />
                <ChoiceBox
                  value="dm"
                  currentValue={triggerType || ""}
                  onSelect={(val) => {
                    setTriggerType(val as any);
                    setUnlockedStep(1);
                  }}
                  tone="blue"
                  label="When a DM arrives"
                  icon={<Send className="size-4 shrink-0 text-foreground/80" />}
                />
              </div>
            </section>

            {/* IF TRIGGER IS "COMMENT" */}
            {triggerType === "comment" && (
              <>
                {/* Step 1: Target post selection */}
                <section data-testid="flow-step-1" className="space-y-3 pt-1">
                  <h4 className="font-semibold text-foreground text-xs">
                    {targetPost === "any"
                      ? "When someone comments on any post"
                      : "When someone comments on a specific post"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <ChoiceBox
                      value="any"
                      currentValue={targetPost}
                      onSelect={(val) => setTargetPost(val as any)}
                      tone="green"
                      label="Any posts"
                    />
                    <ChoiceBox
                      value="specific"
                      currentValue={targetPost}
                      onSelect={(val) => setTargetPost(val as any)}
                      tone="yellow"
                      label="Specific post"
                      connected={targetPost === "specific"}
                    />

                    {/* Connected Panel for Specific Post */}
                    {targetPost === "specific" && (
                      <ChoicePanel tone="yellow">
                        <div className="flex items-center gap-3 rounded-lg border border-foreground/20 bg-background/80 p-2.5">
                          <div className="relative size-10 rounded-md overflow-hidden shrink-0 border border-border">
                            <Image src={selectedPost.thumbnail} alt="post" fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">
                              {selectedPost.caption}
                            </p>
                            <span className="text-[10px] text-muted-foreground">{selectedPost.date}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsPostPickerOpen(true)}
                            className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
                          >
                            Change post
                          </button>
                        </div>
                      </ChoicePanel>
                    )}
                  </div>
                </section>

                {/* Step 2: Comment keywords selection (revealed when unlockedStep >= 2) */}
                {unlockedStep >= 2 && (
                  <section data-testid="flow-step-2" className="space-y-3 pt-2 border-t border-border/70 animate-in fade-in slide-in-from-top-2 duration-200">
                    <h4 className="font-semibold text-foreground text-xs">
                      And this comment has
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <ChoiceBox
                        value="any"
                        currentValue={keywordsType}
                        onSelect={(val) => setKeywordsType(val as any)}
                        tone="green"
                        label="any word"
                      />
                      <ChoiceBox
                        value="specific"
                        currentValue={keywordsType}
                        onSelect={(val) => setKeywordsType(val as any)}
                        tone="yellow"
                        label="a specific word or words"
                        connected={keywordsType === "specific"}
                      />

                      {/* Connected Panel for Specific Keywords */}
                      {keywordsType === "specific" && (
                        <ChoicePanel tone="yellow" className="space-y-2.5">
                          <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Price, Link, Shop"
                            className="w-full rounded-xl border border-foreground/30 bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary font-mono shadow-2xs"
                          />
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="font-medium text-foreground/70">For example:</span>
                            {["Price", "Link", "Shop", "Guide"].map((kw) => (
                              <button
                                key={kw}
                                type="button"
                                onClick={() => addKeywordExample(kw)}
                                className="rounded-md border border-foreground/20 bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-foreground hover:bg-background transition-colors"
                              >
                                {kw}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] text-muted-foreground">Match type:</span>
                            <select
                              value={matchType}
                              onChange={(e) => setMatchType(e.target.value as any)}
                              className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none"
                            >
                              <option value="contains">Contains keyword</option>
                              <option value="exact">Exact match</option>
                            </select>
                          </div>
                        </ChoicePanel>
                      )}
                    </div>
                  </section>
                )}

                {/* Step 3: Action "Then" (revealed when unlockedStep >= 3) */}
                {unlockedStep >= 3 && (
                  <section data-testid="flow-step-3" className="space-y-3 pt-2 border-t border-border/70 animate-in fade-in slide-in-from-top-2 duration-200">
                    <h4 className="font-semibold text-foreground text-xs">Then</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <ChoiceBox
                        value="dm"
                        currentValue={actionType}
                        onSelect={(val) => setActionType(val as any)}
                        tone="blue"
                        label="Send a DM"
                        icon={<Send className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                      />
                      <ChoiceBox
                        value="reply"
                        currentValue={actionType}
                        onSelect={(val) => setActionType(val as any)}
                        tone="blue"
                        label="Reply only"
                        icon={<MessageSquare className="size-3.5 shrink-0" />}
                      />
                      <ChoiceBox
                        value="hide"
                        currentValue={actionType}
                        onSelect={(val) => setActionType(val as any)}
                        tone="neutral"
                        label="Hide the comment"
                        icon={<EyeOff className="size-3.5 shrink-0" />}
                      />
                      <ChoiceBox
                        value="delete"
                        currentValue={actionType}
                        onSelect={(val) => setActionType(val as any)}
                        tone="red"
                        label="Delete the comment"
                        icon={<Trash2 className="size-3.5 shrink-0" />}
                      />
                    </div>

                    {/* Reply toggle switch */}
                    {actionType !== "hide" && actionType !== "delete" && (
                      <div className="pt-2 space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <div
                            onClick={() => setReplyToggle(!replyToggle)}
                            className={cn(
                              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                              replyToggle ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block size-4 transform rounded-full bg-white dark:bg-black shadow-sm ring-0 transition duration-200 ease-in-out",
                                replyToggle ? "translate-x-4" : "translate-x-0"
                              )}
                            />
                          </div>
                          <span className="font-semibold text-foreground text-xs">
                            Reply to their comment under the post
                          </span>
                        </label>

                        {/* Reply variants */}
                        {replyToggle && (
                          <div className="space-y-3 pl-12">
                            {replyVariants.map((rep, idx) => (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <button
                                    type="button"
                                    onClick={() => insertTokenToReply(idx)}
                                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                                  >
                                    <span>+ Insert their name</span>
                                  </button>
                                  {replyVariants.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeReply(idx)}
                                      className="text-muted-foreground hover:text-foreground"
                                      title="Remove reply"
                                    >
                                      <X className="size-3.5" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                  {"{{username}} is replaced with the commenter's name."}
                                </p>
                                <textarea
                                  rows={2}
                                  value={rep}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setReplyVariants((prev) => {
                                      const copy = [...prev];
                                      copy[idx] = val;
                                      return copy;
                                    });
                                  }}
                                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground font-mono resize-none outline-none focus:border-primary"
                                />
                              </div>
                            ))}

                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={addReply}
                                className="inline-flex items-center gap-1 font-bold text-foreground hover:opacity-80"
                              >
                                <Plus className="size-3.5" />
                                <span>Add a reply</span>
                              </button>
                              <span className="text-[10px] text-muted-foreground">
                                If you add several, one is picked at random.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Advanced Accordion */}
                    <div className="pt-2 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground"
                      >
                        {isAdvancedOpen ? (
                          <ChevronDown className="size-3.5" />
                        ) : (
                          <ChevronRight className="size-3.5" />
                        )}
                        <span>Advanced</span>
                      </button>

                      {isAdvancedOpen && (
                        <div className="mt-3 flex items-center gap-3 pl-4">
                          <span className="font-semibold text-foreground">Priority</span>
                          <input
                            type="number"
                            value={priority}
                            onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                            className="w-20 rounded-lg border border-border bg-background px-3 py-1.5 text-foreground font-mono outline-none focus:border-primary"
                          />
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Step 4: "They will get" Section (revealed when unlockedStep >= 4) */}
                {unlockedStep >= 4 && (
                  <section data-testid="flow-step-4" className="space-y-4 pt-3 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-foreground tracking-tight">They will get</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Instagram allows up to 250 comment DMs per account per hour. Anyone over the limit
                        gets theirs automatically a little later.
                      </p>
                    </div>

                    {/* Card 1: Opening DM */}
                    <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => setOpeningDm(!openingDm)}
                            className={cn(
                              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                              openingDm ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block size-4 transform rounded-full bg-white dark:bg-black shadow-sm ring-0 transition duration-200 ease-in-out",
                                openingDm ? "translate-x-4" : "translate-x-0"
                              )}
                            />
                          </div>
                          <span className="font-bold text-foreground text-xs">Opening DM</span>
                        </div>

                        <span className="rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-foreground">
                          Recommended
                        </span>
                      </div>

                      {openingDm && (
                        <div className="space-y-2.5 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => insertToken(setOpeningText, openingText)}
                              className="font-semibold text-primary hover:underline"
                            >
                              + Insert their name
                            </button>
                            <span className="text-muted-foreground font-mono">
                              {openingText.length}/640 chars
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {"{{username}} is replaced with the commenter's name."}
                          </p>
                          <textarea
                            rows={3}
                            value={openingText}
                            onChange={(e) => {
                              setOpeningText(e.target.value);
                              if (errorMsg) setErrorMsg(null);
                            }}
                            placeholder="Message to send first"
                            className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground resize-none outline-none focus:border-primary leading-relaxed"
                          />

                          <div>
                            <input
                              type="text"
                              value={openingButtonLabel}
                              onChange={(e) => setOpeningButtonLabel(e.target.value)}
                              placeholder="Button label (e.g. Get the link)"
                              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                            />
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() => setShowOpeningWhy(!showOpeningWhy)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                            >
                              <Info className="size-3 text-muted-foreground" />
                              <span>Why does an Opening DM matter?</span>
                            </button>

                            {showOpeningWhy && (
                              <div className="mt-2 rounded-xl bg-muted/60 p-3 text-[11px] space-y-1.5 text-muted-foreground border border-border/60">
                                <p className="font-bold text-foreground">What does an Opening DM do?</p>
                                <p>
                                  Opening DMs boost engagement in comment-to-DM automations. Only one private
                                  reply is allowed per comment. Spend it on a first message with a button — the
                                  moment they tap it, a 24-hour chat window opens so you can do way more than just
                                  send a link.
                                </p>
                                <p className="font-semibold text-foreground pt-1">The Opening DM allows you to:</p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                  <li><strong>Send a follow up:</strong> Deliver the promised link DM to anyone who taps the button.</li>
                                  <li><strong>Grow your followers:</strong> Automatically ask them to follow you before sending the link.</li>
                                  <li><strong>Collect emails:</strong> Ask for their email in a DM to connect with them beyond social.</li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card 2: Follow request gate */}
                    <div className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setFollowGate(!followGate)}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                            followGate ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block size-4 transform rounded-full bg-white dark:bg-black shadow-sm ring-0 transition duration-200 ease-in-out",
                              followGate ? "translate-x-4" : "translate-x-0"
                            )}
                          />
                        </div>
                        <span className="font-bold text-foreground text-xs">Follow request</span>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed pl-12">
                        Ask for a follow before sending the link. Non-followers get this message first — once
                        they follow and tap the button, the link DM goes out.
                      </p>

                      {!openingDm && followGate && (
                        <div className="ml-12 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-[11px]">
                          The follow request needs the opening DM turned on.
                        </div>
                      )}

                      {followGate && openingDm && (
                        <div className="pl-12 pt-2 space-y-2">
                          <textarea
                            rows={2}
                            value={followGateText}
                            onChange={(e) => setFollowGateText(e.target.value)}
                            placeholder="Please follow me first to get the link! Tap the button below once you do 😊"
                            className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground resize-none outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={followGateButtonLabel}
                            onChange={(e) => setFollowGateButtonLabel(e.target.value)}
                            placeholder="Button label (e.g. Following)"
                            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
                          />
                        </div>
                      )}
                    </div>

                    {/* Card 3: Collect emails gate */}
                    <div className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setEmailGate(!emailGate)}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                            emailGate ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block size-4 transform rounded-full bg-white dark:bg-black shadow-sm ring-0 transition duration-200 ease-in-out",
                              emailGate ? "translate-x-4" : "translate-x-0"
                            )}
                          />
                        </div>
                        <span className="font-bold text-foreground text-xs">Collect emails</span>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed pl-12">
                        Ask for an email before sending the link. When they reply with their email it lands in
                        Leads and the link DM goes out. Invalid replies get asked again.
                      </p>

                      {!openingDm && emailGate && (
                        <div className="ml-12 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-[11px]">
                          The email request needs the opening DM turned on.
                        </div>
                      )}

                      {emailGate && openingDm && (
                        <div className="pl-12 pt-2 space-y-2">
                          <textarea
                            rows={2}
                            value={emailGateText}
                            onChange={(e) => setEmailGateText(e.target.value)}
                            placeholder="Drop your email before I send the link! I save the best bits for my email family 💌"
                            className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground resize-none outline-none focus:border-primary"
                          />
                        </div>
                      )}
                    </div>

                    {/* Card 4: Also send the resource by email (PRO) */}
                    <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => setEmailDelivery(!emailDelivery)}
                            className={cn(
                              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                              emailDelivery ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block size-4 transform rounded-full bg-white dark:bg-black shadow-sm ring-0 transition duration-200 ease-in-out",
                                emailDelivery ? "translate-x-4" : "translate-x-0"
                              )}
                            />
                          </div>
                          <span className="font-bold text-foreground text-xs">Also send the resource by email</span>
                        </div>
                        <span className="rounded-full bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-bold">
                          PRO
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed pl-12">
                        When they reply with an email address, the email below goes out along with the link DM.
                        Supports a PDF attachment and a reply-to address.
                      </p>

                      {emailDelivery && (
                        <div className="pl-12 pt-1 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={emailConsent}
                              onChange={(e) => setEmailConsent(e.target.checked)}
                              className="mt-0.5 rounded border-border"
                            />
                            <span className="text-[11px] text-muted-foreground leading-tight">
                              I will use the collected email addresses only to deliver the requested resource.
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Step 5: Final DM Section (revealed when unlockedStep >= 5) */}
                {unlockedStep >= 5 && (
                  <section data-testid="flow-step-5" className="space-y-5 pt-3 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-foreground tracking-tight">
                        And then, they will get
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        This is the final delivered DM with your resource or link.
                      </p>
                    </div>

                    {/* Final DM Content */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => insertToken(setFinalDm, finalDm)}
                          className="font-semibold text-primary hover:underline text-[11px]"
                        >
                          + Insert their name
                        </button>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {finalDm.length}/640 chars
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {"{{username}} is replaced with the commenter's name."}
                      </p>
                      <textarea
                        rows={4}
                        value={finalDm}
                        onChange={(e) => setFinalDm(e.target.value)}
                        placeholder="Write a message"
                        className="w-full rounded-xl border border-border bg-background p-3.5 text-xs text-foreground font-mono resize-none outline-none focus:border-primary leading-relaxed shadow-2xs"
                      />
                    </div>

                    {/* Link Buttons */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground text-xs">Action Link Buttons (up to 3)</h4>
                        {links.length < 3 && (
                          <button
                            type="button"
                            onClick={() =>
                              setLinks([...links, { label: "Get the link", url: "https://posteady.com" }])
                            }
                            className="font-bold text-primary hover:underline text-[11px] inline-flex items-center gap-1"
                          >
                            <Plus className="size-3" />
                            <span>Add a link</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {links.map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => {
                                const copy = [...links];
                                copy[idx].label = e.target.value;
                                setLinks(copy);
                              }}
                              placeholder="Button label"
                              className="w-1/3 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                            />
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => {
                                const copy = [...links];
                                copy[idx].url = e.target.value;
                                setLinks(copy);
                              }}
                              placeholder="https://"
                              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setLinks(links.filter((_, i) => i !== idx))}
                              className="text-muted-foreground hover:text-foreground p-1"
                              title="Remove link"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}

            {/* IF TRIGGER IS "DM" (Reference behavior: no mobile preview, direct reply DM flow) */}
            {triggerType === "dm" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <section className="space-y-3">
                  <h4 className="font-semibold text-foreground text-xs">And this DM has</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <ChoiceBox
                      value="any"
                      currentValue={keywordsType}
                      onSelect={(val) => setKeywordsType(val as any)}
                      tone="green"
                      label="any word"
                    />
                    <ChoiceBox
                      value="specific"
                      currentValue={keywordsType}
                      onSelect={(val) => setKeywordsType(val as any)}
                      tone="yellow"
                      label="a specific word or words"
                      connected={keywordsType === "specific"}
                    />

                    {keywordsType === "specific" && (
                      <ChoicePanel tone="yellow" className="space-y-2">
                        <input
                          type="text"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          placeholder="Price, Link, Shop"
                          className="w-full rounded-xl border border-foreground/30 bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary font-mono shadow-2xs"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          Enter keywords separated by commas.
                        </p>
                      </ChoicePanel>
                    )}
                  </div>
                </section>

                {unlockedStep >= 2 && (
                  <section className="space-y-3 pt-2 border-t border-border/70 animate-in fade-in slide-in-from-top-2 duration-200">
                    <h4 className="font-semibold text-foreground text-xs">Reply DM</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => insertToken(setDmReplyText, dmReplyText)}
                          className="font-semibold text-primary hover:underline text-[11px]"
                        >
                          + Insert their name
                        </button>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {dmReplyText.length}/1000 bytes
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={dmReplyText}
                        onChange={(e) => setDmReplyText(e.target.value)}
                        placeholder="Hello {{username}}! Thanks for messaging us..."
                        className="w-full rounded-xl border border-border bg-background p-3.5 text-xs text-foreground font-mono resize-none outline-none focus:border-primary leading-relaxed shadow-2xs"
                      />
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* Error Message Callout */}
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Intermediate Next Button matching Screenshot 1 */}
            {triggerType && unlockedStep < (triggerType === "dm" ? 2 : 5) && (
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-xl bg-black px-6 py-2 text-xs font-bold text-white dark:bg-white dark:text-black hover:opacity-90 shadow-sm transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Drawer Bottom Actions: Shown on final step (or draft option) */}
          {triggerType && unlockedStep >= (triggerType === "dm" ? 2 : 5) && (
            <div className="flex h-16 shrink-0 items-center justify-between border-t border-border px-6 bg-card/60">
              <button
                type="button"
                onClick={handleBackStep}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-colors"
              >
                Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-colors"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={handleGoLive}
                  className="rounded-xl bg-black px-6 py-2 text-xs font-bold text-white dark:bg-white dark:text-black hover:opacity-90 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="size-3.5 fill-current" />
                  <span>Go live</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Conditional Mobile Preview (Only when "When a comment is posted" is selected) */}
        {triggerType === "comment" && isPreviewExpanded && (
          <div className="w-[430px] shrink-0 border-r border-border bg-neutral-100/95 dark:bg-neutral-900/60 p-5 flex flex-col items-center justify-center relative select-none overflow-hidden backdrop-blur-xs animate-in fade-in duration-200">
            {/* Toggle collapse preview button ◀ matching reference screenshot */}
            <button
              type="button"
              onClick={() => setIsPreviewExpanded(false)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex size-6 items-center justify-center rounded-full bg-black text-white hover:opacity-80 shadow-md transition-transform"
              title="Collapse preview"
            >
              <ChevronLeft className="size-3.5" />
            </button>

            {/* iPhone Device Outer Frame with Hardware Buttons */}
            <div className="relative w-[310px] h-[640px] flex items-center justify-center">
              {/* Left Side Hardware Buttons (Mute + Volume) */}
              <span aria-hidden={true} className="absolute -left-[3px] top-[95px] h-6 w-[3px] rounded-l-md bg-neutral-500/80" />
              <span aria-hidden={true} className="absolute -left-[3px] top-[135px] h-11 w-[3px] rounded-l-md bg-neutral-500/80" />
              <span aria-hidden={true} className="absolute -left-[3px] top-[195px] h-11 w-[3px] rounded-l-md bg-neutral-500/80" />
              {/* Right Side Hardware Button (Power) */}
              <span aria-hidden={true} className="absolute -right-[3px] top-[145px] h-14 w-[3px] rounded-r-md bg-neutral-500/80" />

              {/* iPhone Metallic Outer Chassis */}
              <div className="relative w-full h-full rounded-[48px] bg-gradient-to-b from-neutral-400 via-neutral-700 to-neutral-400 p-[2px] shadow-2xl">
                {/* Inner Black Bezel */}
                <div className="w-full h-full rounded-[46px] bg-black p-[5px]">
                  {/* Inner Screen */}
                  <div className="relative w-full h-full rounded-[41px] bg-white text-black overflow-hidden flex flex-col font-sans">
                    {/* Status Bar */}
                    <div className="flex h-10 shrink-0 items-center justify-between px-6 pt-2 text-[11px] font-semibold text-black z-30">
                      <span className="tracking-tight">{liveTime}</span>

                      {/* Dynamic Island pill with camera reflection */}
                      <div className="relative flex h-[22px] w-[86px] items-center justify-end rounded-full bg-black pr-2">
                        <span className="relative size-2.5 rounded-full bg-neutral-800">
                          <span className="absolute left-[3px] top-[3px] size-1 rounded-full bg-neutral-600/80" />
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-normal">
                        <span className="font-semibold text-[10px]">5G</span>
                        {/* Battery Icon */}
                        <div className="flex h-[10px] w-[19px] items-center rounded-[3px] border border-black/80 px-[1.5px]">
                          <div className="h-[6px] w-full rounded-[1px] bg-black" />
                        </div>
                      </div>
                    </div>

                    {/* Header Tabs: Comments / DM (shown once unlockedStep >= 2, or Post view for Step 1) */}
                    {unlockedStep >= 2 ? (
                      <div className="flex items-center justify-center gap-6 border-b border-neutral-100 pb-2 text-xs font-semibold z-10">
                        <button
                          type="button"
                          onClick={() => setPreviewTab("comments")}
                          className={cn(
                            "pb-1 transition-colors relative",
                            previewTab === "comments"
                              ? "text-black font-bold"
                              : "text-neutral-400 hover:text-neutral-600"
                          )}
                        >
                          <span>Comments</span>
                          {previewTab === "comments" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab("dm")}
                          className={cn(
                            "pb-1 transition-colors relative",
                            previewTab === "dm"
                              ? "text-black font-bold"
                              : "text-neutral-400 hover:text-neutral-600"
                          )}
                        >
                          <span>DM</span>
                          {previewTab === "dm" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                          )}
                        </button>
                      </div>
                    ) : (
                      /* Initial Header: Profile and Handle matching Screenshot 1 */
                      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-100">
                        <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                          {accountHandle[0]?.toUpperCase() || "T"}
                        </div>
                        <span className="font-bold text-xs text-neutral-900">{accountHandle}</span>
                      </div>
                    )}

                    {/* iPhone Screen Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* 1. Initial State for Step 1 matching Screenshot 1 */}
                      {unlockedStep === 1 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                          <p className="text-neutral-400 text-xs font-medium">
                            {targetPost === "specific" && selectedPost
                              ? selectedPost.caption
                              : "Applies to every post"}
                          </p>
                        </div>
                      ) : previewTab === "comments" ? (
                        /* Comments view */
                        <div className="space-y-4 pt-1">
                          <div className="flex items-start gap-2.5">
                            <div className="size-7 rounded-full bg-neutral-400 shrink-0" />
                            <div className="space-y-0.5 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[11px]">username</span>
                                <span className="text-neutral-400 text-[10px]">· Now</span>
                              </div>
                              <p className="text-neutral-800 text-xs">
                                {keywordsType === "specific" && keywords
                                  ? keywords.split(",")[0].trim()
                                  : "Comment text"}
                              </p>
                            </div>
                          </div>

                          {/* Public reply thread mockup */}
                          {replyToggle && replyVariants[0] && (
                            <div className="ml-8 flex items-start gap-2.5 border-l-2 border-neutral-200 pl-3">
                              <div className="size-6 rounded-full bg-black shrink-0 flex items-center justify-center text-white text-[9px] font-bold">
                                {accountHandle[0]?.toUpperCase() || "A"}
                              </div>
                              <div className="space-y-0.5 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-[11px]">@{accountHandle}</span>
                                  <span className="text-neutral-400 text-[10px]">· Now</span>
                                </div>
                                <p className="text-neutral-800 text-xs whitespace-pre-wrap">
                                  {replyVariants[0].replace("{{username}}", "@username")}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* DM Thread view matching Screenshot 2 */
                        <div className="space-y-3 pt-1">
                          {/* Sender header with handle matching screenshot 2 */}
                          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                            <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                              {accountHandle[0]?.toUpperCase() || "T"}
                            </div>
                            <span className="font-bold text-xs text-neutral-900">{accountHandle}</span>
                          </div>

                          {/* 1. Opening DM message bubble from account */}
                          {openingDm && (
                            <div className="space-y-2">
                              {/* Left side message bubble */}
                              <div className="flex items-end gap-2">
                                <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                  {accountHandle[0]?.toUpperCase() || "T"}
                                </div>
                                <div className="max-w-[80%] rounded-2xl bg-neutral-100 px-3.5 py-2.5 text-xs text-neutral-900 leading-relaxed shadow-2xs">
                                  {openingText || "gfds"}
                                </div>
                              </div>

                              {/* Interactive button inside or under opening DM */}
                              {openingButtonLabel && (
                                <div className="ml-8 max-w-[80%]">
                                  <div className="rounded-xl border border-neutral-200 bg-white py-2 text-center text-xs font-semibold text-neutral-800 shadow-2xs">
                                    {openingButtonLabel}
                                  </div>
                                </div>
                              )}

                              {/* Right side user tap bubble (black bubble matching screenshot 2) */}
                              <div className="flex justify-end pt-1">
                                <div className="max-w-[80%] rounded-2xl bg-black px-3.5 py-2 text-xs font-medium text-white shadow-2xs">
                                  {openingButtonLabel || "gfds"}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. Follow Gate Simulation */}
                          {followGate && openingDm && (
                            <div className="space-y-2 pt-1">
                              <div className="flex items-end gap-2">
                                <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                  {accountHandle[0]?.toUpperCase() || "T"}
                                </div>
                                <div className="max-w-[80%] rounded-2xl bg-neutral-100 px-3.5 py-2.5 text-xs text-neutral-900 leading-relaxed shadow-2xs">
                                  {followGateText}
                                </div>
                              </div>
                              <div className="ml-8 max-w-[80%]">
                                <div className="rounded-xl border border-neutral-200 bg-white py-2 text-center text-xs font-semibold text-neutral-800 shadow-2xs">
                                  {followGateButtonLabel}
                                </div>
                              </div>
                              <div className="flex justify-end pt-1">
                                <div className="max-w-[80%] rounded-2xl bg-black px-3.5 py-2 text-xs font-medium text-white shadow-2xs">
                                  {followGateButtonLabel}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 3. Email Gate Simulation */}
                          {emailGate && openingDm && (
                            <div className="space-y-2 pt-1">
                              <div className="flex items-end gap-2">
                                <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                  {accountHandle[0]?.toUpperCase() || "T"}
                                </div>
                                <div className="max-w-[80%] rounded-2xl bg-neutral-100 px-3.5 py-2.5 text-xs text-neutral-900 leading-relaxed shadow-2xs">
                                  {emailGateText}
                                </div>
                              </div>
                              <div className="flex justify-end pt-1">
                                <div className="max-w-[80%] rounded-2xl bg-black px-3.5 py-2 text-xs font-medium text-white shadow-2xs">
                                  you@email.com
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 4. Final Delivered DM Message matching screenshot 2 */}
                          {unlockedStep >= 5 && (
                            <div className="space-y-2 pt-1">
                              <div className="flex items-end gap-2">
                                <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                  {accountHandle[0]?.toUpperCase() || "T"}
                                </div>
                                <div className="max-w-[80%] rounded-2xl bg-neutral-100 px-3.5 py-2.5 text-xs text-neutral-900 leading-relaxed shadow-2xs whitespace-pre-wrap">
                                  {finalDm || "gfdsgf"}
                                </div>
                              </div>

                              {/* Action link buttons */}
                              {links.map((link, i) => (
                                <div key={i} className="ml-8 max-w-[80%]">
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full rounded-xl bg-neutral-900 py-2 text-center text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
                                  >
                                    {link.label || "Get the link"}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* iPhone Bottom Bar Indicator */}
                    <div className="h-5 flex items-center justify-center shrink-0">
                      <div className="h-1 w-24 rounded-full bg-neutral-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Preview Rail: When preview is collapsed by clicking ◀ */}
        {triggerType === "comment" && !isPreviewExpanded && (
          <div className="w-8 shrink-0 bg-neutral-100/90 dark:bg-neutral-900/60 flex items-center justify-center border-r border-border backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setIsPreviewExpanded(true)}
              className="flex size-6 items-center justify-center rounded-full bg-black text-white hover:opacity-80 shadow-md transition-transform"
              title="Expand preview"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
