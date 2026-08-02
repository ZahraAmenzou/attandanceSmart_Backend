const Student    = require("../models/Student");
const Attendance = require("../models/Attendance");
const Class      = require("../models/Class");

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classes = await Class.find();

    const classStats = await Promise.all(
      classes.map(async (c) => {
        const attendance = await Attendance.find({
          classId: c._id,
          date: { $gte: today }
        }).populate("studentId");

        const present = attendance.filter(a => a.status === "present");
        const absent  = attendance.filter(a => a.status === "absent");
        const late    = attendance.filter(a => a.status === "late");

        return {
          classId:   c._id,
          className: c.name,
          subject:   "",

          present: present.length,
          absent:  absent.length,
          late:    late.length,

          presentStudents: present.map(a => a.studentId).filter(Boolean),
          absentStudents:  absent.map(a => a.studentId).filter(Boolean),
          lateStudents:    late.map(a => a.studentId).filter(Boolean),
        };
      })
    );

    res.json({ classStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};