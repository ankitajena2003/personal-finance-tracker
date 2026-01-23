import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Budgets() {
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [budgets, setBudgets] = useState([]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // 🔹 Fetch budgets
  const fetchBudgets = async () => {
    try {
      const res = await api.get(
        `/budgets?month=${currentMonth}&year=${currentYear}`
      );
      setBudgets(res.data);
    } catch (err) {
      console.error("Failed to fetch budgets", err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // 🔹 Add budget
  const addBudget = async () => {
    if (!category || !monthlyLimit) return;

    try {
      await api.post("/budgets", {
        category,
        monthly_limit: monthlyLimit,
        month: currentMonth,
        year: currentYear,
      });

      setCategory("");
      setMonthlyLimit("");
      fetchBudgets();
    } catch (err) {
      console.error("Failed to add budget", err);
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-10">Budgets</h1>

      {/* ADD BUDGET */}
      <div className="bg-slate-900 p-6 rounded-2xl mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          placeholder="Category (Food, Rent...)"
          className="input-dark"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Monthly Limit"
          className="input-dark"
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
        />

        <button
          onClick={addBudget}
          className="bg-gradient-to-r from-purple-600 to-indigo-600
                     text-white rounded-xl font-semibold hover:opacity-90"
        >
          Add Budget
        </button>
      </div>

      {/* BUDGET LIST */}
      <div className="space-y-6">
        {budgets.map((b) => (
          <BudgetCard key={b.id} budget={b} />
        ))}
      </div>

      {/* CHART */}
      {budgets.length > 0 && (
        <BudgetChart budgets={budgets} />
      )}
    </Layout>
  );
}

/* =========================
   BUDGET CARD COMPONENT
========================= */
function BudgetCard({ budget }) {
  const spent = Number(budget.spent);
  const limit = Number(budget.monthly_limit);
  const percent = Math.min((spent / limit) * 100, 100);

  let barColor = "bg-green-500";
  if (percent >= 80 && percent < 100) barColor = "bg-yellow-400";
  if (percent >= 100) barColor = "bg-red-500";

  return (
    <div className="bg-slate-900 p-6 rounded-2xl">
      <div className="flex justify-between mb-2">
        <h3 className="text-xl font-semibold">{budget.category}</h3>
        <span className="text-slate-300">
          ₹{spent} / ₹{limit}
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
        <div
          className={`${barColor} h-full transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {percent >= 100 && (
        <p className="text-red-400 text-sm mt-2">
          ⚠ Budget exceeded
        </p>
      )}
    </div>
  );
}

/* =========================
   BUDGET CHART COMPONENT
========================= */
function BudgetChart({ budgets }) {
  const chartData = budgets.map((b) => ({
    category: b.category,
    Budget: Number(b.monthly_limit),
    Spent: Number(b.spent),
  }));

  return (
    <div className="bg-slate-900 p-6 rounded-2xl mt-12">
      <h2 className="text-2xl font-bold mb-6">
        📊 Budget vs Spending
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budget" fill="#7c3aed" />
          <Bar dataKey="Spent" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
