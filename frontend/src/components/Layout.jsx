import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, X, Bell, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const syncProfile = () => {
      const email = localStorage.getItem("userEmail");
      const image = localStorage.getItem(`profileImage_${email}`) || localStorage.getItem("profileImage");
      setProfileImage(image);
    };

    syncProfile();
    // Listen for storage changes in other tabs
    window.addEventListener('storage', syncProfile);
    return () => window.removeEventListener('storage', syncProfile);
  }, []);

  return (
    <div className="bg-[#020617] text-white min-h-screen font-['Outfit'] selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-40">
        <Sidebar />
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 shadow-2xl md:hidden"
            >
              <Sidebar />
              <button 
                onClick={() => setOpen(false)}
                className="absolute top-6 right-6 p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400"
              >
                <X size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= MAIN CONTENT ================= */}
      <div className="md:ml-64 min-h-screen flex flex-col relative">
        
        {/* TOP NAVBAR (DESKTOP & MOBILE) */}
        <header className="sticky top-0 z-30 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setOpen(true)} 
                className="md:hidden p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <Menu size={20} />
              </button>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setSearchQuery("");
                  }
                }}
                className="hidden md:flex items-center gap-3 bg-slate-900/50 border border-slate-800 pr-2 pl-4 py-1.5 rounded-2xl w-96 group focus-within:border-indigo-500/50 transition-all"
              >
                <Search size={18} className="text-slate-500 group-focus-within:text-indigo-400" />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="bg-transparent border-none focus:ring-0 text-sm text-white w-full placeholder:text-slate-600 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Search size={14} />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-400 transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900" />
              </button>
              <div className="w-[1px] h-6 bg-slate-800 mx-2 hidden sm:block" />
              <div 
                onClick={() => navigate("/account")}
                className="hidden sm:flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right">
                  <p className="text-xs font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">{localStorage.getItem("userName") || "User"}</p>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Active Now</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1px] overflow-hidden">
                  <div className="w-full h-full rounded-xl bg-[#020617] flex items-center justify-center font-bold text-indigo-400 overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (localStorage.getItem("userName") || "U").charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 p-6 md:p-10 relative">
          <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
