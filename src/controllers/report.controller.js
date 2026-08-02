const PDFDocument = require("pdfkit");
const Attendance = require("../models/Attendance");

exports.exportAttendancePDF = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("studentId", "firstName lastName")
      .populate("classId", "name")
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Attendance Report", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#666").text(`Generated: ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.moveDown(1.5);

    // Table header
    const startY = doc.y;
    const cols = { name: 50, class: 220, status: 340, date: 420 };

    doc.fontSize(10).fillColor("#333");
    doc.text("Student", cols.name, startY, { width: 160 });
    doc.text("Class", cols.class, startY, { width: 110 });
    doc.text("Status", cols.status, startY, { width: 70 });
    doc.text("Date", cols.date, startY, { width: 120 });

    doc.moveTo(50, startY + 15).lineTo(545, startY + 15).stroke("#ccc");

    // Table rows
    let y = startY + 25;

    data.forEach((a) => {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }

      const name = a.studentId
        ? `${a.studentId.firstName} ${a.studentId.lastName}`
        : "Unknown";
      const className = a.classId?.name || "—";
      const status = a.status;
      const date = a.date
        ? new Date(a.date).toLocaleDateString("fr-MA")
        : "—";

      doc.fontSize(10).fillColor("#333");
      doc.text(name, cols.name, y, { width: 160 });
      doc.text(className, cols.class, y, { width: 110 });
      doc.text(status, cols.status, y, { width: 70 });
      doc.text(date, cols.date, y, { width: 120 });

      y += 20;
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
