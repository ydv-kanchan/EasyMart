const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const User = require("../config/db"); 

const router = express.Router();

router.get("/home", authenticateToken, async (req, res) => {

  try {
    const user = await User.findById(req.user.id);
    console.log("✅ User Found:", user);

    if (!user) {
      console.log("🚨 User not found in database!");
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Welcome to the protected home route!", user });
  } catch (error) {
    console.error("🔥 Database Query Error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

module.exports = router;
