const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const validateSignup = require("../middleware/validateSignup");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

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

// Vendor Signup Route
router.post("/vendors", validateSignup("vendor"), async (req, res) => {
  console.log("Received Data (Vendor):", req.body);

  try {
    const {
      fullName,
      email,
      username,
      password,
      confirmPassword,
      phone,
      businessName,
      businessType,
      businessRegNo,
      businessAddress,
      website,
      storeName,
      storeDescription,
      productCategories,
      shippingPolicy,
      returnPolicy,
    } = req.body;

    if (password != confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const checkUserSql =
      "SELECT * FROM vendors WHERE username = ? OR email = ?";
    db.query(checkUserSql, [username, email], async (err, result) => {
      if (err) {
        console.error("Error checking vendor:", err);
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
      const verificationUrl = `http://localhost:3000/api/verify/vendor?token=${verificationToken}`;

      const insertSql = `INSERT INTO vendors 
         (fullName, email, username, password, phone, businessName, businessType, businessRegNo,
        businessAddress, website, storeName, storeDescription, productCategories, shippingPolicy, returnPolicy, is_verified) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        insertSql,
        [
          fullName,
          email,
          username,
          hashedPassword,
          phone,
          businessName,
          businessType,
          businessRegNo,
          businessAddress,
          website,
          storeName,
          storeDescription,
          productCategories,
          shippingPolicy,
          returnPolicy,
          false,
        ],
        async (err) => {
          if (err) {
            console.error("Error inserting vendor:", err);
            return res.status(500).json({ error: "Database error" });
          }

          await transporter.sendMail({
            from: `"EasyMart" <${process.env.EMAIL}>`,
            to: email,
            subject: "Verify your email",
            html: `<p>Hi ${fullName},</p><p>Welcome to our platform! 🎉</p>
                  <p>Please confirm your email:</p>
                  <a href="${verificationUrl}">Verify Email</a>`,
          });

          res.status(201).json({
            message: "Vendor signup successful. Please verify your email.",
          });
        }
      );
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
