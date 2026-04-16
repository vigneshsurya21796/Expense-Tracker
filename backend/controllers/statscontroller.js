const Apiresponse = require("../utils/Apiresponse");
const Expense = require("../models/expense.model");

// @desc    Summary — total spent, count, avg/day, budget left
// @route   GET /api/v1/stats/summary
// @access  Private
exports.getSummary = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: startOfMonth, $lt: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalSpent = result[0]?.totalSpent || 0;
  const count = result[0]?.count || 0;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const avgPerDay = totalSpent / daysInMonth;
  const budgetLeft = req.user.budgetLimit - totalSpent;

  res.status(200).json(
    new Apiresponse(200, {
      totalSpent,
      count,
      avgPerDay: parseFloat(avgPerDay.toFixed(2)),
      budgetLeft,
      budgetLimit: req.user.budgetLimit,
    })
  );
};

// @desc    Monthly spending — last 6 months (bar chart)
// @route   GET /api/v1/stats/monthly
// @access  Private
exports.getMonthlyStats = async (req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const data = result.map((item) => ({
    month: months[item._id.month - 1],
    year: item._id.year,
    total: item.total,
  }));

  res.status(200).json(new Apiresponse(200, data));
};

// @desc    Category breakdown this month (donut chart)
// @route   GET /api/v1/stats/categories
// @access  Private
exports.getCategoryStats = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: startOfMonth, $lt: endOfMonth },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = result.reduce((sum, item) => sum + item.total, 0);

  const data = result.map((item) => ({
    category: item._id,
    total: item.total,
    percentage: grandTotal > 0 ? parseFloat(((item.total / grandTotal) * 100).toFixed(1)) : 0,
  }));

  res.status(200).json(new Apiresponse(200, data));
};
