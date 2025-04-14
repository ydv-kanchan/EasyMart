const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/category/:categoryName", (req, res) => {
  const { categoryName } = req.params;

  // SQL query to fetch products with category name matching both singular and plural forms
  const query = `
    SELECT 
      i.item_id, 
      i.item_name, 
      i.item_desc, 
      i.item_price, 
      i.item_image, 
      i.item_stock, 
      c.category_name, 
      t.item_type_name
    FROM items i
    JOIN categories c ON i.category_id = c.category_id
    JOIN item_types t ON i.item_type_id = t.item_type_id
    WHERE LOWER(c.category_name) LIKE LOWER(?) OR LOWER(c.category_name) LIKE LOWER(?)
  `;

  // Execute the query with both singular and plural category names
  db.query(query, [categoryName, categoryName + "s"], (err, rows, fields) => {
    if (err) {
      console.error("Error fetching products by category:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    // Respond with the result
    res.status(200).json(rows);
  });
});

module.exports = router;
