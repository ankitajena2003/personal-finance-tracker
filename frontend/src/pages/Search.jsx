import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import { Search as SearchIcon, ArrowUpRight, ArrowDownLeft, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          api.get("/income"),
          api.get("/expenses")
        ]);

        const combined = [
          ...incomeRes.data.map(i => ({ ...i, type: 'income' })),
          ...expenseRes.data.map(e => ({ ...e, type: 'expense' }))
        ];

        const filtered = combined.filter(item => {
          const searchIn = [
            item.category || item.source || "",
            item.description || "",
            item.type || "",
            item.amount.toString()
          ].join(" ").toLowerCase();
          
          return searchIn.includes(query.toLowerCase());
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        setResults(filtered);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchAllData();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <SearchIcon className="text-indigo-500" size={32} />
            Search Results
          </h1>
          <p className="text-slate-400">
            Showing results for <span className="text-white font-bold">"{query}"</span>
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {results.map((item, idx) => (
                <motion.div
                  key={item._id || item.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-[2rem] flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer"
                  onClick={() => navigate(item.type === 'income' ? '/income' : '/expenses')}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {item.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-white text-lg capitalize">{item.category || item.source}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter ${
                          item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.date).toLocaleDateString()}</span>
                        {item.description && <span className="flex items-center gap-1 line-clamp-1"><Tag size={12} /> {item.description}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-xl font-black ${item.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.type === 'income' ? '+' : '-'} ₹{Number(item.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase mt-1 group-hover:text-indigo-400 transition-colors">Click to view</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {results.length === 0 && !isLoading && (
              <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon size={32} className="text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No matching results</h3>
                <p className="text-slate-500 max-w-xs mx-auto">We couldn't find anything matching your search query. Try a different term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
