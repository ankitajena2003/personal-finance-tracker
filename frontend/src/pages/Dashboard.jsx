import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

// 🔹 chart imports
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  // welcome popup state
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  // dashboard data state
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);

  /* =========================
     WELCOME POPUP LOGIC
  ==========================*/
  useEffect(() => {
    const isNewUser = localStorage.getItem("isNewUser");
    const loginType = localStorage.getItem("loginType");

    if (isNewUser) {
      setWelcomeMessage(
        "🎉 Welcome! Let’s manage your finances wisely 💰📊"
      );
      setShowWelcome(true);

      localStorage.removeItem("isNewUser");
      localStorage.removeItem("loginType");
    } else if (loginType === "returning") {
      setWelcomeMessage(
        "👋 Welcome back! Your financial dashboard is ready 🚀💸"
      );
      setShowWelcome(true);

      localStorage.removeItem("loginType");
    }
  }, []);

  // auto close popup
  useEffect(() => {
    if (!showWelcome) return;
    const timer = setTimeout(() => setShowWelcome(false), 3500);
    return () => clearTimeout(timer);
  }, [showWelcome]);

  /* =========================
     DASHBOARD DATA FETCH
  ==========================*/
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const incomeRes = await api.get("/income");
        const expenseRes = await api.get("/expenses");

        setExpenses(expenseRes.data);

        const totalIncome = incomeRes.data.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        );

        const totalExpense = expenseRes.data.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        );

        setIncomeTotal(totalIncome);
        setExpenseTotal(totalExpense);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  const balance = incomeTotal - expenseTotal;

  /* =========================
     CHART DATA
  ==========================*/
  const categoryMap = {};
  expenses.forEach((exp) => {
    categoryMap[exp.category] =
      (categoryMap[exp.category] || 0) + Number(exp.amount);
  });

  const chartData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          "#8b5cf6",
          "#6366f1",
          "#22c55e",
          "#ef4444",
          "#f59e0b",
          "#06b6d4",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Layout>
      {/* 🎉 WELCOME POPUP */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl px-16 py-14 shadow-[0_0_80px_rgba(99,102,241,0.7)] animate-scaleIn text-center">
            <h2 className="text-4xl font-bold mb-4">🎉 Welcome</h2>
            <p className="text-xl opacity-95">{welcomeMessage}</p>
          </div>
        </div>
      )}

      {/* DASHBOARD CONTENT */}
      <h1 className="text-4xl font-bold mb-10">Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 shadow-lg hover:scale-105 transition">
          <h3 className="opacity-80">Total Income</h3>
          <p className="text-3xl font-bold mt-2">₹ {incomeTotal}</p>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl p-8 shadow-lg hover:scale-105 transition">
          <h3 className="opacity-80">Total Expenses</h3>
          <p className="text-3xl font-bold mt-2">₹ {expenseTotal}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-lg hover:scale-105 transition">
          <h3 className="opacity-80">Remaining Balance</h3>
          <p className="text-3xl font-bold mt-2">₹ {balance}</p>
        </div>
      </div>

      {/* 📊 CHART SECTION */}
      {expenses.length > 0 && (
        <div className="mt-14 max-w-xl bg-slate-900 rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">
            Expenses by Category
          </h2>
          <Doughnut data={chartData} />
        </div>
      )}
    </Layout>
  );
}
