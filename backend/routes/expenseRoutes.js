const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");

// Add new expense
router.post("/", authMiddleware, expenseController.addExpense);

// Get all expenses for logged-in user
router.get("/", authMiddleware, expenseController.getExpenses);
router.delete("/:id", authMiddleware, expenseController.deleteExpense);


module.exports = router;
