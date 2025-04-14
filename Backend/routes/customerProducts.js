const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/category/:categoryName", (req, res) => {
    const { categoryName } = req.params;
  
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
      WHERE LOWER(c.category_name) = LOWER(?)
    `;
  
    db.query(query, [categoryName], (err, rows, fields) => {
      if (err) {
        console.error("Error fetching products by category:", err);
        return res.status(500).json({ message: "Failed to fetch products" });
      }
  
      res.status(200).json(rows); 
    });
  });

module.exports = router;
