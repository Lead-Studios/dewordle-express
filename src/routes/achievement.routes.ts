import { Router } from "express";
import * as achievementController from "../controllers/achievement.controller";

const router = Router();

router.get("/", achievementController.getAllAchievements);
router.get("/:id", achievementController.getAchievementById);
router.get("/users/:userId", achievementController.getUserAchievements);
router.post("/users/:userId/:achievementId", achievementController.unlockAchievement);
router.get("/stats", achievementController.getAchievementStats);

export default router;
