const mongoose = require("mongoose");

const teacherClassSubjectSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
}, { timestamps: true });

teacherClassSubjectSchema.index({ teacherId: 1, classId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model("TeacherClassSubject", teacherClassSubjectSchema);