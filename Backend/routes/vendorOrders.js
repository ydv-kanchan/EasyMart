const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");

// GET all orders for a vendor
router.get("/orders", authenticateToken("vendor"), (req, res) => {
  const vendorId = req.user.id;

  const query = `
    SELECT o.*, i.item_image 
    FROM orders o
    JOIN items i ON o.item_id = i.item_id
    WHERE i.vendor_id = ?
    ORDER BY o.order_date DESC
  `;

  db.query(query, [vendorId], (err, results) => {
    if (err) {
      console.error("Error fetching vendor orders:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json({ orders: results });
  });
});

// PATCH: Confirm order
router.patch("/orders/confirm/:id", authenticateToken("vendor"), (req, res) => {
  const orderId = req.params.id;
  const vendorId = req.user.id;

  const query = `
    UPDATE orders o
    JOIN items i ON o.item_id = i.item_id
    SET o.order_status = 'confirmed'
    WHERE o.order_id = ? AND i.vendor_id = ? AND o.order_status = 'pending'
  `;

  db.query(query, [orderId, vendorId], (err, result) => {
    if (err) {
      console.error("Error confirming order:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Order not found or already confirmed" });
    }

    res.json({ message: "Order confirmed" });
  });
});

// PATCH: Ship order
router.patch("/orders/ship/:id", authenticateToken("vendor"), (req, res) => {
  const orderId = req.params.id;
  const vendorId = req.user.id;

  // Step 1: Update order status to 'shipped'
  const updateOrderQuery = `
    UPDATE orders o
    JOIN items i ON o.item_id = i.item_id
    SET o.order_status = 'shipped'
    WHERE o.order_id = ? AND i.vendor_id = ? AND o.order_status = 'confirmed'
  `;

  db.query(updateOrderQuery, [orderId, vendorId], (err, result) => {
    if (err) {
      console.error("Error shipping order:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Order not found or not confirmed yet" });
    }

    // Step 2: Fetch the order to get quantity and item_id
    const fetchOrderQuery = `
      SELECT o.item_id, o.quantity
      FROM orders o
      JOIN items i ON o.item_id = i.item_id
      WHERE o.order_id = ? AND i.vendor_id = ?
    `;

    db.query(fetchOrderQuery, [orderId, vendorId], (err2, orderResults) => {
      if (err2 || orderResults.length === 0) {
        console.error("Error fetching order details for stock update:", err2);
        return res.status(500).json({ message: "Error updating stock" });
      }

      const { item_id, quantity } = orderResults[0];

      // Step 3: Subtract quantity from item_stock
      const updateStockQuery = `
        UPDATE items
        SET item_stock = item_stock - ?
        WHERE item_id = ? AND vendor_id = ?
      `;

      db.query(updateStockQuery, [quantity, item_id, vendorId], (err3) => {
        if (err3) {
          console.error("Error updating item stock:", err3);
          return res.status(500).json({ message: "Failed to update stock" });
        }

        res.json({ message: "Order marked as shipped and stock updated" });
      });
    });
  });
});


module.exports = router;
