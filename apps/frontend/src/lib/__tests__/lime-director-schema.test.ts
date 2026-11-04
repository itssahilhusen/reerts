import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildFallbackLimePlan, conceptHeadline, limeDirectorSchema } from "../lime-director-schema";

describe("Lime Slides Director schema", () => {
  it("rejects headlines over three words or not in uppercase", () => {
    const base = {
      startMs: 0,
      endMs: 1000,
      sceneType: "FULL_GRAPHIC",
      headline: "A concept that is too long",
      illustration: "phone",
      illustrationProps: {},
      speakerMode: "hidden",
      emphasisWords: [],
    };
    assert.equal(limeDirectorSchema.safeParse({ beats: [base] }).success, false);
    assert.equal(limeDirectorSchema.safeParse({ beats: [{ ...base, headline: "lowercase" }] }).success, false);
  });

  it("creates about one word-aligned scene per second from a 12-second clip", () => {
    const words = Array.from({ length: 24 }, (_, index) => ({
      word: index % 2 ? "automate" : "workflow",
      start: index * .5,
      end: index * .5 + .35,
    }));
    const plan = buildFallbackLimePlan("automate the workflow", words, 12);
    assert.equal(plan.beats.length, 12);
    for (const beat of plan.beats.slice(0, -1)) {
      const duration = beat.endMs - beat.startMs;
      assert.ok(duration >= 800 && duration <= 1200);
      assert.equal(beat.endMs % 500, 350);
    }
    assert.equal(plan.beats.at(-1)?.sceneType, "CTA");
    assert.ok(plan.beats.every((beat) => beat.headline.split(/\s+/).length <= 3));
  });

  it("uses a concept headline instead of copying spoken fragments", () => {
    assert.equal(conceptHeadline("have a conversation with somebody"), "START BETTER CONVERSATIONS");
    assert.equal(conceptHeadline("the hardest things"), "MAKE BETTER CONTENT");
    const transcript = "I swear one of the hardest things is trying to have a conversation with somebody";
    const words = transcript.split(" ").map((word, index) => ({ word, start: index * .3, end: index * .3 + .2 }));
    const plan = buildFallbackLimePlan(transcript, words, 4);
    assert.ok(plan.beats.every((beat) => beat.headline === "START BETTER CONVERSATIONS"));
  });
});
