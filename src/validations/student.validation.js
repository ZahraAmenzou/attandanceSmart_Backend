const { z } = require("zod");
const { objectId } = require("./auth.validation");

const createStudentSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1, "First name is required").max(100),
    lastName: z.string().trim().min(1, "Last name is required").max(100),
    classId: objectId,
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    parentPhone: z.string().trim().max(20).optional().or(z.literal("")),
    email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  }),
});

const updateStudentSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    firstName: z.string().trim().min(1, "First name is required").max(100).optional(),
    lastName: z.string().trim().min(1, "Last name is required").max(100).optional(),
    classId: objectId.optional(),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    parentPhone: z.string().trim().max(20).optional().or(z.literal("")),
    email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  }),
});

const studentIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

const classIdParamSchema = z.object({
  params: z.object({
    classId: objectId,
  }),
});

const disciplineSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    value: z.number().min(-20, "Value too low").max(20, "Value too high"),
  }),
});

module.exports = {
  createStudentSchema,
  updateStudentSchema,
  studentIdParamSchema,
  classIdParamSchema,
  disciplineSchema,
};
