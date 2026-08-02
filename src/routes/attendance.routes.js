const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate");
const Attendance = require("../models/Attendance");
const {
  markAttendance,
  getAttendance,
} = require("../controllers/attendance.controller");
const { markAttendanceSchema } = require("../validations/attendance.validation");

// MARK
router.post("/", auth, role(["admin", "teacher"]), validate(markAttendanceSchema), markAttendance);

// GET ALL
router.get("/", auth, role(["admin", "teacher"]), getAttendance);

// HISTORY
router.get("/history", auth, role(["admin", "teacher"]), async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("studentId")
      .populate("classId")
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;