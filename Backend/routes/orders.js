const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your MySQL connection
const authenticateToken = require("../middleware/authenticateToken");

// GET /api/orders - Get orders for logged-in customer
router.get("/", authenticateToken("customer"), (req, res) => {
  const customerId = req.user.id;

  const query = `
    SELECT 
      o.order_id,
      o.quantity,
      o.total_price,
      o.order_date,
      o.order_status,
      i.item_id,
      i.item_name,
      i.item_price,
      i.item_image
    FROM orders o
    JOIN items i ON o.item_id = i.item_id
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
  `;

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ orders: results });
  });
});

router.patch(
  "/cancel/:orderId",
  authenticateToken("customer"), // only authenticated customers can cancel
  (req, res) => {
    const orderId = req.params.orderId;
    const customerId = req.user.id; // user id from JWT

    // Update status only if order belongs to this customer and not already canceled or delivered
    const query = `
        UPDATE orders 
        SET order_status = 'canceled' 
        WHERE order_id = ? AND customer_id = ? AND order_status NOT IN ('canceled', 'delivered')
      `;

    db.query(query, [orderId, customerId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "Cannot cancel this order" });
      }
      res.json({ message: "Order canceled successfully" });
    });
  }
);

module.exports = router;
