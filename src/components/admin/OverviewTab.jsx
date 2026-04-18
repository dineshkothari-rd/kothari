import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const statusStyles = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

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

function StatCard({ icon, label, value, color }) {
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
      </div>
    </div>
  );
}

export default function OverviewTab({ tenants }) {
  const [payments, setPayments] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const unsubPayments = onSnapshot(collection(db, "payments"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setPayments(data);
    });
    const unsubNotices = onSnapshot(collection(db, "notices"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setNotices(data);
    });
    return () => {
      unsubPayments();
      unsubNotices();
    };
  }, []);

  const totalRevenue = tenants.reduce((sum, t) => sum + (t.rent || 0), 0);
  const pendingCount = payments.filter((p) => p.status === "Pending").length;
  const overdueCount = payments.filter((p) => p.status === "Overdue").length;

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
        {payments.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            No payments yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                    Tenant
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                    Month
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                    Amount
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 5).map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                  >
                    <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-white">
                      {p.tenantName}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">
                      {p.month}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-white">
                      ₹{p.amount?.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
