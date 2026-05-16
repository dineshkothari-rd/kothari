import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function AddPaymentForm({ tenants, onClose, onSuccess }) {
  const [form, setForm] = useState({
    tenantId: "",
    month: "",
    amountPaid: "",
    note: "",
    paidOn: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previousBalance, setPreviousBalance] = useState(null);

  const selectedTenant = useMemo(
    () => tenants.find((t) => t.id === form.tenantId),
    [form.tenantId, tenants],
  );
  const totalRent = selectedTenant?.rent || 0;
  const amountPaid = Number(form.amountPaid) || 0;
  const previousPaid =
    previousBalance !== null ? totalRent - previousBalance : 0;

  const totalPaidTillNow = previousPaid + amountPaid;

  const balance = Math.max(0, totalRent - totalPaidTillNow);

  const isFullyPaid =
    previousBalance !== null && totalRent > 0 && previousBalance <= 0;

  function getStatus() {
    if (totalPaidTillNow === 0) return "Pending";
    if (totalPaidTillNow >= totalRent) return "Paid";
    return "Partial";
  }

  const status = getStatus();

  const statusStyles = {
    Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Partial:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };

  const fetchBalance = useCallback(
    async (tenantId, month) => {
      if (!tenantId || !month) return;

      try {
        const tenant = tenants.find((t) => t.id === tenantId);
        const totalRent = tenant?.rent || 0;

        const q = query(
          collection(db, "payments"),
          where("tenantId", "==", tenantId),
          where("month", "==", month),
        );

        const snap = await getDocs(q);

        let totalPaid = 0;

        snap.forEach((doc) => {
          totalPaid += doc.data().amountPaid || 0;
        });

        const balance = Math.max(0, totalRent - totalPaid);

        setPreviousBalance(balance);

        setForm((prev) => ({
          ...prev,
          amountPaid: balance > 0 ? balance.toString() : "",
        }));

        if (balance <= 0) {
          setError("This month's rent is already fully paid");
        } else {
          setError("");
        }
      } catch (err) {
        setError("Unable to calculate balance: " + err.message);
      }
    },
    [tenants],
  );

  function handleTenantChange(e) {
    const tenantId = e.target.value;

    setForm((prev) => ({
      ...prev,
      tenantId,
      amountPaid: "",
    }));

    setPreviousBalance(null);
  }

  useEffect(() => {
    if (form.tenantId && form.month) {
      fetchBalance(form.tenantId, form.month);
    }
  }, [fetchBalance, form.tenantId, form.month]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.tenantId || !form.month || !form.amountPaid) {
      setError("Tenant, month and amount are required");
      return;
    }

    const tenant = tenants.find((t) => t.id === form.tenantId);
    const totalRent = tenant?.rent || 0;
    const amountPaid = Number(form.amountPaid) || 0;

    if (!tenant || totalRent <= 0) {
      setError("Select a tenant with a valid monthly rent");
      return;
    }

    if (amountPaid <= 0) {
      setError("Enter valid amount");
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "payments"),
        where("tenantId", "==", form.tenantId),
        where("month", "==", form.month),
      );

      const snap = await getDocs(q);

      let totalPaid = 0;

      snap.forEach((doc) => {
        totalPaid += doc.data().amountPaid || 0;
      });

      const newTotalPaid = totalPaid + amountPaid;

      if (newTotalPaid > totalRent) {
        setError(`Total exceeds rent. Remaining: ₹${totalRent - totalPaid}`);
        return;
      }

      const balance = Math.max(0, totalRent - newTotalPaid);

      const status =
        newTotalPaid === 0
          ? "Pending"
          : newTotalPaid >= totalRent
            ? "Paid"
            : "Partial";

      await addDoc(collection(db, "payments"), {
        tenantId: form.tenantId,
        tenantName: tenant?.name || "",
        tenantRoom: tenant?.room || "",
        month: form.month,
        totalRent,
        amountPaid,
        balance,
        status,
        paidOn:
          amountPaid > 0
            ? form.paidOn || new Date().toLocaleDateString("en-IN")
            : "",
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

  const showSummaryCard =
    selectedTenant && (form.month || previousBalance !== null);
  const progressPercent =
    totalRent > 0
      ? Math.min(100, Math.round((totalPaidTillNow / totalRent) * 100))
      : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl p-6 w-full flex flex-col gap-5 ${
          showSummaryCard ? "max-w-4xl" : "max-w-lg"
        }`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            💰 Add Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        <div
          className={`grid gap-4 ${
            showSummaryCard ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          <div>
            {/* Tenant Select */}
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
                    {t.name} — {t.room} (₹{t.rent?.toLocaleString()}/mo)
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
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Amount Paid */}
            <InputField
              label="Amount Paid (₹) *"
              name="amountPaid"
              type="number"
              value={form.amountPaid}
              onChange={handleChange}
              placeholder={
                totalRent
                  ? `Max ₹${totalRent.toLocaleString()}`
                  : "Select tenant first"
              }
              hint={
                totalRent ? `Total rent: ₹${totalRent.toLocaleString()}` : ""
              }
            />

            {/* Paid On */}
            {amountPaid > 0 && (
              <InputField
                label="Paid On"
                name="paidOn"
                type="date"
                value={form.paidOn}
                onChange={handleChange}
              />
            )}

            {/* Note */}
            <InputField
              label="Note (optional)"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="e.g. Paid via UPI, partial payment..."
            />
          </div>
          {showSummaryCard && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mt-6 flex flex-col gap-3 border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Payment Summary
              </p>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Monthly Rent
                </span>
                <span className="font-bold text-gray-800 dark:text-white">
                  ₹{totalRent.toLocaleString()}
                </span>
              </div>

              {previousBalance !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Previous Balance Due
                  </span>
                  <span className="font-bold text-orange-500">
                    ₹{previousBalance.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Paying Now
                </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  ₹{amountPaid.toLocaleString()}
                </span>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-700" />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Remaining Balance
                </span>
                <span
                  className={`font-extrabold text-lg ${balance > 0 ? "text-red-500" : "text-green-500"}`}
                >
                  ₹{Math.max(0, balance).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[status]}`}
                >
                  {status === "Paid"
                    ? "✅ Paid"
                    : status === "Partial"
                      ? "🔶 Partial"
                      : "⏳ Pending"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    status === "Paid"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : status === "Partial"
                        ? "bg-gradient-to-r from-orange-400 to-amber-500"
                        : "bg-gray-300"
                  }`}
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 text-right">
                {progressPercent}% paid
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className={`flex-1 ${
              isFullyPaid || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isFullyPaid || loading}
          >
            {loading
              ? "Adding..."
              : isFullyPaid
                ? "Already Paid"
                : "Add Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
