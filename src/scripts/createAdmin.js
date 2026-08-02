const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const {
  createTeacher,
  getTeachers,
  deleteTeacher
} = require("../controllers/user.controller");

// 👑 ADMIN ONLY
router.post("/teacher", auth, role(["admin"]), createTeacher);
router.get("/teacher", auth, role(["admin"]), getTeachers);
router.delete("/teacher/:id", auth, role(["admin"]), deleteTeacher);

module.exports = router;