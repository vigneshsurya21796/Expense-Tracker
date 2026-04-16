const Apierror = require("../utils/Apierror");
const Apiresponse = require("../utils/Apiresponse");
const User = require("../models/usermodel");
const Expense = require("../models/expense.model");

// @desc    Update budget limit / currency / alerts
// @route   PUT /api/v1/users/budget
// @access  Private
exports.updateBudget = async (req, res) => {
  const { budgetLimit, currency, budgetAlerts } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { budgetLimit, currency, budgetAlerts },
    { new: true, runValidators: true }
  );

  res.status(200).json(new Apiresponse(200, updatedUser, "Budget settings updated"));
};

// @desc    Change password
// @route   PUT /api/v1/users/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new Apierror("Current password is incorrect", 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new Apiresponse(200, null, "Password updated successfully"));
};

// @desc    Export all expenses as CSV
// @route   GET /api/v1/users/export
// @access  Private
exports.exportCSV = async (req, res) => {
  const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });

  const header = "Date,Merchant,Category,Amount,Notes";
  const rows = expenses.map((e) => {
    const date = new Date(e.date).toLocaleDateString("en-IN");
    const notes = e.notes ? `"${e.notes.replace(/"/g, '""')}"` : "";
    return `${date},${e.merchant},${e.category},${e.amount},${notes}`;
  });

  const csv = [header, ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
  res.status(200).send(csv);
};
