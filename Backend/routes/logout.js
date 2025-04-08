const express = require("express");
const router = express.Router();

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // match exactly like login
    sameSite: "Lax",
    path: "/", // add path if you didn't change it
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
