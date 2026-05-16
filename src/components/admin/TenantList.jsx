import { useMemo, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import EditTenantForm from "./EditTenantForm";
import Button from "../common/Button";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

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
  const [editTenant, setEditTenant] = useState(null);
  const [deleteTenant, setDeleteTenant] = useState(null);
  const [search, setSearch] = useState("");
  const { data: tenants, loading } = useFirestoreCollection("tenants", {
    sortBy: "createdAt",
  });

  async function handleDelete(id) {
    await deleteDoc(doc(db, "tenants", id));
    setDeleteTenant(null);
  }

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return tenants;

    return tenants.filter(
      (tenant) =>
        tenant.name?.toLowerCase().includes(normalizedSearch) ||
        tenant.room?.toLowerCase().includes(normalizedSearch) ||
        tenant.phone?.includes(search.trim()),
    );
  }, [search, tenants]);

  if (loading) return <p className="text-gray-400">Loading tenants...</p>;

  return (
    <div className="min-w-0">
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

      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          👥 Tenant Records
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, room, phone..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-400 dark:border-gray-700 dark:bg-gray-800">
          {tenants.length === 0 ? "No tenants added yet." : "No results found."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
