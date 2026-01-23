const db = require("./config/db");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Root Test ----------
app.get("/", (req, res) => {
  res.send("Personal Finance Tracker Backend Running 🚀");
});

// ---------- API Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/user", require("./routes/userRoutes"));


// ---------- Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
