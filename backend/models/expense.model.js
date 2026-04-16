const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    merchant: {
      type: String,
      required: [true, "Merchant name is required"],
      trim: true,
      maxlength: [100, "Merchant name cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Entertainment",
        "Health",
        "Bills",
        "Education",
        "Travel",
        "Other",
      ],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Notes cannot exceed 300 characters"],
    },
  },
  { timestamps: true }
);

// Compound index for fast user + date queries
expenseSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);
