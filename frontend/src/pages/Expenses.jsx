import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import { 
  Plus, 
  Search, 
  Trash2, 
  Filter, 
  ArrowDownLeft,
  Calendar,
  Tag,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Expenses() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/expenses", { amount, category, date, description });
      setAmount("");
      setCategory("");
      setDate("");
      setDescription("");
      fetchExpenses();
    } catch (err) {
      console.error("Error adding expense", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense", err);
    }
  };

  const filteredExpenses = expenses.filter(exp => 
    exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp.description && exp.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <div className="p-2 bg-rose-600/20 text-rose-500 rounded-xl">
                <ArrowDownLeft size={28} />
              </div>
              Expenses
            </h1>
            <p className="text-slate-400">Track and manage your daily spending.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-full md:w-80">
            <Search className="ml-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              className="bg-transparent border-none focus:ring-0 text-sm text-white w-full placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ADD EXPENSE FORM */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-8 sticky top-10">
              <h2 className="text-xl font-bold text-white mb-6">Add New Expense</h2>
              <form onSubmit={addExpense} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-white outline-none"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      placeholder="Food, Travel, Rent..."
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-white outline-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="date"
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-white outline-none"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    placeholder="What was this for?"
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-white outline-none resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={20} /> Add Expense</>}
                </button>
              </form>
            </div>
          </div>

          {/* EXPENSE LIST */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-xl font-bold text-white">History</h2>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Filter size={16} />
                Recent First
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {filteredExpenses.map((exp) => (
                  <motion.div
                    key={exp._id || exp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-slate-800/50 p-5 rounded-[2rem] flex items-center justify-between group hover:bg-slate-800/20 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-rose-600/10 text-rose-500 flex items-center justify-center font-bold">
                        {exp.category.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-lg capitalize">{exp.category}</p>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            {new Date(exp.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{exp.description || "No description provided"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <p className="text-xl font-black text-white">₹{Number(exp.amount).toLocaleString()}</p>
                      <button
                        onClick={() => deleteExpense(exp._id || exp.id)}
                        className="p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredExpenses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-[2.5rem] text-slate-600">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} />
                  </div>
                  <p className="font-medium">No expenses found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
