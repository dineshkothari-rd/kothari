export default function AdminStats({ tenants }) {
  const totalTenants = tenants.length;
  const totalRevenue = tenants.reduce((sum, t) => sum + (t.rent || 0), 0);

  const stats = [
    {
      icon: "👥",
      label: "Total Tenants",
      value: totalTenants,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "🛏️",
      label: "Rooms Occupied",
      value: `${totalTenants}/12`,
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: "💰",
      label: "Monthly Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "📋",
      label: "Pending Enquiries",
      value: "3",
      color: "from-orange-500 to-amber-500",
    },
  ];

  function StatCard({ icon, label, value, color }) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl flex-shrink-0`}
        >
          {icon}
        </div>
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider">
            {label}
          </p>
          <p className="text-gray-800 dark:text-white font-extrabold text-2xl mt-0.5">
            {value}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}
