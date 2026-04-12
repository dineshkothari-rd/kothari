import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
      />
    </div>
  );
}

export default function AddPaymentForm({ tenants, onClose, onSuccess }) {
  const [form, setForm] = useState({
    tenantId: "",
    month: "",
    amount: "",
    status: "Pending",
    paidOn: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  // Auto fill rent when tenant selected
  function handleTenantChange(e) {
    const tenantId = e.target.value;
    const tenant = tenants.find((t) => t.id === tenantId);
    setForm((prev) => ({
      ...prev,
      tenantId,
      amount: tenant?.rent || "",
    }));
  }

  async function handleSubmit() {
    if (!form.tenantId || !form.month || !form.amount) {
      setError("Tenant, month and amount are required");
      return;
    }
    setLoading(true);
    try {
      const tenant = tenants.find((t) => t.id === form.tenantId);
      await addDoc(collection(db, "payments"), {
        tenantId: form.tenantId,
        tenantName: tenant?.name || "",
        tenantRoom: tenant?.room || "",
        month: form.month,
        amount: Number(form.amount),
        status: form.status,
        paidOn:
          form.status === "Paid"
            ? form.paidOn || new Date().toLocaleDateString("en-IN")
            : "",
        note: form.note,
        createdAt: serverTimestamp(),
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError("Error adding payment: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            💰 Add Payment Record
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Tenant Select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Select Tenant *
          </label>
          <select
            name="tenantId"
            value={form.tenantId}
            onChange={handleTenantChange}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select tenant...</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.room}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Month */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Month *
            </label>
            <input
              type="month"
              name="month"
              value={form.month}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <InputField
            label="Amount (₹) *"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="8000"
          />

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Paid On */}
          {form.status === "Paid" && (
            <InputField
              label="Paid On"
              name="paidOn"
              type="date"
              value={form.paidOn}
              onChange={handleChange}
            />
          )}
        </div>

        {/* Note */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Note (optional)
          </label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="e.g. Paid via UPI, Late fee included..."
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            {loading ? "Adding..." : "Add Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
