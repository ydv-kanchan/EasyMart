const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/analytics", authenticateToken("vendor"), async (req, res) => {
  const vendorId = req.user.id;

  try {
    const ordersByCategoryQuery = `
      SELECT 
        c.category_name,
        COUNT(o.order_id) AS order_count
      FROM 
        orders o
      JOIN 
        items i ON o.item_id = i.item_id
      JOIN 
        categories c ON i.category_id = c.category_id
      WHERE 
        i.vendor_id = ?
        AND o.order_status = 'delivered'
      GROUP BY 
        c.category_id, c.category_name;
    `;

    const salesTrendQuery = `
      SELECT 
        DATE(o.order_date) AS date,
        SUM(o.total_amount) AS total_sales
      FROM 
        orders o
      JOIN 
        items i ON o.item_id = i.item_id
      WHERE 
        i.vendor_id = ?
        AND o.order_status = 'delivered'
        AND o.order_date >= CURDATE() - INTERVAL 7 DAY
      GROUP BY 
        DATE(o.order_date)
      ORDER BY 
        DATE(o.order_date) ASC;
    `;

    const [ordersByCategory] = await db
      .promise()
      .query(ordersByCategoryQuery, [vendorId]);
    const [salesTrend] = await db.promise().query(salesTrendQuery, [vendorId]);

    res.json({
      ordersByCategoryData: ordersByCategory,
      salesTrendData: salesTrend,
    });
  } catch (error) {
    console.error("Error fetching vendor analytics:", error);
    res.status(500).json({ message: "Server error fetching analytics" });
  }
});

module.exports = router;
