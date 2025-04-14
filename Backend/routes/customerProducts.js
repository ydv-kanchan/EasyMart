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


  router.post("/wishlist/add", validateCustomerToken, (req, res) => {
    const { user_id, item_id } = req.body;
  
    // Ensure user_id and item_id are provided
    if (!user_id || !item_id) {
      return res.status(400).json({ message: "User ID and Item ID are required" });
    }
  
    // Check if the item is already in the user's wishlist
    const checkQuery = `
      SELECT * FROM wishlists WHERE user_id = ? AND item_id = ?
    `;
    db.query(checkQuery, [user_id, item_id], (err, results) => {
      if (err) {
        console.error("Error checking wishlist:", err);
        return res.status(500).json({ message: "Error checking wishlist" });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: "Item is already in your wishlist" });
      }
  
      // Insert the new item into the wishlist
      const insertQuery = `
        INSERT INTO wishlists (user_id, item_id) 
        VALUES (?, ?)
      `;
      db.query(insertQuery, [user_id, item_id], (err, results) => {
        if (err) {
          console.error("Error adding item to wishlist:", err);
          return res.status(500).json({ message: "Error adding item to wishlist" });
        }
  
        res.status(200).json({ message: "Item added to wishlist" });
      });
    });
  });
  

module.exports = router;
