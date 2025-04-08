const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const loginUser = (req, res, userType) => {
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

      // Check if the user is verified
      if (!user.is_verified) {
        return res.status(403).json({
          message:
            "Email not verified. Please check your inbox to verify your account.",
        });
      }

      const token = jwt.sign({ id: user.id, role: userType }, JWT_SECRET, {
        expiresIn: "30m",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Change to true if using HTTPS
        sameSite: "Lax",
        maxAge: 30 * 60 * 1000, // 30 minutes
      });

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.full_name || user.fullName,
          email: user.email,
          username: user.username,
          role: userType,
        },
      });
    }
  );
};

// Customer login
router.post("/customer", (req, res) => {
  loginUser(req, res, "customer");
});

// Vendor login
router.post("/vendor", (req, res) => {
  loginUser(req, res, "vendor");
});

module.exports = router;
