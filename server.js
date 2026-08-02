const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",       require("./src/routes/auth.routes"));
app.use("/api/students",   require("./src/routes/student.routes"));
app.use("/api/classes",    require("./src/routes/class.routes"));
app.use("/api/attendance", require("./src/routes/attendance.routes"));
app.use("/api/dashboard",  require("./src/routes/dashboard.routes"));
app.use("/api/users",      require("./src/routes/user.routes"));
app.use("/api/schedules",  require("./src/routes/schedule.routes"));
app.use("/api/admin",      require("./src/routes/admin.routes"));
app.use("/api/reports",    require("./src/routes/report.routes"));
app.use("/api/subjects",   require("./src/routes/subject.routes"));

app.get("/", (req, res) => res.send("Smart Attendance API ✅"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);