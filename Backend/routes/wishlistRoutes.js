const express = require("express");
const router = express.Router();
const db = require("../config/db");
const validateCustomerToken = require("../middleware/validateCustomerToken");

// ➕ Add to wishlist
router.post("/add", validateCustomerToken, (req, res) => {
  const { product_id } = req.body;
  const customer_id = req.customer.customer_id;

  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  db.query(
    "INSERT IGNORE INTO wishlist (customer_id, product_id) VALUES (?, ?)",
    [customer_id, product_id],
    (err, result) => {
      if (err) {
        console.error("Wishlist insert error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({ message: "Added to wishlist" });
    }
  );
});

// ➖ Remove from wishlist
router.delete("/remove", validateCustomerToken, (req, res) => {
  const { product_id } = req.body;
  const customer_id = req.customer.customer_id;

  db.query(
    "DELETE FROM wishlist WHERE customer_id = ? AND product_id = ?",
    [customer_id, product_id],
    (err, result) => {
      if (err) {
        console.error("Wishlist delete error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({ message: "Removed from wishlist" });
    }
  );
});

// 📃 Get all wishlist items
router.get("/", validateCustomerToken, (req, res) => {
  const customer_id = req.customer.customer_id;

  db.query(
    `SELECT p.* 
     FROM products p
     INNER JOIN wishlist w ON p.id = w.product_id
     WHERE w.customer_id = ?`,
    [customer_id],
    (err, results) => {
      if (err) {
        console.error("Fetch wishlist error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({ wishlist: results });
    }
  );
});

module.exports = router;
