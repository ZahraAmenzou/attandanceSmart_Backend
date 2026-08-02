const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate");
const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  assignTeacherClassSubject,
  getAssignments,
  removeAssignment,
  updateTeacherClassSubjects,
  getMySubjects,
} = require("../controllers/subject.controller");
const {
  createSubjectSchema,
  updateSubjectSchema,
  subjectIdParamSchema,
  assignTeacherClassSubjectSchema,
  updateAssignmentsSchema,
} = require("../validations/subject.validation");

router.get("/", auth, getSubjects);
router.post("/", auth, role(["admin"]), validate(createSubjectSchema), createSubject);
router.put("/:id", auth, role(["admin"]), validate(updateSubjectSchema), updateSubject);
router.delete("/:id", auth, role(["admin"]), validate(subjectIdParamSchema), deleteSubject);

router.get("/my", auth, role(["teacher"]), getMySubjects);

router.get("/assignments", auth, role(["admin"]), getAssignments);
router.post("/assignments", auth, role(["admin"]), validate(assignTeacherClassSubjectSchema), assignTeacherClassSubject);
router.put("/assignments/:teacherId/:classId", auth, role(["admin"]), validate(updateAssignmentsSchema), updateTeacherClassSubjects);
router.delete("/assignments/:id", auth, role(["admin"]), validate(subjectIdParamSchema), removeAssignment);

module.exports = router;