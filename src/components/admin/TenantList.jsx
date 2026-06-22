import { useMemo, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import EditTenantForm from "./EditTenantForm";
import Button from "../common/Button";
import InfiniteListFooter from "../common/InfiniteListFooter";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useIncrementalList } from "../../hooks/useIncrementalList";
import {
  businessTypeOptions,
  getBusinessType,
} from "../../utils/businessTypes";
import { openIdProof } from "../../utils/idProof";
import { formatTime12Hour } from "../../utils/helper";

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-0 sm:items-center sm:px-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-t-xl bg-white p-4 shadow-xl dark:bg-gray-800 sm:rounded-xl sm:p-6">
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
            className="min-h-10 flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TenantList({ roomRecords = [] }) {
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
  const { visibleItems, sentinelRef, visibleCount, hasMore, loadMore } =
    useIncrementalList(filtered, 12);

  if (loading) return <p className="text-gray-400">Loading tenants...</p>;

  console.log("jsakdhaldjka", { visibleItems });

  return (
    <div className="min-w-0">
      {editTenant && (
        <EditTenantForm
          tenant={editTenant}
          tenants={roomRecords.length ? roomRecords : tenants}
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
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
            Customer Records
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search, filter and manage active customers quickly.
          </p>
        </div>
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
          {tenants.length === 0
            ? "No customers added yet."
            : "No results found."}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 md:hidden">
            {visibleItems.map((t) => {
              const type = getBusinessType(t.businessType);
              return (
                <article key={t.id} className="card-modern rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-extrabold text-slate-950 dark:text-white">
                        {t.name}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {type.label} • {type.unitLabel} {t.room || "-"}
                      </p>
                    </div>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-gray-800 dark:text-slate-200">
                      ₹{(Number(t.rent) || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-gray-950">
                      <p className="text-[11px] font-bold uppercase text-slate-400">
                        Phone
                      </p>
                      <p className="mt-1 truncate font-semibold text-slate-700 dark:text-slate-200">
                        {t.phone || "-"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-gray-950">
                      <p className="text-[11px] font-bold uppercase text-slate-400">
                        Start
                      </p>
                      <p className="mt-1 truncate font-semibold text-slate-700 dark:text-slate-200">
                        {t.moveInDate || "-"}
                        {t.moveInTime
                          ? ` at ${formatTime12Hour(t.moveInTime)}`
                          : ""}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-gray-950">
                      <p className="text-[11px] font-bold uppercase text-slate-400">
                        End
                      </p>
                      <p className="mt-1 truncate font-semibold text-slate-700 dark:text-slate-200">
                        {t.moveOutDate || "-"}
                        {t.moveOutTime
                          ? ` at ${formatTime12Hour(t.moveOutTime)}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  {Boolean(t.services?.length) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {t.services.map((service) => (
                        <span
                          key={service}
                          className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.idProof && (
                      <button
                        onClick={() =>
                          openIdProof({
                            dataUrl: t.idProof,
                            type: t.idProofType,
                            name: t.idProofName || `${t.name} ID Proof`,
                          })
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 dark:border-gray-700 dark:text-slate-200"
                      >
                        View ID
                      </button>
                    )}
                    <button
                      onClick={() => setEditTenant(t)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTenant(t)}
                      className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-900/50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="panel-modern hidden overflow-hidden rounded-xl md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 dark:bg-gray-950 dark:text-slate-400">
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
                  {visibleItems.map((t, i) => {
                    const type = getBusinessType(t.businessType);
                    return (
                      <tr
                        key={t.id}
                        className={
                          i % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-slate-50/70 dark:bg-gray-800"
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
                          {t.moveInTime
                            ? ` at ${formatTime12Hour(t.moveInTime)}`
                            : ""}
                        </td>
                        <td className="py-3 px-4 text-gray-500 shrink-0 dark:text-gray-400">
                          {t.moveOutDate || "—"}
                          {t.moveOutTime
                            ? ` at ${formatTime12Hour(t.moveOutTime)}`
                            : ""}
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
                              onClick={() =>
                                openIdProof({
                                  dataUrl: t.idProof,
                                  type: t.idProofType,
                                  name: t.idProofName || `${t.name} ID Proof`,
                                })
                              }
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
          <InfiniteListFooter
            total={filtered.length}
            visible={visibleCount}
            hasMore={hasMore}
            loadMore={loadMore}
            sentinelRef={sentinelRef}
          />
        </div>
      )}
    </div>
  );
}
