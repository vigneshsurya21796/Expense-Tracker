const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const Apierror = require("../utils/Apierror");

exports.protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new Apierror("Not authorized, no token", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    return next(new Apierror("Not authorized, user not found", 401));
  }

  next();
};
