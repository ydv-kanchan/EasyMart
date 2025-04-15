const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/add", authenticateToken("customer"), (req, res) => {
  const { item_id, quantity } = req.body;
  const customer_id = req.user.id;

  if (!item_id || !quantity) {
    return res
      .status(400)
      .json({ message: "Item ID and quantity are required" });
  }

  db.query(
    "SELECT item_stock FROM items WHERE item_id = ?",
    [item_id],
    (err, stockResult) => {
      if (err) return res.status(500).json({ message: "Error checking stock" });
      if (stockResult.length === 0)
        return res.status(404).json({ message: "Item not found" });

      const availableStock = stockResult[0].item_stock;

      db.query(
        "SELECT quantity FROM cart WHERE customer_id = ? AND item_id = ?",
        [customer_id, item_id],
        (err, existingCart) => {
          if (err) return res.status(500).json({ message: "Database error" });

          const existingQuantity =
            existingCart.length > 0 ? existingCart[0].quantity : 0;
          const totalRequested = existingQuantity + quantity;

          if (totalRequested > availableStock) {
            return res.status(400).json({ message: "Quantity exceeds stock" });
          }

          db.query(
            "INSERT INTO cart (customer_id, item_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
            [customer_id, item_id, quantity, quantity],
            (err) => {
              if (err)
                return res
                  .status(500)
                  .json({ message: "Error adding to cart" });
              return res.status(200).json({ message: "Item added to cart" });
            }
          );
        }
      );
    }
  );
});

router.get("/all", authenticateToken("customer"), (req, res) => {
  const customer_id = req.user.id;

  const query = `
    SELECT c.item_id, c.quantity, i.item_name, i.item_price, i.item_image
    FROM cart c
    JOIN items i ON c.item_id = i.item_id
    WHERE c.customer_id = ?
  `;

  db.query(query, [customer_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching cart" });

    const totalPrice = results.reduce((sum, item) => {
      return sum + item.item_price * item.quantity;
    }, 0);

    res.status(200).json({ cart: results, totalPrice });
  });
});

router.put("/update", authenticateToken("customer"), (req, res) => {
  const { item_id, type } = req.body;
  const customer_id = req.user.id;

  if (!item_id || !["increment", "decrement"].includes(type)) {
    return res.status(400).json({ message: "Invalid item ID or type" });
  }

  const updateQuery =
    type === "increment"
      ? "UPDATE cart SET quantity = quantity + 1 WHERE customer_id = ? AND item_id = ?"
      : "UPDATE cart SET quantity = quantity - 1 WHERE customer_id = ? AND item_id = ?";

  if (type === "increment") {
    db.query(
      "SELECT c.quantity, i.item_stock FROM cart c JOIN items i ON c.item_id = i.item_id WHERE c.customer_id = ? AND c.item_id = ?",
      [customer_id, item_id],
      (err, results) => {
        if (err)
          return res.status(500).json({ message: "Error checking stock" });
        if (results.length === 0)
          return res.status(404).json({ message: "Item not in cart" });

        const currentQty = results[0].quantity;
        const stockQty = results[0].item_stock;

        if (currentQty + 1 > stockQty) {
          return res.status(400).json({ message: "Cannot exceed stock" });
        }

        db.query(updateQuery, [customer_id, item_id], (err) => {
          if (err)
            return res.status(500).json({ message: "Error updating cart" });
          return res.status(200).json({ message: "Cart updated" });
        });
      }
    );
  } else {
    db.query(updateQuery, [customer_id, item_id], (err) => {
      if (err) return res.status(500).json({ message: "Error updating cart" });

      db.query(
        "DELETE FROM cart WHERE customer_id = ? AND item_id = ? AND quantity <= 0",
        [customer_id, item_id],
        () => {
          return res.status(200).json({ message: "Cart updated" });
        }
      );
    });
  }
});


router.delete("/remove/:item_id", authenticateToken("customer"), (req, res) => {
  const { item_id } = req.params;
  const customer_id = req.user.id;

  db.query(
    "DELETE FROM cart WHERE customer_id = ? AND item_id = ?",
    [customer_id, item_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error removing item" });

      return res.status(200).json({ message: "Item removed from cart" });
    }
  );
});

module.exports = router;
