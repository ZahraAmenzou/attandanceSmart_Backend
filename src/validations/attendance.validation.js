const { z } = require("zod");
const { objectId } = require("./auth.validation");

const markAttendanceSchema = z.object({
  body: z.object({
    studentId: objectId,
    classId: objectId,
    subjectId: objectId,
    status: z.enum(["present", "absent", "late"], {
      errorMap: () => ({ message: "Status must be present, absent, or late" }),
    }),
  }),
});

module.exports = { markAttendanceSchema };
