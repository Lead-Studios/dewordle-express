import express from "express";
import { joinWaitlist, notifyWaitlist } from "../controllers/waitlistController.js";

const router = express.Router();

router.post("/join", joinWaitlist);
router.post("/notify/:eventId", notifyWaitlist);

export default router;