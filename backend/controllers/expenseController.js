const db = require("../config/db");

// ADD EXPENSE
const addExpense = (req, res) => {
  const { category, amount, description, date } = req.body;
  const userId = req.user.id;

  if (!category || !amount || !date) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const query =
    "INSERT INTO expenses (user_id, category, amount, description, date) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [userId, category, amount, description || "", date],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error adding expense" });
      }
      res.status(201).json({ message: "Expense added successfully" });
    }
  );
};

// GET EXPENSES (FINAL GUARANTEED FIX)
const getExpenses = (req, res) => {
  const userId = req.user.id;

  const query =
    "SELECT id, user_id, category, amount, description, date FROM expenses WHERE user_id = ? ORDER BY date DESC";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching expenses" });
    }

    // 🔥 FINAL GUARANTEED DATE FIX
    const formattedResults = results.map((item) => ({
      ...item,
      date: item.date
        ? new Date(item.date).toISOString().split("T")[0]
        : null,
    }));

    res.json(formattedResults);
  });
};





// DELETE EXPENSE
const deleteExpense = (req, res) => {
  const expenseId = req.params.id;
  const userId = req.user.id;

  const query =
    "DELETE FROM expenses WHERE id = ? AND user_id = ?";

  db.query(query, [expenseId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting expense" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  });
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
};