import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Target, 
  LogOut, 
  User as UserIcon,
  ChevronRight,
  PieChart
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const syncProfile = () => {
      const userEmail = localStorage.getItem("userEmail");
      const image = localStorage.getItem(`profileImage_${userEmail}`) || localStorage.getItem("profileImage");
      setProfileImage(image);
    };
    syncProfile();
    window.addEventListener('storage', syncProfile);
    return () => window.removeEventListener('storage', syncProfile);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Expenses", path: "/expenses", icon: <Wallet size={20} /> },
    { name: "Income", path: "/income", icon: <TrendingUp size={20} /> },
    { name: "Budgets", path: "/budgets", icon: <PieChart size={20} /> },
    { name: "Account", path: "/account", icon: <UserIcon size={20} /> },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
     ${
       isActive
         ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold"
         : "text-slate-400 hover:bg-slate-800/50 hover:text-indigo-400"
     }`;

  return (
    <aside className="w-64 h-full bg-slate-950 border-r border-slate-800/50 p-6 flex flex-col relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Wallet className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Save<span className="text-indigo-500">Smart</span>
        </h1>
      </div>

      {/* NAV LINKS */}
      <nav className="space-y-2 flex-1 relative z-10">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass}>
            <span className="transition-transform group-hover:scale-110 duration-300">
              {item.icon}
            </span>
            <span className="flex-1">{item.name}</span>
            {item.path === window.location.pathname && (
              <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* USER PROFILE */}
      <div className="mt-auto space-y-4 relative z-10">
        <button
          onClick={() => navigate("/account")}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all group"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 font-bold text-white shadow-inner overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="font-semibold text-white text-sm truncate">{userName}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Premium Plan</p>
          </div>
          <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold transition-all duration-300 text-sm border border-red-500/20"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
