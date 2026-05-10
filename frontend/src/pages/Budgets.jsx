import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { 
  Plus, 
  Target, 
  AlertCircle, 
  CheckCircle,
  Tag,
  IndianRupee,
  TrendingUp,
  PieChart as PieIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";

export default function Budgets() {
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchBudgets = async () => {
    try {
      const res = await api.get(`/budgets?month=${currentMonth}&year=${currentYear}`);
      setBudgets(res.data);
    } catch (err) {
      console.error("Failed to fetch budgets", err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const addBudget = async (e) => {
    e.preventDefault();
    if (!category || !monthlyLimit) return;
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <div className="p-2 bg-indigo-600/20 text-indigo-500 rounded-xl">
                <Target size={28} />
              </div>
              Budgets
            </h1>
            <p className="text-slate-400">Set monthly limits to keep your spending in check.</p>
          </div>
          
          <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-slate-400 text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            {new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date())}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ADD BUDGET FORM */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-8 sticky top-10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus size={20} className="text-indigo-500" />
                New Budget
              </h2>
              <form onSubmit={addBudget} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. Groceries, Rent..."
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white outline-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Monthly Limit (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="number"
                      placeholder="5000"
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white outline-none"
                      value={monthlyLimit}
                      onChange={(e) => setMonthlyLimit(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Set Budget"}
                </button>
              </form>
            </div>
          </div>

          {/* BUDGETS LIST & CHART */}
          <div className="lg:col-span-2 space-y-10">
            {/* CHART */}
            {budgets.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-8"
              >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-indigo-500" />
                  Budget Analysis
                </h2>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgets}>
                      <XAxis dataKey="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="monthly_limit" radius={[4, 4, 0, 0]} fill="#1e293b" />
                      <Bar dataKey="spent" radius={[4, 4, 0, 0]}>
                        {budgets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Number(entry.spent) > Number(entry.monthly_limit) ? '#f43f5e' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white px-4">Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {budgets.map((b) => (
                    <motion.div
                      key={b._id || b.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900 border border-slate-800/50 p-6 rounded-[2rem] group hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${Number(b.spent) > Number(b.monthly_limit) ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            <PieIcon size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-white capitalize">{b.category}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Monthly</p>
                          </div>
                        </div>
                        {Number(b.spent) > Number(b.monthly_limit) ? (
                          <AlertCircle className="text-rose-500" size={20} />
                        ) : (
                          <CheckCircle className="text-emerald-500" size={20} />
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Spent: ₹{b.spent}</span>
                          <span className="text-white font-bold">Limit: ₹{b.monthly_limit}</span>
                        </div>
                        
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((Number(b.spent) / Number(b.monthly_limit)) * 100, 100)}%` }}
                            className={`h-full ${Number(b.spent) > Number(b.monthly_limit) ? 'bg-rose-500' : 'bg-indigo-500'}`}
                          />
                        </div>

                        <div className="flex justify-between items-center pt-2">
                           <p className="text-[10px] font-bold uppercase text-slate-500">
                             {Number(b.spent) > Number(b.monthly_limit) ? 'Over Budget' : 'Safe'}
                           </p>
                           <p className="text-xs text-slate-400 font-medium">
                             {Math.max(0, b.monthly_limit - b.spent).toLocaleString()} left
                           </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {budgets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-[2.5rem] text-slate-600">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Target size={32} />
                  </div>
                  <p className="font-medium">No budgets set yet. Start planning today!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
