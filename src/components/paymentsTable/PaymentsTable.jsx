const PaymentsTable = ({ payments, canDeletePayment, setDeletePayment }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center text-gray-400 border border-gray-100 dark:border-gray-700">
        No payment records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-700">
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
              Tenant
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
              Room
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
              Month
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
              Paid On
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
              Total Rent
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
              Paid
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
              Balance
            </th>
            {canDeletePayment && (
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr
              key={p.id}
              className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
            >
              <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-white">
                {p.tenantName}
              </td>
              <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-white">
                {p.tenantRoom}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
