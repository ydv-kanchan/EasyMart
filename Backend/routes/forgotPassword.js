const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const nodemailer = require("nodemailer");

const router = express.Router();

// 🌐 Send password reset email
router.post("/forgot-password", async (req, res) => {
  const { email, userType } = req.body;
  console.log("📩 Request Body:", req.body); // Debug

  if (
    !email ||
    !userType ||
    (userType !== "customers" && userType !== "vendors")
  ) {
    return res
      .status(400)
      .json({ message: "Valid email and userType are required." });
  }

  try {
    const [users] = await db
      .promise()
      .query(`SELECT * FROM ${userType} WHERE email = ?`, [email]);

    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // 1 hour

    await db
      .promise()
      .query(
        `UPDATE ${userType} SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`,
        [token, expiry, email]
      );

    const resetLink = `http://localhost:5173/reset-password/${token}?userType=${userType}`;
    console.log("🔗 Reset Link:", resetLink);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Check if transporter is working
    transporter.verify((err, success) => {
      if (err) {
        console.error("❌ Transporter Verification Error:", err);
      } else {
        console.log("✅ Transporter verified successfully:", success);
      }
    });

    await transporter.sendMail({
      from: `"EasyMart" <${process.env.EMAIL}>`,
      to: email,
      subject: "Password Reset - EasyMart",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p><strong>This link will expire in 1 hour.</strong></p>
      `,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("💥 Forgot Password Error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// 🔐 Handle password reset using token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password, userType } = req.body;

  if (
    !password ||
    !userType ||
    (userType !== "customers" && userType !== "vendors")
  ) {
    return res
      .status(400)
      .json({ message: "Missing password or invalid userType." });
  }

  try {
    const [users] = await db
      .promise()
      .query(
        `SELECT * FROM ${userType} WHERE reset_token = ? AND reset_token_expiry > ?`,
        [token, Date.now()]
      );

    const user = users[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userIdField = userType === "vendors" ? "vendor_id" : "id";

    await db
      .promise()
      .query(
        `UPDATE ${userType} SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE ${userIdField} = ?`,
        [hashedPassword, user[userIdField]]
      );

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("💥 Reset Password Error:", err.message);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
