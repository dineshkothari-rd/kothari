function Money({ value, className = "" }) {
  return (
    <span className={`font-bold ${className}`}>
      ₹{(value || 0).toLocaleString()}
    </span>
  );
}

const PaymentsTable = ({ payments, canDeletePayment, setDeletePayment }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="surface p-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        No payment records found.
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-3 md:hidden">
        {payments.map((p) => (
          <article key={p.id} className="surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900 dark:text-white">
                  {p.tenantName}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {p.tenantRoom} • {p.month}
                </p>
              </div>
              {p.status && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {p.status}
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Rent
                </p>
                <Money value={p.totalRent} className="text-slate-900 dark:text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Paid
                </p>
                <Money value={p.amountPaid} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Balance
                </p>
                <Money value={p.balance} className="text-rose-600 dark:text-rose-400" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>Paid on {p.paidOn || "-"}</span>
              {canDeletePayment && (
                <button
                  onClick={() => setDeletePayment(p.id)}
                  className="font-bold text-rose-600 transition hover:text-rose-700 dark:text-rose-400"
                >
                  Delete
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-950">
            <tr>
              {[
                "Tenant",
                "Room",
                "Month",
                "Paid On",
                "Total Rent",
                "Paid",
                "Balance",
                ...(canDeletePayment ? ["Action"] : []),
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
            {payments.map((p) => (
              <tr
                key={p.id}
                className="bg-white transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70"
              >
                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                  {p.tenantName}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {p.tenantRoom}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {p.month}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {p.paidOn || "-"}
                </td>
                <td className="px-4 py-3">
                  <Money value={p.totalRent} className="text-slate-900 dark:text-white" />
                </td>
                <td className="px-4 py-3">
                  <Money value={p.amountPaid} className="text-emerald-600 dark:text-emerald-400" />
                </td>
                <td className="px-4 py-3">
                  <Money value={p.balance} className="text-rose-600 dark:text-rose-400" />
                </td>
                {canDeletePayment && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeletePayment(p.id)}
                      className="text-xs font-bold text-rose-600 transition hover:text-rose-700 dark:text-rose-400"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTable;
