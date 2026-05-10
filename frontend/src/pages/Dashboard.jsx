import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Plus,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          api.get("/income"),
          api.get("/expenses")
        ]);

        const allTrans = [
          ...incomeRes.data.map(i => ({ ...i, type: 'income' })),
          ...expenseRes.data.map(e => ({ ...e, type: 'expense' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setRecentTransactions(allTrans.slice(0, 5));
        setExpenses(expenseRes.data);

        const totalIncome = incomeRes.data.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpense = expenseRes.data.reduce((sum, item) => sum + Number(item.amount), 0);

        setIncomeTotal(totalIncome);
        setExpenseTotal(totalExpense);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  const balance = incomeTotal - expenseTotal;
  const savingsRate = incomeTotal > 0 ? ((balance / incomeTotal) * 100).toFixed(1) : 0;

  const categoryMap = {};
  expenses.forEach((exp) => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + Number(exp.amount);
  });

  const chartData = {
    labels: Object.keys(categoryMap),
    datasets: [{
      data: Object.values(categoryMap),
      backgroundColor: ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981"],
      hoverOffset: 20,
      borderWidth: 0,
    }],
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {getTimeGreeting()}, <span className="text-indigo-500">{userName}</span>
            </h1>
            <p className="text-slate-400">Here's what's happening with your money today.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-white px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition-all font-medium">
              <Clock size={18} className="text-indigo-400" />
              History
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all font-bold">
              <Plus size={20} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={item} className="bg-slate-900 border border-slate-800/50 p-6 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                <Wallet size={24} />
              </div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-1 rounded-full">Total Balance</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">₹ {balance.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <ArrowUpRight size={14} className="text-emerald-500" />
              <span className="text-emerald-500 font-bold">+2.4%</span> since last month
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-slate-900 border border-slate-800/50 p-6 rounded-[2.5rem] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                <TrendingUp size={24} />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded-full">Income</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">₹ {incomeTotal.toLocaleString()}</p>
            <p className="text-xs text-slate-500 font-medium">Total earned this month</p>
          </motion.div>

          <motion.div variants={item} className="bg-slate-900 border border-slate-800/50 p-6 rounded-[2.5rem] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 flex items-center justify-center text-rose-400">
                <TrendingDown size={24} />
              </div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-400/10 px-2 py-1 rounded-full">Expenses</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">₹ {expenseTotal.toLocaleString()}</p>
            <p className="text-xs text-slate-500 font-medium">Total spent this month</p>
          </motion.div>

          <motion.div variants={item} className="bg-slate-900 border border-slate-800/50 p-6 rounded-[2.5rem] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                <Target size={24} />
              </div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-400/10 px-2 py-1 rounded-full">Savings Rate</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{savingsRate}%</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(savingsRate, 100)}%` }} className="bg-purple-500 h-full" />
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CHART SECTION */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Expense Distribution</h2>
              <select className="bg-slate-800 text-slate-300 text-xs border-none rounded-xl px-3 py-1.5 focus:ring-0">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-around gap-8">
              <div className="w-64 h-64">
                <Doughnut data={chartData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
              </div>
              <div className="flex-1 space-y-4 w-full">
                {Object.entries(categoryMap).slice(0, 4).map(([cat, val], idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx] }} />
                      <span className="text-slate-300 font-medium capitalize">{cat}</span>
                    </div>
                    <span className="text-white font-bold">₹ {val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RECENT TRANSACTIONS */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-8 flex flex-col"
          >
            <h2 className="text-xl font-bold text-white mb-6">Recent Activities</h2>
            <div className="space-y-6 flex-1">
              {recentTransactions.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-slate-800/30 p-2 rounded-2xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      tx.type === 'income' ? 'bg-emerald-600/10 text-emerald-500' : 'bg-rose-600/10 text-rose-500'
                    }`}>
                      {tx.type === 'income' ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white capitalize">{tx.description || tx.category}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{tx.type}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${
                    tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'} ₹{Number(tx.amount).toLocaleString()}
                  </p>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <p>No recent activity found.</p>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-3 rounded-2xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-bold text-sm">
              View All Transactions
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
