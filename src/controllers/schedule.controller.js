const Schedule = require("../models/Schedule");

// CREATE SCHEDULE (ADMIN ONLY)
exports.createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL SCHEDULES
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("classId")
      .populate("teacherId");

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TEACHER VIEW ONLY HIS SCHEDULE
exports.getMySchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      teacherId: req.user.id
    })
      .populate("classId");

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};