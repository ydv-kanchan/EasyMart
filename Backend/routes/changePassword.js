const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

router.post("/change-password/:role", async (req, res) => {
  const { role } = req.params;
  const { currentPassword, newPassword } = req.body;

  const token =
    role === "customer"
      ? req.cookies.customer_token
      : role === "vendor"
      ? req.cookies.vendor_token
      : null;

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    let tableName, idColumn;
    if (role === "customer") {
      tableName = "customers";
      idColumn = "id";
    } else if (role === "vendor") {
      tableName = "vendors";
      idColumn = "vendor_id";
    } else {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    db.query(
      `SELECT password FROM ${tableName} WHERE ${idColumn} = ?`,
      [userId],
      async (err, results) => {
        if (err) {
          console.error("Error fetching password from DB:", err);
          return res.status(500).json({ error: "Database error." });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found." });
        }

        const storedHashedPassword = results[0].password;

        const isMatch = await bcrypt.compare(
          currentPassword,
          storedHashedPassword
        );
        if (!isMatch) {
          return res
            .status(400)
            .json({ error: "Current password is incorrect." });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        db.query(
          `UPDATE ${tableName} SET password = ? WHERE ${idColumn} = ?`,
          [newHashedPassword, userId],
          (err, updateResult) => {
            if (err) {
              console.error("Error updating password in DB:", err);
              return res
                .status(500)
                .json({ error: "Failed to update password." });
            }

            return res.json({ message: "Password updated successfully!" });
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
