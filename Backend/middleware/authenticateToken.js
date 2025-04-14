const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (role) => {
  return (req, res, next) => {
    const token = req.cookies[`${role}_token`]; 
    console.log(`${role} token from cookie:`, token);

    if (!token) {
      return res
        .status(401)
        .json({ message: `Access denied. No ${role} token provided.` });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== role) {
        return res
          .status(403)
          .json({ message: `Access denied. Invalid ${role} token.` });
      }
      req.user = decoded; // store decoded info for later use
      next();
    } catch (err) {
      return res
        .status(403)
        .json({ message: `Invalid or expired ${role} token.` });
    }
  };
};

module.exports = authenticateToken;
