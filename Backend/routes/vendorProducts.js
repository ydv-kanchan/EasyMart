const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const validateToken = require("../middleware/validateToken");

// Ensure upload folder exists
const dir = "./uploads/products";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


router.get("/categories", validateToken, (req, res) => {
  const vendorId = req.vendor.vendor_id;
  console.log("vendor id in categories route" , req.vendor.vendor_id);

  const sql = `
    SELECT c.category_id, c.category_name 
    FROM vendor_categories vc
    JOIN categories c ON vc.category_id = c.category_id
    WHERE vc.vendor_id = ?
  `;

  db.query(sql, [vendorId], (err, results) => {
    if (err) {
      console.error("Error fetching vendor categories:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json({ categories: results });
  });
});


// ✅ Get item types for a category (public)
router.get("/item-types/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;

  const sql = `
    SELECT item_type_id, item_type_name
    FROM item_types
    WHERE category_id = ?
  `;

  db.query(sql, [categoryId], (err, results) => {
    if (err) {
      console.error("Error fetching item types:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json({ itemTypes: results });
  });
});


// ✅ Add new product (token-based)
router.post("/add-product", validateToken, upload.single("image"), (req, res) => {
  const {
    name,
    description,
    price,
    quantity,
    category,
    item_type,
  } = req.body;

  const vendorId = req.vendor.vendor_id;
  const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

  const accessQuery = `
    SELECT 1 FROM vendor_categories
    WHERE vendor_id = ? AND category_id = ?
  `;

  db.query(accessQuery, [vendorId, category], (err, accessResult) => {
    if (err) {
      console.error("Access check failed:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (accessResult.length === 0) {
      return res.status(403).json({
        message: "You are not authorized to add products in this category.",
      });
    }

    const insertQuery = `
      INSERT INTO items
      (item_name, item_desc, item_price, item_stock, item_image, vendor_id, category_id, item_type_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [
        name,
        description,
        price,
        quantity,
        imagePath,
        vendorId,
        category,
        item_type,
      ],
      (insertErr) => {
        if (insertErr) {
          console.error("Error inserting product:", insertErr);
          return res
            .status(500)
            .json({ message: "Failed to add product", error: insertErr });
        }

        res.status(201).json({ message: "Product added successfully" });
      }
    );
  });
});

router.get("/my-products", validateToken, (req, res) => {
  const vendorId = req.vendor.vendor_id;

  const sql = `
    SELECT i.item_id, i.item_name, i.item_desc, i.item_price, i.item_image, 
           c.category_name, t.item_type_name
    FROM items i
    JOIN categories c ON i.category_id = c.category_id
    JOIN item_types t ON i.item_type_id = t.item_type_id
    WHERE i.vendor_id = ?
  `;

  db.query(sql, [vendorId], (err, results) => {
    if (err) {
      console.error("Error fetching vendor products:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ products: results });
  });
});

module.exports = router;
