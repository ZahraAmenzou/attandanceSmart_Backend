const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate");

const {
  createTeacher,
  getTeachers,
  deleteTeacher,
  updateTeacher,
} = require("../controllers/user.controller");
const {
  createTeacherSchema,
  deleteTeacherSchema,
  updateTeacherSchema,
} = require("../validations/auth.validation");

// ADMIN ONLY
router.post("/teacher", auth, role(["admin"]), validate(createTeacherSchema), createTeacher);
router.get("/teacher", auth, role(["admin"]), getTeachers);
router.put("/teacher/:id", auth, role(["admin"]), validate(updateTeacherSchema), updateTeacher);
router.delete("/teacher/:id", auth, role(["admin"]), validate(deleteTeacherSchema), deleteTeacher);

module.exports = router;