import { Request, Response } from "express";
import { Achievement } from "../models/achievement.model";
import User from "../models/user.model";

export const getAllAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const achievements = await Achievement.find();
    res.status(200).json(achievements);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to fetch achievements", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to fetch achievements", error: "Unknown error" });
    }
  }
};

export const getAchievementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      res.status(404).json({ message: "Achievement not found" });
      return;
    }
    res.status(200).json(achievement);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to fetch achievement", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to fetch achievement", error: "Unknown error" });
    }
  }
};

export const getUserAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId).populate("achievements");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user.achievements);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to fetch user achievements", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to fetch user achievements", error: "Unknown error" });
    }
  }
};

export const unlockAchievement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, achievementId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.achievements.includes(achievementId as any)) {
      res.status(400).json({ message: "Achievement already unlocked" });
      return;
    }
    user.achievements.push(achievementId as any);
    await user.save();
    res.status(200).json({ message: "Achievement unlocked successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to unlock achievement", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to unlock achievement", error: "Unknown error" });
    }
  }
};

export const getAchievementStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await User.aggregate([
      { $unwind: "$achievements" },
      { $group: { _id: "$achievements", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const detailedStats: Array<{ achievementId: unknown; title: string; count: number }> = [];
    for (const item of stats) {
      const achievement = await Achievement.findById(item._id);
      if (achievement) {
        detailedStats.push({ achievementId: achievement._id, title: achievement.title, count: item.count });
      }
    }
    res.status(200).json(detailedStats);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to fetch achievement stats", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to fetch achievement stats", error: "Unknown error" });
    }
  }
};
