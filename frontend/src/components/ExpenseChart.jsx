import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ expenses }) {
  // group expenses by category
  const categoryMap = {};

  expenses.forEach((exp) => {
    categoryMap[exp.category] =
      (categoryMap[exp.category] || 0) + Number(exp.amount);
  });

  const data = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          "#8b5cf6",
          "#6366f1",
          "#22c55e",
          "#ef4444",
          "#f59e0b",
          "#06b6d4",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">
        Expenses by Category
      </h3>
      <Doughnut data={data} />
    </div>
  );
}
