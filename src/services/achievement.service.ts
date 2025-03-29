import { Types } from "mongoose";
import User from "../models/user.model";
import { Achievement } from "../models/achievement.model";

export const checkAndUnlockAchievements = async (userId: string, action: any) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    const achievements = await Achievement.find();
    for (const ach of achievements) {
      if (user.achievements.some(id => id.toString() === (ach._id as Types.ObjectId).toString())) continue;
      const meetsRequirement = customCheck(ach, action);
      if (meetsRequirement) { 
        user.achievements.push(ach._id as Types.ObjectId);
      }
    }
    await user.save();
  } catch (error: unknown) {
  }
};
function customCheck(achievement: any, action: any): boolean {
  return false;
}
