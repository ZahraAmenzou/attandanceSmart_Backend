const Subject = require("../models/Subject");
const TeacherClassSubject = require("../models/TeacherClassSubject");

exports.createSubject = async (req, res) => {
  try {
    const { name, code, description } = req.validated.body;
    const subject = await Subject.create({ name, code, description });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { name, code, description } = req.validated.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, code, description },
      { new: true }
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    await TeacherClassSubject.deleteMany({ subjectId: req.params.id });
    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignTeacherClassSubject = async (req, res) => {
  try {
    const { teacherId, classId, subjectIds } = req.validated.body;

    const existing = await TeacherClassSubject.find({ teacherId, classId }).select("subjectId");
    const existingIds = existing.map(e => e.subjectId.toString());

    const toCreate = subjectIds.filter(s => !existingIds.includes(s));
    if (toCreate.length === 0) return res.status(400).json({ message: "All subjects already assigned" });

    await TeacherClassSubject.insertMany(
      toCreate.map(subjectId => ({ teacherId, classId, subjectId }))
    );

    const assignments = await TeacherClassSubject.find({ teacherId, classId })
      .populate("teacherId", "name email")
      .populate("classId", "name")
      .populate("subjectId", "name code");

    res.status(201).json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await TeacherClassSubject.find()
      .populate("teacherId", "name email")
      .populate("classId", "name")
      .populate("subjectId", "name code")
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeAssignment = async (req, res) => {
  try {
    const assignment = await TeacherClassSubject.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json({ message: "Assignment removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTeacherClassSubjects = async (req, res) => {
  try {
    const { teacherId, classId } = req.params;
    const { subjectIds } = req.validated.body;

    await TeacherClassSubject.deleteMany({ teacherId, classId });

    if (subjectIds.length > 0) {
      await TeacherClassSubject.insertMany(
        subjectIds.map(subjectId => ({ teacherId, classId, subjectId }))
      );
    }

    const assignments = await TeacherClassSubject.find({ teacherId, classId })
      .populate("teacherId", "name email")
      .populate("classId", "name")
      .populate("subjectId", "name code");

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMySubjects = async (req, res) => {
  try {
    const { classId } = req.query;
    const filter = { teacherId: req.user.id };
    if (classId) filter.classId = classId;

    const assignments = await TeacherClassSubject.find(filter)
      .populate("subjectId", "name code description")
      .populate("classId", "name")
      .sort({ createdAt: -1 });

    if (classId) {
      const subjects = assignments.map(a => a.subjectId).filter(Boolean);
      return res.json(subjects);
    }

    const grouped = {};
    assignments.forEach(a => {
      const cid = a.classId?._id || "unknown";
      if (!grouped[cid]) grouped[cid] = { class: a.classId, subjects: [] };
      if (a.subjectId) grouped[cid].subjects.push(a.subjectId);
    });

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};