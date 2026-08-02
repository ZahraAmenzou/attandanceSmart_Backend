const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const { exportAttendancePDF } = require("../controllers/report.controller");

router.get("/attendance", auth, role(["admin"]), exportAttendancePDF);

module.exports = router;
