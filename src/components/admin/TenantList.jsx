import { useMemo, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import EditTenantForm from "./EditTenantForm";
import Button from "../common/Button";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { businessTypeOptions, getBusinessType } from "../../utils/businessTypes";

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Delete Customer?
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
  const [filterType, setFilterType] = useState("");
  const { data: tenants, loading } = useFirestoreCollection("tenants", {
    sortBy: "createdAt",
  });

  async function handleDelete(id) {
    await deleteDoc(doc(db, "tenants", id));
    setDeleteTenant(null);
  }

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tenants.filter((tenant) => {
      const matchesType = filterType
        ? (tenant.businessType || "pg") === filterType
        : true;
      const matchesSearch = !normalizedSearch
        ? true
        : tenant.name?.toLowerCase().includes(normalizedSearch) ||
          tenant.room?.toLowerCase().includes(normalizedSearch) ||
          tenant.phone?.includes(search.trim());

      return matchesType && matchesSearch;
    });
  }, [filterType, search, tenants]);

  if (loading) return <p className="text-gray-400">Loading tenants...</p>;

  return (
    <div className="min-w-0">
      {editTenant && (
        <EditTenantForm
          tenant={editTenant}
          tenants={tenants}
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
          Customer Records
        </h2>
        <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-[11rem_18rem]">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            {businessTypeOptions.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, unit, phone..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-400 dark:border-gray-700 dark:bg-gray-800">
          {tenants.length === 0 ? "No customers added yet." : "No results found."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Unit</th>
                  <th className="text-left py-3 px-4">Charge</th>
                  <th className="text-left py-3 px-4">Start</th>
                  <th className="text-left py-3 px-4">End</th>
                  <th className="text-left py-3 px-4">Services</th>
                  <th className="text-left py-3 px-4">ID Proof</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const type = getBusinessType(t.businessType);
                  return (
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
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-gray-700 dark:text-slate-200">
                        {type.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {t.phone}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {type.unitLabel} {t.room}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800 dark:text-white">
                      ₹{t.rent?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {t.moveInDate || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-500 shrink-0 dark:text-gray-400">
                      {t.moveOutDate || "—"}
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
                      {t.idProof ? (
                        <button
                          onClick={() => {
                            const w = window.open();
                            if (t.idProofType === "application/pdf") {
                              w.document.write(
                                `<iframe src="${t.idProof}" width="100%" height="100%"></iframe>`,
                              );
                            } else {
                              w.document.write(
                                `<img src="${t.idProof}" style="max-width:100%;"/>`,
                              );
                            }
                          }}
                          className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline text-xs font-medium"
                        >
                          🪪 View ID
                        </button>
                      ) : (
                        "—"
                      )}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
