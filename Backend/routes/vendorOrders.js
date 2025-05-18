const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");

// GET all vendor orders
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

// PATCH to confirm order
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
      return res
        .status(400)
        .json({ message: "Order not found or already confirmed" });
    }
    res.json({ message: "Order confirmed" });
  });
});

// PATCH: Ship order and update stock
router.patch("/orders/ship/:id", authenticateToken("vendor"), (req, res) => {
  const orderId = req.params.id;
  const vendorId = req.user.id;

  // Step 1: Fetch the order to verify and get item_id, quantity
  const fetchOrderQuery = `
    SELECT o.item_id, o.quantity
    FROM orders o
    JOIN items i ON o.item_id = i.item_id
    WHERE o.order_id = ? AND i.vendor_id = ? AND o.order_status = 'confirmed'
  `;

  db.query(fetchOrderQuery, [orderId, vendorId], (err1, results) => {
    if (err1) {
      console.error("Error fetching order:", err1);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ message: "Order not found or not confirmed" });
    }

    const { item_id, quantity } = results[0];

    // Step 2: Update the order status to 'shipped'
    const updateOrderQuery = `
      UPDATE orders
      SET order_status = 'shipped'
      WHERE order_id = ?
    `;

    db.query(updateOrderQuery, [orderId], (err2, result2) => {
      if (err2) {
        console.error("Error updating order status:", err2);
        return res
          .status(500)
          .json({ message: "Failed to update order status" });
      }

      // Step 3: Decrease the item stock
      const updateStockQuery = `
        UPDATE items
        SET item_stock = item_stock - ?
        WHERE item_id = ? AND vendor_id = ?
      `;

      db.query(
        updateStockQuery,
        [quantity, item_id, vendorId],
        (err3, result3) => {
          if (err3) {
            console.error("Error updating stock:", err3);
            return res.status(500).json({ message: "Failed to update stock" });
          }

          res.json({ message: "Order shipped and stock updated" });
        }
      );
    });
  });
});

// PATCH: Deliver order
router.patch("/orders/deliver/:id", authenticateToken("vendor"), (req, res) => {
  const orderId = req.params.id;
  const vendorId = req.user.id;

  const query = `
    UPDATE orders o
    JOIN items i ON o.item_id = i.item_id
    SET o.order_status = 'delivered'
    WHERE o.order_id = ? AND i.vendor_id = ? AND o.order_status = 'shipped'
  `;

  db.query(query, [orderId, vendorId], (err, result) => {
    if (err) {
      console.error("Error delivering order:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "Order not found or not shipped" });
    }
    res.json({ message: "Order marked as delivered" });
  });
});

// PATCH: Cancel order
router.patch("/orders/cancel/:id", authenticateToken("vendor"), (req, res) => {
  const orderId = req.params.id;
  const vendorId = req.user.id;

  const query = `
    UPDATE orders o
    JOIN items i ON o.item_id = i.item_id
    SET o.order_status = 'canceled'
    WHERE o.order_id = ? AND i.vendor_id = ? AND o.order_status NOT IN ('delivered', 'canceled')
  `;

  db.query(query, [orderId, vendorId], (err, result) => {
    if (err) {
      console.error("Error cancelling order:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }
    res.json({ message: "Order canceled" });
  });
});

module.exports = router;
