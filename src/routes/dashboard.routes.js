const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const {
  getDashboardStats
} = require("../controllers/dashboard.controller");

router.get(
  "/",
  auth,
  role(["admin", "teacher"]),
  getDashboardStats
);

module.exports = router;