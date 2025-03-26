import express, { Request, Response, NextFunction } from "express";
import FollowService from "../services/follow/follow.service";
import { validateFollowUser, validatePagination } from "../validators/follow.validator";

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email?: string
        username?: string
      }
    }
  }
}

const router = express.Router();

router.post("/follow", validateFollowUser, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return; // Explicit return to stop further execution
    }

    if (currentUserId === userId) {
      res.status(400).json({ success: false, message: "You cannot follow yourself" });
      return; // Explicit return to stop further execution
    }

    const result = await FollowService.followUser({ follower: currentUserId, following: userId });

    res.status(result ? 200 : 400).json({
      success: result,
      message: result ? "User followed successfully" : "You are already following this user",
    });
  } catch (error) {
    console.error("Error in follow route:", error);
    next(error);
  }
});

router.post("/unfollow", validateFollowUser, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return; // Explicit return to stop further execution
    }

    if (currentUserId === userId) {
      res.status(400).json({ success: false, message: "You cannot unfollow yourself" });
      return; // Explicit return to stop further execution
    }

    const result = await FollowService.unfollowUser({ follower: currentUserId, following: userId });

    res.status(result ? 200 : 400).json({
      success: result,
      message: result ? "User unfollowed successfully" : "You are not following this user",
    });
  } catch (error) {
    console.error("Error in unfollow route:", error);
    next(error);
  }
});

router.get("/followers/:userId", validatePagination, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    
    const result = await FollowService.getFollowers(userId, page, limit);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error in get followers route:", error);
    next(error);
  }
});

// Error handling middleware
router.use((err: unknown, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  res.status(500).json({ success: false, message: "Server error", error: (err as Error).message });
});

export default router;