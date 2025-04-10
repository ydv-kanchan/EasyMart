const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

// POST /api/change-password/:role
router.post("/change-password/:role", async (req, res) => {
  const role = req.params.role;

  // ✅ Use correct cookie based on role
  const token =
    role === "customer"
      ? req.cookies.customer_token
      : role === "vendor"
      ? req.cookies.vendor_token
      : null;

  const { currentPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    console.log("User ID from token:", userId);

    let table, idColumn;
    if (role === "customer") {
      table = "customers";
      idColumn = "id";
    } else if (role === "vendor") {
      table = "vendors";
      idColumn = "vendor_id";
    } else {
      return res.status(400).json({ error: "Invalid user role." });
    }

    db.query(
      `SELECT password FROM ${table} WHERE ${idColumn} = ?`,
      [userId],
      async (err, result) => {
        if (err) {
          console.error("DB SELECT error:", err);
          return res.status(500).json({ error: "Database error." });
        }

        if (result.length === 0) {
          return res.status(404).json({ error: "User not found." });
        }

        const hashedPassword = result[0].password;
        console.log("Password from DB:", hashedPassword);

        const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
        if (!isMatch) {
          console.warn("Incorrect current password");
          return res
            .status(400)
            .json({ error: "Current password is incorrect." });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        db.query(
          `UPDATE ${table} SET password = ? WHERE ${idColumn} = ?`,
          [newHashedPassword, userId],
          (err, result) => {
            if (err) {
              console.error("DB UPDATE error:", err);
              return res
                .status(500)
                .json({ error: "Failed to update password." });
            }

            console.log("Password updated successfully");
            res.json({ message: "Password updated successfully!" });
          }
        );
      }
    );
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
});

module.exports = router;
