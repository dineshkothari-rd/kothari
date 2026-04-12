const stats = [
  { icon: "🛏️", label: "Room Type", value: "Single Occupancy" },
  { icon: "📅", label: "Move In Date", value: "01 Jan 2025" },
  { icon: "💰", label: "Monthly Rent", value: "₹8,000" },
  { icon: "📆", label: "Next Due Date", value: "01 May 2025" },
];

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
      <span className="text-4xl">{icon}</span>
      <div>
        <p className="text-gray-400 dark:text-gray-500 text-xs">{label}</p>
        <p className="text-gray-800 dark:text-white font-semibold text-lg">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function QuickStats() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Your Room Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}
