const express = require("express");
const router = express.Router();
const db = require("../config/db");
const validateCustomerToken = require("../middleware/validateCustomerToken");

router.get("/category/:categoryName",validateCustomerToken,(req, res) => {
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

  router.get("/item/:id", (req, res) => {
    const { id } = req.params;
  
    const query = `
      SELECT 
        i.item_id, 
        i.item_name, 
        i.item_desc AS item_description,
        i.item_price, 
        i.item_image, 
        i.item_stock, 
        c.category_name AS item_category,
        t.item_type_name
      FROM items i
      JOIN categories c ON i.category_id = c.category_id
      JOIN item_types t ON i.item_type_id = t.item_type_id
      WHERE i.item_id = ?
    `;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error fetching product by ID:", err);
        return res.status(500).json({ message: "Failed to fetch product" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json(results[0]); 
    });
  });


  router.get("/top-picks", (req, res) => {
    const query = `
      SELECT 
        items.item_id,
        items.item_name AS name,
        items.item_desc AS sub,
        items.item_image AS img,
        items.item_price AS price,
        item_types.item_type_name,
        categories.category_name
      FROM items
      JOIN categories ON items.category_id = categories.category_id
      JOIN item_types ON items.item_type_id = item_types.item_type_id
      ORDER BY RAND() LIMIT 12
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching top picks:", err);
        return res.status(500).json({ message: "Failed to fetch top picks" });
      }
  
      const groups = [
        { title: 'Editor’s Picks', items: results.slice(0, 4) },
        { title: 'You’ll Love These', items: results.slice(4, 8) },
        { title: 'Discover More', items: results.slice(8, 12) },
      ];
  
      res.status(200).json(groups);
    });
  });
  
module.exports = router;
