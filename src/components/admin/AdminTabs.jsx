const tabs = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "tenants", label: "Customers", icon: "👥" },
  { id: "payments", label: "Payments", icon: "💰" },
  { id: "operations", label: "Operations", icon: "🧭" },
  { id: "library", label: "Library", icon: "📚" },
  { id: "meter", label: "Meter", icon: "⚡" },
  { id: "enquiries", label: "Enquiries", icon: "📨" },
  { id: "notices", label: "Notices", icon: "📋" },
];

export default function AdminTabs({ active, onChange }) {
  return (
    <div className="panel-modern sticky top-[65px] z-30 flex gap-1.5 overflow-x-auto rounded-xl p-2 scrollbar-hide sm:gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          title={tab.label}
          aria-label={tab.label}
          className={`flex min-h-10 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-all duration-200 min-[520px]:min-w-0 min-[520px]:px-4 ${
            active === tab.id
              ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500 dark:text-white"
              : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-gray-800 dark:hover:text-white"
          }`}
        >
          <span className="text-base">{tab.icon}</span>
          <span className="hidden min-[520px]:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
