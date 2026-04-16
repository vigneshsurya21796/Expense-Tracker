const express = require("express");
const router = express.Router();
const { getSummary, getMonthlyStats, getCategoryStats } = require("../controllers/statscontroller");
const { protect } = require("../middleware/authMiddleware");

router.get("/summary", protect, getSummary);
router.get("/monthly", protect, getMonthlyStats);
router.get("/categories", protect, getCategoryStats);

module.exports = router;
