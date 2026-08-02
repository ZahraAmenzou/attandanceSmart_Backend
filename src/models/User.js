const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);