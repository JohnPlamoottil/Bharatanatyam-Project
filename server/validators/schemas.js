const { z } = require("zod");

// Auth validation schemas
const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    email: z.string().email("Please provide a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Message validation schemas
const createMessageSchema = z.object({
  body: z.object({
    dancerName: z.string().optional(),
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    content: z
      .string()
      .min(1, "Message content is required")
      .max(1000, "Message is too long"),
  }),
});

// Image/Video category validation
const categorySchema = z.object({
  body: z.object({
    category: z
      .string()
      .min(1, "Category is required")
      .max(50, "Category is too long"),
  }),
});

const categoryParamSchema = z.object({
  params: z.object({
    category: z.string().min(1, "Category is required"),
  }),
});

// ID parameter validation
const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  createMessageSchema,
  categorySchema,
  categoryParamSchema,
  idParamSchema,
};
