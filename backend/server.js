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
app.use(cors({
  origin: ["https://personal-finance-tracker-sigma-sable.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
// parse JSON bodies and capture raw body for debugging
app.use(
  express.json({
    verify: (req, res, buf) => {
      try {
        req.rawBody = buf.toString();
      } catch (e) {
        req.rawBody = "";
      }
    },
  })
);

// parse urlencoded bodies (for form submissions or non-JSON clients)
app.use(express.urlencoded({ extended: true }));

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
