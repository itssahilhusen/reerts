import express, { Request, Response } from "express";
import cors from "cors";
import { PostsRepository, AccountsRepository } from "@reerts/database";

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", service: "reerts-backend", timestamp: new Date().toISOString() });
});

// Public API endpoints (Postiz / Gitroom style)
app.get("/api/v1/posts", async (req: Request, res: Response) => {
  try {
    const workspaceId = (req.query.workspaceId as string) || "ws-default-1";
    const posts = await PostsRepository.findWorkspacePosts(workspaceId);
    res.json({ success: true, data: posts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/v1/accounts", async (req: Request, res: Response) => {
  try {
    const workspaceId = (req.query.workspaceId as string) || "ws-default-1";
    const accounts = await AccountsRepository.findWorkspaceAccounts(workspaceId);
    res.json({ success: true, data: accounts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`📡 Reerts Backend API listening on port ${PORT}`);
});
