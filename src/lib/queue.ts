import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", { maxRetriesPerRequest: null });

export const postQueue = new Queue("post-publish", { connection });

export function createPublishWorker(handler: (postId: string) => Promise<void>) {
  return new Worker("post-publish", async (job) => { await handler(job.data.postId); }, { connection });
}
