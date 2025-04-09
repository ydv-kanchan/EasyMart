const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const authenticateToken = require("../middleware/authenticateToken");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

// ========== UPDATE Customer Profile ==========
router.put("/customer/update", authenticateToken, async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    phone,
    house_no,
    street,
    landmark,
    city,
    state,
    country,
    pincode,
  } = req.body;

  const userId = req.user.id;

  const getEmailQuery = "SELECT email FROM customers WHERE id = ?";
  db.query(getEmailQuery, [userId], async (err, results) => {
    if (err || results.length === 0) {
      console.error("Error fetching email:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const currentEmail = results[0].email;

    const updateQuery = `
      UPDATE customers SET first_name=?, middle_name=?, last_name=?, phone=?, 
      house_no=?, street=?, landmark=?, city=?, state=?, country=?, pincode=? 
      WHERE id=?`;

    db.query(
      updateQuery,
      [
        first_name,
        middle_name || null,
        last_name || null,
        phone,
        house_no,
        street || null,
        landmark,
        city,
        state,
        country,
        pincode,
        userId,
      ],
      async (err) => {
        if (err) {
          console.error("Error updating profile:", err);
          return res.status(500).json({ error: "Profile update failed" });
        }

        if (email !== currentEmail) {
          const token = jwt.sign(
            { user_id: userId, email, type: "add" },
            JWT_SECRET,
            { expiresIn: "1d" }
          );

          const verifyURL = `http://localhost:3000/api/profile/verify-email?token=${token}`;

          try {
            await transporter.sendMail({
              from: `"EasyMart" <${EMAIL}>`,
              to: email,
              subject: "Verify Your New Email",
              html: `<p>Click below to verify your new email address:</p><a href="${verifyURL}">Verify Email</a>`,
            });

            db.query(
              "UPDATE customers SET is_verified = 0 WHERE id = ?",
              [userId],
              (err) => {
                if (err) {
                  console.error("Error setting verification flag:", err);
                  return res.status(500).json({ error: "Flag update error" });
                }

                return res.status(200).json({
                  requiresVerification: true,
                  message:
                    "Verification email sent to the new address. Please verify.",
                });
              }
            );
          } catch (mailErr) {
            console.error("Email sending failed:", mailErr);
            return res.status(500).json({ error: "Email sending failed" });
          }
        } else {
          return res
            .status(200)
            .json({ message: "Profile updated successfully." });
        }
      }
    );
  });
});

// ========== VERIFY EMAIL ==========
// ========== VERIFY EMAIL ==========
router.get("/verify-email", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token error:", err);
      return res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
          <h1 style="color: red;">❌ Verification Failed</h1>
          <p>Token is invalid or expired. Please try again.</p>
        </div>
      `);
    }

    const { user_id, email, type } = decoded;

    if (type === "add") {
      db.query(
        "UPDATE customers SET email = ?, is_verified = 1 WHERE id = ?",
        [email, user_id],
        (err) => {
          if (err) {
            console.error("DB error during email update:", err);
            return res.status(500).send(`
              <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
                <h1 style="color: red;">❌ Internal Error</h1>
                <p>Something went wrong. Please try again later.</p>
              </div>
            `);
          }

          // Optionally, set new token as cookie (not required for email-only verify)
          const newToken = jwt.sign(
            { id: user_id, email, role: "customer" },
            JWT_SECRET,
            { expiresIn: "7d" }
          );

          res.cookie("token", newToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
          });

          // ✅ SUCCESS MESSAGE INSTEAD OF REDIRECT
          res.send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
              <h1 style="color: green;">✅ Email Verified Successfully!</h1>
              <p>You can now close this window and continue using EasyMart.</p>
            </div>
          `);
        }
      );
    } else {
      return res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
          <h1 style="color: red;">❌ Invalid Token Type</h1>
          <p>Unable to verify email. Please contact support.</p>
        </div>
      `);
    }
  });
});

// ========== FETCH Customer Profile ==========
router.get("/customer", authenticateToken, (req, res) => {
  const { role, id } = req.user;
  if (role !== "customer") {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  const query = `
    SELECT first_name, middle_name, last_name, email, username, phone,
           house_no, street, landmark, city, state, country, pincode
    FROM customers WHERE id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(results[0]);
  });
});

// ========== FETCH Vendor Profile ==========
router.get("/vendor", authenticateToken, (req, res) => {
  const { role, id } = req.user;
  if (role !== "vendor") {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  const query = `
    SELECT fullName, email, username, phone, businessName, businessType,
           businessRegNo, businessAddress, website, storeName,
           storeDescription, productCategories
    FROM vendors WHERE id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(results[0]);
  });
});

module.exports = router;
