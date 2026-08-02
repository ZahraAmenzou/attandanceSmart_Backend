const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({

  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  date: {
    type: String, // YYYY-MM-DD
    required: true
  },

  time: String

}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);