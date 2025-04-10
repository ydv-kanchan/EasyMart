const express = require("express");
const router = express.Router();

router.get("/logout", (req, res) => {
  res.clearCookie("customer_token", {
    httpOnly: true,
    secure: false, // should match login setup
    sameSite: "Lax",
    path: "/",
  });
  return res.status(200).json({ message: "Customer logged out successfully" });
});

router.get("/vendorLogout", (req, res) => {
  res.clearCookie("vendor_token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
  });
  return res.status(200).json({ message: "Vendor logged out successfully" });
});

module.exports = router;
