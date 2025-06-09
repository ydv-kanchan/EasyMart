const express = require("express");
const router = express.Router();
const db = require("../config/db");
const validateCustomerToken = require("../middleware/validateCustomerToken");
const authenticateToken = require("../middleware/authenticateToken");


function buildPriceConditions(priceRange) {
  const ranges = priceRange.split(",");
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
  return priceConditions.length > 0
    ? ` AND (${priceConditions.join(" OR ")})`
    : "";
}

// Route: Get products by category with filtering & sorting
router.get("/category/:categoryName", validateCustomerToken, (req, res) => {
  const { categoryName } = req.params;
  const { priceRange, sortOrder } = req.query;

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

  if (priceRange) {
    query += buildPriceConditions(priceRange);
  }

  if (sortOrder === "lowToHigh") {
    query += " ORDER BY i.item_price ASC";
  } else if (sortOrder === "highToLow") {
    query += " ORDER BY i.item_price DESC";
  } else {
    query += " ORDER BY i.item_id DESC";
  }

  db.query(query, queryParams, (err, rows) => {
    if (err) {
      console.error("Error fetching products by category:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
    res.status(200).json(rows);
  });
});

// Route: Get product details by ID
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

// Route: Top picks (random 12 items in groups)
router.get("/top-picks", (req, res) => {
  const query = `
      SELECT 
    items.item_id,
    items.item_name AS name,
    items.item_desc AS sub,
    items.item_image AS img,
    items.item_price AS price,
    item_types.item_type_name,
    categories.category_name,
    COUNT(orders.item_id) AS times_ordered
  FROM items
  JOIN categories ON items.category_id = categories.category_id
  JOIN item_types ON items.item_type_id = item_types.item_type_id
  LEFT JOIN orders ON items.item_id = orders.item_id
  GROUP BY items.item_id
  ORDER BY times_ordered DESC
  LIMIT 12;
    `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching top picks:", err);
      return res.status(500).json({ message: "Failed to fetch top picks" });
    }

    const groups = [
      { title: "Editor’s Picks", items: results.slice(0, 4) },
      { title: "You’ll Love These", items: results.slice(4, 8) },
      { title: "Discover More", items: results.slice(8, 12) },
    ];

    res.status(200).json(groups);
  });
});

router.get("/search/:searchTerm", validateCustomerToken, (req, res) => {
  const { searchTerm } = req.params;
  const { priceRange, sortOrder } = req.query;
  const searchValue = `%${searchTerm.toLowerCase()}%`;

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
    WHERE (LOWER(i.item_name) LIKE ? OR LOWER(c.category_name) LIKE ?)
  `;

  let queryParams = [searchValue, searchValue];

  if (priceRange) {
    query += buildPriceConditions(priceRange);
  }

  if (sortOrder === "lowToHigh") {
    query += " ORDER BY i.item_price ASC";
  } else if (sortOrder === "highToLow") {
    query += " ORDER BY i.item_price DESC";
  } else {
    query += " ORDER BY i.item_id DESC";
  }

  db.query(query, queryParams, (err, rows) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).json({ message: "Search failed" });
    }
    res.status(200).json(rows);
  });
});

router.get("/category/:categoryName", validateCustomerToken, (req, res) => {
  const { categoryName } = req.params;
  const { priceRange, sortOrder } = req.query;


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

  if (priceRange) {
    const ranges = priceRange.split(",");
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
      query += ` AND (${priceConditions.join(" OR ")})`;
    }
  }

  if (sortOrder === "lowToHigh") {
    query += " ORDER BY i.item_price ASC";
  } else if (sortOrder === "highToLow") {
    query += " ORDER BY i.item_price DESC";
  } else {
    query += " ORDER BY i.item_id DESC";
  }

  db.query(query, queryParams, (err, rows) => {
    if (err) {
      console.error("Error fetching products by category:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
    res.status(200).json(rows);
  });
});

module.exports = router;
