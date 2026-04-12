export default function AdminStats({ tenants }) {
  const totalTenants = tenants.length;
  const totalRevenue = tenants.reduce((sum, t) => sum + (t.rent || 0), 0);

  const stats = [
    { icon: "👥", label: "Total Tenants", value: totalTenants },
    { icon: "🛏️", label: "Rooms Occupied", value: `${totalTenants}/12` },
    {
      icon: "💰",
      label: "Monthly Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
    },
    { icon: "📋", label: "Pending Enquiries", value: "3" },
  ];

  function StatCard({ icon, label, value }) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <span className="text-4xl">{icon}</span>
        <div>
          <p className="text-gray-400 dark:text-gray-500 text-xs">{label}</p>
          <p className="text-gray-800 dark:text-white font-bold text-2xl">
            {value}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
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
