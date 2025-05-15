const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/verify-email", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Verification token is missing.");
  }

  try {
    const { email } = jwt.verify(token, JWT_SECRET);
    console.log("Verifying email:", email); 


    const updateSql = "UPDATE customers SET is_verified = true WHERE email = ?";
    db.query(updateSql, [email], (err, result) => {
      if (err) {
        console.error("Database error during verification:", err);
        return res.status(500).send("Internal Server Error");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("User not found.");
      }

    
      res.redirect("http://localhost:3000/profile"); 
    });
  } catch (err) {
    console.error("Invalid or expired token:", err);
    res.status(400).send("Invalid or expired token.");
  }
});

module.exports = router;
