"use client";

import React, { useState, useEffect } from "react";
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
  Sliders,
  ExternalLink,
  ShieldCheck,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AutomationItem } from "./AutoDmView";

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
  // Wizard steps: 1 = triggers & opening gates, 2 = final DM & go live
  const [step, setStep] = useState<1 | 2>(1);

  // Trigger state
  const [triggerType, setTriggerType] = useState<"comment" | "dm">("comment");
  const [targetPost, setTargetPost] = useState<"any" | "specific">("any");
  const [keywordsType, setKeywordsType] = useState<"any" | "specific">("any");
  const [keywords, setKeywords] = useState("Price, Link, Shop");

  // Action state
  const [actionType, setActionType] = useState<"dm" | "reply">("dm");
  const [hideComment, setHideComment] = useState(false);
  const [deleteComment, setDeleteComment] = useState(false);

  // Comment public reply variants
  const [replyToggle, setReplyToggle] = useState(false);
  const [replyVariants, setReplyVariants] = useState<string[]>([
    "xddfd{{username}}",
    "Reply 2",
  ]);

  // Advanced priority
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [priority, setPriority] = useState<number>(0);

  // Step 3 / "They will get"
  const [openingDm, setOpeningDm] = useState(true);
  const [openingText, setOpeningText] = useState("");
  const [openingButtonLabel, setOpeningButtonLabel] = useState("");
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

  // Final DM step 2
  const [finalDm, setFinalDm] = useState("pls check DM!{{username}}");
  const [links, setLinks] = useState<{ label: string; url: string }[]>([
    { label: "Get the link", url: "https://reerts.com" },
  ]);

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [previewTab, setPreviewTab] = useState<"comments" | "dm">("comments");

  // Reset or initialize when opened
  useEffect(() => {
    if (initialData) {
      setTriggerType(initialData.triggerType === "dm" ? "dm" : "comment");
      setFinalDm(initialData.dmContent || "pls check DM!{{username}}");
      setKeywords(initialData.keywords || "Price, Link, Shop");
      setKeywordsType(initialData.keywords === "All DMs" ? "any" : "specific");
      setStep(1);
    } else {
      setStep(1);
      setTriggerType("comment");
      setTargetPost("any");
      setKeywordsType("any");
      setKeywords("Price, Link, Shop");
      setActionType("dm");
      setReplyToggle(false);
      setOpeningDm(true);
      setOpeningText("");
      setOpeningButtonLabel("");
      setFollowGate(false);
      setEmailGate(false);
      setErrorMsg(null);
    }
  }, [initialData, isOpen]);

  // Sync preview tab with current action
  useEffect(() => {
    if (step === 2 || (openingDm && openingText.length > 0)) {
      setPreviewTab("dm");
    } else {
      setPreviewTab("comments");
    }
  }, [step, openingDm, openingText]);

  if (!isOpen) return null;

  // Insert {{username}} variable
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

  // Add & remove replies
  const addReply = () => {
    setReplyVariants((prev) => [...prev, `Reply ${prev.length + 1}`]);
  };

  const removeReply = (index: number) => {
    setReplyVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation on Next
  const handleNext = () => {
    if (openingDm && (!openingText || openingText.trim() === "")) {
      setErrorMsg("Enter the opening DM message.");
      return;
    }
    setErrorMsg(null);
    setStep(2);
    setPreviewTab("dm");
  };

  // Go live action
  const handleGoLive = () => {
    if (!finalDm.trim()) {
      setErrorMsg("Please enter the DM message.");
      return;
    }
    onSave(
      {
        triggerType,
        actionType: actionType === "dm" ? "DM" : "Reply",
        keywords: keywordsType === "any" ? (triggerType === "dm" ? "All DMs" : "Any word") : keywords,
        dmContent: finalDm,
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

  // Save Draft
  const handleSaveDraft = () => {
    onSave(
      {
        triggerType,
        actionType: actionType === "dm" ? "DM" : "Reply",
        keywords: keywordsType === "any" ? (triggerType === "dm" ? "All DMs" : "Any word") : keywords,
        dmContent: finalDm || "Draft automation",
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
    if (openingText || finalDm !== "pls check DM!{{username}}") {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-start bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-foreground text-base">Discard unsaved changes?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your unsaved changes will be lost.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-semibold hover:bg-muted text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose();
                }}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container: Split Drawer + Phone Preview */}
      <div className="relative flex h-full w-full max-w-5xl bg-background shadow-2xl border-r border-border overflow-hidden">
        {/* LEFT COLUMN: Form configuration drawer */}
        <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-border bg-card">
          {/* Drawer Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 px-6 bg-card/60">
            <div className="flex items-center gap-2">
              <span className="text-base text-foreground font-semibold">✳</span>
              <h2 className="text-base font-bold text-foreground tracking-tight">
                {initialData ? "Edit automation" : "New automation"}
              </h2>
            </div>

            {/* Black rounded square Close button matching screenshot */}
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="flex size-7 items-center justify-center rounded-lg bg-black text-white hover:opacity-80 transition-opacity"
              title="Close"
            >
              <X className="size-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-foreground">
            {step === 1 ? (
              <>
                {/* 1. Trigger Title: What should start this automation? */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    What should start this automation?
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Card 1: When a comment is posted */}
                    <button
                      type="button"
                      onClick={() => setTriggerType("comment")}
                      className={cn(
                        "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                        triggerType === "comment"
                          ? "border-emerald-300 bg-emerald-50/70 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-100"
                          : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          triggerType === "comment"
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {triggerType === "comment" && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-foreground text-xs">
                        <MessageSquare className="size-4 shrink-0" />
                        <span>When a comment is posted</span>
                      </div>
                    </button>

                    {/* Card 2: When a DM arrives */}
                    <button
                      type="button"
                      onClick={() => setTriggerType("dm")}
                      className={cn(
                        "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                        triggerType === "dm"
                          ? "border-emerald-300 bg-emerald-50/70 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-100"
                          : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          triggerType === "dm"
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {triggerType === "dm" && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-foreground text-xs">
                        <Send className="size-4 shrink-0" />
                        <span>When a DM arrives</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Target post */}
                <div className="space-y-2.5">
                  <h4 className="font-semibold text-foreground">
                    {targetPost === "any"
                      ? "When someone comments on any post"
                      : "When someone comments on a specific post"}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTargetPost("any")}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                        targetPost === "any"
                          ? "border-emerald-300 bg-emerald-50/70 text-foreground font-semibold dark:bg-emerald-950/30 dark:border-emerald-800"
                          : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          targetPost === "any"
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {targetPost === "any" && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <span>Any posts</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetPost("specific")}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                        targetPost === "specific"
                          ? "border-emerald-300 bg-emerald-50/70 text-foreground font-semibold dark:bg-emerald-950/30 dark:border-emerald-800"
                          : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          targetPost === "specific"
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {targetPost === "specific" && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <span>Specific post</span>
                    </button>
                  </div>
                </div>

                {/* 3. Comment Keywords */}
                <div className="space-y-2.5">
                  <h4 className="font-semibold text-foreground">
                    {triggerType === "dm" ? "And this DM has" : "And this comment has"}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setKeywordsType("any")}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                        keywordsType === "any"
                          ? "border-emerald-300 bg-emerald-50/70 text-foreground font-semibold dark:bg-emerald-950/30 dark:border-emerald-800"
                          : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          keywordsType === "any"
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {keywordsType === "any" && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <span>any word</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setKeywordsType("specific")}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                        keywordsType === "specific"
                          ? "border-emerald-300 bg-emerald-50/70 text-foreground font-semibold dark:bg-emerald-950/30 dark:border-emerald-800"
                          : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          keywordsType === "specific"
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {keywordsType === "specific" && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <span>a specific word or words</span>
                    </button>
                  </div>

                  {keywordsType === "specific" && (
                    <div className="pt-2 space-y-1">
                      <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Price, Link, Shop"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary font-mono"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        For example: Price, Link, Shop (comma separated)
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Action: Then */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Then</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setActionType("dm")}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                        actionType === "dm"
                          ? "border-blue-200 bg-blue-50/70 text-blue-950 font-semibold dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100"
                          : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          actionType === "dm"
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {actionType === "dm" && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <Send className="size-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Send a DM</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionType("reply")}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                        actionType === "reply"
                          ? "border-blue-200 bg-blue-50/70 text-blue-950 font-semibold dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100"
                          : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          actionType === "reply"
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {actionType === "reply" && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <MessageSquare className="size-3.5" />
                      <span>Reply only</span>
                    </button>
                  </div>

                  {/* Hide & Delete options */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setHideComment(!hideComment)}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                        hideComment
                          ? "border-border bg-muted/60 text-foreground font-semibold"
                          : "border-border/60 bg-background text-muted-foreground hover:bg-muted/30"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          hideComment
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {hideComment && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <EyeOff className="size-3.5" />
                      <span>Hide the comment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteComment(!deleteComment)}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                        deleteComment
                          ? "border-border bg-muted/60 text-foreground font-semibold"
                          : "border-border/60 bg-background text-muted-foreground hover:bg-muted/30"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          deleteComment
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                            : "border-muted-foreground/40 bg-card"
                        )}
                      >
                        {deleteComment && <Check className="size-3 stroke-[3]" />}
                      </div>
                      <Trash2 className="size-3.5" />
                      <span>Delete the comment</span>
                    </button>
                  </div>

                  {/* Reply toggle switch */}
                  <div className="pt-2">
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

                    {/* Reply variants (Screenshot 3) */}
                    {replyToggle && (
                      <div className="mt-3 space-y-3 pl-12">
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
                              <button
                                type="button"
                                onClick={() => removeReply(idx)}
                                className="text-muted-foreground hover:text-foreground"
                                title="Remove reply"
                              >
                                <X className="size-3.5" />
                              </button>
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
                </div>

                {/* 5. "They will get" Section (Screenshot 3 & 4) */}
                <div className="space-y-4 pt-3 border-t border-border">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground tracking-tight">They will get</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Instagram allows up to 250 comment DMs per account per hour. Anyone over the limit
                      gets theirs automatically a little later.
                    </p>
                  </div>

                  {/* Card: Opening DM */}
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
                      <div className="space-y-2 pt-1">
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
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card: Follow request gate */}
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

                    {followGate && (
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

                  {/* Card: Collect emails gate */}
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

                    {emailGate && (
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

                  {/* Red validation error matching screenshot */}
                  {errorMsg && (
                    <div className="rounded-lg bg-red-50 p-2.5 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                      {errorMsg}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* STEP 2: And then, they will get (Go live step) */
              <div className="space-y-6">
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
                  <textarea
                    rows={4}
                    value={finalDm}
                    onChange={(e) => setFinalDm(e.target.value)}
                    placeholder="Write a message"
                    className="w-full rounded-xl border border-border bg-background p-3.5 text-xs text-foreground font-mono resize-none outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                {/* Link Buttons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Action Link Buttons (up to 3)</h4>
                    {links.length < 3 && (
                      <button
                        type="button"
                        onClick={() =>
                          setLinks([...links, { label: "New Button", url: "https://" }])
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

                {/* Email Delivery Upgrade Notice */}
                <div className="rounded-2xl border border-border/80 bg-muted/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Also send resource by email</span>
                    <span className="rounded-full bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-bold">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    When someone replies with an email address, your resource PDF and reply-to address
                    are dispatched automatically.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Bottom Actions matching screenshot */}
          <div className="flex h-16 shrink-0 items-center justify-between border-t border-border px-6 bg-card/60">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-colors"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl bg-black px-6 py-2 text-xs font-bold text-white dark:bg-white dark:text-black hover:opacity-90 shadow-sm transition-all"
                >
                  Next
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted text-foreground"
                >
                  Back
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted text-foreground"
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
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Realistic iPhone Mockup Preview matching screenshot */}
        {isPreviewExpanded ? (
          <div className="w-[440px] shrink-0 border-l border-border bg-neutral-100 dark:bg-neutral-900/40 p-6 flex flex-col items-center justify-center relative select-none overflow-hidden">
            {/* Toggle collapse preview button ◀ matching screenshot */}
            <button
              type="button"
              onClick={() => setIsPreviewExpanded(false)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex size-6 items-center justify-center rounded-full bg-black text-white hover:opacity-80 shadow-md transition-transform"
              title="Collapse preview"
            >
              <ChevronLeft className="size-3.5" />
            </button>

            {/* iPhone Device Chassis */}
            <div className="relative w-[300px] h-[610px] rounded-[48px] bg-black p-3 shadow-2xl border-4 border-neutral-800 ring-1 ring-black/40">
              {/* iPhone Inner Screen */}
              <div className="relative w-full h-full rounded-[38px] bg-white text-black overflow-hidden flex flex-col font-sans">
                {/* Status Bar */}
                <div className="flex h-9 shrink-0 items-center justify-between px-6 pt-2 text-[11px] font-semibold text-black z-10">
                  <span>20:17</span>
                  {/* Dynamic Island pill */}
                  <div className="size-fit px-3 py-1 bg-black rounded-full text-white text-[9px] flex items-center justify-center">
                    <span className="size-1.5 rounded-full bg-emerald-400 mr-1.5 inline-block" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span>5G</span>
                    <span className="text-[10px]">100%</span>
                  </div>
                </div>

                {/* iPhone Header Tabs: Comments / DM */}
                <div className="flex items-center justify-center gap-4 border-b border-neutral-100 pb-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("comments")}
                    className={cn(
                      "pb-1 transition-colors",
                      previewTab === "comments"
                        ? "border-b-2 border-black text-black font-bold"
                        : "text-neutral-400"
                    )}
                  >
                    Comments
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("dm")}
                    className={cn(
                      "pb-1 transition-colors",
                      previewTab === "dm"
                        ? "border-b-2 border-black text-black font-bold"
                        : "text-neutral-400"
                    )}
                  >
                    DM
                  </button>
                </div>

                {/* iPhone Screen Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {previewTab === "comments" ? (
                    /* Comments view matching screenshot 2 */
                    <div className="space-y-4 pt-2">
                      <div className="flex items-start gap-2.5">
                        <div className="size-7 rounded-full bg-neutral-400 shrink-0" />
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[11px]">username</span>
                            <span className="text-neutral-400 text-[10px]">· Now</span>
                          </div>
                          <p className="text-neutral-800 text-xs">
                            {keywordsType === "specific" && keywords
                              ? keywords.split(",")[0]
                              : "Comment text"}
                          </p>
                        </div>
                      </div>

                      {/* If reply toggle is on, show reply mockup */}
                      {replyToggle && replyVariants[0] && (
                        <div className="ml-8 flex items-start gap-2.5 border-l-2 border-neutral-200 pl-3">
                          <div className="size-6 rounded-full bg-black shrink-0 flex items-center justify-center text-white text-[9px] font-bold">
                            P
                          </div>
                          <div className="space-y-0.5 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[11px]">@{accountHandle}</span>
                              <span className="text-neutral-400 text-[10px]">· Just now</span>
                            </div>
                            <p className="text-neutral-800 text-xs">
                              {replyVariants[0].replace("{{username}}", "@username")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* DM Thread view matching screenshot 3 & 4 */
                    <div className="space-y-3 pt-1">
                      {/* Sender header */}
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                        <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-bold">
                          {accountHandle[0]?.toUpperCase()}
                        </div>
                        <span className="font-bold text-xs">@{accountHandle}</span>
                      </div>

                      {/* Opening DM message */}
                      {openingDm && (
                        <div className="space-y-2">
                          <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-neutral-100 p-3 text-xs text-neutral-900 leading-relaxed shadow-2xs">
                            {openingText || "Message to send first"}
                          </div>

                          <div className="max-w-[85%]">
                            <button
                              type="button"
                              className="w-full rounded-xl border border-neutral-200 bg-white py-2 text-center text-xs font-semibold text-neutral-800 shadow-2xs"
                            >
                              {openingButtonLabel || "Button label (e.g. Get the link)"}
                            </button>
                          </div>

                          {/* Simulated User Response */}
                          <div className="flex justify-end pt-1">
                            <div className="max-w-[80%] rounded-2xl rounded-tr-xs bg-black px-3.5 py-2 text-xs font-medium text-white shadow-2xs">
                              {openingButtonLabel || "Button label (e.g. Get the link)"}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Follow Gate Simulation */}
                      {followGate && (
                        <div className="space-y-2 pt-1">
                          <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-neutral-100 p-3 text-xs text-neutral-900 leading-relaxed">
                            {followGateText}
                          </div>
                          <div className="max-w-[85%]">
                            <button
                              type="button"
                              className="w-full rounded-xl border border-neutral-200 bg-white py-2 text-center text-xs font-semibold text-neutral-800"
                            >
                              {followGateButtonLabel || "Following"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Final Delivered DM */}
                      <div className="space-y-2 pt-1">
                        <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-neutral-100 p-3 text-xs text-neutral-900 leading-relaxed">
                          {finalDm || "Write a message"}
                        </div>

                        {/* Action link buttons */}
                        {links.map((link, i) => (
                          <div key={i} className="max-w-[85%]">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block w-full rounded-xl bg-neutral-900 py-2 text-center text-xs font-bold text-white shadow-xs hover:opacity-90"
                            >
                              {link.label || "Action Link"}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* iPhone Bottom Bar Indicator */}
                <div className="h-4 flex items-center justify-center">
                  <div className="h-1 w-24 rounded-full bg-neutral-400" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Expand preview pill button */
          <div className="w-8 shrink-0 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border-l border-border">
            <button
              type="button"
              onClick={() => setIsPreviewExpanded(true)}
              className="flex size-6 items-center justify-center rounded-full bg-black text-white hover:opacity-80 shadow-md"
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
