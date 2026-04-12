import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";

const statusStyles = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function AddPaymentModal({ tenants, onClose }) {
  const [form, setForm] = useState({ userId: "", month: "", amount: "" });
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!form.userId || !form.month || !form.amount) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    const tenant = tenants.find((t) => t.id === form.userId);
    try {
      await addDoc(collection(db, "payments"), {
        userId: form.userId,
        tenantName: tenant?.name || "",
        amount: Number(form.amount),
        month: form.month,
        status: "Pending",
        paidOn: "",
        razorpayId: "",
        createdAt: serverTimestamp(),
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Add Payment Record
        </h3>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Select Tenant
          </label>
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.room}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Month
          </label>
          <input
            type="month"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Amount (₹)
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="8000"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd} className="flex-1">
            {loading ? "Adding..." : "Add Record"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManagePayments({ tenants }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "payments"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  if (loading) return <p className="text-gray-400">Loading payments...</p>;

  return (
    <div>
      {showModal && (
        <AddPaymentModal
          tenants={tenants}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          💰 Payment Records
        </h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Payment
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center text-gray-400">
          No payment records yet.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left py-3 px-4">Tenant</th>
                  <th className="text-left py-3 px-4">Month</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Paid On</th>
                  <th className="text-left py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
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
                    <td className="py-3 px-4">
                      <select
                        value={p.status}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none"
                      >
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Overdue</option>
                      </select>
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
