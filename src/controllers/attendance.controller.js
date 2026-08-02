const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const nodemailer = require("nodemailer");

const HOURS_PER_SESSION = 2;
const ALERT_THRESHOLD = 15;

// ============ EMAIL SENDER ============
const sendAlertEmail = async (student, totalHours, className) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Smart Attendance" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: `⚠️ تنبيه غياب — ${student.firstName} ${student.lastName}`,
      html: `
        <div style="font-family: Arial; padding: 20px; direction: rtl;">
          <h2 style="color: #e53e3e;">⚠️ تنبيه غياب</h2>
          <p>السلام عليكم،</p>
          <p>
            نود إعلامكم بأن الطالب 
            <strong>${student.firstName} ${student.lastName}</strong>
            من قسم <strong>${className}</strong>
            قد تجاوز <strong>${totalHours} ساعة غياب</strong>.
          </p>
          <p>نرجو التواصل مع الإدارة في أقرب وقت.</p>
          <hr/>
          <small style="color: #718096;">Smart Attendance System</small>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Alert email sent to ${student.email}`);
    return { success: true, to: student.email };
  } catch (err) {
    console.log("❌ Email error:", err.message);
    return { success: false, error: err.message };
  }
};

// ============ SMS SENDER ============
const sendAlertSMS = async (student, totalHours, className) => {
  const phone = student.parentPhone || student.phone;
  if (!phone) return { success: false, error: "No phone number" };

  const message = `تنبيه: الطالب ${student.firstName} ${student.lastName} من قسم ${className} تجاوز ${totalHours} ساعة غياب.`;

  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = require("twilio");
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log(`✅ Alert SMS sent to ${phone}`);
      return { success: true, to: phone };
    } else {
      console.log(`[SMS mock] To: ${phone} — ${message}`);
      return { success: true, to: phone, mock: true };
    }
  } catch (err) {
    console.log("❌ SMS error:", err.message);
    return { success: false, error: err.message };
  }
};

// ============ CHECK & ALERT ============
const checkAndAlert = async (studentId, className) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) return null;

    const absences = await Attendance.countDocuments({
      studentId,
      status: "absent",
    });

    const totalHours = absences * HOURS_PER_SESSION;

    if (totalHours >= ALERT_THRESHOLD && totalHours > (student.lastAlertedHours || 0)) {
      const emailResult = await sendAlertEmail(student, totalHours, className);
      const smsResult = await sendAlertSMS(student, totalHours, className);

      student.lastAlertedHours = totalHours;
      await student.save();

      return {
        triggered: true,
        studentName: `${student.firstName} ${student.lastName}`,
        totalHours,
        email: emailResult,
        sms: smsResult,
        message: `${student.firstName} ${student.lastName} تجاوز ${totalHours} ساعة غياب`,
      };
    }

    return { triggered: false };
  } catch (err) {
    console.log("checkAndAlert error:", err.message);
    return null;
  }
};

// ============ MARK ATTENDANCE ============
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, classId, subjectId, status } = req.validated.body;

    const attendance = await Attendance.create({
      studentId,
      classId,
      subjectId,
      status,
      teacher: req.user.id,
    });

    let alert = null;
    if (status === "absent") {
      const Class = require("../models/Class");
      const cls = await Class.findById(classId);
      alert = await checkAndAlert(studentId, cls?.name || "");
    }

    res.status(201).json({ attendance, alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============ GET ALL ============
exports.getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("studentId")
      .populate("classId")
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
