import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€" };

const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color || "text-gray-900"}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const symbol = CURRENCY_SYMBOLS[user?.currency] || "₹";

  const { data: summary } = useQuery({
    queryKey: ["stats-summary"],
    queryFn: () => api.get("/stats/summary").then((r) => r.data.data),
  });

  const { data: monthly = [] } = useQuery({
    queryKey: ["stats-monthly"],
    queryFn: () => api.get("/stats/monthly").then((r) => r.data.data),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["stats-categories"],
    queryFn: () => api.get("/stats/categories").then((r) => r.data.data),
  });

  const { data: recentExpenses = [] } = useQuery({
    queryKey: ["expenses-recent"],
    queryFn: () => api.get("/expenses").then((r) => r.data.data.slice(0, 5)),
  });

  const budgetPct = summary
    ? Math.min(Math.round((summary.totalSpent / summary.budgetLimit) * 100), 100)
    : 0;

  const budgetColor =
    budgetPct >= 90 ? "text-red-600" : budgetPct >= 70 ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Spent (this month)"
          value={`${symbol}${summary?.totalSpent?.toLocaleString("en-IN") || 0}`}
        />
        <StatCard
          label="Budget Left"
          value={`${symbol}${summary?.budgetLeft?.toLocaleString("en-IN") || 0}`}
          color={budgetColor}
        />
        <StatCard
          label="Transactions"
          value={summary?.count || 0}
          sub="this month"
        />
        <StatCard
          label="Avg / Day"
          value={`${symbol}${summary?.avgPerDay?.toLocaleString("en-IN") || 0}`}
        />
      </div>

      {/* Budget progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Budget Usage</span>
          <span className={`font-semibold ${budgetColor}`}>{budgetPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${
              budgetPct >= 90 ? "bg-red-500" : budgetPct >= 70 ? "bg-amber-400" : "bg-emerald-500"
            }`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {symbol}{summary?.totalSpent?.toLocaleString("en-IN") || 0} of {symbol}{summary?.budgetLimit?.toLocaleString("en-IN") || 0}
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Spending</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `${symbol}${v.toLocaleString("en-IN")}`} />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Spending by Category</h3>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-10">No expenses this month</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${symbol}${v.toLocaleString("en-IN")}`} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent expenses */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Expenses</h3>
        {recentExpenses.length === 0 ? (
          <p className="text-sm text-gray-400">No expenses yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                <th className="pb-2 font-medium">Merchant</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((e) => (
                <tr key={e._id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 font-medium text-gray-800">{e.merchant}</td>
                  <td className="py-2">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">
                    {new Date(e.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-2 text-right font-semibold text-gray-800">
                    {symbol}{e.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
