const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const handleLogin = (req, res, userType, idField) => {
  const { email, password } = req.body;
  const table = userType === "customer" ? "customers" : "vendors";

  db.query(
    `SELECT * FROM ${table} WHERE email = ?`,
    [email],
    async (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Email not found" });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ message: "Invalid password" });
      }

      if (!user.is_verified) {
        return res.status(403).json({
          message:
            "Email not verified. Please check your inbox to verify your account.",
        });
      }

      // ✅ Generate token
      const token = jwt.sign(
        { id: user[idField], role: userType },
        JWT_SECRET,
        { expiresIn: "30m" }
      );

      // ✅ Set correct cookie name
      const cookieName =
        userType === "customer" ? "customer_token" : "vendor_token";

      // ✅ Clear opposite cookie
      const oppositeCookie =
        userType === "customer" ? "vendor_token" : "customer_token";
      res.clearCookie(oppositeCookie);

      // ✅ Set current token in cookie
      res.cookie(cookieName, token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "Lax",
        maxAge: 30 * 60 * 1000, // 30 minutes
      });

      // ✅ Respond with user data
      res.status(200).json({
        message: "Login successful",
        token, // Optional: useful for frontend fallback
        user: {
          id: user[idField],
          name: user.full_name || user.fullName,
          email: user.email,
          username: user.username,
          role: userType,
        },
      });
    }
  );
};

router.post("/customer", (req, res) => {
  handleLogin(req, res, "customer", "id");
});

router.post("/vendor", (req, res) => {
  handleLogin(req, res, "vendor", "vendor_id");
});

module.exports = router;
