const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const multer = require("multer");
const validateSignup = require("../middleware/validateSignup");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/logo"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Customer Signup Route
router.post("/customers", validateSignup("customer"), async (req, res) => {
  console.log("Received Customer Data:", req.body);

  try {
    const {
      firstName,
      middleName, // Optional
      lastName, // Optional
      email,
      username,
      password,
      confirmPassword,
      phone,
      houseNo,
      street, // Added street separately
      landmark,
      city,
      state,
      country,
      pincode,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const checkUserSql =
      "SELECT * FROM customers WHERE username = ? OR email = ?";
    db.query(checkUserSql, [username, email], async (err, result) => {
      if (err) {
        console.error("Error checking customer:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.length > 0) {
        return res.status(400).json({
          message:
            result[0].username === username
              ? "Username is already taken"
              : "Email is already taken",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: "1d",
      });

      const insertSql = `INSERT INTO customers 
        (first_name, middle_name, last_name, email, username, password, phone, house_no, street, landmark, city, state, country, pincode, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)`;

      db.query(
        insertSql,
        [
          firstName,
          middleName || null,
          lastName || null,
          email,
          username,
          hashedPassword,
          phone,
          houseNo,
          street,
          landmark,
          city,
          state,
          country,
          pincode,
        ],
        async (err, result) => {
          if (err) {
            console.error("Error inserting customer:", err);
            return res.status(500).json({ error: "Database error" });
          }

          const verificationUrl = `http://localhost:3000/api/verify/customer?token=${verificationToken}`;

          await transporter.sendMail({
            from: `"EasyMart" <${process.env.EMAIL}>`,
            to: email,
            subject: "Verify your email",
            html: `<p>Hi ${firstName} ${lastName || ""},</p>
                   <p>Welcome to our platform! 🎉</p>
                   <p>Please confirm your email address by clicking the link below:</p>
                   <a href="${verificationUrl}">Verify Email</a>
                   <p>If you didn't sign up, please ignore this email.</p>
                   <p>Thanks,</p>
                   <p>The EasyMart Team</p>`,
          });

          res
            .status(201)
            .json({ message: "Signup successful. Please verify your email." });
        }
      );
    });
  } catch (error) {
    console.error("Customer signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/vendors", upload.single("storeLogo"), async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      email,
      username,
      password,
      phone,
      businessName,
      storeName,
      storeDescription,
    } = req.body;

    console.log("Request Body in /vendors route:", req.body);

    const storeLogo =req.file ? `/uploads/logo/${req.file.filename}` : null;

    const categories = req.body.productCategories || [];
    const productCategories = Array.isArray(categories)
      ? categories
      : [categories];

    const cleanCategories = productCategories.filter(
      (cat) => typeof cat === "string" && cat.trim() !== ""
    );

    // Check if username or email already exists
    const checkSql = "SELECT * FROM vendors WHERE username = ? OR email = ?";
    db.query(checkSql, [username, email], async (err, result) => {
      if (err) {
        console.error("Database Error on Check:", err);
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }

      if (result.length > 0) {
        return res.status(400).json({
          message:
            result[0].username === username
              ? "Username already taken"
              : "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);


      const insertSql = `
        INSERT INTO vendors (
          first_name, middle_name, last_name, email, username,
          password, phone, businessName, storeName,
          storeDescription, store_logo, is_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)
      `;

      db.query(
        insertSql,
        [
          first_name,
          middle_name || null,
          last_name || null,
          email,
          username,
          hashedPassword,
          phone,
          businessName,
          storeName,
          storeDescription,
          storeLogo,
        ],
        async (err, result) => {
          if (err) {
            console.error("Database Insert Error:", err);
            return res
              .status(500)
              .json({ message: "Insert error", error: err.message });
          }

          const vendorId = result.insertId;

          const getCategoryIdSql = "SELECT category_id FROM categories WHERE category_name = ?";
          const insertVendorCategorySql = "INSERT INTO vendor_categories (vendor_id, category_id) VALUES (?, ?)";

          for (let i = 0; i < cleanCategories.length; i++) {
            const catName = cleanCategories[i];

            db.query(getCategoryIdSql, [catName], (err, categoryResult) => {
              if (err || categoryResult.length === 0) {
                console.error(
                  `Category "${catName}" not found or error occurred:`,
                  err
                );
                return;
              }

              const categoryId = categoryResult[0].category_id;

              db.query(
                insertVendorCategorySql,
                [vendorId, categoryId],
                (err) => {
                  if (err) {
                    console.error(
                      "Error inserting into vendor_categories:",
                      err
                    );
                  } else {
                    console.log(
                      `Inserted vendor category: ${catName} (ID: ${categoryId})`
                    );
                  }
                }
              );
            });
          }

          console.log("Vendor inserted with ID:", vendorId);

          const token = jwt.sign({ email, role: "vendor" }, JWT_SECRET, {
            expiresIn: "1d",
          });

          const verifyURL = `http://localhost:3000/api/verify/vendor?token=${token}`;

          await transporter.sendMail({
            from: `"EasyMart" <${process.env.EMAIL}>`,
            to: email,
            subject: "Verify your email",
            html: `
              <p>Hi ${first_name},</p>
              <p>Click below to verify your email and activate your store:</p>
              <a href="${verifyURL}">Verify Email</a>
            `,
          });

          res.status(201).json({
            message: "Vendor signed up successfully. Verification email sent.",
          });
        }
      );
    });
  } catch (err) {
    console.error("Vendor Signup Error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
