import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Income() {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [incomes, setIncomes] = useState([]);

  const token = localStorage.getItem("token");

  // 🔹 Fetch income list
  const fetchIncome = async () => {
    const res = await axios.get("http://localhost:5000/api/income", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setIncomes(res.data);
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // 🔹 Add income
  const addIncome = async () => {
    if (!amount || !source || !date) return;

    await axios.post(
      "http://localhost:5000/api/income",
      { amount, source, date, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAmount("");
    setSource("");
    setDate("");
    setDescription("");
    fetchIncome();
  };

  // 🔹 Delete income
  const deleteIncome = async (id) => {
    await axios.delete(`http://localhost:5000/api/income/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchIncome();
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Income</h1>

      {/* ADD INCOME */}
      <div className="bg-slate-800/60 rounded-2xl p-6 mb-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-dark"
        />

        <input
          placeholder="Source (Salary, Freelance...)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="input-dark"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-dark"
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-dark col-span-1 md:col-span-3"
        />

        <button
          onClick={addIncome}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold py-3 hover:scale-105 transition col-span-1"
        >
          Add Income
        </button>
      </div>

      {/* INCOME LIST */}
      {incomes.length === 0 && (
        <p className="text-slate-400">No income added yet.</p>
      )}

      <div className="space-y-5">
        {incomes.map((i) => (
          <div
            key={i.id}
            className="bg-slate-800/60 rounded-2xl p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold">
                ₹ {i.amount} — {i.source}
              </h3>
              <p className="text-slate-400 text-sm">
                {i.description || "No description"} | {i.date}
              </p>
            </div>

            <button
              onClick={() => deleteIncome(i.id)}
              className="text-red-400 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
