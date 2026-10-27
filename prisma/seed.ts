import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Reerts initial database...");

  // 1. Create or upsert Default Workspace
  const workspace = await prisma.workspace.upsert({
    where: { handle: "my-workspace" },
    update: {},
    create: {
      id: "ws-default-1",
      name: "My Workspace",
      handle: "my-workspace",
      timezone: "Asia/Calcutta",
      plan: "Pro",
      creditsUsed: 111,
      creditsMax: 500,
    },
  });

  // 2. Create Default Brand Voice
  const existingVoice = await prisma.brandVoice.findFirst({
    where: { workspaceId: workspace.id },
  });

  if (!existingVoice) {
    await prisma.brandVoice.create({
      data: {
        workspaceId: workspace.id,
        name: "Alex Rivers - AI Tech Founder",
        formality: 30,
        directness: 85,
        humor: 45,
        targetAudience: "Founders, creators, engineers, and digital entrepreneurs looking to scale with automation.",
        bannedWords: "delve, tapestry, synergy, revolutionize, unleash, testament",
        isDefault: true,
      },
    });
  }

  // 3. Create Sample Connected Social Accounts
  const initialAccounts = [
    { provider: "x", name: "Alex Rivers", handle: "alexrivers_ai", status: "active", avatar: "/images/platforms/x-light.svg" },
    { provider: "linkedin", name: "Alex Rivers", handle: "alex-rivers", status: "active", avatar: "/images/platforms/linkedin.svg" },
    { provider: "threads", name: "Alex Rivers", handle: "alexrivers.ai", status: "active", avatar: "/images/platforms/threads.svg" },
    { provider: "instagram", name: "The AI Seed", handle: "theaiseed", status: "active", avatar: "/images/platforms/instagram.svg" },
    { provider: "tiktok", name: "The AI Seed", handle: "@theaiseed", status: "updating", avatar: "/images/platforms/tiktok-light.svg" },
  ];

  for (const acc of initialAccounts) {
    await prisma.socialAccount.upsert({
      where: {
        workspaceId_provider_handle: {
          workspaceId: workspace.id,
          provider: acc.provider,
          handle: acc.handle,
        },
      },
      update: {},
      create: {
        workspaceId: workspace.id,
        provider: acc.provider,
        name: acc.name,
        handle: acc.handle,
        avatar: acc.avatar,
        status: acc.status,
      },
    });
  }

  // 4. Create Sample Posts across statuses
  const samplePosts = [
    {
      title: "Reerts 2.0 is officially live! 🚀",
      content: "Autonomous multi-platform publishing with your unique brand voice. Write once, tailor to every channel, and schedule on autopilot.\n\n#buildinpublic #ai #saas",
      platforms: JSON.stringify(["x", "linkedin", "threads", "instagram"]),
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2),
      impressions: 14200,
      engagements: 680,
    },
    {
      title: "Why carousel posts get 3x higher dwell time on LinkedIn",
      content: "Data breakdown from over 10,000 posts analyzed with our analytics engine. High dwell time comes down to 3 factors:\n\n1. Stop-scrolling hook on Slide 1\n2. Single idea per slide\n3. High-utility save CTA on final slide.\n\n#linkedin #creator",
      platforms: JSON.stringify(["linkedin"]),
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 24 * 3600 * 1000 * 4),
      impressions: 28500,
      engagements: 1760,
    },
    {
      title: "5 AI tools that will save you 20 hours this week",
      content: "From autonomous content engines to automatic lead DM responses. Here is the breakdown:\n\n1. Reerts for automated publishing\n2. Cursor for agentic coding\n3. Whisper for voice capture\n4. Claude 3.5 Sonnet for deep research\n5. Perplexity for fast search\n\n#productivity #ai",
      platforms: JSON.stringify(["x", "threads", "linkedin"]),
      status: "SCHEDULED",
      scheduledAt: new Date(Date.now() + 24 * 3600 * 1000 * 1),
      impressions: 0,
      engagements: 0,
    },
    {
      title: "Behind the scenes of building Reerts in public",
      content: "Here is the exact tech stack we used to achieve 100% UI fidelity in record time with Next.js 14, Tailwind, Prisma SQLite, and autonomous agents.",
      platforms: JSON.stringify(["x", "linkedin"]),
      status: "DRAFT",
      impressions: 0,
      engagements: 0,
    },
  ];

  for (const postData of samplePosts) {
    const existing = await prisma.post.findFirst({
      where: { workspaceId: workspace.id, title: postData.title },
    });
    if (!existing) {
      await prisma.post.create({
        data: {
          workspaceId: workspace.id,
          ...postData,
        },
      });
    }
  }

  // 5. Create Sample Ideas
  const sampleIdeas = [
    {
      title: "Why consistency on 1 platform is obsolete in 2026",
      excerpt: "Cross-pollinating content across X, Threads, and LinkedIn gives 4x organic compounding without 4x the effort.",
      sourceType: "X Viral",
      viralityScore: 98,
      tags: JSON.stringify(["Strategy", "Multi-Platform"]),
    },
    {
      title: "How I turn 1 technical commit into a LinkedIn carousel and a Twitter breakdown",
      excerpt: "Step-by-step framework to repurpose engineering work into high-engagement creator assets.",
      sourceType: "Reddit",
      viralityScore: 94,
      tags: JSON.stringify(["Repurposing", "Developer"]),
    },
    {
      title: "Stop posting at random times: the real data behind dwell-time algorithms",
      excerpt: "Why morning slots (8:30 - 10:00 AM) outperform evening spikes for B2B engagement.",
      sourceType: "RSS Feed",
      viralityScore: 91,
      tags: JSON.stringify(["Analytics", "Growth"]),
    },
    {
      title: "The feedback loop playbook: how to make past winners generate future winners",
      excerpt: "Using top 10% analytics outliers to seed next month's content calendar automatically.",
      sourceType: "AI Engine",
      viralityScore: 96,
      tags: JSON.stringify(["AI", "Feedback Loop"]),
    },
  ];

  for (const idea of sampleIdeas) {
    const existing = await prisma.idea.findFirst({
      where: { workspaceId: workspace.id, title: idea.title },
    });
    if (!existing) {
      await prisma.idea.create({
        data: {
          workspaceId: workspace.id,
          ...idea,
        },
      });
    }
  }

  // 6. Create Sample Automation
  const existingAuto = await prisma.automation.findFirst({
    where: { workspaceId: workspace.id },
  });

  if (!existingAuto) {
    await prisma.automation.create({
      data: {
        workspaceId: workspace.id,
        name: "Lead DM - Free Growth Playbook",
        active: true,
        triggerType: "comment",
        keywords: "guide, link, ready, send",
        actionType: "dm",
        dmContent: "Hey {{username}}! Thanks for commenting. Here is your free copy of our 2026 Social Scaling Guide: https://reerts.in/playbook",
        buttonLabel: "Open Free Guide",
        buttonUrl: "https://reerts.in/playbook",
        replyVariants: JSON.stringify([
          "Sent you a DM! Check your inbox 😊",
          "Just sent the details to your DMs!",
          "Check your DMs {{username}}! Enjoy 🚀",
        ]),
        requireFollow: true,
        followGateText: "Please follow me first so I can send the link! Tap the button below once you do 😊",
        captureEmail: false,
        sentCount: 142,
        clicksCount: 98,
      },
    });
  }

  // 7. Create Sample Competitors
  const sampleCompetitors = [
    { platform: "threads", handle: "alexandrabrand", name: "Alexandra | Tech & AI", followers: 42800, growthRate: "+12.4%" },
    { platform: "tiktok", handle: "@growthops", name: "GrowthOps Weekly", followers: 89400, growthRate: "+8.9%" },
    { platform: "threads", handle: "saas_daily", name: "SaaS Daily Insights", followers: 23100, growthRate: "+4.2%" },
  ];

  for (const comp of sampleCompetitors) {
    const existing = await prisma.competitor.findFirst({
      where: { workspaceId: workspace.id, handle: comp.handle },
    });
    if (!existing) {
      await prisma.competitor.create({
        data: {
          workspaceId: workspace.id,
          ...comp,
        },
      });
    }
  }

  // 8. Create Sample Media Assets
  const sampleMedia = [
    { name: "reerts-hero-cover.png", url: "/apple-icon.png", mimeType: "image/png", sizeBytes: 17934 },
    { name: "brand-logo-symbol.png", url: "/icon.png", mimeType: "image/png", sizeBytes: 919 },
  ];

  for (const media of sampleMedia) {
    const existing = await prisma.mediaAsset.findFirst({
      where: { workspaceId: workspace.id, name: media.name },
    });
    if (!existing) {
      await prisma.mediaAsset.create({
        data: {
          workspaceId: workspace.id,
          ...media,
        },
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
