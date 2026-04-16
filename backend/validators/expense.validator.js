const { z } = require("zod");

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Bills",
  "Education",
  "Travel",
  "Other",
];

const createExpenseSchema = z.object({
  merchant: z
    .string({ required_error: "Merchant is required" })
    .trim()
    .min(1, "Merchant is required")
    .max(100, "Merchant cannot exceed 100 characters"),
  amount: z
    .number({ required_error: "Amount is required", invalid_type_error: "Amount must be a number" })
    .min(0, "Amount cannot be negative"),
  date: z
    .string({ required_error: "Date is required" })
    .min(1, "Date is required"),
  category: z
    .enum(CATEGORIES, { errorMap: () => ({ message: "Invalid category" }) }),
  notes: z
    .string()
    .max(300, "Notes cannot exceed 300 characters")
    .optional(),
});

const updateExpenseSchema = z.object({
  merchant: z
    .string()
    .trim()
    .min(1, "Merchant is required")
    .max(100, "Merchant cannot exceed 100 characters")
    .optional(),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0, "Amount cannot be negative")
    .optional(),
  date: z.string().optional(),
  category: z
    .enum(CATEGORIES, { errorMap: () => ({ message: "Invalid category" }) })
    .optional(),
  notes: z
    .string()
    .max(300, "Notes cannot exceed 300 characters")
    .optional(),
});

exports.createExpenseValidator = (req, res, next) => {
  const result = createExpenseSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    return next(new Error(result.error.issues[0].message));
  }
  next();
};

exports.updateExpenseValidator = (req, res, next) => {
  const result = updateExpenseSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    return next(new Error(result.error.issues[0].message));
  }
  next();
};
