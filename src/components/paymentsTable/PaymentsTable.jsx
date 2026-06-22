import { getBusinessType } from "../../utils/businessTypes";
import { formatINR } from "../../utils/adminActions";
import { downloadReceipt, shareReceipt } from "../../utils/receipts";
import { formatTime } from "../../utils/helper";

const PaymentsTable = ({
  payments,
  canDeletePayment,
  setDeletePayment,
  onPayBalance,
}) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center text-gray-400 border border-gray-100 dark:border-gray-700">
        No payment records found.
      </div>
    );
  }

  console.log("laksdjaslkdsjas", { payments });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {payments.map((p) => {
          const type = getBusinessType(p.businessType);
          const totalRent = Number(p.totalRent) || 0;
          const amountPaid = Number(p.amountPaid ?? p.amount ?? 0) || 0;
          const balance = Math.max(
            0,
            Number(p.balance ?? totalRent - amountPaid) || 0,
          );

          return (
            <article key={p.id} className="card-modern rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold text-slate-950 dark:text-white">
                    {p.tenantName || "Customer"}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {type.label} • {type.unitLabel} {p.tenantRoom || "-"}
                  </p>
                </div>
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                    balance > 0
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  }`}
                >
                  {balance > 0 ? "Partial" : "Paid"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-gray-950">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Charge
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                    {formatINR(totalRent)}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
                  <p className="text-[11px] font-bold uppercase text-emerald-600">
                    Paid
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                    {formatINR(amountPaid)}
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                  <p className="text-[11px] font-bold uppercase text-red-500">
                    Due
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-red-600 dark:text-red-300">
                    {formatINR(balance)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                <span>{p.month || "-"}</span>
                <span>{p.paidOn || "-"}</span>
                <span>{formatTime(p.createdAt)}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => downloadReceipt(p)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-slate-200"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => shareReceipt(p)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-green-400 hover:text-green-600 dark:border-gray-700 dark:text-slate-200"
                >
                  Share
                </button>
                {onPayBalance && balance > 0 && (
                  <button
                    onClick={() => onPayBalance(p)}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Pay Balance
                  </button>
                )}
                {canDeletePayment && (
                  <button
                    onClick={() => setDeletePayment(p)}
                    className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="panel-modern hidden overflow-hidden rounded-xl md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-gray-800 dark:bg-gray-950">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                  Customer
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                  Type
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                  Unit
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                  Month
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                  Paid On
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                  Charge
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                  Paid
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                  Balance
                </th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                  Receipt
                </th>
                {(canDeletePayment || onPayBalance) && (
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const type = getBusinessType(p.businessType);
                const totalRent = Number(p.totalRent) || 0;
                const amountPaid = Number(p.amountPaid ?? p.amount ?? 0) || 0;
                const balance = Math.max(
                  0,
                  Number(p.balance ?? totalRent - amountPaid) || 0,
                );
                return (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 transition hover:bg-slate-50 dark:border-gray-800/70 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-white">
                      {p.tenantName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-gray-800 dark:text-slate-200">
                        {type.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-white">
                      {type.unitLabel} {p.tenantRoom || "-"}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                      {p.month}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                      {p.paidOn} at &nbsp;
                      {formatTime(p.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                      <p className="font-bold text-gray-800 dark:text-white">
                        {formatINR(totalRent)}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                      <p className="font-bold text-green-600 dark:text-green-400">
                        {formatINR(amountPaid)}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                      <p className="font-bold text-red-500">
                        {formatINR(balance)}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => downloadReceipt(p)}
                          className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-slate-200"
                        >
                          Download
                        </button>
                        <button
                          type="button"
                          onClick={() => shareReceipt(p)}
                          className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 transition hover:border-green-400 hover:text-green-600 dark:border-gray-700 dark:text-slate-200"
                        >
                          Share
                        </button>
                      </div>
                    </td>
                    {(canDeletePayment || onPayBalance) && (
                      <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                        <div className="flex flex-wrap gap-2">
                          {onPayBalance && balance > 0 && (
                            <button
                              onClick={() => onPayBalance(p)}
                              className="text-blue-600 hover:underline text-xs font-medium transition dark:text-blue-400"
                            >
                              Pay Balance
                            </button>
                          )}
                          {canDeletePayment && (
                            <button
                              onClick={() => setDeletePayment(p)}
                              className="text-red-500 hover:underline text-xs font-medium transition"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTable;
