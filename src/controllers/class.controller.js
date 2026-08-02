const Class = require("../models/Class");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

exports.createClass = async (req, res) => {
  try {
    const { name } = req.validated.body;
    const c = await Class.create({ name });
    res.status(201).json(c);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { name } = req.validated.body;
    const c = await Class.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!c) return res.status(404).json({ message: "Class not found" });
    res.json(c);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const c = await Class.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ message: "Class not found" });
    await Attendance.deleteMany({ classId: req.params.id });
    await Student.deleteMany({ classId: req.params.id });
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};