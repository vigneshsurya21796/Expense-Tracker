const User = require("../models/usermodel");
const Apierror = require("../utils/Apierror");
const sendtoken = require("../utils/sendtoken");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new Apierror("Email already in use", 400));
  }

  const user = await User.create({ name, email, password });
  sendtoken(user, 201, res);
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new Apierror("Invalid email or password", 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new Apierror("Invalid email or password", 401));
  }

  sendtoken(user, 200, res);
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @desc    Get logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
