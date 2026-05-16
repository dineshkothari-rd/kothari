import {
  calculateSummary,
  calculateTenantDues,
  getMonthKey,
} from "../../utils/helper";
import PaymentsTable from "../paymentsTable/PaymentsTable";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

const avatarColors = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-amber-500",
  "from-green-500 to-emerald-500",
  "from-red-500 to-rose-500",
];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0][0];
}

function StatCard({ icon, label, value, hint, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition">
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-gray-800 dark:text-white mt-0.5">
          {value}
        </p>
        {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      </div>
    </div>
  );
}

export default function OverviewTab({ tenants }) {
  const { data: payments } = useFirestoreCollection("payments", {
    sortBy: "createdAt",
  });
  const { data: notices } = useFirestoreCollection("notices", {
    sortBy: "createdAt",
  });

  const currentMonth = getMonthKey();
  const totalRevenue = tenants.reduce(
    (sum, tenant) => sum + (Number(tenant.rent) || 0),
    0,
  );
  const { pendingCount, pendingTenants } = calculateTenantDues(
    tenants,
    payments,
    currentMonth,
  );
  const { normalized, totalBalance } = calculateSummary(payments, tenants);

  const overdueCount = normalized.filter(
    (payment) => payment.status !== "Paid" && payment.month < currentMonth,
  ).length;

  const stats = [
    {
      icon: "👥",
      label: "Total Tenants",
      value: tenants.length,
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: "💰",
      label: "Monthly Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      color: "from-green-400 to-emerald-600",
    },
    {
      icon: "⏳",
      label: "Pending Payments",
      value: pendingCount,
      hint: `₹${totalBalance} due`,
      color: "from-yellow-400 to-amber-500",
    },
    {
      icon: "🚨",
      label: "Overdue Payments",
      value: overdueCount,
      color: "from-red-400 to-rose-600",
    },
  ];

  const recentTenants = tenants.slice(0, 5);
  const recentNotices = notices.slice(0, 3);

  const noticeTypeStyles = {
    info: "border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/10",
    success: "border-l-4 border-green-400 bg-green-50 dark:bg-green-900/10",
    warning: "border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10",
    danger: "border-l-4 border-red-400 bg-red-50 dark:bg-red-900/10",
  };

  const noticeIcons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    danger: "🚨",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Month Dues */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
            Current Month Dues
          </h3>
          {pendingTenants.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              All active tenants are paid for {currentMonth}.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingTenants.slice(0, 5).map((tenant) => (
                <div
                  key={tenant.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-800 dark:text-white">
                      {tenant.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {tenant.room || "No room"} • Paid ₹
                      {tenant.paid.toLocaleString()} of ₹
                      {tenant.rent.toLocaleString()}
                    </p>
                  </div>
                  <p className="flex-shrink-0 text-sm font-extrabold text-red-500">
                    ₹{tenant.balance.toLocaleString()}
                  </p>
                </div>
              ))}
              {pendingTenants.length > 5 && (
                <p className="text-center text-xs font-semibold text-gray-400">
                  +{pendingTenants.length - 5} more pending
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recent Tenants */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
            👥 Recent Tenants
          </h3>
          {recentTenants.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              No tenants yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentTenants.map((t, i) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {getInitials(t.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {t.room} • ₹{t.rent?.toLocaleString()}/mo
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notices */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
            📋 Recent Notices
          </h3>
          {recentNotices.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              No notices yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentNotices.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl p-3 ${noticeTypeStyles[n.type]}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{noticeIcons[n.type]}</span>
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                      {n.title}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {n.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
          💰 Recent Payments
        </h3>
        <PaymentsTable payments={normalized.slice(0, 5)} />
      </div>
    </div>
  );
}
