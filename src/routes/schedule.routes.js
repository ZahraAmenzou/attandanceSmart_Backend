const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate");

const {
  createSchedule,
  getSchedules,
  getMySchedule
} = require("../controllers/schedule.controller");
const { createScheduleSchema } = require("../validations/schedule.validation");

// ADMIN ONLY
router.post("/", auth, role(["admin"]), validate(createScheduleSchema), createSchedule);

// ALL (admin/teacher)
router.get("/", auth, getSchedules);

// TEACHER ONLY HIS OWN
router.get("/me", auth, role(["teacher"]), getMySchedule);

module.exports = router;