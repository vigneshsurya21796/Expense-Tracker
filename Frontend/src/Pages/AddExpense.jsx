import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../utils/axios";

const CATEGORIES = ["Food", "Transport", "Shopping", "Entertainment", "Health", "Bills", "Education", "Travel", "Other"];

const AddExpense = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { date: new Date().toISOString().slice(0, 10) },
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/expenses", { ...data, amount: Number(data.amount) });
      toast.success("Expense added!");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["stats-summary"] });
      queryClient.invalidateQueries({ queryKey: ["stats-categories"] });
      queryClient.invalidateQueries({ queryKey: ["stats-monthly"] });
      navigate("/expenses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add expense");
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Expense</h2>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Swiggy, Amazon"
              {...register("merchant", { required: "Merchant is required" })}
            />
            {errors.merchant && <p className="text-red-500 text-xs mt-1">{errors.merchant.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                {...register("amount", { required: "Amount is required", min: { value: 0, message: "Cannot be negative" } })}
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400">(optional)</span></label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes…"
              rows={3}
              {...register("notes")}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate("/expenses")}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "Adding…" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
