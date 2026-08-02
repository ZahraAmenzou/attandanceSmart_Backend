const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,

  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  phone: String,
  parentPhone: String,
  email: String,

  discipline: {
    type: Number,
    default: 20
  },

  lastAlertedHours: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Student", studentSchema);