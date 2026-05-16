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
import { calculateSummary } from "../../utils/helper";
import PaymentsTable from "../paymentsTable/PaymentsTable";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "payments"),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        data.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
        );
        setPayments(data);
        setError("");
        setLoading(false);
      },
      (err) => {
        setError("Unable to load payments: " + err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, "payments", id));
      setDeletePayment(null);
    } catch (err) {
      setError("Unable to delete payment: " + err.message);
    }
  }

  const filtered = payments.filter((p) => {
    const matchTenant = filterTenant ? p.tenantId === filterTenant : true;
    const matchStatus = filterStatus ? p.status === filterStatus : true;
    return matchTenant && matchStatus;
  });

  const { totalPaid, totalPartial, totalOverdue, totalBalance } =
    calculateSummary(filtered);

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
      <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Payment Records
        </h2>
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={filterTenant}
            onChange={(e) => setFilterTenant(e.target.value)}
            className="field-control sm:w-52"
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
            className="field-control sm:w-44"
          >
            <option value="">All Status</option>
            <option value="Paid">✅ Paid</option>
            <option value="Partial">🔶 Partial</option>
            <option value="Pending">⏳ Pending</option>
            <option value="Overdue">🚨 Overdue</option>
          </select>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wide">
            Fully Paid
          </p>
          <p className="text-xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1">
            ₹{totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/60 dark:bg-orange-950/40">
          <p className="text-xs text-orange-700 dark:text-orange-300 font-bold uppercase tracking-wide">
            Partial Paid
          </p>
          <p className="text-xl font-extrabold text-orange-700 dark:text-orange-300 mt-1">
            ₹{totalPartial.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/40">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wide">
            Pending
          </p>
          <p className="text-xl font-extrabold text-yellow-700 dark:text-yellow-300 mt-1">
            ₹{totalBalance.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/60 dark:bg-rose-950/40">
          <p className="text-xs text-rose-700 dark:text-rose-300 font-bold uppercase tracking-wide">
            Overdue
          </p>
          <p className="text-xl font-extrabold text-red-700 dark:text-red-300 mt-1">
            ₹{totalOverdue.toLocaleString()}
          </p>
        </div>
      </div>
      <PaymentsTable
        payments={filtered}
        canDeletePayment={true}
        setDeletePayment={setDeletePayment}
      />
    </div>
  );
}
