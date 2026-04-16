const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/authcontroller");
const { registerValidator, loginValidator } = require("../validators/auth.validator");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;