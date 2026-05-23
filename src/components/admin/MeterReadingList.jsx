import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";

function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Delete Reading?
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          This meter reading will be permanently deleted.
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

export default function MeterReadingList({ tenants }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteReading, setDeleteReading] = useState(null);
  const [filterTenant, setFilterTenant] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "meterReadings"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setReadings(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function handleDelete(id) {
    await deleteDoc(doc(db, "meterReadings", id));
    setDeleteReading(null);
  }

  const filtered = filterTenant
    ? readings.filter((r) => r.tenantId === filterTenant)
    : readings;

  // Total bill summary
  const totalBill = filtered.reduce((sum, r) => sum + (r.billAmount || 0), 0);
  const totalUnits = filtered.reduce(
    (sum, r) => sum + (r.unitsConsumed || 0),
    0,
  );

  if (loading)
    return <p className="text-gray-400">Loading meter readings...</p>;

  return (
    <div>
      {deleteReading && (
        <ConfirmDelete
          onConfirm={() => handleDelete(deleteReading)}
          onCancel={() => setDeleteReading(null)}
        />
      )}

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        ⚡ Meter Readings
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4">
          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
            ⚡ Total Units
          </p>
          <p className="text-2xl font-extrabold text-yellow-700 dark:text-yellow-300 mt-1">
            {totalUnits} units
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
            💰 Total Bill
          </p>
          <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">
            ₹{totalBill.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
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
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center text-gray-400 border border-gray-100 dark:border-gray-700">
          No meter readings yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl">⚡</span>
                    <p className="font-bold text-gray-800 dark:text-white">
                      {r.tenantName}
                    </p>
                    <span className="text-xs text-gray-400">
                      {r.tenantRoom}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">{r.month}</p>
                  {r.note && (
                    <p className="text-xs text-gray-400 italic mt-0.5">
                      {r.note}
                    </p>
                  )}
                </div>

                {/* Right — Reading Details */}
                <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Previous</p>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">
                      {r.previousReading}
                    </p>
                  </div>
                  <div className="text-gray-300 dark:text-gray-600">→</div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Current</p>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">
                      {r.currentReading}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-blue-500">Units Used</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {r.unitsConsumed}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-yellow-500">Bill</p>
                    <p className="font-extrabold text-yellow-600 dark:text-yellow-400">
                      ₹{r.billAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setDeleteReading(r.id)}
                  className="text-red-500 hover:underline text-xs font-medium ml-auto"
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
