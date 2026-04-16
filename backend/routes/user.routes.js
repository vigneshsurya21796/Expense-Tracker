const express = require("express");
const router = express.Router();
const { updateBudget, updatePassword, exportCSV } = require("../controllers/userscontroller");
const { budgetValidator, passwordValidator } = require("../validators/user.validator");
const { protect } = require("../middleware/authMiddleware");

router.put("/budget", protect, budgetValidator, updateBudget);
router.put("/password", protect, passwordValidator, updatePassword);
router.get("/export", protect, exportCSV);

module.exports = router;
