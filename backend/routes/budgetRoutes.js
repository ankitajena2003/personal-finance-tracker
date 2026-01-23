const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * =========================
 * ADD BUDGET
 * =========================
 * POST /api/budgets
 */
router.post("/", authMiddleware, (req, res) => {
  const { category, monthly_limit, month, year } = req.body;
  const userId = req.user.id;

  if (!category || !monthly_limit || !month || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO budgets (user_id, category, monthly_limit, month, year)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [userId, category, monthly_limit, month, year],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add budget" });
      }
      res.json({ message: "Budget added successfully" });
    }
  );
});

/**
 * =========================
 * GET BUDGETS (WITH SPENT)
 * =========================
 * GET /api/budgets?month=1&year=2026
 */
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { month, year } = req.query;

  if (!month || !year) {
    return res
      .status(400)
      .json({ message: "Month and year are required" });
  }

  const sql = `
    SELECT 
      b.id,
      b.category,
      b.monthly_limit,
      b.month,
      b.year,
      IFNULL(SUM(e.amount), 0) AS spent
    FROM budgets b
    LEFT JOIN expenses e
      ON b.category = e.category
      AND b.user_id = e.user_id
      AND MONTH(e.date) = b.month
      AND YEAR(e.date) = b.year
    WHERE b.user_id = ?
      AND b.month = ?
      AND b.year = ?
    GROUP BY b.id
  `;

  db.query(sql, [userId, month, year], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch budgets" });
    }
    res.json(results);
  });
});

/**
 * =========================
 * DELETE BUDGET
 * =========================
 * DELETE /api/budgets/:id
 */
router.delete("/:id", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const budgetId = req.params.id;

  const sql = `
    DELETE FROM budgets
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [budgetId, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete budget" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });
  });
});

module.exports = router;
