const tenants = [
  {
    name: "Rahul Sharma",
    room: "101 - Single",
    rent: "₹8,000",
    status: "Paid",
    due: "01 May 2025",
  },
  {
    name: "Priya Verma",
    room: "102 - Single",
    rent: "₹8,000",
    status: "Paid",
    due: "01 May 2025",
  },
  {
    name: "Amit Joshi",
    room: "201 - Double",
    rent: "₹5,500",
    status: "Pending",
    due: "01 May 2025",
  },
  {
    name: "Sneha Patel",
    room: "202 - Double",
    rent: "₹5,500",
    status: "Paid",
    due: "01 May 2025",
  },
  {
    name: "Vikram Singh",
    room: "301 - Triple",
    rent: "₹4,000",
    status: "Overdue",
    due: "01 Apr 2025",
  },
];

const statusStyles = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function TenantRow({ name, room, rent, status, due }) {
  return (
    <tr className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
      <td className="py-3 px-4 text-gray-800 dark:text-white font-medium">
        {name}
      </td>
      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
        {room}
      </td>
      <td className="py-3 px-4 text-gray-800 dark:text-white font-semibold">
        {rent}
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={status} />
      </td>
      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
        {due}
      </td>
    </tr>
  );
}

export default function TenantTable() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        🏠 Tenant Records
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="text-left py-3 px-4 font-semibold">Tenant</th>
                <th className="text-left py-3 px-4 font-semibold">Room</th>
                <th className="text-left py-3 px-4 font-semibold">Rent</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <TenantRow key={t.name} {...t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
