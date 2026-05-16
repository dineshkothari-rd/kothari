const tabs = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "tenants", label: "Tenants", icon: "👥" },
  { id: "payments", label: "Payments", icon: "💰" },
  { id: "enquiries", label: "Enquiries", icon: "📨" },
  { id: "notices", label: "Notices", icon: "📋" },
];

export default function AdminTabs({ active, onChange }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 border border-gray-100 dark:border-gray-700 flex gap-2 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
            active === tab.id
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          <span className="text-base">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
