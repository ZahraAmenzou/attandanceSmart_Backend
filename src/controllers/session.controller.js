const Session = require("../models/Session");

exports.createSession = async (req, res) => {

  try {

    const { classId, subject, time } = req.body;

    const session = await Session.create({
      classId,
      teacherId: req.user.id,
      subject,
      date: new Date().toISOString().split("T")[0],
      time
    });

    res.status(201).json(session);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};