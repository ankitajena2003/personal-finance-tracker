const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// UPDATE PROFILE
router.put("/update", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;

  try {
    let query = "UPDATE users SET name = ?, email = ?";
    let params = [name, email];

    if (password && password.length >= 6) {
      const hashed = await bcrypt.hash(password, 10);
      query += ", password = ?";
      params.push(hashed);
    }

    query += " WHERE id = ?";
    params.push(userId);

    db.query(query, params, (err) => {
      if (err) return res.status(500).json({ message: "Update failed" });
      res.json({ message: "Profile updated" });
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
