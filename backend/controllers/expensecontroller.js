const Apierror = require("../utils/Apierror");
const Apiresponse = require("../utils/Apiresponse");
const Expense = require("../models/expense.model");

// @desc    Get all expenses (with optional filters)
// @route   GET /api/v1/expenses?category=&month=&search=
// @access  Private
exports.getAllExpenses = async (req, res) => {
  const { category, month, search } = req.query;

  const filter = { userId: req.user._id };

  if (category) filter.category = category;

  if (month) {
    const [year, mon] = month.split("-").map(Number);
    const start = new Date(year, mon - 1, 1);
    const end = new Date(year, mon, 1);
    filter.date = { $gte: start, $lt: end };
  }

  if (search) filter.merchant = { $regex: search, $options: "i" };

  const expenses = await Expense.find(filter).sort({ date: -1 });
  res.status(200).json(new Apiresponse(200, expenses));
};

// @desc    Create expense
// @route   POST /api/v1/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  const { merchant, amount, date, category, notes } = req.body;

  const expense = await Expense.create({
    userId: req.user._id,
    merchant,
    amount,
    date,
    category,
    notes,
  });

  res.status(201).json(new Apiresponse(201, expense, "Expense created"));
};

// @desc    Get single expense
// @route   GET /api/v1/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) return next(new Apierror("Expense not found", 404));
  if (expense.userId.toString() !== req.user._id.toString())
    return next(new Apierror("Not authorized to access this expense", 403));

  res.status(200).json(new Apiresponse(200, expense));
};

// @desc    Update expense
// @route   PUT /api/v1/expenses/:id
// @access  Private
exports.updateExpense = async (req, res, next) => {
  let expense = await Expense.findById(req.params.id);

  if (!expense) return next(new Apierror("Expense not found", 404));
  if (expense.userId.toString() !== req.user._id.toString())
    return next(new Apierror("Not authorized to update this expense", 403));

  expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new Apiresponse(200, expense, "Expense updated"));
};

// @desc    Delete expense
// @route   DELETE /api/v1/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) return next(new Apierror("Expense not found", 404));
  if (expense.userId.toString() !== req.user._id.toString())
    return next(new Apierror("Not authorized to delete this expense", 403));

  await Expense.findByIdAndDelete(req.params.id);
  res.status(200).json(new Apiresponse(200, null, "Expense deleted"));
};
