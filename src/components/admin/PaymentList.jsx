import { useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";
import InfiniteListFooter from "../common/InfiniteListFooter";
import {
  calculateSummary,
  getPaymentAmount,
  getPaymentTenantId,
  normalizePayments,
  toNumber,
} from "../../utils/helper";
import PaymentsTable from "../paymentsTable/PaymentsTable";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useIncrementalList } from "../../hooks/useIncrementalList";
import { businessTypeOptions, getBusinessType } from "../../utils/businessTypes";

function BalancePayModal({ payment, tenants, onClose }) {
  const [amount, setAmount] = useState(payment.balance || 0);
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    const payingNow = Number(amount);

    if (!payingNow || payingNow <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    if (payingNow > Number(payment.balance || 0)) {
      alert("Payment cannot exceed the remaining balance.");
      return;
    }

    setLoading(true);
    try {
      const modernQuery = query(
        collection(db, "payments"),
        where("tenantId", "==", payment.tenantId),
        where("month", "==", payment.month),
      );
      const legacyQuery = query(
        collection(db, "payments"),
        where("userId", "==", payment.tenantId),
        where("month", "==", payment.month),
      );
      const [modernSnap, legacySnap] = await Promise.all([
        getDocs(modernQuery),
        getDocs(legacyQuery),
      ]);
      const records = new Map();

      modernSnap.forEach((document) => {
        records.set(document.id, document.data());
      });
      legacySnap.forEach((document) => {
        records.set(document.id, document.data());
      });

      let totalPaid = 0;
      records.forEach((record) => {
        if (getPaymentTenantId(record) === payment.tenantId) {
          totalPaid += getPaymentAmount(record);
        }
      });

      const tenant = tenants.find((item) => item.id === payment.tenantId);
      const totalRent = toNumber(payment.totalRent) || toNumber(tenant?.rent);
      const currentBalance = Math.max(0, totalRent - totalPaid);

      if (payingNow > currentBalance) {
        alert(
          `Payment cannot exceed the current remaining balance of ₹${currentBalance.toLocaleString("en-IN")}.`,
        );
        return;
      }

      const newTotalPaid = totalPaid + payingNow;
      const newBalance = Math.max(0, totalRent - newTotalPaid);
      const newStatus = newBalance <= 0 ? "Paid" : "Partial";

      await addDoc(collection(db, "payments"), {
        tenantId: payment.tenantId,
        tenantName: payment.tenantName || tenant?.name || "",
        tenantRoom: payment.tenantRoom || tenant?.room || "",
        businessType: payment.businessType || tenant?.businessType || "pg",
        month: payment.month,
        totalRent,
        amountPaid: payingNow,
        balance: newBalance,
        status: newStatus,
        paidOn: new Date().toLocaleDateString("en-IN"),
        note: "Balance payment",
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-0 sm:items-center sm:px-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-t-xl bg-white p-4 shadow-xl dark:bg-gray-800 sm:rounded-xl sm:p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          🔶 Pay Remaining Balance
        </h3>
        <div className="flex flex-col gap-2 rounded-xl bg-orange-50 p-4 dark:bg-orange-900/20">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Charge</span>
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
            min="1"
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-0 sm:items-center sm:px-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-t-xl bg-white p-4 shadow-xl dark:bg-gray-800 sm:rounded-xl sm:p-6">
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
            className="min-h-10 flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentList({ tenants }) {
  const [deletePayment, setDeletePayment] = useState(null);
  const [balancePayment, setBalancePayment] = useState(null);
  const [filterTenant, setFilterTenant] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const { data: payments, loading } = useFirestoreCollection("payments", {
    sortBy: "createdAt",
  });

  async function handleDelete(payment) {
    const recordIds = payment.recordIds?.length
      ? payment.recordIds
      : [payment.sourceId || payment.id];

    await Promise.all(
      recordIds.filter(Boolean).map((id) => deleteDoc(doc(db, "payments", id))),
    );
    setDeletePayment(null);
  }

  const normalized = useMemo(
    () => normalizePayments(payments, tenants),
    [payments, tenants],
  );

  const filtered = useMemo(
    () =>
      normalized.filter((payment) => {
        const matchTenant = filterTenant
          ? getPaymentTenantId(payment) === filterTenant
          : true;
        const matchStatus = filterStatus
          ? payment.status === filterStatus
          : true;
        const tenant = tenants.find(
          (item) => item.id === getPaymentTenantId(payment),
        );
        const paymentType = payment.businessType || tenant?.businessType || "pg";
        const matchType = filterType ? paymentType === filterType : true;
        return matchTenant && matchStatus && matchType;
      }),
    [filterStatus, filterTenant, filterType, normalized, tenants],
  );

  const { totalPaid, totalPartial, totalOverdue, totalBalance } =
    calculateSummary(filtered, tenants);
  const {
    visibleItems,
    sentinelRef,
    visibleCount,
    hasMore,
    loadMore,
  } = useIncrementalList(filtered, 12);

  if (loading) return <p className="text-gray-400">Loading payments...</p>;

  return (
    <div className="min-w-0">
      {deletePayment && (
        <ConfirmDelete
          onConfirm={() => handleDelete(deletePayment)}
          onCancel={() => setDeletePayment(null)}
        />
      )}
      {balancePayment && (
        <BalancePayModal
          payment={balancePayment}
          tenants={tenants}
          onClose={() => setBalancePayment(null)}
        />
      )}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
            Payment Records
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monthly payment ledger with live balance tracking.
          </p>
        </div>
        {/* Filters */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Businesses</option>
            {businessTypeOptions.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={filterTenant}
            onChange={(e) => setFilterTenant(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Customers</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {getBusinessType(t.businessType).label} — {t.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="Paid">✅ Paid</option>
            <option value="Partial">🔶 Partial</option>
            <option value="Pending">⏳ Pending</option>
            <option value="Overdue">🚨 Overdue</option>
          </select>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        <div className="card-modern rounded-xl p-4">
          <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
            Fully Paid
          </p>
          <p className="text-xl font-extrabold text-green-700 dark:text-green-300 mt-1">
            ₹{totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="card-modern rounded-xl p-4">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
            Partial Paid
          </p>
          <p className="text-xl font-extrabold text-orange-700 dark:text-orange-300 mt-1">
            ₹{totalPartial.toLocaleString()}
          </p>
        </div>
        <div className="card-modern rounded-xl p-4">
          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
            Pending
          </p>
          <p className="text-xl font-extrabold text-yellow-700 dark:text-yellow-300 mt-1">
            ₹{totalBalance.toLocaleString()}
          </p>
        </div>
        <div className="card-modern rounded-xl p-4">
          <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
            Overdue
          </p>
          <p className="text-xl font-extrabold text-red-700 dark:text-red-300 mt-1">
            ₹{totalOverdue.toLocaleString()}
          </p>
        </div>
      </div>
      <PaymentsTable
        payments={visibleItems}
        canDeletePayment={true}
        setDeletePayment={setDeletePayment}
        onPayBalance={setBalancePayment}
      />
      <InfiniteListFooter
        total={filtered.length}
        visible={visibleCount}
        hasMore={hasMore}
        loadMore={loadMore}
        sentinelRef={sentinelRef}
      />
    </div>
  );
}
