const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= CREATE TEACHER =================
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const teacher = await User.create({
      name,
      email,
      password: hashed,
      role: "teacher"
    });

    res.status(201).json(teacher);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET TEACHERS =================
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE TEACHER =================
exports.deleteTeacher = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE TEACHER =================
exports.updateTeacher = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existing = await User.findOne({ email, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const teacher = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};