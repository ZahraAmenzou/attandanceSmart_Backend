const { z } = require("zod");
const { objectId } = require("./auth.validation");

const createScheduleSchema = z.object({
  body: z.object({
    classId: objectId,
    teacherId: objectId,
    subject: z.string().trim().min(1, "Subject is required").max(100),
    day: z.string().trim().min(1, "Day is required"),
    time: z.string().trim().min(1, "Time is required"),
  }),
});

module.exports = { createScheduleSchema };
