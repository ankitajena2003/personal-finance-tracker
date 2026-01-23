import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "User";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-5 py-3 rounded-xl transition-all duration-300
     ${
       isActive
         ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
         : "text-slate-300 hover:bg-slate-800 hover:text-white"
     }`;

  return (
    <aside className="w-64 h-full bg-slate-950 border-r border-slate-800 p-6 flex flex-col">
      
      {/* LOGO */}
      <h1 className="text-2xl font-bold text-white mb-10 flex items-center gap-2">
        💰 SaveSmart
      </h1>

      {/* NAV LINKS */}
      <nav className="space-y-3 flex-1">
        <NavLink to="/" className={linkClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/expenses" className={linkClass}>
          💸 Expenses
        </NavLink>

        <NavLink to="/income" className={linkClass}>
          💰 Income
        </NavLink>

        <NavLink to="/budgets" className={linkClass}>
          🎯 Budgets
        </NavLink>
      </nav>

      {/* USER PROFILE */}
      <button
        onClick={() => navigate("/account")}
        className="w-full flex items-center gap-3 px-4 py-3 mb-4
                   rounded-xl bg-slate-900 hover:bg-slate-800
                   text-white transition"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 font-bold text-lg">
          {userName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 text-left">
          <p className="font-semibold leading-tight">{userName}</p>
          <p className="text-xs text-slate-400">Manage account</p>
        </div>

        <span className="text-slate-400 text-lg">▸</span>
      </button>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="py-3 rounded-xl bg-red-600/90 hover:bg-red-600
                   text-white font-semibold transition"
      >
        Logout
      </button>
    </aside>
  );
}
