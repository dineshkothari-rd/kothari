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
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Delete Payment?
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          This payment record will be permanently deleted.
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
  const [filterTenant, setFilterTenant] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "payments"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Sort by createdAt desc
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setPayments(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function updateStatus(id, status) {
    await updateDoc(doc(db, "payments", id), {
      status,
      paidOn: status === "Paid" ? new Date().toLocaleDateString("en-IN") : "",
    });
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, "payments", id));
    setDeletePayment(null);
  }

  const filtered = payments.filter((p) => {
    const matchTenant = filterTenant ? p.tenantId === filterTenant : true;
    const matchStatus = filterStatus ? p.status === filterStatus : true;
    return matchTenant && matchStatus;
  });

  // Summary stats
  const totalPaid = filtered
    .filter((p) => p.status === "Paid")
    .reduce((s, p) => s + p.amount, 0);
  const totalPending = filtered
    .filter((p) => p.status === "Pending")
    .reduce((s, p) => s + p.amount, 0);
  const totalOverdue = filtered
    .filter((p) => p.status === "Overdue")
    .reduce((s, p) => s + p.amount, 0);

  if (loading) return <p className="text-gray-400">Loading payments...</p>;

  return (
    <div>
      {deletePayment && (
        <ConfirmDelete
          onConfirm={() => handleDelete(deletePayment)}
          onCancel={() => setDeletePayment(null)}
        />
      )}

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        💰 Payment Records
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Total Paid
            </p>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">
              ₹{totalPaid.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Total Pending
            </p>
            <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
              ₹{totalPending.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="text-xs text-red-600 dark:text-red-400">
              Total Overdue
            </p>
            <p className="text-xl font-bold text-red-700 dark:text-red-300">
              ₹{totalOverdue.toLocaleString()}
            </p>
          </div>
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
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center text-gray-400">
          No payment records found.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left py-3 px-4">Tenant</th>
                  <th className="text-left py-3 px-4">Room</th>
                  <th className="text-left py-3 px-4">Month</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Paid On</th>
                  <th className="text-left py-3 px-4">Note</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={
                      i % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-900"
                        : "bg-white dark:bg-gray-800"
                    }
                  >
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                      {p.tenantName}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {p.tenantRoom}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {p.month}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800 dark:text-white">
                      ₹{p.amount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {p.paidOn || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 max-w-[120px] truncate">
                      {p.note || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 items-center">
                        <select
                          value={p.status}
                          onChange={(e) => updateStatus(p.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none"
                        >
                          <option>Pending</option>
                          <option>Paid</option>
                          <option>Overdue</option>
                        </select>
                        <button
                          onClick={() => setDeletePayment(p.id)}
                          className="text-red-500 hover:underline text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
