const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");

router.get("/dashboard", auth, role(["admin"]), async (req, res) => {
  try {
    const classes = await Class.find();

    const data = await Promise.all(
      classes.map(async (c) => {
        const attendance = await Attendance.find({ classId: c._id })
          .populate("studentId", "firstName lastName")
          .sort({ createdAt: -1 });

        return {
          className: c.name,
          subject: "",
          students: attendance.map((a) => ({
            firstName: a.studentId?.firstName,
            lastName: a.studentId?.lastName,
            status: a.status,
            date: a.date,
          })),
        };
      })
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;