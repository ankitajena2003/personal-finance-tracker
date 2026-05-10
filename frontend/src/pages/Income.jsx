import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import { 
  Plus, 
  Search, 
  Trash2, 
  Filter, 
  ArrowUpRight,
  Calendar,
  Briefcase,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Income() {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [incomes, setIncomes] = useState([]);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isLoading, setIsLoading] = useState(false);

  const fetchIncome = async () => {
    try {
      const res = await api.get("/income");
      setIncomes(res.data);
    } catch (err) {
      console.error("Error fetching income", err);
    }
  };

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchIncome();
  }, []);

  const addIncome = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/income", { amount, source, date, description });
      setAmount("");
      setSource("");
      setDate("");
      setDescription("");
      fetchIncome();
    } catch (err) {
      console.error("Error adding income", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await api.delete(`/income/${id}`);
      fetchIncome();
    } catch (err) {
      console.error("Error deleting income", err);
    }
  };

  const filteredIncomes = incomes.filter(inc => 
    inc.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inc.description && inc.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <div className="p-2 bg-emerald-600/20 text-emerald-500 rounded-xl">
                <ArrowUpRight size={28} />
              </div>
              Income
            </h1>
            <p className="text-slate-400">Manage your earnings and revenue sources.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-full md:w-80">
            <Search className="ml-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search income..." 
              className="bg-transparent border-none focus:ring-0 text-sm text-white w-full placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ADD INCOME FORM */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-8 sticky top-10">
              <h2 className="text-xl font-bold text-white mb-6">Add New Income</h2>
              <form onSubmit={addIncome} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-white outline-none"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Source</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      placeholder="Salary, Freelance, Gift..."
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-white outline-none"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
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
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-white outline-none"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    placeholder="Notes about this income..."
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-white outline-none resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={20} /> Add Income</>}
                </button>
              </form>
            </div>
          </div>

          {/* INCOME LIST */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-xl font-bold text-white">Earnings History</h2>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Filter size={16} />
                Recent First
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {filteredIncomes.map((inc) => (
                  <motion.div
                    key={inc._id || inc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-slate-800/50 p-5 rounded-[2rem] flex items-center justify-between group hover:bg-slate-800/20 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center font-bold">
                        {inc.source.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-lg capitalize">{inc.source}</p>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            {new Date(inc.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{inc.description || "No description provided"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <p className="text-xl font-black text-white">₹{Number(inc.amount).toLocaleString()}</p>
                      <button
                        onClick={() => deleteIncome(inc._id || inc.id)}
                        className="p-3 text-slate-600 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredIncomes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-[2.5rem] text-slate-600">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} />
                  </div>
                  <p className="font-medium">No income sources found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
