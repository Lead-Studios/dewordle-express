const express = require("express");
const router = express.Router();
const { getUserStats, updateUserStats } = require("../controllers/statsController");

router.get("/:userId", getUserStats);  // GET /stats/:userId → Fetch stats
router.post("/update", updateUserStats); // POST /stats/update → Update stats

module.exports = router;