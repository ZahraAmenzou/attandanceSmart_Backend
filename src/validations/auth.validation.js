const { z } = require("zod");

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email format");

const password = z
  .string()
  .min(6, "Password must be at least 6 characters");

const name = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name is too long");

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1, "Password is required"),
  }),
});

const createTeacherSchema = z.object({
  body: z.object({
    name,
    email,
    password,
  }),
});

const deleteTeacherSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

const updateTeacherSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    name,
    email,
  }),
});

module.exports = {
  loginSchema,
  createTeacherSchema,
  deleteTeacherSchema,
  updateTeacherSchema,
  email,
  password,
  name,
  objectId,
};
