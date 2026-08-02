const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class"
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    subject: String,
    day: String,   // Monday, Tuesday...
    time: String   // 08:00 - 10:00
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);