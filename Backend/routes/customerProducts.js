const express = require("express");
const router = express.Router();
const db = require("../config/db");
const validateCustomerToken = require("../middleware/validateCustomerToken");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/category/:categoryName", validateCustomerToken, (req, res) => {
  const { categoryName } = req.params;
  const { priceRange, sortOrder } = req.query; // Get filters from query parameters

  // Start building the query
  let query = `
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

  let queryParams = [categoryName];

  // Apply price range filter if provided
  if (priceRange) {
    const ranges = priceRange.split(","); // Expect priceRange to be a comma-separated string
    let priceConditions = [];

    if (ranges.includes("₹0 - ₹500")) {
      priceConditions.push("i.item_price BETWEEN 0 AND 500");
    }
    if (ranges.includes("₹500 - ₹1000")) {
      priceConditions.push("i.item_price BETWEEN 500 AND 1000");
    }
    if (ranges.includes("Above ₹1000")) {
      priceConditions.push("i.item_price > 1000");
    }

    if (priceConditions.length > 0) {
      query += ` AND (${priceConditions.join(" OR ")})`; // Use OR for multiple price ranges
    }
  }

  // Apply sorting if provided
  if (sortOrder === "lowToHigh") {
    query += " ORDER BY i.item_price ASC";
  } else if (sortOrder === "highToLow") {
    query += " ORDER BY i.item_price DESC";
  } else {
    query += " ORDER BY i.item_id DESC"; // Default sorting (e.g., by ID)
  }

  // Run the query
  db.query(query, queryParams, (err, rows) => {
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
    WHERE i.item_id = ?`;

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



router.get("/search/:searchTerm", validateCustomerToken, (req, res) => {
  const { searchTerm } = req.params;
  const searchValue = `%${searchTerm.toLowerCase()}%`;

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
    WHERE LOWER(i.item_name) LIKE ? OR LOWER(c.category_name) LIKE ?
  `;

  db.query(query, [searchValue, searchValue], (err, rows) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).json({ message: "Search failed" });
    }
    res.status(200).json(rows);
  });
});

router.get("/category/:categoryName", validateCustomerToken, (req, res) => {
  const { categoryName } = req.params;
  const { priceRange, sortOrder } = req.query; // Get filters from query parameters

  // Start building the query
  let query = `
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

  let queryParams = [categoryName];

  // Apply price range filter if provided
  if (priceRange) {
    const ranges = priceRange.split(","); // Expect priceRange to be a comma-separated string
    let priceConditions = [];

    if (ranges.includes("₹0 - ₹500")) {
      priceConditions.push("i.item_price BETWEEN 0 AND 500");
    }
    if (ranges.includes("₹500 - ₹1000")) {
      priceConditions.push("i.item_price BETWEEN 500 AND 1000");
    }
    if (ranges.includes("Above ₹1000")) {
      priceConditions.push("i.item_price > 1000");
    }

    if (priceConditions.length > 0) {
      query += ` AND (${priceConditions.join(" OR ")})`; // Use OR for multiple price ranges
    }
  }

  // Apply sorting if provided
  if (sortOrder === "lowToHigh") {
    query += " ORDER BY i.item_price ASC";
  } else if (sortOrder === "highToLow") {
    query += " ORDER BY i.item_price DESC";
  } else {
    query += " ORDER BY i.item_id DESC"; // Default sorting (e.g., by ID)
  }

  // Run the query
  db.query(query, queryParams, (err, rows) => {
    if (err) {
      console.error("Error fetching products by category:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
    res.status(200).json(rows);
  });
});

router.post("/buy", validateCustomerToken, (req, res) => {
  console.log("Buy route hit");

  const { name, address, paymentMethod, items } = req.body;

  if (!name || !address || !paymentMethod || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing required order data" });
  }

  const total_amount = items.reduce(
    (sum, item) => sum + item.quantity * item.price_per_item,
    0
  );

  // Assuming you have customer id from token middleware, e.g.:
  const customerId = req.customerId; // or req.user.id depending on your middleware

  const orderQuery = `INSERT INTO orders (customer_name, address, payment_method, total_amount) VALUES (?, ?, ?, ?)`;
  db.query(orderQuery, [name, address, paymentMethod, total_amount], (err, orderResult) => {
    if (err) {
      console.error("Error inserting order:", err);
      return res.status(500).json({ error: "Failed to place order" });
    }

    const orderId = orderResult.insertId;

    const orderItemsData = items.map(item => [
      orderId,
      item.item_id,
      item.quantity,
      item.price_per_item
    ]);

    const orderItemsQuery = `INSERT INTO order_items (order_id, item_id, quantity, price_per_item) VALUES ?`;
    db.query(orderItemsQuery, [orderItemsData], (err2) => {
      if (err2) {
        console.error("Error inserting order items:", err2);
        return res.status(500).json({ error: "Failed to place order items" });
      }

      // NOW delete items from the customer's cart
      const deleteCartQuery = `DELETE FROM cart WHERE customer_id = ?`;
      db.query(deleteCartQuery, [customerId], (err3) => {
        if (err3) {
          console.error("Error clearing cart after order:", err3);
          // Optionally: respond with success anyway or fail here
          return res.status(500).json({ error: "Failed to clear cart after order" });
        }

        // Success response after everything
        res.status(201).json({ message: "Order placed successfully", order_id: orderId });
      });
    });
  });
});

module.exports = router;
