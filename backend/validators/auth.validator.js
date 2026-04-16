const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name is required")
    .max(50, "Name can't exceed 50 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

exports.registerValidator = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    return next(new Error(result.error.issues[0].message));
  }
  next();
};

exports.loginValidator = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400);
    return next(new Error(result.error.issues[0].message));
  }
  next();
};
