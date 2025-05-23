const express = require("express");
const router = express.Router();
const db = require("../config/db");
const validateCustomerToken = require("../middleware/validateCustomerToken");


router.post("/add", validateCustomerToken, (req, res) => {
  const { item_id } = req.body; 
  const customer_id = req.customer.customer_id;

  if (!item_id) {
    return res.status(400).json({ message: "Item ID is required" });
  }


  db.query(
    "INSERT IGNORE INTO wishlist (customer_id, item_id) VALUES (?, ?)", 
    [customer_id, item_id],
    (err, result) => {
      if (err) {
        console.error("Wishlist insert error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({ message: "Added to wishlist" });
    }
  );
});


router.delete("/remove/:item_id", validateCustomerToken, (req, res) => {
  const { item_id } = req.params; 
  const customer_id = req.customer.customer_id;

  db.query(
    "DELETE FROM wishlist WHERE customer_id = ? AND item_id = ?",
    [customer_id, item_id],
    (err, result) => {
      if (err) {
        console.error("Wishlist delete error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Item removed from wishlist" });
      } else {
        res.status(404).json({ message: "Item not found in wishlist" });
      }
    }
  );
});

router.get("/all", validateCustomerToken, (req, res) => {
  const customer_id = req.customer.customer_id;

  db.query(
    `SELECT i.* 
     FROM items i
     INNER JOIN wishlist w ON i.item_id = w.item_id  /* item_id as the reference */
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
