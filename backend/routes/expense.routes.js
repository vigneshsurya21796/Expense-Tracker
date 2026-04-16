const express = require("express");
const router = express.Router();
const {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expensecontroller");
const {
  createExpenseValidator,
  updateExpenseValidator,
} = require("../validators/expense.validator");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAllExpenses).post(protect, createExpenseValidator, createExpense);
router
  .route("/:id")
  .get(protect, getExpenseById)
  .put(protect, updateExpenseValidator, updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;