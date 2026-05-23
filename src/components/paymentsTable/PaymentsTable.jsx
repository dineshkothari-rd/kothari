import { getBusinessType } from "../../utils/businessTypes";
import { downloadReceipt, shareReceipt } from "../../utils/receipts";

const PaymentsTable = ({ payments, canDeletePayment, setDeletePayment }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center text-gray-400 border border-gray-100 dark:border-gray-700">
        No payment records found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
            {canDeletePayment && (
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                Action
              </th>
            )}
          </tr>
          </thead>
          <tbody>
          {payments.map((p) => {
            const type = getBusinessType(p.businessType);
            return (
              <tr
                key={p.id}
                className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
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
                {p.paidOn}
              </td>
              <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                <p className="font-bold text-gray-800 dark:text-white">
                  ₹{p.totalRent?.toLocaleString()}
                </p>
              </td>
              <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                <p className="font-bold text-green-600 dark:text-green-400">
                  ₹{p.amountPaid?.toLocaleString()}
                </p>
              </td>
              <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                <p className="font-bold text-red-500">
                  ₹{p.balance?.toLocaleString()}
                </p>
              </td>
              <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadReceipt(p)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-slate-200"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => shareReceipt(p)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 transition hover:border-green-400 hover:text-green-600 dark:border-gray-700 dark:text-slate-200"
                  >
                    Share
                  </button>
                </div>
              </td>
              {canDeletePayment && (
                <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => setDeletePayment(p.id)}
                    className="text-red-500 hover:underline text-xs font-medium transition"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTable;
