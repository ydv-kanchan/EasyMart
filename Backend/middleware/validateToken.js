const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (decoded.role !== "vendor") {
      return res.status(403).json({ message: "Access denied: Not a vendor" });
    }

    req.vendor = { vendor_id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error("Token validation error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = validateToken;
