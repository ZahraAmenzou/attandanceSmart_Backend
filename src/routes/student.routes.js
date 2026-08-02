const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate");
const Student = require("../models/Student");
const Class = require("../models/Class");
const TeacherClassSubject = require("../models/TeacherClassSubject");
const { getStudentsWithStats } = require("../controllers/student.controller");
const {
  createStudentSchema,
  updateStudentSchema,
  studentIdParamSchema,
  classIdParamSchema,
  disciplineSchema,
} = require("../validations/student.validation");

router.get("/", auth, async (req, res) => {
  try {
    const { classId, teacherId } = req.query;
    let query = {};

    if (classId) {
      query.classId = classId;
    }

    if (teacherId) {
      const assignments = await TeacherClassSubject.find({ teacherId }).select("classId");
      const classIds = [...new Set(assignments.map(a => a.classId.toString()))];
      query.classId = { $in: classIds };
    }

    const students = await Student.find(query).populate("classId");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/class/:classId", auth, validate(classIdParamSchema), async (req, res) => {
  try {
    const students = await Student.find({
      classId: req.params.classId,
    }).populate("classId");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stats", auth, role(["admin", "teacher"]), getStudentsWithStats);

router.post("/", auth, role(["admin"]), validate(createStudentSchema), async (req, res) => {
  try {
    const { firstName, lastName, classId, phone, parentPhone, email } = req.validated.body;
    const student = await Student.create({
      firstName,
      lastName,
      classId,
      phone,
      parentPhone,
      email,
      discipline: 20,
    });
    const populated = await student.populate("classId");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth, role(["admin"]), validate(updateStudentSchema), async (req, res) => {
  try {
    const { firstName, lastName, classId, phone, parentPhone, email } = req.validated.body;
    const update = {};
    if (firstName !== undefined) update.firstName = firstName;
    if (lastName !== undefined) update.lastName = lastName;
    if (classId !== undefined) update.classId = classId;
    if (phone !== undefined) update.phone = phone;
    if (parentPhone !== undefined) update.parentPhone = parentPhone;
    if (email !== undefined) update.email = email;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate("classId");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, role(["admin"]), validate(studentIdParamSchema), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/discipline/:id", auth, validate(disciplineSchema), async (req, res) => {
  try {
    const { value } = req.validated.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    student.discipline = Math.max(0, Math.min(20, student.discipline + value));
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;