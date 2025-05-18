const express = require("express");
const router = express.Router();
const db = require("../config/db");
const validateToken = require("../middleware/validateToken");

router.get("/details", validateToken, (req, res) => {
  const vendorId = req.vendor.vendor_id;

  const query = `
    SELECT storeName AS name, storeDescription AS description, store_logo AS logo
    FROM vendors
    WHERE vendor_id = ?
  `;

  db.query(query, [vendorId], (err, results) => {
    if (err) {
      console.error("Error fetching shop details:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(results[0]);
  });
});

module.exports = router;
