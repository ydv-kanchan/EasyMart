const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateCustomerToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from the header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (decoded.role !== "customer") {
      return res.status(403).json({ message: "Access denied: Not a customer" });
    }
   
    req.customer = { customer_id: decoded.id, role: decoded.role };
    next(); 
  } catch (err) {
    console.error("Token validation error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = validateCustomerToken;
