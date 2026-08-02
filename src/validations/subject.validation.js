const { z } = require("zod");
const { objectId } = require("./auth.validation");

const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Subject name is required").max(100),
    code: z.string().trim().optional().or(z.literal("")),
    description: z.string().trim().optional().or(z.literal("")),
  }),
});

const updateSubjectSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    name: z.string().trim().min(1, "Subject name is required").max(100),
    code: z.string().trim().optional().or(z.literal("")),
    description: z.string().trim().optional().or(z.literal("")),
  }),
});

const subjectIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

const assignTeacherClassSubjectSchema = z.object({
  body: z.object({
    teacherId: objectId,
    classId: objectId,
    subjectIds: z.array(objectId).min(1, "At least one subject is required"),
  }),
});

const updateAssignmentsSchema = z.object({
  params: z.object({ teacherId: objectId, classId: objectId }),
  body: z.object({
    subjectIds: z.array(objectId).optional().default([]),
  }),
});

module.exports = {
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdParamSchema,
  assignTeacherClassSubjectSchema,
  updateAssignmentsSchema,
};