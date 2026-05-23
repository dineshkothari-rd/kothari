import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";

const RATE_PER_UNIT = 10;

export default function MeterReadingForm({ tenants, onClose, onSuccess }) {
  const [form, setForm] = useState({
    tenantId: "",
    month: "",
    currentReading: "",
    note: "",
  });
  const [previousReading, setPreviousReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedTenant = tenants.find((t) => t.id === form.tenantId);
  const currentReading = Number(form.currentReading) || 0;
  const unitsConsumed =
    previousReading !== null
      ? Math.max(0, currentReading - previousReading)
      : 0;
  const billAmount = unitsConsumed * RATE_PER_UNIT;

  async function handleTenantChange(e) {
    const tenantId = e.target.value;
    setForm((prev) => ({ ...prev, tenantId, currentReading: "" }));
    setPreviousReading(null);

    if (!tenantId) return;

    try {
      const q = query(
        collection(db, "meterReadings"),
        where("tenantId", "==", tenantId),
        orderBy("createdAt", "desc"),
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setPreviousReading(snap.docs[0].data().currentReading);
      } else {
        setPreviousReading(0);
      }
    } catch (err) {
      console.error(err);
      setPreviousReading(0);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.tenantId || !form.month || !form.currentReading) {
      setError("Tenant, month and current reading are required");
      return;
    }
    if (previousReading !== null && currentReading < previousReading) {
      setError(
        `Current reading cannot be less than previous reading (${previousReading})`,
      );
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "meterReadings"), {
        tenantId: form.tenantId,
        tenantName: selectedTenant?.name || "",
        tenantRoom: selectedTenant?.room || "",
        month: form.month,
        previousReading: previousReading ?? 0,
        currentReading,
        unitsConsumed,
        ratePerUnit: RATE_PER_UNIT,
        billAmount,
        note: form.note,
        createdAt: serverTimestamp(),
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg flex flex-col gap-5 my-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            ⚡ Add Meter Reading
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Tenant */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Select Tenant *
          </label>
          <select
            value={form.tenantId}
            onChange={handleTenantChange}
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select tenant...</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.room}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Month *
          </label>
          <input
            type="month"
            name="month"
            value={form.month}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border scheme-light-dark border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Readings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Previous Reading
            </label>
            <div className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
              {previousReading !== null
                ? `${previousReading} units`
                : "Select tenant first"}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Current Reading *
            </label>
            <input
              type="number"
              name="currentReading"
              value={form.currentReading}
              onChange={handleChange}
              placeholder="e.g. 1250"
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Live Bill Summary */}
        {selectedTenant && form.currentReading && (
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
              ⚡ Bill Summary
            </p>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Previous Reading
              </span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {previousReading ?? 0} units
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Current Reading
              </span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {currentReading} units
              </span>
            </div>

            <div className="h-px bg-yellow-200 dark:bg-yellow-800" />

            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Units Consumed
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {unitsConsumed} units
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Rate per Unit
              </span>
              <span className="font-semibold text-gray-800 dark:text-white">
                ₹{RATE_PER_UNIT}
              </span>
            </div>

            <div className="h-px bg-yellow-200 dark:bg-yellow-800" />

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300 font-semibold">
                Total Bill
              </span>
              <span className="text-2xl font-extrabold text-yellow-600 dark:text-yellow-400">
                ₹{billAmount.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Note (optional)
          </label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Any remarks..."
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            {loading ? "Saving..." : "Save Reading"}
          </Button>
        </div>
      </div>
    </div>
  );
}
