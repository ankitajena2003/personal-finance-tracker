import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-40">
        <Sidebar />
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950
        transform transition-transform duration-300 md:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="md:ml-64 min-h-screen flex flex-col">

        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center gap-4 p-4 border-b border-slate-800">
          <button onClick={() => setOpen(true)} className="text-2xl">
            ☰
          </button>
          <h1 className="font-bold text-lg">SaveSmart</h1>
        </div>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          {children}
        </main>

      </div>
    </div>
  );
}
