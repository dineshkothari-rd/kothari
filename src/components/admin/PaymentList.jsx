import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";

const statusStyles = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Partial:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusIcons = {
  Paid: "✅",
  Pending: "⏳",
  Partial: "🔶",
  Overdue: "🚨",
};

function BalancePayModal({ payment, onClose }) {
  const [amount, setAmount] = useState(payment.balance || 0);
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const newAmountPaid = payment.amountPaid + Number(amount);
      const newBalance = payment.totalRent - newAmountPaid;
      const newStatus = newBalance <= 0 ? "Paid" : "Partial";
      await updateDoc(doc(db, "payments", payment.id), {
        amountPaid: newAmountPaid,
        balance: Math.max(0, newBalance),
        status: newStatus,
        paidOn: new Date().toLocaleDateString("en-IN"),
      });
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          🔶 Pay Remaining Balance
        </h3>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Rent</span>
            <span className="font-bold text-gray-800 dark:text-white">
              ₹{payment.totalRent?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Already Paid</span>
            <span className="font-bold text-green-600">
              ₹{payment.amountPaid?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Balance Due</span>
            <span className="font-bold text-red-500">
              ₹{payment.balance?.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Amount Paying Now (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={payment.balance}
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePay} className="flex-1">
            {loading ? "Saving..." : "Mark as Paid"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Delete Payment?
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          This record will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentList({ tenants }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePayment, setDeletePayment] = useState(null);
  const [balancePayment, setBalancePayment] = useState(null);
  const [filterTenant, setFilterTenant] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "payments"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setPayments(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function handleDelete(id) {
    await deleteDoc(doc(db, "payments", id));
    setDeletePayment(null);
  }

  const filtered = payments.filter((p) => {
    const matchTenant = filterTenant ? p.tenantId === filterTenant : true;
    const matchStatus = filterStatus ? p.status === filterStatus : true;
    return matchTenant && matchStatus;
  });

  const totalPaid = filtered
    .filter((p) => p.status === "Paid")
    .reduce((s, p) => s + (p.totalRent || 0), 0);
  const totalPartial = filtered
    .filter((p) => p.status === "Partial")
    .reduce((s, p) => s + (p.amountPaid || 0), 0);
  const totalBalance = filtered
    .filter((p) => p.status === "Partial")
    .reduce((s, p) => s + (p.balance || 0), 0);
  const totalPending = filtered
    .filter((p) => p.status === "Pending")
    .reduce((s, p) => s + (p.totalRent || 0), 0);
  const totalOverdue = filtered
    .filter((p) => p.status === "Overdue")
    .reduce((s, p) => s + (p.totalRent || 0), 0);

  if (loading) return <p className="text-gray-400">Loading payments...</p>;

  return (
    <div>
      {deletePayment && (
        <ConfirmDelete
          onConfirm={() => handleDelete(deletePayment)}
          onCancel={() => setDeletePayment(null)}
        />
      )}
      {balancePayment && (
        <BalancePayModal
          payment={balancePayment}
          onClose={() => setBalancePayment(null)}
        />
      )}

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        💰 Payment Records
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
          <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
            ✅ Fully Paid
          </p>
          <p className="text-xl font-extrabold text-green-700 dark:text-green-300 mt-1">
            ₹{totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
            🔶 Partial Paid
          </p>
          <p className="text-xl font-extrabold text-orange-700 dark:text-orange-300 mt-1">
            ₹{totalPartial.toLocaleString()}
          </p>
          {totalBalance > 0 && (
            <p className="text-xs text-red-500 mt-0.5">
              ₹{totalBalance.toLocaleString()} pending
            </p>
          )}
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4">
          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
            ⏳ Pending
          </p>
          <p className="text-xl font-extrabold text-yellow-700 dark:text-yellow-300 mt-1">
            ₹{totalPending.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4">
          <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
            🚨 Overdue
          </p>
          <p className="text-xl font-extrabold text-red-700 dark:text-red-300 mt-1">
            ₹{totalOverdue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={filterTenant}
          onChange={(e) => setFilterTenant(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Tenants</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="Paid">✅ Paid</option>
          <option value="Partial">🔶 Partial</option>
          <option value="Pending">⏳ Pending</option>
          <option value="Overdue">🚨 Overdue</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center text-gray-400 border border-gray-100 dark:border-gray-700">
          No payment records found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-800 dark:text-white">
                      {p.tenantName}
                    </p>
                    <span className="text-xs text-gray-400">
                      {p.tenantRoom}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyles[p.status]}`}
                    >
                      {statusIcons[p.status]} {p.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {p.month} {p.paidOn ? `• Paid on ${p.paidOn}` : ""}
                  </p>
                  {p.note && (
                    <p className="text-xs text-gray-400 mt-0.5 italic">
                      {p.note}
                    </p>
                  )}
                </div>

                {/* Right — Amounts */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Rent</p>
                    <p className="font-bold text-gray-800 dark:text-white">
                      ₹{p.totalRent?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-500">Paid</p>
                    <p className="font-bold text-green-600 dark:text-green-400">
                      ₹{p.amountPaid?.toLocaleString()}
                    </p>
                  </div>
                  {p.balance > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-red-400">Balance</p>
                      <p className="font-bold text-red-500">
                        ₹{p.balance?.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {p.totalRent > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        p.status === "Paid"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : p.status === "Partial"
                            ? "bg-gradient-to-r from-orange-400 to-amber-500"
                            : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round(((p.amountPaid || 0) / p.totalRent) * 100))}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.min(
                      100,
                      Math.round(((p.amountPaid || 0) / p.totalRent) * 100),
                    )}
                    % paid
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                {p.status === "Partial" && (
                  <button
                    onClick={() => setBalancePayment(p)}
                    className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    🔶 Pay Balance (₹{p.balance?.toLocaleString()})
                  </button>
                )}

                <button
                  onClick={() => setDeletePayment(p.id)}
                  className="text-red-500 hover:underline text-xs font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
