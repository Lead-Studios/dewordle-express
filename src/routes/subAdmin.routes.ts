import express from "express";
import {
  createSubAdmin,
  getSubAdmins,
  updateSubAdmin,
  deleteSubAdmin,
} from "../services/user/subAdmin.controller";

import roleMiddleware from "../middleware/rbac.middleware";

const router = express.Router();

router.post("/", roleMiddleware("admin"), createSubAdmin);
router.get("/", roleMiddleware("admin"), getSubAdmins);
router.put("/:id", roleMiddleware("admin"), updateSubAdmin);
router.delete("/:id", roleMiddleware("admin"), deleteSubAdmin);

export default router;
