import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import EditTenantForm from "./EditTenantForm";
import Button from "../common/Button";

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Delete Tenant?
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Are you sure you want to delete <strong>{name}</strong>? This cannot
          be undone.
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

export default function TenantList() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTenant, setEditTenant] = useState(null);
  const [deleteTenant, setDeleteTenant] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tenants"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTenants(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function handleDelete(id) {
    await deleteDoc(doc(db, "tenants", id));
    setDeleteTenant(null);
  }

  const filtered = tenants.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.room?.toLowerCase().includes(search.toLowerCase()) ||
      t.phone?.includes(search),
  );

  if (loading) return <p className="text-gray-400">Loading tenants...</p>;

  return (
    <div>
      {editTenant && (
        <EditTenantForm
          tenant={editTenant}
          onClose={() => setEditTenant(null)}
          onSuccess={() => setEditTenant(null)}
        />
      )}

      {deleteTenant && (
        <ConfirmDelete
          name={deleteTenant.name}
          onConfirm={() => handleDelete(deleteTenant.id)}
          onCancel={() => setDeleteTenant(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          👥 Tenant Records
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, room, phone..."
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center text-gray-400">
          {tenants.length === 0 ? "No tenants added yet." : "No results found."}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Room</th>
                  <th className="text-left py-3 px-4">Rent</th>
                  <th className="text-left py-3 px-4">Move In</th>
                  <th className="text-left py-3 px-4">Services</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className={
                      i % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-900"
                        : "bg-white dark:bg-gray-800"
                    }
                  >
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                      {t.name}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {t.phone}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {t.room}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800 dark:text-white">
                      ₹{t.rent?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {t.moveInDate || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {t.services?.map((s) => (
                          <span
                            key={s}
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditTenant(t)}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTenant(t)}
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
