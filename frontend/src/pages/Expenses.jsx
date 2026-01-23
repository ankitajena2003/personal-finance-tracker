import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // 🔄 Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ➕ Add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      await api.post("/expenses", {
        amount,
        category,
        description,
        date,
      });

      // reset form
      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");

      fetchExpenses();
    } catch (err) {
      console.error("Error adding expense", err);
    }
  };

  // ❌ Delete expense
  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense", err);
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-10">Expenses</h1>

      {/* ➕ ADD EXPENSE */}
      <form
        onSubmit={handleAddExpense}
        className="bg-slate-900 p-6 rounded-2xl mb-10 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="number"
          placeholder="Amount"
          className="px-4 py-3 rounded-xl bg-slate-800 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category (Food, Travel...)"
          className="px-4 py-3 rounded-xl bg-slate-800 text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="date"
          className="px-4 py-3 rounded-xl bg-slate-800 text-white"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          className="px-4 py-3 rounded-xl bg-slate-800 text-white md:col-span-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-purple-600 to-indigo-600
                     text-white rounded-xl py-3 font-semibold hover:opacity-90"
        >
          Add Expense
        </button>
      </form>

      {/* 📋 EXPENSE LIST */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <p className="text-slate-400">No expenses added yet.</p>
        ) : (
          expenses.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-900 p-5 rounded-xl flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  ₹ {exp.amount} – {exp.category}
                </h3>
                <p className="text-sm text-slate-400">
                  {exp.description} | {exp.date}
                </p>
              </div>

              <button
                onClick={() => handleDelete(exp.id)}
                className="text-red-400 hover:text-red-500 font-semibold"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
