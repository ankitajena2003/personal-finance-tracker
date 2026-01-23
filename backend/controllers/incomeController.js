const db = require("../config/db");

// ADD INCOME
const addIncome = (req, res) => {
  const { source, amount, frequency, date } = req.body;
  const userId = req.user.id;

  if (!source || !amount || !date) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const query =
    "INSERT INTO income (user_id, source, amount, frequency, date) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [userId, source, amount, frequency || "monthly", date],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error adding income" });
      }

      res.status(201).json({ message: "Income added successfully" });
    }
  );
};

// GET INCOME
const getIncome = (req, res) => {
  const userId = req.user.id;

  const query =
    "SELECT id, user_id, source, amount, frequency, date FROM income WHERE user_id = ? ORDER BY date DESC";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching income" });
    }

    const formattedResults = results.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    }));

    res.json(formattedResults);
  });
};

// DELETE INCOME
const deleteIncome = (req, res) => {
  const incomeId = req.params.id;
  const userId = req.user.id;

  const query =
    "DELETE FROM income WHERE id = ? AND user_id = ?";

  db.query(query, [incomeId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting income" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });
  });
};

module.exports = {
  addIncome,
  getIncome,
  deleteIncome,
};
