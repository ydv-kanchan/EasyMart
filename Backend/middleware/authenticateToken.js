const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  console.log("req.cookies:", req.cookies);

  // Ensure cookies are being used
  if (!req.cookies || !req.cookies.token) {
    console.log("No token found in cookies");
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token decoded:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT verification error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
