const { z } = require("zod");

const budgetSchema = z.object({
  budgetLimit: z
    .number({ required_error: "Budget limit is required", invalid_type_error: "Budget must be a number" })
    .min(0, "Budget limit cannot be negative"),
  currency: z
    .enum(["INR", "USD", "EUR"], { errorMap: () => ({ message: "Currency must be INR, USD, or EUR" }) })
    .optional(),
  budgetAlerts: z.boolean().optional(),
});

const passwordSchema = z.object({
  currentPassword: z
    .string({ required_error: "Current password is required" })
    .min(1, "Current password is required"),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(6, "New password must be at least 6 characters"),
});

exports.budgetValidator = (req, res, next) => {
  const result = budgetSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    return next(new Error(result.error.issues[0].message));
  }
  next();
};

exports.passwordValidator = (req, res, next) => {
  const result = passwordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    return next(new Error(result.error.issues[0].message));
  }
  next();
};
