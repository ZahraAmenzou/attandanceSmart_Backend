const { z } = require("zod");
const { objectId } = require("./auth.validation");

const createClassSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Class name is required").max(100),
  }),
});

const updateClassSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    name: z.string().trim().min(1, "Class name is required").max(100),
  }),
});

const classIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

module.exports = { createClassSchema, updateClassSchema, classIdParamSchema };