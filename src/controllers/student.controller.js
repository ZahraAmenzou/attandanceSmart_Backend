const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

exports.getStudentsWithStats = async (req, res) => {

  try {

    const students = await Student.find().populate("classId");

    const result = await Promise.all(
      students.map(async (s) => {

        const absences = await Attendance.countDocuments({
          studentId: s._id,
          status: "absent"
        });

        const presents = await Attendance.countDocuments({
          studentId: s._id,
          status: "present"
        });

        const lates = await Attendance.countDocuments({
          studentId: s._id,
          status: "late"
        });

        // discipline system
        let discipline = 20 - (absences * 0.5);

        if (discipline < 0) discipline = 0;

        let warning = null;

        if (absences >= 3) {
          warning = "⚠ Warning: 3+ absences";
        }

        return {
          _id: s._id,
          firstName: s.firstName,
          lastName: s.lastName,
          classId: s.classId,

          absences,
          presents,
          lates,

          discipline,
          warning
        };

      })
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};