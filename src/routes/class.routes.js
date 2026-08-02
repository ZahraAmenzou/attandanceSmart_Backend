const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate");
const { createClass, getClasses, updateClass, deleteClass } = require("../controllers/class.controller");
const TeacherClassSubject = require("../models/TeacherClassSubject");
const { createClassSchema, updateClassSchema, classIdParamSchema } = require("../validations/class.validation");

router.get("/", auth, getClasses);

router.get("/my", auth, async (req, res) => {
  try {
    const assignments = await TeacherClassSubject.find({ teacherId: req.user.id }).select("classId").populate("classId");
    const seen = {};
    const classes = [];
    assignments.forEach(a => {
      if (a.classId && !seen[a.classId._id]) {
        seen[a.classId._id] = true;
        classes.push(a.classId);
      }
    });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, role(["admin"]), validate(createClassSchema), createClass);
router.put("/:id", auth, role(["admin"]), validate(updateClassSchema), updateClass);
router.delete("/:id", auth, role(["admin"]), validate(classIdParamSchema), deleteClass);

module.exports = router;