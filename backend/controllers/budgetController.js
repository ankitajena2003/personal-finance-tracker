const db = require("../config/db");

// SET / UPDATE BUDGET
const setBudget = (req, res) => {
  const { category, monthly_limit } = req.body;
  const userId = req.user.id;

  if (!category || !monthly_limit) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const checkQuery =
    "SELECT * FROM budgets WHERE user_id = ? AND category = ?";

  db.query(checkQuery, [userId, category], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      const updateQuery =
        "UPDATE budgets SET monthly_limit = ? WHERE user_id = ? AND category = ?";

      db.query(updateQuery, [monthly_limit, userId, category], (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error updating budget" });
        }
        res.json({ message: "Budget updated successfully" });
      });
    } else {
      const insertQuery =
        "INSERT INTO budgets (user_id, category, monthly_limit) VALUES (?, ?, ?)";

      db.query(insertQuery, [userId, category, monthly_limit], (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error setting budget" });
        }
        res.status(201).json({ message: "Budget set successfully" });
      });
    }
  });
};

// GET BUDGET TRACKING
const getBudgets = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      b.id,
      b.category,
      b.monthly_limit,
      IFNULL(SUM(e.amount), 0) AS spent,
      (b.monthly_limit - IFNULL(SUM(e.amount), 0)) AS remaining,
      ROUND((IFNULL(SUM(e.amount), 0) / b.monthly_limit) * 100, 2) AS percentage
    FROM budgets b
    LEFT JOIN expenses e 
      ON b.category = e.category 
      AND e.user_id = b.user_id
    WHERE b.user_id = ?
    GROUP BY b.id
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching budgets" });
    }

    res.json(results);
  });
};

module.exports = {
  setBudget,
  getBudgets,
};
