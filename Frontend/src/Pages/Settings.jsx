import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  // ── Budget form ────────────────────────────────────────────
  const {
    register: rBudget,
    handleSubmit: hBudget,
    formState: { isSubmitting: budgetSubmitting },
  } = useForm({
    defaultValues: {
      budgetLimit: user?.budgetLimit,
      currency: user?.currency,
      budgetAlerts: user?.budgetAlerts,
    },
  });

  const onBudgetSubmit = async (data) => {
    try {
      const res = await api.put("/users/budget", {
        ...data,
        budgetLimit: Number(data.budgetLimit),
        budgetAlerts: Boolean(data.budgetAlerts),
      });
      setUser(res.data.data);
      queryClient.invalidateQueries({ queryKey: ["stats-summary"] });
      toast.success("Budget settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    }
  };

  // ── Password form ──────────────────────────────────────────
  const {
    register: rPass,
    handleSubmit: hPass,
    reset: resetPass,
    formState: { isSubmitting: passSubmitting },
  } = useForm();

  const onPassSubmit = async (data) => {
    try {
      await api.put("/users/password", data);
      toast.success("Password updated");
      resetPass();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  // ── CSV Export ─────────────────────────────────────────────
  const handleExport = async () => {
    try {
      const res = await api.get("/users/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Settings</h2>

      {/* Budget & Currency */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Budget & Currency</h3>
        <form onSubmit={hBudget(onBudgetSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget Limit</label>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...rBudget("budgetLimit", { required: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...rBudget("currency")}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="budgetAlerts"
              className="w-4 h-4 accent-blue-600"
              {...rBudget("budgetAlerts")}
            />
            <label htmlFor="budgetAlerts" className="text-sm text-gray-700">
              Enable budget alerts
            </label>
          </div>

          <button
            type="submit"
            disabled={budgetSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {budgetSubmitting ? "Saving…" : "Save Budget Settings"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Change Password</h3>
        <form onSubmit={hPass(onPassSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
              {...rPass("currentPassword", { required: "Required" })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min 6 characters"
              {...rPass("newPassword", { required: "Required", minLength: { value: 6, message: "Min 6 characters" } })}
            />
          </div>

          <button
            type="submit"
            disabled={passSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {passSubmitting ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* CSV Export */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Export Data</h3>
        <p className="text-xs text-gray-400 mb-4">Download all your expenses as a CSV file.</p>
        <button
          onClick={handleExport}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default Settings;
