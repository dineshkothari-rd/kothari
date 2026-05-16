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
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tenants"),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTenants(data);
        setError("");
        setLoading(false);
      },
      (err) => {
        setError("Unable to load tenants: " + err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, "tenants", id));
      setDeleteTenant(null);
    } catch (err) {
      setError("Unable to delete tenant: " + err.message);
    }
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
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Tenant Records
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, room, phone..."
          className="field-control sm:w-72"
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="surface p-10 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          {tenants.length === 0 ? "No tenants added yet." : "No results found."}
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {filtered.map((t) => (
              <article key={t.id} className="surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t.room} • ₹{t.rent?.toLocaleString()}/mo
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {t.status || "active"}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <p>{t.phone}</p>
                  <p>{t.email || "No email added"}</p>
                  <p>Move in: {t.moveInDate || "-"}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.services?.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => setEditTenant(t)}
                    className="text-sm font-bold text-teal-700 dark:text-teal-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTenant(t)}
                    className="text-sm font-bold text-rose-600 dark:text-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 md:block">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950">
                <tr>
                  {[
                    "Name",
                    "Phone",
                    "Room",
                    "Rent",
                    "Move In",
                    "Services",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className={
                      i % 2 === 0
                        ? "bg-slate-50 dark:bg-slate-950"
                        : "bg-white dark:bg-slate-900"
                    }
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {t.phone}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {t.room}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ₹{t.rent?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {t.moveInDate || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {t.services?.map((s) => (
                          <span
                            key={s}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs px-2 py-0.5 rounded-full"
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
                          className="text-teal-700 dark:text-teal-300 hover:underline text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTenant(t)}
                          className="text-rose-600 dark:text-rose-400 hover:underline text-xs font-bold"
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
        </>
      )}
    </div>
  );
}
