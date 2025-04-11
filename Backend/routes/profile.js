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
router.put(
  "/customer/update",
  authenticateToken("customer"),
  async (req, res) => {
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
  }
);

router.get("/verify-email", (req, res) => {
  const token = req.query.token || req.query.vendor_token;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
          <h1 style="color: red;">❌ Verification Failed</h1>
          <p>Token is invalid or expired. Please try again.</p>
        </div>
      `);
    }

    const { user_id, vendor_id, email, type } = decoded;

    if (type === "add") {
      db.query(
        "UPDATE customers SET email = ?, is_verified = 1 WHERE id = ?",
        [email, user_id],
        (err) => {
          if (err) return res.status(500).send("Internal DB error");
          const token = jwt.sign(
            { id: user_id, role: "customer" },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          res.cookie("customer_token", token, { httpOnly: true });
          return res.send(successHTML("Customer"));
        }
      );
    } else if (type === "vendor_add") {
      db.query(
        "UPDATE vendors SET email = ? WHERE vendor_id = ?",
        [email, vendor_id],
        (err) => {
          if (err) return res.status(500).send("Internal DB error");
          const token = jwt.sign(
            { id: vendor_id, role: "vendor" },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          res.cookie("vendor_token", token, { httpOnly: true });
          return res.send(successHTML("Vendor"));
        }
      );
    } else {
      return res.status(400).send("Invalid token type.");
    }
  });

  function successHTML(role) {
    return `
      <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
        <h1 style="color: green;">✅ ${role} Email Verified!</h1>
        <p>You can now close this window and continue using EasyMart.</p>
      </div>
    `;
  }
});


// ========== FETCH Customer Profile ==========
router.get("/customer", authenticateToken("customer"), (req, res) => {
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
router.get("/vendor", authenticateToken("vendor"), (req, res) => {
  const { role, id } = req.user;

  if (role !== "vendor") {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  const query = `
    SELECT first_name, middle_name, last_name, email, username, phone
    FROM vendors WHERE vendor_id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Vendor not found" });

    res.json(results[0]);
  });
});

router.put("/vendor/update", authenticateToken("vendor"), (req, res) => {
  const vendorId = req.user.id;
  const { first_name, middle_name, last_name, phone, email, username } =
    req.body;

  const getEmailQuery = "SELECT email FROM vendors WHERE vendor_id = ?";
  db.query(getEmailQuery, [vendorId], async (err, results) => {
    if (err || results.length === 0) {
      console.error("Error fetching vendor email:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const currentEmail = results[0].email;

    const updateQuery = `
      UPDATE vendors SET first_name = ?, middle_name = ?, last_name = ?, phone = ?, username = ?
      WHERE vendor_id = ?
    `;

    db.query(
      updateQuery,
      [first_name, middle_name, last_name, phone, username, vendorId],
      async (err) => {
        if (err) {
          console.error("Vendor profile update error:", err);
          return res.status(500).json({ error: "Internal error" });
        }

        if (email !== currentEmail) {
          const token = jwt.sign(
            { vendor_id: vendorId, email, type: "vendor_add" },
            JWT_SECRET,
            { expiresIn: "1d" }
          );

          const verifyURL = `http://localhost:3000/api/profile/verify-email?vendor_token=${token}`;

          try {
            await transporter.sendMail({
              from: `"EasyMart" <${EMAIL}>`,
              to: email,
              subject: "Verify Your New Email (Vendor)",
              html: `<p>Click below to verify your new email address:</p><a href="${verifyURL}">Verify Email</a>`,
            });

            return res.status(200).json({
              requiresVerification: true,
              message:
                "Verification email sent to the new address. Please verify.",
            });
          } catch (mailErr) {
            console.error("Email sending failed:", mailErr);
            return res
              .status(500)
              .json({ error: "Failed to send verification email" });
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


router.delete("/delete", async (req, res, next) => {
  // Check for vendor or customer token
  const vendorAuth = authenticateToken("vendor");
  const customerAuth = authenticateToken("customer");

  // Run both middlewares, whichever matches will proceed
  vendorAuth(req, res, (err) => {
    if (!err) return deleteAccount(req, res, "vendor");
    customerAuth(req, res, (err) => {
      if (!err) return deleteAccount(req, res, "customer");
      return res
        .status(401)
        .json({ message: "Unauthorized. Token not valid." });
    });
  });
});

// 🔁 Reusable deletion logic
router.delete("/delete", (req, res) => {
  const vendorToken = req.cookies.vendor_token;
  const customerToken = req.cookies.customer_token;

  let token = null;
  let role = null;

  // ✅ Determine which token exists
  if (vendorToken) {
    token = vendorToken;
    role = "vendor";
  } else if (customerToken) {
    token = customerToken;
    role = "customer";
  } else {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // ✅ Choose table and column based on role
    const table = role === "vendor" ? "vendors" : "customers";
    const column = role === "vendor" ? "vendor_id" : "id";

    db.query(
      `DELETE FROM ${table} WHERE ${column} = ?`,
      [userId],
      (err, result) => {
        if (err) {
          console.error("Error deleting account:", err);
          return res
            .status(500)
            .json({
              message: "Error deleting account. Please try again later.",
            });
        }

        // ✅ Clear correct token after deletion
        const cookieName =
          role === "vendor" ? "vendor_token" : "customer_token";
        res.clearCookie(cookieName);

        return res
          .status(200)
          .json({ message: `${role} account deleted successfully` });
      }
    );
  } catch (err) {
    console.error("Token verification failed:", err);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
});


module.exports = router;
