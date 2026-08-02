const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present"
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);