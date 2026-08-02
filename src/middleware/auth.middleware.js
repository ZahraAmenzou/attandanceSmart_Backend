const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(403).json({ message: "No token" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY"
    );

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};